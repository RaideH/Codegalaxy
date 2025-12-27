(() => {
  const canvas = document.getElementById('sunCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, cx, cy;
  let particles = [], shockwaves = [], stars = [];
  let running = true;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Read theme colors from CSS variables (falls back to site palette)
  function readPalette(){
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue('--accent').trim() || '#FFD700';
    const accentDark = cs.getPropertyValue('--accent-dark').trim() || '#C0A000';
    const secondary = cs.getPropertyValue('--secondary').trim() || '#F5F5DC';
    const bg = cs.getPropertyValue('--bg').trim() || '#0D133D';
    return {accent, accentDark, secondary, bg};
  }

  function hexToRgb(hex){
    if(!hex) return null;
    hex = hex.replace('#','');
    if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
    const num = parseInt(hex,16);
    return {r:(num>>16)&255, g:(num>>8)&255, b:num&255};
  }

  function parseCssColor(v){
    v = (v||'').trim();
    if(!v) return null;
    if(v.startsWith('rgb')){
      const parts = v.replace(/rgba?|\(|\)|\s/g,'').split(',').map(Number);
      return {r:parts[0], g:parts[1], b:parts[2]};
    }
    if(v.startsWith('#')) return hexToRgb(v);
    return null;
  }

  // palette filled during init
  let palette = [];
  let paletteAccent = {r:255,g:215,b:0};

  // (sound removed) prefers-reduced-motion check still applied

  function rand(min,max){ return Math.random()*(max-min)+min }

  function resize(){
    w = canvas.width = innerWidth; h = canvas.height = innerHeight;
    cx = w/2; cy = h/2 - 40;
    // recreate starfield with density scaled to size
    createStars();
  }

  function createStars(){
    stars = [];
    const baseCount = prefersReducedMotion ? 30 : 120;
    const count = Math.max(20, Math.floor(baseCount * (w/1200)));
    const sec = parseCssColor(readPalette().secondary) || {r:245,g:245,b:220};
    for(let i=0;i<count;i++) stars.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.2,a:Math.random()*0.9,color:`${sec.r},${sec.g},${sec.b}`});
  }

  function explode(){
    particles = [];
    shockwaves = [];
    const base = Math.min(w,h)/12;
    // scale particle count down on small screens and when reduced-motion is requested
    const screenScale = Math.min(1, w / 1400 * (window.devicePixelRatio || 1));
    const count = prefersReducedMotion ? Math.max(40, Math.floor(90 * screenScale)) : Math.max(60, Math.floor(260 * screenScale));

    for(let i=0;i<count;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = rand(base*0.02, base*0.8) * (0.5 + Math.random());
      const life = rand(900,1600);
      const size = rand(1.2, 6.2) * (1 + (1-screenScale)*0.6);
      // pick from palette (accent, accent-dark, secondary)
      const color = palette[Math.floor(Math.random()*palette.length)];
      particles.push({x:cx,y:cy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life,age:0,size,color,alpha:1});
    }

    // add core flash / shockwaves
    const flashCount = prefersReducedMotion ? 1 : 2;
    if(flashCount >= 1) shockwaves.push({r:base*0.6,dr:0.6,alpha:1,fade:0.005});
    if(flashCount >= 2) shockwaves.push({r:base*0.3,dr:1.2,alpha:0.9,fade:0.006});

    // sound removed — visual only
  }

  function drawStarfield(){
    ctx.save();
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation = 'lighter';
    for(const s of stars){
      const col = s.color ? s.color : '255,255,255';
      ctx.fillStyle = `rgba(${col},${s.a*0.09})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  function step(){
    if(!running) return;
    ctx.clearRect(0,0,w,h);
    drawStarfield();

    // subtle background gradient glow from explosion center
    const pal = readPalette();
    const a = parseCssColor(pal.accent) || {r:255,g:215,b:0};
    const ad = parseCssColor(pal.accentDark) || {r:192,g:160,b:0};
    const g = ctx.createRadialGradient(cx,cy,10,cx,cy,Math.max(w,h));
    g.addColorStop(0,`rgba(${a.r},${a.g},${a.b},0.12)`);
    g.addColorStop(0.25,`rgba(${ad.r},${ad.g},${ad.b},0.06)`);
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

    // shockwaves
    for(let i=shockwaves.length-1;i>=0;i--){
      const s = shockwaves[i];
      ctx.beginPath(); ctx.lineWidth = 6 + (1.3*i);
      ctx.strokeStyle = `rgba(${paletteAccent.r},${paletteAccent.g},${paletteAccent.b},${s.alpha})`;
      ctx.arc(cx,cy,s.r,0,Math.PI*2); ctx.stroke();
      s.r += s.dr * (1 + Math.random()*0.5);
      s.alpha -= s.fade;
      if(s.alpha <= 0) shockwaves.splice(i,1);
    }

    // particles
    ctx.globalCompositeOperation = 'lighter';
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx * 0.016; p.y += p.vy * 0.016 + 0.02 * (i%3-1);
      p.vx *= 0.999; p.vy *= 0.999; p.age += 16; p.alpha = Math.max(0,1 - p.age / p.life);

      const rad = p.size*1.8; const rg = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad*3);
      const c = p.color;
      rg.addColorStop(0, `rgba(${c},${p.alpha})`);
      rg.addColorStop(0.2, `rgba(${c},${p.alpha*0.65})`);
      rg.addColorStop(0.5, `rgba(${c},${p.alpha*0.12})`);
      rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(p.x,p.y,rad*2,0,Math.PI*2); ctx.fill();

      ctx.fillStyle = `rgba(255,255,255,${Math.min(1,p.alpha*1.2)})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*0.6,0,Math.PI*2); ctx.fill();

      if(p.age > p.life) particles.splice(i,1);
    }
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(step);
  }

  // event binding, with simple debounce for resize
  function bindEvents(){
    let rto = null;
    window.addEventListener('resize', ()=>{ clearTimeout(rto); rto = setTimeout(resize, 120); });

    canvas.addEventListener('click', ()=> explode());
    canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); explode(); }, {passive:false});

    // pause when tab hidden to save CPU/battery
    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden){ running = false; }
      else { running = true; requestAnimationFrame(step); }
    });
  }

  // bootstrap
  function init(){
    // prepare palette from CSS variables
    const pal = readPalette();
    const a = parseCssColor(pal.accent) || {r:255,g:215,b:0};
    const ad = parseCssColor(pal.accentDark) || {r:192,g:160,b:0};
    const s = parseCssColor(pal.secondary) || {r:245,g:245,b:220};
    paletteAccent = a;
    palette = [ `${a.r},${a.g},${a.b}`, `${ad.r},${ad.g},${ad.b}`, `${s.r},${s.g},${s.b}` ];

    resize(); createStars();
    // initial tiny explosion to show effect
    if(!prefersReducedMotion) explode();
    bindEvents();
    requestAnimationFrame(step);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
