'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GROUPS=Array.from({length:10},(_,i)=>[String(i*10).padStart(2,'0')+'–'+String(i*10+9).padStart(2,'0'),CARDS.slice(i*10,i*10+10)]);
const blank=()=>({seen:{},group:0,index:0,custom:{},hidden:false});
let state=blank();let remember=false;try{remember=localStorage.getItem('numbercast-remember')==='yes';state={...state,...JSON.parse((remember?localStorage:sessionStorage).getItem('numbercast-state')||'{}')}}catch{}
let view='learn',editID=null,shuffled=false,order=null;
function save(){try{(remember?localStorage:sessionStorage).setItem('numbercast-state',JSON.stringify(state))}catch{}}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2400)}
function current(){return GROUPS[state.group][1]}
function shown(){return shuffled&&order?order:current()}
function imgUrl(d){return state.custom[d.n]||d.image||resolved[d.n]||''}
const resolved={};
function needResolve(d){if(imgUrl(d))return;const wiki=d.wiki;const title=d.name.replace(/ /g,'_');const endpoint='https://'+wiki+'.fandom.com/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=650&titles='+encodeURIComponent(title);
fetch(endpoint).then(r=>r.json()).then(j=>{const pages=Object.values(j.query?.pages||{});const u=pages.find(p=>p.thumbnail?.source)?.thumbnail?.source;if(u){resolved[d.n]=u;$('[data-portrait="'+d.n+'"]').forEach(img=>{img.src=u;img.style.display='block';img.closest('.person-portrait,.mini-portrait')?.classList.add('has-photo')})}}).catch(()=>{});}
function photo(d){const u=imgUrl(d);if(!u)needResolve(d);return '<div class="fallback"><strong>'+esc(d.n)+'</strong><small>Portrait not available from source.<br>Find a matching character image below.</small><button data-photo="'+d.n+'">Change portrait</button></div><img class="portrait" data-portrait="'+d.n+'" src="'+esc(u||'')+'" alt="'+esc(d.name)+'" referrerpolicy="no-referrer" loading="lazy">'}
function bindPhotos(){$$('.portrait').forEach(el=>{if(!el.getAttribute('src'))el.style.display='none';else el.addEventListener('error',()=>{el.style.display='none'}, {once:true})});$$('[data-photo]').forEach(b=>b.onclick=()=>{editID=b.dataset.photo;$('#portraitURL').value=state.custom[editID]||'';$('#portraitDialog').showModal()})}
function selectGroup(g){state.group=g;state.index=0;shuffled=false;order=null;view='learn';render()}
function nav(){const n=$('#groups');n.innerHTML=GROUPS.map((g,i)=>'<button class="group-button '+(i===state.group?'active':'')+'" data-group="'+i+'"><span class="group-num">'+String(i+1).padStart(2,'0')+'</span><span>'+g[0]+'</span><span class="group-tail">'+g[1].length+' people</span></button>').join('');$$('[data-group]').forEach(b=>b.onclick=()=>{selectGroup(+b.dataset.group);document.body.classList.remove('menu-open')})}
function portraitTools(d){return '<div class="source-tools"><a href="https://www.google.com/search?tbm=isch&q='+encodeURIComponent(d.name+' '+d.anime+' anime portrait')+'" target="_blank" rel="noopener">Find character picture ↗</a> <button class="quiet" data-photo="'+d.n+'">Change portrait</button></div>'}
function learn(){const list=shown();const d=list[state.index]||list[0];if(!d)return;state.seen[d.n]=true;$('#view').innerHTML='<div class="learning-card"><div class="card-counter">'+(state.index+1)+' / '+list.length+'</div><div class="sound-head"><span class="sound-glyph">'+d.n+'</span><div><span class="tiny-tag">YOUR NUMBER PERSON</span><h2>'+esc(d.name)+'</h2><p>'+esc(d.anime)+'</p></div></div><div class="person-portrait">'+photo(d)+'</div>'+portraitTools(d)+'<div class="study-actions"><button id="prev" class="quiet">← Previous</button><button id="toggleName" class="quiet">'+(state.hidden?'Show':'Hide')+' name</button><button id="next" class="button">Next →</button></div><div class="quiet-note">No rush. Build the connection between <b>'+d.n+'</b> and <b>'+esc(d.name)+'</b>.</div></div>';
$('#toggleName').onclick=()=>{state.hidden=!state.hidden;$('#view').classList.toggle('hide-person',state.hidden);$('#toggleName').textContent=state.hidden?'Show name':'Hide name'};$('#view').classList.toggle('hide-person',state.hidden);
$('#prev').onclick=()=>move(-1);$('#next').onclick=()=>move(1);bindPhotos();}
function move(s){const n=shown().length;state.index=(state.index+s+n)%n;render()}
function reference(){const d=current();$('#view').innerHTML='<div class="reference-list">'+d.map(x=>'<button class="reference-card" data-n="'+x.n+'"><div class="mini-portrait">'+photo(x)+'</div><span class="reference-kana">'+x.n+'</span><strong>'+esc(x.name)+'</strong><small>'+esc(x.anime)+'</small></button>').join('')+'</div>';$$('.reference-card').forEach(b=>b.onclick=e=>{if(e.target.closest('[data-photo]'))return;state.index=current().findIndex(x=>x.n===b.dataset.n);view='learn';render()});bindPhotos()}
function stats(){const seen=Object.keys(state.seen).length;$('#masteryCount').textContent=seen+' / 100';$('#overallBar').style.width=seen+'%';$('#statSeen').textContent=seen;$('#statGroup').textContent=GROUPS[state.group][0];$('#groupBadge').textContent=String(state.group+1).padStart(2,'0')+' / '+GROUPS[state.group][0]}
function render(){nav();$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));if(view==='learn')learn();else reference();stats();save()}
$$('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;render()});
$('#shuffle').onclick=()=>{order=[...current()];for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}shuffled=true;state.index=0;view='learn';render();toast('Cards shuffled within this group')};
$('#allCards').onclick=()=>{view='reference';render()};
$('#mobilemenu').onclick=()=>document.body.classList.toggle('menu-open');
$('#settingsOpen').onclick=()=>$('#settings').showModal();$('#creditsOpen').onclick=()=>$('#credits').showModal();
$$('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
$('#remember').checked=remember;$('#remember').onchange=e=>{remember=e.target.checked;localStorage.setItem('numbercast-remember',remember?'yes':'no');save()};
$('#resetProgress').onclick=()=>{state.seen={};render();toast('Visited cards cleared')};
$('#portraitForm').onsubmit=e=>{e.preventDefault();if(editID){state.custom[editID]=$('#portraitURL').value.trim();save();$('#portraitDialog').close();render()}};
$('#restorePortrait').onclick=()=>{if(editID){delete state.custom[editID];save();$('#portraitDialog').close();render()}};
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)});
render();