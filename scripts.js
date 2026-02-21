// ===== NAV: hamburger open/close =====
const navCard = document.querySelector('.nav-card');
const burger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', ()=>{
const isOpen = navCard.classList.toggle('open');
burger.setAttribute('aria-expanded', String(isOpen));
mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});
document.addEventListener('click', (e)=>{
if(!navCard.contains(e.target) && navCard.classList.contains('open')){
navCard.classList.remove('open');
burger.setAttribute('aria-expanded','false');
mobileMenu.setAttribute('aria-hidden','true');
}
});


// ===== Particle Cursor (bubbles / firecracker trail) =====
const cvs = document.getElementById('particles');
const ctx = cvs.getContext('2d');
const glow = document.getElementById('cursorGlow');
const stickyArea = document.getElementById('stickyArea');
let W, H, rect;
function resize(){
rect = stickyArea.getBoundingClientRect();
W = window.innerWidth; H = window.innerHeight; // full-screen canvas
cvs.width = W; cvs.height = H;
}
resize();
window.addEventListener('resize', resize);


let mouse = {x: W/2, y: H/2, vx:0, vy:0};
window.addEventListener('mousemove', (e)=>{
mouse.vx = e.clientX - mouse.x; mouse.vy = e.clientY - mouse.y;
mouse.x = e.clientX; mouse.y = e.clientY;
// move glow
glow.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
// spawn burst when speed is high (firecracker), else gentle bubbles
const speed = Math.hypot(mouse.vx, mouse.vy);
const count = Math.min(12, 3 + Math.floor(speed/12));
for(let i=0;i<count;i++) spawn(mouse.x, mouse.y, speed>18);
});


const parts = [];
function spawn(x,y,burst){
const ang = Math.random()*Math.PI*2;
const mag = burst ? (2+Math.random()*5) : (0.5+Math.random()*1.6);
parts.push({
x, y,
vx: Math.cos(ang)*mag + mouse.vx*0.02,
vy: Math.sin(ang)*mag + mouse.vy*0.02,
r: burst ? (2+Math.random()*3) : (1+Math.random()*2.2),
life: burst ? 28+Math.random()*18 : 36+Math.random()*28,
hue: (260 + Math.random()*160) % 360,
alpha: 1
});
}


function step(){
ctx.clearRect(0,0,W,H);
for(let i=parts.length-1;i>=0;i--){
const p = parts[i];
p.x += p.vx; p.y += p.vy;
p.vy += 0.02; // gentle gravity
p.vx *= 0.985; p.vy *= 0.985;
p.life -= 1; p.alpha = Math.max(0, p.life/60);
// draw
const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*6);
g.addColorStop(0, `hsla(${p.hue},100%,70%,${0.9*p.alpha})`);
g.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
ctx.fillStyle = g;
ctx.beginPath();
ctx.arc(p.x, p.y, p.r*3, 0, Math.PI*2);
ctx.fill();
if(p.life<=0) parts.splice(i,1);
}
requestAnimationFrame(step);
}
step();