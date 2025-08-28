// get current year
const dateElement = document.getElementById("date");
const currentYear = new Date().getFullYear();
dateElement.textContent = currentYear;


// helpers de stockage robustes
function canUseStorage(storage) {
      try {
            const k = '__test__' + Math.random();
            storage.setItem(k, '1'); storage.removeItem(k);
            return true;
      } catch { return false; }
}

function shrinkObject(obj, maxStringLen = 5000, maxArrayLen = 200) {
      const seen = new WeakSet();
      const dropKeys = new Set(['html', 'htmlSnippet', 'raw', 'screenshot', 'trace', 'stack', 'logs', 'headers', 'body', 'dom', 'nodes', 'elements', 'computedStyles']);
      const walk = (v) => {
            if (v && typeof v === 'object') {
                  if (seen.has(v)) return undefined;
                  seen.add(v);
                  if (Array.isArray(v)) {
                        const arr = v.slice(0, maxArrayLen).map(walk).filter(x => x !== undefined);
                        return arr;
                  }
                  const out = {};
                  for (const [k, val] of Object.entries(v)) {
                        if (dropKeys.has(k)) continue;
                        const w = walk(val);
                        if (w !== undefined) out[k] = w;
                  }
                  return out;
            }
            if (typeof v === 'string' && v.length > maxStringLen) {
                  return v.slice(0, maxStringLen) + '…[truncated]';
            }
            return v;
      };
      return walk(obj);
}

function safeSetJson(key, data) {
      const raw = JSON.stringify(data);
      const tryWrite = (storage, value) => {
            storage.setItem(key, value);
            return true;
      };

      // 1) localStorage normal
      if (canUseStorage(localStorage)) {
            try {
                  // compression si LZString dispo
                  const payload = (window.LZString)
                        ? LZString.compressToUTF16(raw)
                        : raw;
                  if (tryWrite(localStorage, payload)) return { where: 'localStorage', compressed: !!window.LZString };
            } catch { }
            // 2) shrink + retente
            try {
                  const shrunk = shrinkObject(data);
                  const shrunkRaw = JSON.stringify(shrunk);
                  const payload = (window.LZString)
                        ? LZString.compressToUTF16(shrunkRaw)
                        : shrunkRaw;
                  if (tryWrite(localStorage, payload)) return { where: 'localStorage_shrunk', compressed: !!window.LZString };
            } catch { }
      }

      // 3) sessionStorage
      if (canUseStorage(sessionStorage)) {
            try {
                  const payload = JSON.stringify(shrinkObject(data));
                  sessionStorage.setItem(key, payload);
                  return { where: 'sessionStorage' };
            } catch { }
      }

      // 4) fallback mémoire
      window.__auditCache = data;
      return { where: 'memory' };
}


// function audit gratuit 

document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('free-audit-form');
      if (!form) return;

      const statusEl = document.getElementById('auditStatus');

      const normalizeUrl = (raw) => {
            let v = raw.trim();
            if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
            try { new URL(v); return v; } catch { return null; }
      };

      const handleSearch = async ({ url }) => {
            if (!url) return;
            const res = await fetch('/api/free-audit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url }),
            });
            if (!res.ok) throw new Error('Erreur audit');
            const data = await res.json();

            const info = safeSetJson('freeAuditResult', data);
            console.log('Audit stocké dans :', info)
      };

      form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('#url');
            const cleaned = normalizeUrl(input.value);

            if (!cleaned) {
                  input.setCustomValidity("Merci d'entrer une URL valide (ex: https://exemple.com)");
                  input.reportValidity();
                  return;
            }
            input.setCustomValidity('');

            try {
                  statusEl.textContent = 'Analyse en cours… (Cela peut prendre une ou deux minutes)';
                  const data = await handleSearch({ url: cleaned });
                  statusEl.textContent = "Audit fini ! Le rapport s'ouvre dans un nouvel onglet.";
                  // ➜ Ouvre un nouvel onglet vers la page de rapport
                  window.open('/free/reports', '_blank');
            } catch (err) {
                  console.error(err);
                  statusEl.textContent = "Impossible de lancer l'audit. Réessaie plus tard.";
            } finally {
                  form.classList.remove('is-loading');
            }
      });
});

