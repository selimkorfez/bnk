document.querySelector('#year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const heroScroll = document.querySelector('.hero-scroll');
const hero = document.querySelector('.hero');
const nameLetters = [...document.querySelectorAll('.name-title span')];
const atlas = 'url("assets/solar-system-atlas.png")';
const celestialBodies = [
  { size: 18, fill: atlas, x: '0%', y: '0%' },
  { size: 28, fill: atlas, x: '33.333%', y: '0%' },
  { size: 28, fill: atlas, x: '66.667%', y: '0%' },
  { size: 22, fill: atlas, x: '100%', y: '0%' },
  { size: 47, fill: atlas, x: '0%', y: '100%' },
  { size: 32, fill: 'radial-gradient(circle at 32% 27%, #f3ddbf 0 16%, #d3ad80 48%, #8f6f68 100%)' },
  { size: 33, fill: atlas, x: '66.667%', y: '100%' },
  { size: 33, fill: atlas, x: '100%', y: '100%' },
  { size: 7, fill: '#fff7e6', shadow: '0 0 10px 4px #f0b9b6, 0 0 25px 8px #f4d3bd' },
  { size: 5, fill: '#fff7e6', shadow: '0 0 8px 3px #d7b9f0, 0 0 20px 6px #e7d4f0' }
];
let frame = 0;
function animateHeroOnScroll() {
  frame = 0;
  if (!heroScroll || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const distance = Math.max(1, heroScroll.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -heroScroll.getBoundingClientRect().top / distance));
  const travel = Math.min(1, Math.max(0, (progress - .08) / .65));
  hero.style.setProperty('--name-x', `${progress * 2}vw`);
  hero.style.setProperty('--name-y', `${-progress * 4}vh`);
  hero.style.setProperty('--name-rotate', `${progress * 2}deg`);
  hero.style.setProperty('--name-scale', `${1 + progress * .06}`);
  hero.style.setProperty('--name-opacity', `${1 - progress * .08}`);
  const orbitalHeights = [-17, -7, 4, 14, -12, 7, 18, 27, -2, 21];
  nameLetters.forEach((letter, index) => {
    const centred = index - (nameLetters.length - 1) / 2;
    const x = (46 - centred * 6) * travel;
    const y = orbitalHeights[index] * travel;
    const rotation = centred * 4 * travel;
    const bodyProgress = Math.min(1, Math.max(0, (progress - .12 - index * .018) / .36));
    const body = celestialBodies[index];
    letter.style.setProperty('--letter-x', `${x}vw`);
    letter.style.setProperty('--letter-y', `${y}vh`);
    letter.style.setProperty('--letter-rotate', `${rotation}deg`);
    letter.style.setProperty('--letter-scale', `${1 + Math.abs(centred) * .008 * travel}`);
    letter.style.setProperty('--letter-opacity', '1');
    letter.style.color = `rgba(196, 107, 135, ${1 - bodyProgress})`;
    letter.style.setProperty('--planet-opacity', `${bodyProgress}`);
    letter.style.setProperty('--planet-scale', `${.58 + bodyProgress * .42}`);
    letter.style.setProperty('--planet-size', `${body.size}px`);
    letter.style.setProperty('--planet-fill', body.fill);
    letter.style.setProperty('--planet-shadow', body.shadow || 'inset -5px -5px 9px #553d4133, 2px 5px 12px #85576033');
    letter.style.setProperty('--atlas-x', body.x || '0%');
    letter.style.setProperty('--atlas-y', body.y || '0%');
  });
  hero.style.setProperty('--map-x', `${-progress * 8}vw`);
  hero.style.setProperty('--map-y', `${progress * 5}vh`);
  hero.style.setProperty('--map-rotate', `${progress * -22}deg`);
  hero.style.setProperty('--map-opacity', `${.85 - progress * .2}`);
  hero.style.setProperty('--orbit-turn', `${progress * 100}deg`);
}
function requestHeroUpdate() { if (!frame) frame = requestAnimationFrame(animateHeroOnScroll); }
window.addEventListener('scroll', requestHeroUpdate, { passive: true });
window.addEventListener('resize', requestHeroUpdate);
animateHeroOnScroll();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const star = document.createElement('div');
  const trail = document.createElement('div');
  star.className = 'shooting-star';
  trail.className = 'shooting-trail';
  document.body.append(trail, star);
  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
  let x = targetX, y = targetY, previousX = x, previousY = y;
  document.addEventListener('pointermove', (event) => { targetX = event.clientX; targetY = event.clientY; }, { passive: true });
  function animateCursor() {
    x += (targetX - x) * .32;
    y += (targetY - y) * .32;
    const dx = x - previousX, dy = y - previousY;
    const speed = Math.min(1, Math.hypot(dx, dy) / 18);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    star.style.left = `${x}px`; star.style.top = `${y}px`;
    trail.style.left = `${x}px`; trail.style.top = `${y}px`;
    trail.style.width = `${18 + speed * 90}px`;
    trail.style.opacity = `${.18 + speed * .72}`;
    trail.style.transform = `translate(-100%, -50%) rotate(${angle}deg)`;
    previousX = x; previousY = y;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}
