/* Liaison temps réel entre l'écran du prof et les téléphones.
   - Avec une configuration Firebase (config.js) : Firebase Realtime Database + connexion anonyme.
   - Sans configuration : mode démo, qui ne relie que les onglets d'un même navigateur (pour essayer). */
(function () {
  const cfg = window.FIREBASE_CONFIG;
  const live = !!(cfg && cfg.apiKey && cfg.databaseURL && window.firebase);

  function firebaseBackend() {
    const app = firebase.initializeApp(cfg);
    const db = firebase.database(app);
    let uid = null, offset = 0;
    db.ref('.info/serverTimeOffset').on('value', (s) => { offset = s.val() || 0; });
    const sub = (ref, cb) => { const h = ref.on('value', (s) => cb(s.val())); return () => ref.off('value', h); };
    return {
      mode: 'live',
      async init() {
        const cred = await firebase.auth(app).signInAnonymously();
        uid = cred.user.uid; return uid;
      },
      now: () => Date.now() + offset,
      async createSession(code) { await db.ref('sessions/' + code).set({ host: uid, created: firebase.database.ServerValue.TIMESTAMP, step: 0, phase: 'open' }); },
      async sessionHost(code) { const s = await db.ref('sessions/' + code + '/host').once('value'); return s.val(); },
      setState: (code, patch) => db.ref('sessions/' + code).update(patch),
      onState: (code, cb) => sub(db.ref('sessions/' + code), cb),
      submit: (code, key, val) => db.ref(`answers/${code}/${key}/${uid}`).set(val),
      onAnswers: (code, key, cb) => sub(db.ref(`answers/${code}/${key}`), (v) => cb(v || {})),
      allAnswers: async (code) => (await db.ref('answers/' + code).once('value')).val() || {},
      join(code) { const r = db.ref(`presence/${code}/${uid}`); r.onDisconnect().remove(); r.set(true); },
      onCount: (code, cb) => sub(db.ref('presence/' + code), (v) => cb(v ? Object.keys(v).length : 0)),
      async clear(code) {
        await db.ref('answers/' + code).remove();
        await db.ref('presence/' + code).remove();
        await db.ref('sessions/' + code).remove();
      },
    };
  }

  function demoBackend() {
    const ls = {
      get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
      set(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    };
    const listeners = new Set();
    const fire = (k) => listeners.forEach((l) => l(k));
    window.addEventListener('storage', (e) => fire(e.key));
    const sub = (match, read, cb) => { const l = (k) => { if (k === null || match(k)) cb(read()); }; listeners.add(l); setTimeout(() => cb(read()), 0); return () => listeners.delete(l); };
    let uid = null; let hb = null;
    const write = (k, v) => { ls.set(k, v); fire(k); };
    return {
      mode: 'demo',
      async init() {
        try { uid = sessionStorage.getItem('demo-uid'); } catch (e) {}
        if (!uid) { uid = 'u' + Math.random().toString(36).slice(2, 10); try { sessionStorage.setItem('demo-uid', uid); } catch (e) {} }
        return uid;
      },
      now: () => Date.now(),
      async createSession(code) { write('s:' + code, { host: uid, created: Date.now(), step: 0, phase: 'open' }); },
      async sessionHost(code) { return (ls.get('s:' + code) || {}).host || null; },
      async setState(code, patch) { const s = ls.get('s:' + code); if (!s) return; write('s:' + code, Object.assign(s, patch)); },
      onState: (code, cb) => sub((k) => k === 's:' + code, () => ls.get('s:' + code), cb),
      async submit(code, key, val) { const k = `a:${code}:${key}`; const a = ls.get(k) || {}; a[uid] = val; write(k, a); },
      onAnswers: (code, key, cb) => sub((k) => k === `a:${code}:${key}`, () => ls.get(`a:${code}:${key}`) || {}, cb),
      async allAnswers(code) {
        const out = {};
        try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(`a:${code}:`)) out[k.slice(code.length + 3)] = ls.get(k); } } catch (e) {}
        return out;
      },
      join(code) {
        const beat = () => { const p = ls.get('p:' + code) || {}; p[uid] = Date.now(); write('p:' + code, p); };
        beat(); clearInterval(hb); hb = setInterval(beat, 3000);
        window.addEventListener('pagehide', () => { const p = ls.get('p:' + code) || {}; delete p[uid]; write('p:' + code, p); });
      },
      onCount(code, cb) {
        const read = () => { const p = ls.get('p:' + code) || {}; const t = Date.now(); return Object.values(p).filter((x) => t - x < 8000).length; };
        const stop = sub((k) => k === 'p:' + code, read, cb); const iv = setInterval(() => cb(read()), 4000);
        return () => { stop(); clearInterval(iv); };
      },
      async clear(code) {
        try { Object.keys(localStorage).filter((k) => k.includes(':' + code)).forEach((k) => localStorage.removeItem(k)); } catch (e) {}
        fire('s:' + code);
      },
    };
  }

  window.Backend = live ? firebaseBackend() : demoBackend();
})();
