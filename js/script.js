const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$('#yr').textContent=new Date().getFullYear();

/* ---------- Config ---------- */
const WA='2348036385924',MAIL='andavventures@gmail.com';
/* Optional: paste a form-handling endpoint (e.g. a Formspree URL) to receive messages WITH attachments
   straight in your inbox. Leave empty to use WhatsApp / email links and the phone's share sheet instead. */
const FORM_ENDPOINT='';
const MAX_FILES=5,MAX_MB=10,MAX_VOICE_S=120;

/* ---------- Mobile menu ---------- */
const mb=$('.menu'),nv=$('#nav');
mb.onclick=()=>{const o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
nv.onclick=e=>{if(e.target.tagName==='A'){nv.classList.remove('open');mb.setAttribute('aria-expanded',false)}};

/* ---------- Light / dark theme (header corner toggle) ---------- */
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const root=document.documentElement,tb=$('#theme'),tc=document.querySelector('meta[name=theme-color]');
function applyTheme(t,save){
  root.setAttribute('data-theme',t);
  tb.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode');
  tb.setAttribute('aria-pressed',t==='dark');
  if(tc)tc.content=t==='dark'?'#0a1226':'#ffffff';
  if(save)store.set('andav-theme',t);
}
applyTheme(root.getAttribute('data-theme')==='dark'?'dark':'light',false);
tb.onclick=()=>{
  root.classList.add('tx');
  applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark',true);
  setTimeout(()=>root.classList.remove('tx'),450);
};
const mq=matchMedia('(prefers-color-scheme:dark)');
if(mq.addEventListener)mq.addEventListener('change',e=>{if(!store.get('andav-theme'))applyTheme(e.matches?'dark':'light',false)});

/* ---------- Portfolio filter + service shortcuts ---------- */
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.cat').forEach(w=>w.hidden=b.dataset.f!=='all'&&w.dataset.c!==b.dataset.f)});
$$('[data-svc]').forEach(a=>a.onclick=()=>{$('#sv').value=a.dataset.svc;location.hash='contact';setTimeout(()=>$('#cm').focus({preventScroll:true}),500)});

/* ---------- Contact form: state ---------- */
const f=$('#cf'),nm=$('#cn'),ct=$('#cc'),ms=$('#cm'),fi=$('#fi'),fl=$('#fl'),st=$('#st');
let files=[],voice=null;
const allFiles=()=>voice?[...files,voice]:files;
const fmt=b=>b<1024?b+' B':b<1048576?Math.round(b/1024)+' KB':(b/1048576).toFixed(1)+' MB';

function note(text,dl){
  st.replaceChildren();
  st.hidden=!text;
  if(!text)return;
  st.append(text);
  if(dl){st.append(' ');const a=document.createElement('a');a.href=URL.createObjectURL(dl);a.download=dl.name;a.textContent='Download voice note';st.append(a)}
}

/* ---------- Inline validation (bubble under each field) ---------- */
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isPhone=v=>/^\+?\d{7,15}$/.test(v.replace(/[\s().-]/g,''));
function show(inp,type,text){
  const m=$('#'+inp.id+'-m');
  inp.removeAttribute('aria-invalid');inp.classList.remove('valid');
  if(type==='err'){inp.setAttribute('aria-invalid','true')}
  if(type==='ok'){inp.classList.add('valid')}
  if(!text){m.hidden=true;m.textContent='';m.className='msg';return}
  m.hidden=false;m.className='msg '+type;m.textContent=text;
}
/* strict=true (submit / blur): report problems.  strict=false (typing): only clear errors or confirm success. */
function checkName(strict){
  if(nm.value.trim()){show(nm,'ok','');return true}
  if(strict)show(nm,'err','Please fill out this field.');
  return false;
}
function checkContact(strict){
  const v=ct.value.trim();
  if(!v){if(strict)show(ct,'err','Please fill out this field.');return false}
  if(EMAIL.test(v)){show(ct,'ok','\u2713 Valid email address');return true}
  if(isPhone(v)){show(ct,'ok','\u2713 Valid phone number');return true}
  if(strict)show(ct,'err',v.includes('@')?'That email looks incomplete. Try name@example.com':'Enter a valid email address or phone number.');
  else show(ct,'','');
  return false;
}
function checkMsg(strict){
  if(ms.value.trim()||allFiles().length){show(ms,'','');return true}
  if(strict)show(ms,'err','Please write a message, or attach a file or voice note.');
  return false;
}
nm.addEventListener('input',()=>checkName(false));
ct.addEventListener('input',()=>checkContact(false));
ms.addEventListener('input',()=>checkMsg(false));
ct.addEventListener('blur',()=>{if(ct.value.trim())checkContact(true)});
function validate(){
  const r=[checkName(true),checkContact(true),checkMsg(true)];
  const bad=[nm,ct,ms][r.indexOf(false)];
  if(bad)bad.focus();
  return r.every(Boolean);
}

/* ---------- Attachments ---------- */
function renderFiles(){
  fl.replaceChildren(...files.map((x,i)=>{
    const li=document.createElement('li');
    let th;
    if(x.type.startsWith('image/')){
      th=document.createElement('img');th.alt='';th.src=URL.createObjectURL(x);
      th.onload=()=>URL.revokeObjectURL(th.src);
      th.onerror=()=>{const s=document.createElement('span');s.className='th';s.textContent='img';th.replaceWith(s)};
    }else{th=document.createElement('span');th.textContent=(x.name.split('.').pop()||'file').slice(0,4)}
    th.classList.add('th');
    const d=document.createElement('div');d.className='nm';
    const b=document.createElement('b');b.textContent=x.name;b.title=x.name;
    const s=document.createElement('span');s.textContent=fmt(x.size);
    d.append(b,s);
    const rm=document.createElement('button');rm.type='button';rm.className='x';rm.textContent='\u00d7';rm.setAttribute('aria-label','Remove '+x.name);
    rm.onclick=()=>{files.splice(i,1);renderFiles();note('')};
    li.append(th,d,rm);return li;
  }));
}
fi.onchange=()=>{
  const rej=[];
  for(const x of fi.files){
    if(files.length>=MAX_FILES){rej.push(x.name+' (limit of '+MAX_FILES+' files)');continue}
    if(x.size>MAX_MB*1048576){rej.push(x.name+' (over '+MAX_MB+' MB)');continue}
    if(files.some(y=>y.name===x.name&&y.size===x.size))continue;
    files.push(x);
  }
  fi.value='';renderFiles();checkMsg(false);
  note(rej.length?'Not added: '+rej.join(', ')+'.':'');
};
/* keyboard access for the file chip (it is a <label>) */
$('label[for=fi]').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fi.click()}});

