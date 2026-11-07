(async function () {
  const [rules, acts] = await Promise.all([
    fetch('data/regulations.json').then((r) => r.json()),
    fetch('data/eu-acts.json').then((r) => r.json()),
  ]);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (d) => d ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '';

  $('reviewed').textContent = 'Last reviewed ' + fmtDate(rules.lastReviewed);

  // The EU act a rule refers to, by its number (e.g. "2023/1542")
  const actFor = (reg) => {
    const nums = reg.reference.match(/\d{4}\/\d{1,4}|\d{1,4}\/\d{4}/g) || [];
    return acts.acts.filter((a) => nums.some((n) => a.reference.includes(n)));
  };

  const CHIPS = [
    ['E-bike', 'e-bike'], ['E-scooter', 'e-scooter'], ['Toy', 'toy'], ['Clothing', 'clothing'], ['Home textiles', 'bedding'],
    ['TV / monitor', 'television'], ['Washing machine', 'washing machine'], ['Electronics', 'electronics'],
    ['Detergent', 'detergent'], ['Furniture', 'furniture'], ['Steel', 'steel'], ['Home battery', 'home battery'],
  ];
  const allCats = [...new Set(rules.regulations.flatMap((r) => r.categories.map((c) => c.replace(/_/g, ' '))))].sort();
  $('cats').innerHTML = allCats.map((c) => `<option value="${esc(c)}">`).join('');
  $('chips').innerHTML = CHIPS.map(([label, v]) => `<button type="button" class="chip" data-v="${esc(v)}" aria-pressed="false">${esc(label)}</button>`).join('');

  // Same matching as the catalog: whole words, plural allowed, "-" and "_" read as spaces
  const norm = (s) => s.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const matches = (reg, text) => reg.categories.some((c) => {
    const w = norm(c).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${w}s?\\b`).test(text);
  });

  function render() {
    const text = norm($('q').value);
    const fr = $('fr').checked;
    document.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(norm(b.dataset.v) === text)));
    if (!text) { $('results').innerHTML = ''; return; }
    const specific = rules.regulations.filter((r) => r.categories.length && matches(r, text) && (r.market === 'EU' || fr));
    const general = rules.regulations.filter((r) => r.appliesToAllProducts);
    const groups = [
      ['Applies today', [...specific, ...general].filter((r) => r.status === 'in_force')],
      ['Passport date set in law', specific.filter((r) => r.status === 'dpp_dated')],
      ['Planned (dates indicative)', specific.filter((r) => r.status === 'planned')],
    ];
    const head = specific.length
      ? `<h2 class="group-h">${specific.length} product-specific rule${specific.length > 1 ? 's' : ''} for “${esc($('q').value)}”, plus rules that cover nearly every product</h2>`
      : `<p class="empty panel">No product-specific rule in the dataset matches “${esc($('q').value)}”. The general rules below still apply to most products sold in the EU.</p>`;
    $('results').innerHTML = head + groups.filter(([, list]) => list.length).map(([title, list]) =>
      `<h2 class="group-h">${esc(title)}</h2>` + list.map(card).join('')).join('');
  }

  function card(r) {
    const law = actFor(r);
    const req = r.requirements;
    const links = [`<a href="${esc(r.documentationUrl)}" target="_blank" rel="noopener">Official source</a>`]
      .concat(law.filter((a) => a.eurLexUrl !== r.documentationUrl).map((a) => `<a href="${esc(a.eurLexUrl)}" target="_blank" rel="noopener">${esc(a.shortName)} on EUR-Lex</a>`));
    return `<article class="rule">
      <h3>${esc(r.name)}</h3>
      <p class="ref">${esc(r.reference)}${r.market === 'FR' ? ' · France only' : ''}</p>
      <span class="badge ${r.status}">${esc(rules.statuses[r.status])}</span>${r.statusNote === rules.statuses[r.status] ? "" : `<span class="note">${esc(r.statusNote)}</span>`}
      <p class="desc">${esc(r.description)}</p>
      <div class="links">${links.join('')}</div>
      <details><summary>${req.length} data point${req.length > 1 ? 's' : ''} (${req.filter((q) => q.mandatory).length} required)</summary>
        <ul class="reqs">${req.map((q) => `<li><span class="n">${esc(q.name)}</span>${q.mandatory ? '' : '<span class="opt">optional</span>'}<span class="h">${esc(q.help)}</span></li>`).join('')}</ul>
      </details>
    </article>`;
  }

  function renderActs() {
    const f = $('filter').value.toLowerCase().trim();
    const list = acts.acts.filter((a) => !f || [a.shortName, a.reference, a.celex, ...a.aliases].join(' ').toLowerCase().includes(f));
    $('acts').innerHTML = list.map((a) => `<tr><td>${esc(a.shortName)}</td><td>${esc(a.reference)}</td><td class="mono">${esc(a.celex)}</td>
      <td><a href="${esc(a.eurLexUrl)}" target="_blank" rel="noopener">EUR-Lex</a>${a.eliUrl ? ` · <a href="${esc(a.eliUrl)}" target="_blank" rel="noopener">ELI</a>` : ''}</td></tr>`).join('')
      || '<tr><td colspan="4" class="empty">No act matches.</td></tr>';
  }

  $('chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $('q').value = b.dataset.v; render();
  });
  $('q').addEventListener('input', render);
  $('fr').addEventListener('change', render);
  $('form').addEventListener('submit', (e) => e.preventDefault());
  $('filter').addEventListener('input', renderActs);

  const p = new URLSearchParams(location.search);
  if (p.get('product')) $('q').value = p.get('product');
  if (p.get('fr') === '1') $('fr').checked = true;
  render(); renderActs();
})();
