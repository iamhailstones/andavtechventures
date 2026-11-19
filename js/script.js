const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$('#yr').textContent=new Date().getFullYear();
const mb=$('.menu'),nv=$('#nav');
mb.onclick=()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
nv.onclick=e=>{if(e.target.tagName==='A'){nv.classList.remove('open');mb.setAttribute('aria-expanded',false)}};
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.work').forEach(w=>w.hidden=b.dataset.f!=='all'&&w.dataset.c!==b.dataset.f)});
$$('[data-svc]').forEach(a=>a.onclick=()=>{$('#sv').value=a.dataset.svc;location.hash='contact';setTimeout(()=>document.querySelector('[name=m]').focus({preventScroll:true}),500)});
const msg=()=>{const f=new FormData($('#cf'));return`Hello ANDAV TECH. VENTURES,\nName: ${f.get('n')}\nContact: ${f.get('c')}\nService: ${f.get('s')}\n\n${f.get('m')}`};
$('#cf').onsubmit=e=>{e.preventDefault();window.open('https://wa.me/2348036385924?text='+encodeURIComponent(msg()),'_blank')};
$('#em').onclick=()=>{if(!$('#cf').reportValidity())return;location.href='mailto:andavventures@gmail.com?subject='+encodeURIComponent('Enquiry: '+$('#sv').value)+'&body='+encodeURIComponent(msg())};
const v=$('#hv');
if(matchMedia('(prefers-reduced-motion:reduce)').matches){v.removeAttribute('autoplay');v.pause()}
else{const p=v.play();if(p&&p.catch)p.catch(()=>{v.style.display='none'})}
v.addEventListener('error',()=>{v.style.display='none'},true);