/* ---------- Voice note (MediaRecorder) ---------- */
const rec=$('#rec'),recLabel=rec.querySelector('span'),vn=$('#vn'),va=$('#va');
let mr=null,chunks=[],stream=null,tick=null,t0=0,starting=false;
const pickMime=()=>window.MediaRecorder?(['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t))||''):null;
function clearVoice(){
  voice=null;if(va.src)URL.revokeObjectURL(va.src);va.removeAttribute('src');va.load();vn.hidden=true;recLabel.textContent='Record voice note';
}
async function startRec(){
  if(starting)return;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){
    note('Voice recording is not supported in this browser. Try Chrome, Edge, Firefox or Safari, or attach an audio file instead.');return;
  }
  starting=true;
  try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}
  catch(e){
    note(e&&e.name==='NotAllowedError'?'Microphone access is blocked. Allow it in your browser settings, then try again.':'No microphone was found on this device.');
    starting=false;return;
  }
  starting=false;
  const mime=pickMime();
  mr=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);chunks=[];
  mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  mr.onstop=()=>{
    stream.getTracks().forEach(t=>t.stop());clearInterval(tick);
    rec.setAttribute('aria-pressed','false');
    const type=(mr.mimeType||mime||'audio/webm').split(';')[0];
    if(!chunks.length){recLabel.textContent='Record voice note';return}
    const ext=type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';
    if(va.src)URL.revokeObjectURL(va.src);
    voice=new File([new Blob(chunks,{type})],'voice-note.'+ext,{type});
    va.src=URL.createObjectURL(voice);vn.hidden=false;recLabel.textContent='Record again';checkMsg(false);
  };
  mr.start();t0=Date.now();rec.setAttribute('aria-pressed','true');recLabel.textContent='Stop \u00b7 0:00';note('');
  tick=setInterval(()=>{
    const s=Math.floor((Date.now()-t0)/1000);
    recLabel.textContent='Stop \u00b7 '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
    if(s>=MAX_VOICE_S)mr.stop();
  },250);
}
rec.onclick=()=>{if(mr&&mr.state==='recording')mr.stop();else startRec()};
$('#vx').onclick=()=>{clearVoice();checkMsg(false)};

