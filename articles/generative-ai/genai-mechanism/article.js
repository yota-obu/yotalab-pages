// ── Progress bar ──
window.addEventListener('scroll', () => {
  const el = document.getElementById('progress');
  if (!el) return;
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  el.style.width = scrolled + '%';
});

// ── Fade-in animations for timeline & generation flow ──
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('timeline-item')) {
        const items = entry.target.parentElement.querySelectorAll('.timeline-item');
        items.forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 150));
        items.forEach(item => fadeObserver.unobserve(item));
      }
      if (entry.target.classList.contains('gen-step')) {
        const steps = entry.target.parentElement.querySelectorAll('.gen-step');
        steps.forEach((step, i) => setTimeout(() => step.classList.add('visible'), i * 250));
        steps.forEach(step => fadeObserver.unobserve(step));
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item, .gen-step').forEach(el => fadeObserver.observe(el));

// ── Bar fill animations ──
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const targetWidth = entry.target.dataset.width;
      if (targetWidth) {
        setTimeout(() => entry.target.style.width = targetWidth + '%', 100);
        barObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.survey-fill, .prob-fill, .skill-fill').forEach(el => barObserver.observe(el));

// ── 「問題」 vector update interaction ──
(function() {
  const vec = document.getElementById('problemVec');
  const label = document.getElementById('problemLabel');
  const caption = document.getElementById('problemCaption');
  const trailContainer = document.getElementById('trailContainer');
  const sentenceTokens = document.querySelectorAll('#attSentence .att-token[data-key]');
  if (!vec) return;

  const steps = [
    { pos: { x: 22, y: 28 }, attention: {},
      caption: { num: '// STEP 01 / INITIAL', text: '更新前の「問題」は、<strong>「トラブル」「懸念点」「いざこざ」</strong>などネガティブな意味の近くに配置されている。' } },
    { pos: { x: 60, y: 65 },
      attention: { '数学': '60%', 'の': '2%', 'に': '3%', '時間': '10%', 'を': '2%', 'かけた': '18%' },
      attentionLevel: { '数学': 'high', 'の': 'low', 'に': 'low', '時間': 'mid', 'を': 'low', 'かけた': 'mid' },
      caption: { num: '// STEP 02 / 「数学」で更新', text: '「問題」は <strong>「数学」(60%)</strong> に強く注目し、ベクトルが「宿題」「設問」のある学習関連の領域へ移動する。' } },
    { pos: { x: 82, y: 84 },
      attention: { '数学': '40%', 'の': '2%', 'に': '3%', '時間': '20%', 'を': '2%', 'かけた': '33%' },
      attentionLevel: { '数学': 'high', 'の': 'low', 'に': 'low', '時間': 'mid', 'を': 'low', 'かけた': 'high' },
      caption: { num: '// STEP 03 / 「時間」「かけた」で更新', text: 'さらに<strong>「かけた」「時間」</strong>の影響で、「取り組んだ問題」「難問」のある領域に近づく。文脈に応じた具体的な意味が確定していく。' } }
  ];
  let autoTimer = null;
  function moveTo(stepIdx) {
    const step = steps[stepIdx];
    const oldX = parseFloat(vec.style.left);
    const oldY = parseFloat(vec.style.bottom);
    if (stepIdx !== 0 && (Math.abs(oldX - step.pos.x) > 1 || Math.abs(oldY - step.pos.y) > 1)) {
      const trail = document.createElement('div');
      trail.className = 'vec-trail show';
      trail.style.left = oldX + '%';
      trail.style.bottom = oldY + '%';
      trailContainer.appendChild(trail);
      setTimeout(() => trail.remove(), 1700);
    }
    vec.style.left = step.pos.x + '%';
    vec.style.bottom = step.pos.y + '%';
    label.style.left = step.pos.x + '%';
    label.style.bottom = step.pos.y + '%';
    caption.classList.add('active');
    caption.innerHTML = `<span class="step-num">${step.caption.num}</span>${step.caption.text}`;
    setTimeout(() => caption.classList.remove('active'), 1500);
    sentenceTokens.forEach(tok => {
      const key = tok.dataset.key;
      const pctEl = tok.querySelector('.att-pct');
      if (step.attention[key]) {
        pctEl.textContent = step.attention[key];
        tok.dataset.attention = step.attentionLevel[key] || 'low';
      } else {
        pctEl.textContent = '';
        delete tok.dataset.attention;
      }
    });
  }
  document.querySelectorAll('.viz-btn[data-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      const step = btn.dataset.step;
      if (step === 'auto') {
        document.querySelectorAll('.viz-btn[data-step]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        let i = 0;
        moveTo(0);
        autoTimer = setInterval(() => {
          i = (i + 1) % steps.length;
          moveTo(i);
          document.querySelectorAll('.viz-btn[data-step]').forEach(b => b.classList.remove('active'));
          const targetBtn = document.querySelector(`.viz-btn[data-step="${i}"]`);
          if (targetBtn) targetBtn.classList.add('active');
        }, 2400);
      } else {
        document.querySelectorAll('.viz-btn[data-step]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        moveTo(parseInt(step));
      }
    });
  });
})();

// ── 「高い」 vector ──
(function() {
  const vec = document.getElementById('takaiVec');
  const label = document.getElementById('takaiLabel');
  const caption = document.getElementById('takaiCaption');
  if (!vec) return;
  const states = [
    { pos: { x: 50, y: 50 }, caption: { num: '// INITIAL', text: '初期位置 <strong>(0.5, 0.5)</strong>。文脈情報がないため、中立的な位置にある。' } },
    { pos: { x: 22, y: 85 }, caption: { num: '// 「この時計は高い」', text: '「時計」に注目 → ベクトルは <strong>(0.2, 0.9)</strong> へ移動。「高級」「高価」の意味に近づく。' } },
    { pos: { x: 88, y: 18 }, caption: { num: '// 「この山は高い」', text: '「山」に注目 → ベクトルは <strong>(0.9, 0.1)</strong> へ移動。「標高」「山頂」の意味に近づく。' } }
  ];
  document.querySelectorAll('.viz-btn[data-takai]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.takai);
      const state = states[idx];
      document.querySelectorAll('.viz-btn[data-takai]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vec.style.left = state.pos.x + '%';
      vec.style.bottom = state.pos.y + '%';
      label.style.left = state.pos.x + '%';
      label.style.bottom = state.pos.y + '%';
      caption.classList.add('active');
      caption.innerHTML = `<span class="step-num">${state.caption.num}</span>${state.caption.text}`;
      setTimeout(() => caption.classList.remove('active'), 1500);
    });
  });
})();

