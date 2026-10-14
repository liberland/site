(function(){
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
