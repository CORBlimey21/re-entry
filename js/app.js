import { SCIENCE, kineticEnergy, densityAt, dragForce, relativeHeating } from './science.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const number = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 0 });
const fixed = (value, places = 1) => value.toLocaleString('en-IE', { minimumFractionDigits: places, maximumFractionDigits: places });
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

function rangeStyle(input) {
  input.style.setProperty('--range-fill', `${100 * (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min))}%`);
}

function initEnergy() {
  const mass = $('#mass');
  const speed = $('#speed');
  function update() {
    const m = Number(mass.value);
    const v = Number(speed.value) * 1000;
    const energy = kineticEnergy(m, v);
    const doubled = kineticEnergy(m, 2 * v);
    const scale = Math.max(kineticEnergy(m, SCIENCE.leoSpeed) * 4, doubled);
    $('#mass-value').innerHTML = `${number.format(m)} <span>kg</span>`;
    $('#speed-value').innerHTML = `${fixed(v / 1000)} <span>km/s</span>`;
    $('#energy-value').textContent = fixed(energy / 1e9);
    $('#energy-joules').textContent = `${number.format(energy)} joules`;
    $('#energy-bar-label').textContent = `${fixed(energy / 1e9)} GJ`;
    $('#double-bar-label').textContent = `${fixed(doubled / 1e9)} GJ`;
    $('#energy-bar').style.width = `${energy / scale * 100}%`;
    $('#double-bar').style.width = `${doubled / scale * 100}%`;
    $('#energy-working').textContent = `½ × ${number.format(m)} kg × (${number.format(v)} m/s)² = ${number.format(energy)} J`;
    mass.setAttribute('aria-valuetext', `${number.format(m)} kilograms`);
    speed.setAttribute('aria-valuetext', `${fixed(v / 1000)} kilometres per second`);
    $$('[data-speed]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.speed) === v / 1000)));
    rangeStyle(mass); rangeStyle(speed);
  }
  [mass, speed].forEach(input => input.addEventListener('input', update));
  $$('[data-speed]').forEach(button => button.addEventListener('click', () => { speed.value = button.dataset.speed; update(); }));
  $('#reset-energy').addEventListener('click', () => { mass.value = SCIENCE.defaultMass; speed.value = SCIENCE.leoSpeed / 1000; update(); });
  update();
}

function initFlow() {
  const altitude = $('#altitude');
  const speed = $('#flow-speed');
  const params = SCIENCE.sampler;
  function update() {
    const h = Number(altitude.value) * 1000;
    const v = Number(speed.value) * 1000;
    const density = densityAt(h);
    const drag = dragForce(density, v, params.dragCoefficient, params.referenceArea);
    const ratio = relativeHeating(density, v, densityAt(params.referenceAltitude), params.referenceSpeed);
    $('#altitude-value').innerHTML = `${h / 1000} <span>km</span>`;
    $('#flow-speed-value').innerHTML = `${fixed(v / 1000)} <span>km/s</span>`;
    $('#density-value').textContent = density.toExponential(2);
    $('#drag-value').textContent = fixed(drag / 1000);
    $('#heating-value').textContent = fixed(ratio, 2);
    // Colour strength is an illustrative response, never a temperature readout.
    $('.shock-zone').style.opacity = String(Math.min(1, 0.2 + 0.8 * Math.sqrt(ratio / 6)));
    altitude.setAttribute('aria-valuetext', `${h / 1000} kilometres`);
    speed.setAttribute('aria-valuetext', `${fixed(v / 1000)} kilometres per second`);
    rangeStyle(altitude); rangeStyle(speed);
  }
  [altitude, speed].forEach(input => input.addEventListener('input', update));
  update();
}

const RADIO = {
  clear: ['Radio link received', 'The signal reaches the ground with little interference from plasma.'],
  attenuated: ['Radio signal weakened', 'Plasma can absorb or reflect some of the radio signal, so less power reaches the ground. The effect depends on the number of free electrons, their collisions, the signal’s frequency and its path through the gas.'],
  blackout: ['Radio blackout', 'If enough of the signal is reflected or absorbed, communication is interrupted. This is a radio blackout. It depends on the signal’s frequency and the plasma in its path: one frequency may be blocked while another gets through.'],
};
const LAYERS = {
  char: ['LAYER 01 / SURFACE AND CHAR', 'Surface ablation', 'The hot surface breaks down chemically, releasing gas and leaving char. Escaping gas, lost material and radiation carry energy away. The char slows heat passing into the shield. Testing checks whether the gas can escape and whether the char cracks.'],
  virgin: ['LAYER 02 / UNREACTED ABLATOR', 'Unreacted material', 'Below the char is material that has not yet broken down. It conducts heat slowly, protecting the structure beneath it. Some energy raises its temperature. With continued heating, the chemical breakdown can spread deeper into the shield.'],
  structure: ['LAYER 03 / SUPPORTING STRUCTURE', 'Supporting structure', 'The structure must stay cool enough to keep its strength. Insulation slows heat transfer, but does not stop it. Heat can keep moving inward after heating at the outer surface has passed its peak, so engineers must allow for this delay.'],
};
const TRAJECTORIES = {
  shallow: ['Shallow entry', 'A shallow path can spread the slowing over more time and reduce the highest loads. The longer heating may increase total heat exposure. If the path is too shallow, the spacecraft may leave the atmosphere again before slowing enough. Speed, lift and guidance also affect the outcome.', 'Lower peak loads ↔ longer heating ↔ risk of leaving the atmosphere'],
  moderate: ['Moderate entry', 'A suitable path keeps heating and slowing within the spacecraft’s limits and reaches the planned recovery area. “Moderate” is just a label for this drawing; no safe entry angle has been calculated here.', 'Peak load ↔ duration ↔ landing range'],
  steep: ['Steep entry', 'A steep path reaches denser air quickly. The spacecraft may slow more sharply and experience a higher peak heat flux. Although the heating lasts less time, the highest loads may exceed what the spacecraft or crew can withstand.', 'Shorter exposure ↔ higher peak loads'],
};

function selectGroup(selector, button) {
  $$(selector).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}
function initExplorers() {
  $$('[data-radio]').forEach(button => button.addEventListener('click', () => {
    selectGroup('[data-radio]', button);
    const state = button.dataset.radio;
    $('#radio-art').dataset.condition = state;
    $('#radio-title').textContent = RADIO[state][0];
    $('#radio-description').textContent = RADIO[state][1];
  }));
  $$('[data-layer]').forEach(button => button.addEventListener('click', () => {
    selectGroup('[data-layer]', button);
    const [index, title, description] = LAYERS[button.dataset.layer];
    $('#layer-index').textContent = index;
    $('#layer-title').textContent = title;
    $('#layer-description').textContent = description;
  }));
  $$('[data-trajectory]').forEach(button => button.addEventListener('click', () => {
    selectGroup('[data-trajectory]', button);
    const state = button.dataset.trajectory;
    const [title, description, tradeoff] = TRAJECTORIES[state];
    $('#trajectory-heading').textContent = title;
    $('#trajectory-description').textContent = description;
    $('#trajectory-tradeoff').textContent = tradeoff;
    $$('[data-path]').forEach(path => path.classList.toggle('selected', path.dataset.path === state));
  }));
}

function initNavigation() {
  const chapters = $$('.chapter');
  const links = $$('.chapter-nav a');
  const toggle = $('#presentation-toggle');
  const toolbar = $('#presentation-toolbar');
  let current = 0;
  let presenting = false;
  let scheduled = false;
  function updateNavigation() {
    current = 0;
    chapters.forEach((chapter, index) => { if (chapter.getBoundingClientRect().top <= 160) current = index; });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    $('#present-position').textContent = `${String(current + 1).padStart(2, '0')} / 06`;
    $('#present-prev').disabled = current === 0;
    $('#present-next').disabled = current === chapters.length - 1;
    const extent = document.documentElement.scrollHeight - innerHeight;
    $('#reading-progress').style.width = `${extent > 0 ? Math.min(100, Math.max(0, scrollY / extent * 100)) : 0}%`;
    // Reveal the active chapter in the horizontal rail, without moving the page.
    const rail = $('.chapter-nav-inner');
    const active = links[current];
    if (active.offsetLeft < rail.scrollLeft || active.offsetLeft + active.offsetWidth > rail.scrollLeft + rail.clientWidth) {
      rail.scrollTo({ left: Math.max(0, active.offsetLeft - rail.offsetLeft - 15), behavior: motion.matches ? 'instant' : 'smooth' });
    }
    scheduled = false;
  }
  function onScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); } }
  function goTo(index) {
    const chapter = chapters[Math.min(chapters.length - 1, Math.max(0, index))];
    // Direct steps keep the requested chapter and telemetry in sync even under rapid input.
    chapter.scrollIntoView({ behavior: 'instant', block: 'start' });
    history.replaceState(null, '', `#${chapter.id}`);
    const heading = chapter.querySelector('h2');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    updateNavigation();
  }
  function setPresenting(value) {
    presenting = value;
    document.body.classList.toggle('is-presenting', value);
    toggle.setAttribute('aria-pressed', String(value));
    toggle.lastElementChild.textContent = value ? 'Presenting' : 'Present';
    toolbar.hidden = !value;
    if (value) goTo(current); else toggle.focus({ preventScroll: true });
    updateNavigation();
  }
  toggle.addEventListener('click', () => setPresenting(!presenting));
  $('#present-exit').addEventListener('click', () => setPresenting(false));
  $('#present-prev').addEventListener('click', () => goTo(current - 1));
  $('#present-next').addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', event => {
    if (!presenting) return;
    if (event.key === 'Escape') { setPresenting(false); return; }
    if (event.target.closest('input,textarea,select,[contenteditable=true]')) return;
    if (event.key === 'PageDown' || event.key === 'PageUp') {
      event.preventDefault(); goTo(current + (event.key === 'PageDown' ? 1 : -1));
    }
  });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  updateNavigation();
}

initEnergy();
initFlow();
initExplorers();
initNavigation();
document.documentElement.classList.add('js');
$$('input[type=range], [data-layer]').forEach(control => { control.disabled = false; });
