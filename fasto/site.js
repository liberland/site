(function(){
  // Remember a language picked with the flags; it overrides the time-zone guess
  document.addEventListener('click',function(e){
    var f=e.target.closest('.flag[hreflang]');
    if(f)try{localStorage.setItem('fasto-lang',f.getAttribute('hreflang'));}catch(err){}
  });

  // Mobile menu
  var btn=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
  function set(open){menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));}
  btn.addEventListener('click',function(){set(!menu.classList.contains('open'));});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){set(false);btn.focus();}});

  // Reveal on scroll
  var targets=document.querySelectorAll('.reveal,.close');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{rootMargin:'0px 0px -10% 0px',threshold:.1});
    targets.forEach(function(t){io.observe(t);});
  }else{targets.forEach(function(t){t.classList.add('in');});}

  // Active nav link
  var links={};document.querySelectorAll('.nav__link').forEach(function(a){links[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var nio=new IntersectionObserver(function(entries){
      entries.forEach(function(en){var a=links[en.target.id];if(a)a.classList.toggle('is-active',en.isIntersecting);});
    },{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)nio.observe(s);});
  }

  // Scroll progress, header shadow, zome parallax
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.documentElement,header=document.querySelector('.header'),zimg=document.querySelector('.zomes__img img'),ticking=false;
  function frame(){
    var max=root.scrollHeight-innerHeight;
    root.style.setProperty('--p',max>0?(scrollY/max).toFixed(4):0);
    header.classList.toggle('scrolled',scrollY>8);
    if(zimg&&!reduce){
      var r=zimg.parentNode.getBoundingClientRect(),c=(r.top+r.height/2-innerHeight/2)/innerHeight;
      zimg.style.setProperty('--py',(Math.max(-1,Math.min(1,c))*-6).toFixed(2)+'%');
    }
    ticking=false;
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(frame);}},{passive:true});
  addEventListener('resize',frame);frame();
})();

// News gallery lightbox
(function(){
  var box=document.querySelector('.lightbox');
  if(!box||typeof box.showModal!=='function')return;
  var img=box.querySelector('img'),cap=box.querySelector('figcaption'),
      prev=box.querySelector('.lightbox__prev'),next=box.querySelector('.lightbox__next'),
      shots=[],i=0,opener=null;
  function show(n){
    i=(n+shots.length)%shots.length;
    var s=shots[i];
    img.src=s.getAttribute('data-full');img.alt=s.getAttribute('data-alt')||'';
    cap.textContent=(shots.length>1?(i+1)+' / '+shots.length+' · ':'')+(s.getAttribute('data-alt')||'');
    img.style.animation='none';void img.offsetWidth;img.style.animation='';
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('.news__shot');if(!b)return;
    shots=Array.prototype.slice.call(b.closest('.news__gallery').querySelectorAll('.news__shot'));
    opener=b;prev.hidden=next.hidden=shots.length<2;
    show(shots.indexOf(b));box.showModal();
  });
  prev.addEventListener('click',function(){show(i-1);});
  next.addEventListener('click',function(){show(i+1);});
  box.querySelector('.lightbox__close').addEventListener('click',function(){box.close();});
  box.addEventListener('click',function(e){if(e.target===box)box.close();});
  box.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'&&shots.length>1)show(i-1);
    if(e.key==='ArrowRight'&&shots.length>1)show(i+1);
  });
  var x0=null;
  box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',function(e){
    if(x0===null||shots.length<2)return;var dx=e.changedTouches[0].clientX-x0;x0=null;
    if(Math.abs(dx)>50)show(dx<0?i+1:i-1);
  });
  box.addEventListener('close',function(){img.removeAttribute('src');if(opener)opener.focus();});
})();