// ── 「彼」 vector ──
(function() {
  const vec = document.getElementById('kareVec');
  const label = document.getElementById('kareLabel');
  const caption = document.getElementById('kareCaption');
  if (!vec) return;
  const states = [
    { pos: { x: 18, y: 78 }, caption: { num: '// INITIAL', text: '「彼」は当初、誰を指すか確定していない位置 <strong>(0.1, 0.8)</strong> にある。' } },
    { pos: { x: 72, y: 73 }, caption: { num: '// ATTENTION 適用後', text: 'Attentionによって「彼」が「太郎」に注目 → ベクトルが <strong>「太郎」(0.7, 0.7)</strong> のすぐ近くへ移動。<strong>「彼 = 太郎」</strong>だと認識できる。' } }
  ];
  document.querySelectorAll('.viz-btn[data-kare]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.kare);
      const state = states[idx];
      document.querySelectorAll('.viz-btn[data-kare]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      vec.style.left = state.pos.x + '%';
      vec.style.bottom = state.pos.y + '%';
      label.style.left = state.pos.x + '%';
      label.style.bottom = state.pos.y + '%';
      caption.classList.add('active');
      caption.innerHTML = `<span class="step-num">${state.caption.num}</span>${state.caption.text}`;
      setTimeout(() => caption.classList.remove('active'), 1500);
    });
  });
})();