/* ---------- Sending ---------- */
const val=()=>({n:nm.value.trim(),c:ct.value.trim(),s:$('#sv').value,m:ms.value.trim()});
function bodyText(){
  const v=val(),a=allFiles();
  return 'Hello ANDAV TECH. VENTURES,\nName: '+v.n+'\nContact: '+v.c+'\nService: '+v.s+'\n\n'+(v.m||'(Please see my attachments)')
    +(a.length?'\n\nAttachments ('+a.length+'): '+a.map(x=>x.name).join(', '):'');
}
function resetForm(){f.reset();files=[];renderFiles();clearVoice();$$('#cf input,#cf textarea').forEach(i=>{i.classList.remove('valid');i.removeAttribute('aria-invalid')});$$('.msg').forEach(m=>m.hidden=true)}
async function send(channel){
  note('');
  if(!validate())return;
  const v=val(),a=allFiles(),body=bodyText();
  /* 1. Optional endpoint: delivers the message and every attachment in one request */
  if(FORM_ENDPOINT){
    try{
      const fd=new FormData();
      fd.append('name',v.n);fd.append('contact',v.c);fd.append('service',v.s);fd.append('message',v.m);
      a.forEach(x=>fd.append('attachments',x,x.name));
      const r=await fetch(FORM_ENDPOINT,{method:'POST',body:fd,headers:{Accept:'application/json'}});
      if(!r.ok)throw new Error(r.status);
      resetForm();note('Thank you. Your message was sent and we will reply soon.');return;
    }catch(e){note('We could not send that directly, so we are opening '+(channel==='wa'?'WhatsApp':'your email app')+' instead.')}
  }
  /* 2. Phones / modern browsers: the share sheet can pass files into WhatsApp or an email app */
  if(a.length&&navigator.canShare&&navigator.canShare({files:a})){
    try{await navigator.share({files:a,text:body,title:'Enquiry: '+v.s});note('Choose WhatsApp or your email app in the share sheet to send your message and attachments.');return}
    catch(e){if(e&&e.name==='AbortError')return}
  }
  /* 3. Fallback: text-only link. Links cannot carry files, so tell the person clearly. */
  if(channel==='wa')window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(body),'_blank','noopener');
  else location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Enquiry: '+v.s)+'&body='+encodeURIComponent(body);
  if(a.length)note('Your message is ready. Links cannot carry files, so please attach your file(s) in the '+(channel==='wa'?'WhatsApp chat':'email')+' that just opened.',voice);
}
f.onsubmit=e=>{e.preventDefault();send('wa')};
$('#em').onclick=()=>send('mail');

/* ---------- Footer: live clock, back to top, interactive network canvas ---------- */
const clk=$('#clk'),tf=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'});
const tickClock=()=>{clk.textContent=tf.format(new Date())};tickClock();setInterval(tickClock,15000);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#top').onclick=()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'});
(()=>{
  const cv=$('#net'),ft=$('#top-footer');if(!cv||!cv.getContext)return;
  const ctx=cv.getContext('2d');let W=0,H=0,pts=[],raf=0,vis=false,rt=0;const m={x:-999,y:-999},L=120;
  function size(){
    const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;
    cv.width=Math.round(W*d);cv.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);
    const n=Math.round(Math.min(90,Math.max(26,W*H/11000)));
    pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<pts.length;i++){
      const p=pts[i];
      if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy;
        if(d<L*L){ctx.strokeStyle='rgba(110,170,255,'+(.55*(1-Math.sqrt(d)/L)).toFixed(3)+')';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}
      }
      const dm=Math.hypot(p.x-m.x,p.y-m.y);
      if(dm<150){ctx.strokeStyle='rgba(255,90,100,'+(.55*(1-dm/150)).toFixed(3)+')';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(m.x,m.y);ctx.stroke()}
      ctx.fillStyle='rgba(160,210,255,1)';ctx.beginPath();ctx.arc(p.x,p.y,1.9,0,6.283);ctx.fill();
    }
    if(!reduce&&vis)raf=requestAnimationFrame(draw);
  }
  size();draw();
  if(!reduce){
    new IntersectionObserver(([e])=>{vis=e.isIntersecting;cancelAnimationFrame(raf);if(vis)draw()}).observe(cv);
    ft.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
    ft.addEventListener('pointerleave',()=>{m.x=m.y=-999});
  }
  addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{size();if(reduce)draw()},150)});
})();

/* ---------- Hero video ---------- */
const v=$('#hv');
if(reduce){v.removeAttribute('autoplay');v.pause()}
else{const p=v.play();if(p&&p.catch)p.catch(()=>{v.style.display='none'})}
v.addEventListener('error',()=>{v.style.display='none'},true);
