(function(){
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var P='dm-';var ch=document.body.dataset.ch;
function toast(t){var e=document.getElementById('toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},1800)}
// thème
document.getElementById('themeBtn').onclick=function(){var d=document.documentElement.classList.toggle('dark');try{localStorage.setItem('dm-theme',d?'dark':'light')}catch(e){}};
// menu
document.getElementById('menuBtn').onclick=function(){document.body.classList.toggle('nav')};
document.getElementById('overlay').onclick=function(){document.body.classList.remove('nav')};
// modal
var modal=document.getElementById('modal'),mbody=modal.querySelector('.mbody');
function openM(h){mbody.innerHTML=h;modal.classList.add('on')}
function closeM(){modal.classList.remove('on')}
modal.onclick=function(e){if(e.target===modal||e.target.classList.contains('mclose'))closeM()};
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
// notes
document.querySelectorAll('sup.nref').forEach(function(s){s.onclick=function(){openM('<h4>Note '+s.textContent+'</h4><p>'+s.dataset.note.replace(/</g,'&lt;')+'</p>')}});
// progression
var chapLinks=[].slice.call(document.querySelectorAll('#side li a[data-ch]'));
var read=LS.get(P+'read',{});
function paintProg(){chapLinks.forEach(function(a){a.classList.toggle('read',!!read[a.dataset.ch])});
 document.querySelectorAll('.toclist a').forEach(function(a){a.classList.toggle('read',!!read[a.dataset.ch])});
 var n=chapLinks.filter(function(a){return read[a.dataset.ch]}).length,t=chapLinks.length||1;
 document.getElementById('gprog').style.width=(100*n/t)+'%';document.getElementById('gprogt').textContent=n+' / '+t+' chapitres lus ('+Math.round(100*n/t)+' %)'}
paintProg();
document.getElementById('resetBtn').onclick=function(){if(confirm('Réinitialiser la progression de lecture (chapitres lus et positions) ? Les marque-pages sont conservés.')){read={};LS.set(P+'read',read);LS.set(P+'pos',{});LS.set(P+'last',null);paintProg();toast('Progression réinitialisée')}};
// barre de lecture + position
var bar=document.querySelector('#readbar span');var pos=LS.get(P+'pos',{});
var isChap=!!document.querySelector('.chap');
function onScroll(){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;var r=max>0?h.scrollTop/max:0;bar.style.width=(r*100)+'%';
 if(!isChap)return;pos[ch]=h.scrollTop;LS.set(P+'pos',pos);LS.set(P+'last',{ch:ch,t:document.querySelector('.chead h1').textContent});
 var em=document.getElementById('endmark');if(em&&em.getBoundingClientRect().top<h.clientHeight&&!read[ch]){read[ch]=1;LS.set(P+'read',read);paintProg();toast('Chapitre marqué comme lu ✓')}}
var tm;window.addEventListener('scroll',function(){clearTimeout(tm);tm=setTimeout(onScroll,120)});
if(isChap&&!location.hash&&pos[ch]){window.scrollTo(0,pos[ch])}
// reprise
var rs=document.getElementById('resume');var last=LS.get(P+'last',null);
if(rs&&last){rs.innerHTML='<a href="'+last.ch+'">Reprendre la lecture : '+last.t.replace(/</g,'&lt;')+'</a>'}
// marque-pages
var bms=LS.get(P+'bms',[]);
function saveB(){LS.set(P+'bms',bms)}
function paintMarks(){document.querySelectorAll('.bm').forEach(function(el){el.classList.toggle('marked',bms.some(function(b){return b.ch===ch&&b.id===el.id}))})}
document.querySelectorAll('.chap .bm').forEach(function(el){var b=document.createElement('button');b.className='bmbtn';b.title='Ajouter / retirer un marque-page';b.textContent='🔖';
 b.onclick=function(e){e.stopPropagation();var i=bms.findIndex(function(x){return x.ch===ch&&x.id===el.id});
  if(i>=0){bms.splice(i,1);toast('Marque-page retiré')}else{var tx=el.innerText.replace(/^🔖|Texte arabe :|Traduction française :/g,'').trim().slice(0,110);
   bms.unshift({ch:ch,id:el.id,ct:document.querySelector('.chead h1').textContent,tx:tx,d:Date.now()});toast('Marque-page ajouté')}
  saveB();paintMarks()};el.insertBefore(b,el.firstChild)});
paintMarks();
document.getElementById('bmListBtn').onclick=function(){
 if(!bms.length){openM('<h4>Marque-pages</h4><p>Aucun marque-page. Survolez (ou touchez) un paragraphe et cliquez sur 🔖 pour en ajouter un.</p>');return}
 var h='<h4>Marque-pages ('+bms.length+')</h4><ul class="bml">'+bms.map(function(b,i){return '<li><a href="'+b.ch+'#'+b.id+'"><b>'+b.ct.replace(/</g,'&lt;')+'</b><small>'+b.tx.replace(/</g,'&lt;')+'…</small></a><button data-i="'+i+'">✕</button></li>'}).join('')+'</ul><p style="margin-top:14px"><button class="mbtn" id="bmClear">Supprimer tous les marque-pages</button></p>';
 openM(h);mbody.querySelectorAll('.bml button').forEach(function(x){x.onclick=function(){bms.splice(+x.dataset.i,1);saveB();paintMarks();document.getElementById('bmListBtn').onclick()}});
 document.getElementById('bmClear').onclick=function(){if(confirm('Supprimer tous les marque-pages ?')){bms=[];saveB();paintMarks();closeM();toast('Marque-pages supprimés')}};
 mbody.querySelectorAll('.bml a').forEach(function(a){a.onclick=function(){closeM()}})};
// ferme le menu après un clic (mobile)
document.querySelectorAll('#side a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('nav')})});
})();
