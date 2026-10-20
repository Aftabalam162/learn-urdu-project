/* Text-only quiz: 50 sets of 20 words. No backend or audio. */
(() => {
  'use strict';
  const SET_SIZE = 20;
  const SET_COUNT = Math.ceil(URDU_WORDS.length / SET_SIZE);
  const STORE_KEY = 'urdu-seekho-1000-practice-v1';
  const $ = id => document.getElementById(id);
  const byId = id => URDU_WORDS[id - 1];
  const state = {set: 1, mode: 'reading', ids: [], index: 0, score: 0, mistakes: [], chosen: null, isReview: false, lastWasReview: false};
  let saved = {set: 1, best: {}};
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      saved.best = raw.best && typeof raw.best === 'object' ? raw.best : {};
      saved.set = Number.isInteger(raw.set) && raw.set >= 1 && raw.set <= SET_COUNT ? raw.set : 1;
    }
  } catch (e) { /* Private browsing or unavailable storage: quiz still functions */ }
  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(saved)); } catch (e) { /* storage optional */ }
  }
  function shuffle(items) {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function inSet() {
    return URDU_WORDS.slice((state.set - 1) * SET_SIZE, state.set * SET_SIZE);
  }
  function setQuestions(ids = null, isReview = false) {
    state.ids = shuffle(ids ? [...ids] : inSet().map(w => w.id));
    state.index = 0;
    state.score = 0;
    state.mistakes = [];
    state.chosen = null;
    state.isReview = isReview;
    $('quizScreen').hidden = false;
    $('resultScreen').hidden = true;
    showQuestion();
  }
  function bestKey() { return `${state.set}-${state.mode}`; }
  function updateBest() {
    const val = saved.best[bestKey()];
    $('bestScore').textContent = (typeof val === 'number') ? `Best: ${val}/${inSet().length} correct` : 'Not yet completed';
  }
  function updateStudyList() {
    const tbody = $('wordTable'); tbody.replaceChildren();
    inSet().forEach(w => {
      const tr = document.createElement('tr');
      for (const [text, className, lang] of [[w.id,'',''],[w.urdu,'urdu-cell','ur'],[w.reading,'hindi-cell','hi'],[w.english,'','en']]) {
        const td=document.createElement('td'); td.textContent=text;
        if (className) td.className=className;
        if (lang) td.lang=lang;
        if (lang==='ur') td.dir='rtl';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
  }
  function correctValue(w) { return state.mode === 'reading' ? w.reading : w.english; }
  function getOptions(w) {
    const correct = correctValue(w);
    const seen = new Set([correct.trim().toLocaleLowerCase()]);
    const sameSet = shuffle(inSet().filter(x => x.id !== w.id));
    // Prefer comparably useful alternatives from the current set;
    // favor the same part of speech where possible, but avoid duplicate labels.
    const preferred = sameSet.filter(x => x.pos && x.pos === w.pos);
    const others = sameSet.filter(x => !preferred.includes(x));
    const fallback = shuffle(URDU_WORDS.filter(x => x.id !== w.id && !sameSet.includes(x)));
    const options = [correct];
    for (const cand of [...preferred, ...others, ...fallback]) {
      const v = correctValue(cand).trim();
      const k = v.toLocaleLowerCase();
      if (v && !seen.has(k)) {seen.add(k); options.push(v);}
      if (options.length === 4) break;
    }
    return shuffle(options);
  }
  function showQuestion() {
    state.chosen = null;
    const w = byId(state.ids[state.index]);
    $('counter').textContent = `Question ${state.index + 1} of ${state.ids.length}`;
    $('liveScore').textContent = `${state.score} correct`;
    $('progress').setAttribute('aria-valuemax', String(state.ids.length));
    $('progress').setAttribute('aria-valuenow', String(state.index));
    $('progressFill').style.width = `${100 * state.index / state.ids.length}%`;
    $('questionPrompt').textContent = state.mode === 'reading' ? 'How do you read this Urdu word in Hindi?' : 'What does this Urdu word mean in English?';
    $('urduWord').textContent = w.urdu;
    $('choices').replaceChildren();
    for (const value of getOptions(w)) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'option';
      btn.textContent = value; btn.dataset.value = value;
      if (state.mode === 'reading') btn.lang = 'hi';
      btn.addEventListener('click', () => choose(value));
      $('choices').appendChild(btn);
    }
    $('feedback').hidden = true;
    $('feedback').replaceChildren();
    $('nextBtn').disabled = true;
    $('nextBtn').textContent = state.index === state.ids.length - 1 ? 'See result →' : 'Next word →';
  }
  function appendLine(parent, text, tag = 'div', cls = '') {
    const el = document.createElement(tag); el.textContent = text;
    if (cls) el.className = cls;
    parent.appendChild(el);
    return el;
  }
  function choose(value) {
    if (state.chosen !== null) return;
    const w = byId(state.ids[state.index]);
    state.chosen = value;
    const correct = value === correctValue(w);
    if (correct) state.score++;
    else state.mistakes.push(w.id);
    [...$('choices').children].forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.value === correctValue(w)) btn.classList.add('correct');
      else if (btn.dataset.value === value) btn.classList.add('wrong');
    });
    const area = $('feedback');
    area.replaceChildren();
    area.className = 'feedback ' + (correct ? 'good' : 'bad');
    appendLine(area, correct ? 'Correct!' : 'Not quite — here is the answer:', 'strong');
    appendLine(area, `Hindi reading: ${w.reading}`);
    if (w.hindi !== w.reading) appendLine(area, `Hindi meaning: ${w.hindi}`);
    appendLine(area, `English meaning: ${w.english}`);
    if (w.note) appendLine(area, w.note, 'span', 'note');
    area.hidden = false;
    $('liveScore').textContent = `${state.score} correct`;
    $('progress').setAttribute('aria-valuenow', String(state.index + 1));
    $('progressFill').style.width = `${100 * (state.index + 1) / state.ids.length}%`;
    $('nextBtn').disabled = false;
    $('nextBtn').focus();
  }
  function next() {
    if (state.chosen === null) return;
    if (state.index + 1 < state.ids.length) { state.index++; showQuestion(); }
    else { finish(); }
  }
  function finish() {
    state.lastWasReview = state.isReview;
    $('quizScreen').hidden = true;
    $('resultScreen').hidden = false;
    $('resultHeading').textContent = `${state.score} / ${state.ids.length} correct`;
    $('resultText').textContent = state.mistakes.length === 0 ? 'Excellent! You recognised every word.' : `You missed ${state.mistakes.length} word${state.mistakes.length === 1 ? '' : 's'}. Review those below and practise again.`;
    if (!state.isReview) {
      saved.best[bestKey()] = Math.max(saved.best[bestKey()] || 0, state.score);
      persist(); updateBest();
    }
    $('resultBest').textContent = state.isReview ? 'Review complete. Your best full-set score has not changed.' : 'Your best full-set score is saved on this device.';
    const tbody = $('mistakesTable'); tbody.replaceChildren();
    state.mistakes.forEach(id => {
      const w = byId(id);
      const tr = document.createElement('tr');
      for (const [txt, cls, lang] of [[w.urdu,'urdu-cell','ur'],[w.reading,'hindi-cell','hi'],[w.english,'','en']]) {
        const td=document.createElement('td');td.textContent=txt;if(cls)td.className=cls;if(lang)td.lang=lang;if(lang==='ur')td.dir='rtl';tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    $('mistakesWrap').hidden = state.mistakes.length === 0;
    $('retryMistakesBtn').hidden = state.mistakes.length === 0;
    $('nextSetBtn').disabled = state.set === SET_COUNT;
    $('nextSetBtn').hidden = state.set === SET_COUNT;
    $('resultHeading').focus();
  }
  function changeSet(newSet) {
    state.set = newSet;
    saved.set = newSet;persist();
    $('setSelect').value = String(newSet);
    $('studyDetails').open = false;
    updateStudyList();updateBest();setQuestions();
  }
  // Initialization
  for (let i = 1; i <= SET_COUNT; i++) {
    const start = (i - 1) * SET_SIZE + 1;
    const end = Math.min(URDU_WORDS.length, i * SET_SIZE);
    const opt = document.createElement('option'); opt.value=String(i);
    opt.textContent = `Set ${i} · Words ${start}–${end}`;
    $('setSelect').appendChild(opt);
  }
  $('resultHeading').tabIndex=-1;
  $('setSelect').addEventListener('change', e => changeSet(Number(e.target.value)));
  for (const input of document.querySelectorAll('input[name="mode"]')) {
    input.addEventListener('change', e => {
      if (e.target.checked) {state.mode=e.target.value;updateBest();setQuestions();}
    });
  }
  $('restartBtn').addEventListener('click', () => setQuestions());
  $('nextBtn').addEventListener('click', next);
  $('retrySetBtn').addEventListener('click', () => setQuestions());
  $('retryMistakesBtn').addEventListener('click', () => setQuestions(state.mistakes, true));
  $('nextSetBtn').addEventListener('click', () => changeSet(Math.min(SET_COUNT,state.set+1)));
  changeSet(saved.set);
})();
