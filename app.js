(() => {
  'use strict';
  const C = window.PM_CATALOG;
  const BASE_ICONS = window.PM_ICONS || {};
  if (!C) throw new Error('Catalog not loaded');

  const STORAGE_KEY = 'pipemark-studio-v5-state';
  const PROJECTS_KEY = 'pipemark-studio-v5-projects';
  const ICONS_KEY = 'pipemark-studio-v5-icons';
  const $ = id => document.getElementById(id);
  const qsa = (s,root=document) => [...root.querySelectorAll(s)];
  const deep = v => JSON.parse(JSON.stringify(v));
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const num = (v,f=0) => Number.isFinite(Number(v)) ? Number(v) : f;
  const round1 = v => Math.round(v*10)/10;
  const round5 = v => Math.max(5,Math.round(v/5)*5);
  const esc = (s='') => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = (s='') => String(s).trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g,'-').replace(/^-+|-+$/g,'') || 'label';

  let persistAvailable = true;
  let customIcons = loadJSON(ICONS_KEY, []);
  let projects = loadJSON(PROJECTS_KEY, {});
  let state = loadState();
  let selectedObject = null;
  let directEdit = false;
  let editingId = null;
  let currentView = 'edit';
  let rightTab = 'queue';
  let gesture = null;
  let suppressSave = false;

  function loadJSON(key, fallback){
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
    catch(e){ persistAvailable=false; return fallback; }
  }
  function saveLocal(){
    if(suppressSave) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(ICONS_KEY, JSON.stringify(customIcons));
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      persistAvailable=true;
    } catch(e){ persistAvailable=false; }
    renderSaveStatus();
  }
  function defaultState(){
    const s = {
      version:5, theme:'studio', projectName:'기본 현장', categoryId:'pipe', templateId:'pipe-cooling', kind:'pipe',
      familyId:'steel-sgp', specId:'SGP-20A', purposeId:'cooling', tone:'pipe', pipeSizeMode:'smart', wrapMode:'flat', direction:'right', design:'classic-arrow',
      signSizeProfile:'near', lineMode:'auto', showSpec:true, showSub:true, showIcon:true,
      width:80, height:25, fill:'#128B63', accent:'#075B42', textColor:'#FFFFFF', borderWidth:.7, cornerStyle:'square',
      mainText:'냉각수', subText:'COOLING WATER', iconId:'snow', quantity:1,
      elements:{}, queue:[], paperSize:'A4', paperOrientation:'auto', paperGap:4, paperMargin:8
    };
    s.elements = defaultElements(s);
    const size = computePipeSize(s);
    s.width=size.w; s.height=size.h; s.elements=defaultElements(s);
    return s;
  }
  function loadState(){
    const d=defaultState(); const saved=loadJSON(STORAGE_KEY,null);
    if(!saved || saved.version!==5) return d;
    const merged={...d,...saved,queue:Array.isArray(saved.queue)?saved.queue:[]};
    merged.elements={...defaultElements(merged),...(saved.elements||{})};
    return merged;
  }

  function allIcons(){
    const out={...BASE_ICONS};
    customIcons.forEach(i=>out[i.id]={label:i.name,svg:i.svg,custom:true});
    return out;
  }
  function iconSvg(id){ return allIcons()[id]?.svg || ''; }
  function getTemplate(id=state.templateId){ return C.templates.find(t=>t.id===id) || C.templates[0]; }
  function getFamily(s=state){ return C.pipeFamilies.find(f=>f.id===s.familyId) || C.pipeFamilies[0]; }
  function getSpec(s=state){ const f=getFamily(s); return f.items.find(x=>x.id===s.specId) || f.items[0]; }
  function getPurpose(s=state){ return C.pipePurposes.find(p=>p.id===s.purposeId) || C.pipePurposes[0]; }
  function getSignProfile(s=state){ return C.signSizeProfiles.find(p=>p.id===s.signSizeProfile) || C.signSizeProfiles[1]; }
  function getDesign(id=state.design){ return C.designPresets.find(d=>d.id===id) || C.designPresets[0]; }

  function specText(s=state){
    if(s.kind!=='pipe') return '';
    const sp=getSpec(s);
    if(sp.od) return `${sp.label} · Ø${round1(sp.od)} mm`;
    if(sp.a) return `${sp.label}`;
    return sp.label || '';
  }
  function circumference(s=state){
    const sp=getSpec(s), f=getFamily(s);
    if(f.geometry==='round') return Math.PI*num(sp.od,0);
    if(f.geometry==='rect') return 2*(num(sp.a,0)+num(sp.b,0));
    return 0;
  }
  function pipeDimensionBasis(s=state){
    const sp=getSpec(s), f=getFamily(s);
    if(f.geometry==='round') return num(sp.od,26);
    if(f.geometry==='rect') return Math.max(num(sp.a,50),num(sp.b,50));
    return 50;
  }
  function computePipeSize(s=state){
    const basis=pipeDimensionBasis(s); let h,w;
    if(s.pipeSizeMode==='compact'){
      h=clamp(round5(14 + basis*.105),18,50); w=clamp(round5(h*3.35),70,180);
    } else if(s.pipeSizeMode==='reference'){
      if(basis<=33){w=200;h=30}else if(basis<=61){w=200;h=40}else if(basis<=170){w=300;h=60}else if(basis<=254){w=400;h=80}else{w=500;h=100}
    } else if(s.pipeSizeMode==='custom'){
      return {w:num(s.width,80),h:num(s.height,25),baseH:num(s.height,25),basis};
    } else {
      h=clamp(round5(18 + basis*.145),20,65); w=clamp(round5(h*3.5),75,225);
    }
    const baseH=h;
    const wrap=C.wrapModes.find(x=>x.id===s.wrapMode) || C.wrapModes[0];
    if(wrap.ratio>0){
      const per=circumference(s);
      if(per>0) h=Math.max(h,round1(per*wrap.ratio));
    }
    return {w:round1(w),h:round1(h),baseH,basis};
  }
  function effectiveLineMode(s=state){
    if(s.lineMode!=='auto') return s.lineMode;
    const weighted=[...String(s.mainText||'')].reduce((n,c)=>n+(c.charCodeAt(0)>127?1:.58),0);
    return weighted>11 ? 'two' : 'one';
  }
  function splitBalanced(text){
    const raw=String(text||'').trim();
    if(!raw || raw.includes('\n')) return raw;
    const words=raw.split(/\s+/);
    if(words.length<2){
      if([...raw].length<9) return raw;
      const chars=[...raw], mid=Math.ceil(chars.length/2); return chars.slice(0,mid).join('')+'\n'+chars.slice(mid).join('');
    }
    let best=1,bestDiff=Infinity;
    for(let i=1;i<words.length;i++){
      const a=words.slice(0,i).join(' '),b=words.slice(i).join(' '),diff=Math.abs(a.length-b.length);
      if(diff<bestDiff){best=i;bestDiff=diff;}
    }
    return words.slice(0,best).join(' ')+'\n'+words.slice(best).join(' ');
  }
  function displayMain(s=state){
    const mode=effectiveLineMode(s);
    const raw=String(s.mainText||'');
    if(mode==='one') return raw.replace(/\s*\n\s*/g,' ');
    if(mode==='two') return splitBalanced(raw);
    return raw;
  }
  function displaySub(s=state){
    const parts=[];
    if(s.showSub && s.subText) parts.push(s.subText);
    if(s.kind==='pipe' && s.showSpec) parts.push(specText(s));
    return parts.join('  ·  ');
  }

  function defaultElements(s=state){
    const isPipe=s.kind==='pipe';
    const design=s.design || (isPipe?'classic-arrow':'panel');
    if(isPipe){
      let icon={x:13,y:48,w:12,h:54,rotation:0,visible:s.showIcon!==false,z:3};
      let main={x:55,y:39,w:62,h:43,rotation:0,fontPct:42,weight:900,align:'center',spacing:0,lineHeight:100,visible:true,z:4};
      let sub={x:55,y:70,w:72,h:22,rotation:0,fontPct:16,weight:750,align:'center',spacing:2,lineHeight:105,visible:true,z:4};
      if(design==='split-arrow'){icon={...icon,x:12,w:15,h:60};main={...main,x:59,w:57};sub={...sub,x:59,w:66};}
      if(design==='minimal-arrow'){icon={...icon,x:10,w:9,h:44};main={...main,x:53,w:68,fontPct:46};sub={...sub,x:53,w:76};}
      if(design==='outline-arrow'){main={...main,fontPct:44};}
      return {icon,main,sub};
    }
    if(design==='round') return {icon:{x:50,y:31,w:30,h:30,rotation:0,visible:s.showIcon!==false,z:3},main:{x:50,y:57,w:72,h:28,rotation:0,fontPct:18,weight:900,align:'center',spacing:0,lineHeight:100,visible:true,z:4},sub:{x:50,y:75,w:72,h:15,rotation:0,fontPct:9,weight:700,align:'center',spacing:1,lineHeight:105,visible:true,z:4}};
    if(design==='symbol-top') return {icon:{x:50,y:26,w:24,h:30,rotation:0,visible:s.showIcon!==false,z:3},main:{x:50,y:58,w:76,h:25,rotation:0,fontPct:20,weight:900,align:'center',spacing:0,lineHeight:100,visible:true,z:4},sub:{x:50,y:78,w:78,h:14,rotation:0,fontPct:9,weight:700,align:'center',spacing:1,lineHeight:105,visible:true,z:4}};
    if(design==='round-split') return {icon:{x:24,y:50,w:22,h:44,rotation:0,visible:s.showIcon!==false,z:3},main:{x:67,y:43,w:53,h:27,rotation:0,fontPct:20,weight:900,align:'center',spacing:0,lineHeight:100,visible:true,z:4},sub:{x:67,y:66,w:54,h:18,rotation:0,fontPct:9,weight:700,align:'center',spacing:1,lineHeight:105,visible:true,z:4}};
    if(design==='safety-header') return {icon:{x:18,y:59,w:21,h:42,rotation:0,visible:s.showIcon!==false,z:3},main:{x:62,y:50,w:62,h:28,rotation:0,fontPct:21,weight:900,align:'center',spacing:0,lineHeight:100,visible:true,z:4},sub:{x:62,y:72,w:62,h:15,rotation:0,fontPct:9,weight:700,align:'center',spacing:1,lineHeight:105,visible:true,z:4}};
    if(design==='nameplate'||design==='technical') return {icon:{x:13,y:52,w:14,h:36,rotation:0,visible:s.showIcon!==false,z:3},main:{x:57,y:42,w:70,h:25,rotation:0,fontPct:19,weight:900,align:'left',spacing:0,lineHeight:100,visible:true,z:4},sub:{x:57,y:67,w:70,h:18,rotation:0,fontPct:9,weight:650,align:'left',spacing:1,lineHeight:105,visible:true,z:4}};
    return {icon:{x:18,y:50,w:20,h:48,rotation:0,visible:s.showIcon!==false,z:3},main:{x:62,y:43,w:60,h:27,rotation:0,fontPct:21,weight:900,align:'center',spacing:0,lineHeight:100,visible:true,z:4},sub:{x:62,y:68,w:62,h:17,rotation:0,fontPct:9,weight:700,align:'center',spacing:1,lineHeight:105,visible:true,z:4}};
  }

  function applyPipeSize(reset=true){
    if(state.kind!=='pipe' || state.pipeSizeMode==='custom') return;
    const size=computePipeSize(state); state.width=size.w; state.height=size.h;
    if(reset) state.elements=defaultElements(state);
  }
  function applySignProfile(id,reset=true){
    state.signSizeProfile=id;
    if(id!=='custom'){
      const p=getSignProfile(state); state.width=p.w; state.height=p.h;
      if(reset) state.elements=defaultElements(state);
    }
  }
  function applyPurpose(id,reset=false){
    state.purposeId=id; state.tone='pipe'; const p=getPurpose(state);
    state.fill=p.fill; state.accent=p.accent; state.textColor=p.text; state.iconId=p.icon; state.mainText=p.main; state.subText=p.sub;
    if(reset) state.elements=defaultElements(state);
  }
  function applyTemplate(id){
    const t=C.templates.find(x=>x.id===id); if(!t) return;
    state.templateId=t.id; state.categoryId=t.category; state.kind=t.kind; state.design=t.design; state.iconId=t.icon; state.tone=t.tone||'neutral';
    if(t.kind==='pipe'){
      applyPurpose(t.purposeId||'water',false); state.direction='right'; state.showSpec=true; state.showSub=true; state.showIcon=true;
      if(!C.pipeFamilies.some(f=>f.id===state.familyId)) state.familyId='steel-sgp';
      const fam=getFamily(); if(!fam.items.some(x=>x.id===state.specId)) state.specId=fam.items[Math.min(1,fam.items.length-1)].id;
      applyPipeSize(false);
    } else {
      const tone=C.tones[t.tone]||C.tones.neutral; state.fill=tone.fill; state.accent=tone.accent; state.textColor=tone.text; state.mainText=t.main; state.subText=t.sub; state.showSub=!!t.sub; state.showSpec=false; state.showIcon=true; state.signSizeProfile=t.sizeProfile||'near';
      const p=getSignProfile(state); state.width=t.width||p.w; state.height=t.height||p.h;
    }
    state.elements=defaultElements(state); selectedObject=null; directEdit=false; editingId=null; renderAll();
  }
  function applyDesign(id){
    state.design=id; state.elements=defaultElements(state); selectedObject=null; renderAll(); toast('디자인을 적용했습니다. 필요하면 직접 편집에서 위치를 조정하세요.','info');
  }

  function labelSnapshot(s=state){
    return {version:5,kind:s.kind,tone:s.tone||getTemplate(s.templateId)?.tone||'neutral',categoryId:s.categoryId,templateId:s.templateId,familyId:s.familyId,specId:s.specId,purposeId:s.purposeId,pipeSizeMode:s.pipeSizeMode,wrapMode:s.wrapMode,direction:s.direction,design:s.design,signSizeProfile:s.signSizeProfile,lineMode:s.lineMode,showSpec:s.showSpec,showSub:s.showSub,showIcon:s.showIcon,width:num(s.width,100),height:num(s.height,40),fill:s.fill,accent:s.accent,textColor:s.textColor,borderWidth:num(s.borderWidth,.7),cornerStyle:s.cornerStyle,mainText:s.mainText,subText:s.subText,iconId:s.iconId,elements:deep(s.elements)};
  }
  function loadLabelIntoState(label){
    const queue=state.queue,theme=state.theme,projectName=state.projectName,paperSize=state.paperSize,paperOrientation=state.paperOrientation,paperGap=state.paperGap,paperMargin=state.paperMargin;
    state={...state,...deep(label),queue,theme,projectName,paperSize,paperOrientation,paperGap,paperMargin};
    state.elements={...defaultElements(state),...(label.elements||{})};
    selectedObject=null; directEdit=false;
  }

  function createArtClass(label){
    let design=label.design || (label.kind==='pipe'?'classic-arrow':'panel');
    if(label.kind==='pipe' && label.direction==='both') design='double-arrow';
    if(label.kind==='pipe' && label.direction==='none' && ['classic-arrow','soft-arrow','band-arrow','chevron','double-arrow'].includes(design)) design='outline-arrow';
    return design;
  }
  function signalText(label){
    return {danger:'위험 / DANGER',warning:'경고 / WARNING',prohibition:'금지 / PROHIBITION',mandatory:'지시 / MANDATORY',emergency:'비상 / EMERGENCY',fire:'소방 / FIRE'}[label.tone] || '주의 / CAUTION';
  }
  function fitFontPx(text,obj,label,scale){
    const lines=String(text||'').split('\n');
    const maxLen=Math.max(1,...lines.map(line=>[...line].reduce((n,c)=>n+(c.charCodeAt(0)>127?1:.58),0)));
    const availableW=label.width*(obj.w/100); const availableH=label.height*(obj.h/100);
    const wanted=label.height*(obj.fontPct/100);
    const byW=availableW/(maxLen*.94); const byH=availableH/Math.max(1,lines.length)*.78;
    return Math.max(2.4,Math.min(wanted,byW,byH))*scale;
  }
  function fontFamilyCss(id){
    return id==='serif'?'Georgia, "Noto Serif KR", serif':id==='mono'?'"Courier New", monospace':id==='condensed'?'"Arial Narrow", "Roboto Condensed", Arial, sans-serif':'Arial, "Noto Sans KR", sans-serif';
  }
  function createStage(label,{interactive=false,scale=1,thumb=false}={}){
    const stage=document.createElement('div'); stage.className='label-stage'+(interactive&&directEdit?' editing':''); stage.style.width=`${label.width*scale}px`; stage.style.height=`${label.height*scale}px`; stage.dataset.scale=String(scale);
    const art=document.createElement('div'); const artClass=createArtClass(label); art.className=`label-art ${artClass} ${label.direction||''}`; art.dataset.signal=signalText(label);
    art.style.setProperty('--label-fill',label.fill); art.style.setProperty('--label-accent',label.accent); art.style.setProperty('--label-text',label.textColor); art.style.setProperty('--bw',`${Math.max(.6,label.borderWidth*scale)}px`); art.style.setProperty('--corner',label.cornerStyle==='round'?`${label.height*scale*.25}px`:label.cornerStyle==='soft'?`${label.height*scale*.08}px`:'0px'); stage.appendChild(art);
    const icons=allIcons(), elements=label.elements||defaultElements(label);
    const renderedSub=displaySub(label);
    const content={main:displayMain(label),sub:renderedSub};
    ['icon','main','sub'].forEach(key=>{
      const o=elements[key]; if(!o || o.visible===false) return;
      if(key==='icon' && label.showIcon===false) return;
      if(key==='sub' && !renderedSub) return;
      const el=document.createElement('div'); el.className=`label-object ${key==='icon'?'icon':'text '+key}${interactive&&selectedObject===key?' selected':''}`; el.dataset.object=key; el.style.left=`${o.x}%`; el.style.top=`${o.y}%`; el.style.width=`${o.w}%`; el.style.height=`${o.h}%`; el.style.setProperty('--rot',`${o.rotation||0}deg`); el.style.zIndex=String(o.z||4); el.style.color=o.color||(artClass==='outline-arrow'?label.fill:label.textColor);
      if(key==='icon'){
        el.innerHTML=icons[label.iconId]?.svg||'';
      } else {
        el.style.fontSize=`${fitFontPx(content[key],o,label,scale)}px`; el.style.fontWeight=String(o.weight||700); el.style.fontFamily=fontFamilyCss(o.fontFamily||'sans'); el.style.textAlign=o.align||'center'; el.style.justifyContent=o.align==='left'?'flex-start':o.align==='right'?'flex-end':'center'; el.style.letterSpacing=`${(o.spacing||0)/100}em`; el.style.setProperty('--lh',String((o.lineHeight||105)/100));
        const span=document.createElement('span'); span.className='text-content'; span.textContent=content[key]; el.appendChild(span);
      }
      if(interactive && directEdit && !thumb){
        const r=document.createElement('i'); r.className='object-handle resize'; r.dataset.handle='resize'; const rot=document.createElement('i'); rot.className='object-handle rotate'; rot.dataset.handle='rotate'; el.append(r,rot);
      }
      stage.appendChild(el);
    });
    return stage;
  }

  function renderAll(){
    document.documentElement.dataset.theme=state.theme||'studio';
    renderSaveStatus(); renderBuilder(); renderStage(); renderRight(); renderSheet(); saveLocal();
  }
  function renderSaveStatus(){
    if(!$('save-status')) return; $('save-status').innerHTML=persistAvailable?'<i></i> 이 PC 자동 저장':'저장 제한 · JSON 백업 권장';
  }
  function renderBuilder(){
    $('project-name').value=state.projectName;
    $('category-select').innerHTML=C.categories.map(c=>`<option value="${c.id}">${esc(c.label)}</option>`).join(''); $('category-select').value=state.categoryId;
    const catTemplates=C.templates.filter(t=>t.category===state.categoryId); $('template-select').innerHTML=catTemplates.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join(''); $('template-select').value=state.templateId;
    $('category-chips').innerHTML=C.categories.map(c=>`<button class="category-chip ${c.id===state.categoryId?'active':''}" data-category="${c.id}" type="button">${iconSvg(c.icon)}<span>${esc(c.label)}</span></button>`).join('');
    renderTemplateGallery();
    $('pipe-options').hidden=state.kind!=='pipe'; $('sign-options').hidden=state.kind==='pipe'; $('show-spec-row').hidden=state.kind!=='pipe';
    if(state.kind==='pipe'){
      $('pipe-family').innerHTML=C.pipeFamilies.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join(''); $('pipe-family').value=state.familyId;
      const fam=getFamily(); if(!fam.items.some(x=>x.id===state.specId)) state.specId=fam.items[0].id; $('pipe-spec').innerHTML=fam.items.map(x=>`<option value="${x.id}">${esc(x.label)}</option>`).join(''); $('pipe-spec').value=state.specId;
      $('pipe-purpose').innerHTML=C.pipePurposes.map(p=>`<option value="${p.id}">${esc(p.label)}</option>`).join(''); $('pipe-purpose').value=state.purposeId;
      $('pipe-size-mode').innerHTML=C.pipeSizingModes.map(m=>`<option value="${m.id}">${esc(m.label)}</option>`).join(''); $('pipe-size-mode').value=state.pipeSizeMode;
      $('wrap-mode').innerHTML=C.wrapModes.map(m=>`<option value="${m.id}">${esc(m.label)}</option>`).join(''); $('wrap-mode').value=state.wrapMode;
      const sp=getSpec(), size=computePipeSize(state), per=circumference(state), mode=C.pipeSizingModes.find(x=>x.id===state.pipeSizeMode);
      const scalePct=Math.round((pipeDimensionBasis(state)/27.2)*100);
      $('pipe-size-summary').innerHTML=`<b>${esc(sp.label)}</b>${sp.od?` · 외경 <strong>${sp.od} mm</strong>`:''} → 라벨 <strong>${state.width} × ${round1(state.height)} mm</strong><br>${per?`원주 ${round1(per)} mm · `:''}${esc(mode?.desc||'')}<br><span>20A급 대비 배관 크기 지표 약 ${scalePct}% · A4 배치는 출력 용지에서 자동 계산</span>`;
    } else {
      $('sign-size-profile').innerHTML=C.signSizeProfiles.map(p=>`<option value="${p.id}">${esc(p.label)} — ${p.w}×${p.h} mm</option>`).join(''); $('sign-size-profile').value=state.signSizeProfile;
      const p=getSignProfile(); $('sign-size-summary').innerHTML=`<b>${esc(p.label)}</b> · 시작 크기 <strong>${state.width} × ${state.height} mm</strong><br>${esc(p.desc)} · 필요한 경우 세부 설정에서 실제 크기 변경`;
    }
    $('main-text').value=state.mainText; $('sub-text').value=state.subText; $('quantity').value=state.quantity; $('pipe-direction').value=state.direction; $('show-spec').checked=!!state.showSpec;
    qsa('#line-mode button').forEach(b=>b.classList.toggle('active',b.dataset.line===state.lineMode)); renderDesignStrip();
    $('btn-direct-edit').classList.toggle('active',directEdit); $('btn-direct-edit').innerHTML=directEdit?'<span>✓</span> 직접 편집 종료':'<span>✥</span> 화면에서 직접 편집';
    $('btn-add').textContent=editingId?'수정 내용 저장':'+ 출력 목록에 추가';
    $('current-title').textContent=getTemplate()?.name||state.mainText; $('current-meta').textContent=`${state.kind==='pipe'?specText(state):getSignProfile().label} · ${state.width} × ${round1(state.height)} mm`; $('current-kind-badge').textContent=state.kind==='pipe'?'PIPE':'SIGN'; $('canvas-size-label').textContent=`${state.width} × ${round1(state.height)} mm`;
  }
  function renderTemplateGallery(){
    const list=C.templates.filter(t=>t.category===state.categoryId).slice(0,6); const box=$('template-gallery'); box.innerHTML='';
    list.forEach(t=>{
      const b=document.createElement('button'); b.type='button'; b.className='template-card'+(t.id===state.templateId?' active':''); b.dataset.template=t.id;
      const thumb=document.createElement('div'); thumb.className='template-thumb'; const lab=previewLabelForTemplate(t); const sc=Math.min(1.1,95/lab.width,42/lab.height); thumb.appendChild(createStage(lab,{scale:sc,thumb:true}));
      b.appendChild(thumb); b.insertAdjacentHTML('beforeend',`<strong>${esc(t.name)}</strong><small>${esc(t.kind==='pipe'?(C.pipePurposes.find(p=>p.id===t.purposeId)?.main||'배관'):t.main)}</small>`); box.appendChild(b);
    });
  }
  function previewLabelForTemplate(t){
    const s={...defaultState(),...state,queue:[],categoryId:t.category,templateId:t.id,kind:t.kind,design:t.design,iconId:t.icon};
    if(t.kind==='pipe'){
      s.purposeId=t.purposeId||'water'; const p=C.pipePurposes.find(x=>x.id===s.purposeId)||C.pipePurposes[0]; Object.assign(s,{fill:p.fill,accent:p.accent,textColor:p.text,mainText:p.main,subText:p.sub,width:80,height:24,showSpec:false});
    } else { const tone=C.tones[t.tone]||C.tones.neutral; Object.assign(s,{fill:tone.fill,accent:tone.accent,textColor:tone.text,mainText:t.main,subText:t.sub,width:t.width||100,height:t.height||50,showSpec:false}); }
    s.elements=defaultElements(s); return labelSnapshot(s);
  }
  function renderDesignStrip(){
    const group=state.kind==='pipe'?'pipe':'sign'; const list=C.designPresets.filter(d=>d.group===group).slice(0,4); const box=$('design-strip'); box.innerHTML='';
    list.forEach(d=>box.appendChild(designButton(d,true)));
  }
  function designButton(d,small=false){
    const b=document.createElement('button'); b.type='button'; b.className=(small?'design-option':'design-card')+(d.id===state.design?' active':''); b.dataset.design=d.id;
    const lab=labelSnapshot(state); lab.design=d.id; lab.elements=defaultElements({...state,design:d.id});
    const prev=document.createElement('div'); prev.className=small?'mini-design':'preview'; const maxW=small?76:170,maxH=small?31:70; const sc=Math.min(1.1,maxW/lab.width,maxH/lab.height); prev.appendChild(createStage(lab,{scale:sc,thumb:true})); b.appendChild(prev);
    if(small) b.insertAdjacentHTML('beforeend',`<span>${esc(d.name)}</span>`); else b.insertAdjacentHTML('beforeend',`<strong>${esc(d.name)}</strong><small>${esc(d.desc)}</small>`);
    return b;
  }

  function canvasScale(){
    const box=$('canvas-space'); const w=Math.max(320,box.clientWidth), h=Math.max(280,box.clientHeight); return clamp(Math.min((w-140)/state.width,(h-150)/state.height,5),.55,5);
  }
  function renderStage(){
    const old=$('label-stage'); if(!old) return; const stage=createStage(labelSnapshot(state),{interactive:true,scale:canvasScale()}); stage.id='label-stage'; old.replaceWith(stage); bindStage(stage);
    $('canvas-hint').textContent=directEdit?'객체를 클릭하고 바로 끌어 이동하세요. 모서리는 크기, 위 핸들은 회전입니다.':'기본값 그대로 바로 출력할 수 있습니다. 위치를 바꿀 때만 직접 편집을 켜세요.';
    $('edit-status').hidden=!directEdit; $('edit-toolbar').hidden=!(directEdit&&selectedObject);
  }
  function bindStage(stage){
    stage.addEventListener('pointerdown',e=>{
      if(!directEdit) return;
      const obj=e.target.closest('.label-object'); if(!obj) return; e.preventDefault(); e.stopPropagation(); selectObject(obj.dataset.object);
      const key=obj.dataset.object, handle=e.target.dataset.handle||'drag', rect=stage.getBoundingClientRect(), o=state.elements[key];
      const center={x:rect.left+rect.width*o.x/100,y:rect.top+rect.height*o.y/100}; const startAngle=Math.atan2(e.clientY-center.y,e.clientX-center.x)*180/Math.PI;
      gesture={key,type:handle,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,orig:deep(o),rect,center,startAngle};
      try{obj.setPointerCapture(e.pointerId)}catch(_){ }
    });
    stage.addEventListener('dblclick',e=>{
      if(!directEdit) return; const obj=e.target.closest('.label-object.text'); if(!obj) return; e.preventDefault(); e.stopPropagation(); const key=obj.dataset.object; selectObject(key);
      const span=obj.querySelector('.text-content'); if(!span) return; span.contentEditable='true'; span.spellcheck=false; span.focus();
      const range=document.createRange(); range.selectNodeContents(span); const sel=window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      const finish=()=>{ span.contentEditable='false'; let txt=span.innerText.replace(/\r/g,'').trim(); if(key==='main')state.mainText=txt; if(key==='sub'){ const spec=state.kind==='pipe'&&state.showSpec?specText(state):''; if(spec && txt.endsWith(spec)) txt=txt.slice(0,-spec.length).replace(/[·\s]+$/,''); state.subText=txt; } renderAll(); };
      span.addEventListener('blur',finish,{once:true});
    });
    stage.addEventListener('pointermove',e=>{
      if(!gesture || e.pointerId!==gesture.pointerId) return; const g=gesture,o=state.elements[g.key];
      const dx=(e.clientX-g.startX)/g.rect.width*100, dy=(e.clientY-g.startY)/g.rect.height*100;
      if(g.type==='drag'){
        let x=clamp(g.orig.x+dx,0,100), y=clamp(g.orig.y+dy,0,100); const sx=Math.abs(x-50)<1.4, sy=Math.abs(y-50)<1.4; if(sx)x=50;if(sy)y=50; $('snap-v').hidden=!sx;$('snap-h').hidden=!sy; o.x=x;o.y=y;
      } else if(g.type==='resize'){
        o.w=clamp(g.orig.w+dx*2,4,120); o.h=clamp(g.orig.h+dy*2,4,120);
      } else if(g.type==='rotate'){
        const a=Math.atan2(e.clientY-g.center.y,e.clientX-g.center.x)*180/Math.PI; o.rotation=Math.round(g.orig.rotation+(a-g.startAngle));
      }
      refreshObject(g.key); renderInspector();
    });
    const finish=e=>{if(!gesture||e.pointerId!==gesture.pointerId)return;gesture=null;$('snap-v').hidden=true;$('snap-h').hidden=true;saveLocal();};
    stage.addEventListener('pointerup',finish); stage.addEventListener('pointercancel',finish);
  }
  function refreshObject(key){
    const stage=$('label-stage'),el=stage?.querySelector(`[data-object="${key}"]`),o=state.elements[key]; if(!el||!o) return; const scale=num(stage.dataset.scale,1); el.style.left=`${o.x}%`;el.style.top=`${o.y}%`;el.style.width=`${o.w}%`;el.style.height=`${o.h}%`;el.style.setProperty('--rot',`${o.rotation||0}deg`);el.style.zIndex=String(o.z||4);
    if(key!=='icon'){const txt=key==='main'?displayMain(state):displaySub(state);el.style.fontSize=`${fitFontPx(txt,o,labelSnapshot(state),scale)}px`;el.style.fontWeight=String(o.weight||700);el.style.fontFamily=fontFamilyCss(o.fontFamily||'sans');el.style.color=o.color||(createArtClass(state)==='outline-arrow'?state.fill:state.textColor);el.style.letterSpacing=`${(o.spacing||0)/100}em`;el.style.setProperty('--lh',String((o.lineHeight||105)/100));el.style.justifyContent=o.align==='left'?'flex-start':o.align==='right'?'flex-end':'center';}
  }
  function selectObject(key){
    selectedObject=key; qsa('#label-stage .label-object').forEach(x=>x.classList.toggle('selected',x.dataset.object===key)); rightTab='inspector'; renderRightTabs(); renderInspector(); $('edit-toolbar').hidden=false;
  }
  function toggleDirectEdit(force){
    directEdit=typeof force==='boolean'?force:!directEdit; if(!directEdit)selectedObject=null; else if(!selectedObject)selectedObject='main'; renderAll(); if(directEdit){rightTab='inspector';renderRightTabs();renderInspector();}
  }

  function renderRight(){ renderRightTabs(); renderQueue(); renderInspector(); }
  function renderRightTabs(){
    qsa('[data-right-tab]').forEach(b=>b.classList.toggle('active',b.dataset.rightTab===rightTab)); $('queue-tab').classList.toggle('active',rightTab==='queue'); $('inspector-tab').classList.toggle('active',rightTab==='inspector');
  }
  function renderInspector(){
    const empty=$('inspector-empty'),panel=$('object-inspector'); if(!selectedObject||!state.elements[selectedObject]){empty.hidden=false;panel.hidden=true;return;} empty.hidden=true;panel.hidden=false;
    const o=state.elements[selectedObject],isText=selectedObject!=='icon'; $('inspector-type').textContent=isText?'TEXT':'SVG'; $('inspector-name').textContent=selectedObject==='main'?'큰 문구':selectedObject==='sub'?'보조 문구 / 규격':'SVG 아이콘'; $('text-tools').hidden=!isText;$('icon-tools').hidden=isText;
    if(isText){$('obj-text').value=selectedObject==='main'?state.mainText:state.subText;$('obj-font').value=o.fontPct||20;$('obj-weight').value=String(o.weight||700);$('obj-font-family').value=o.fontFamily||'sans';$('obj-color').value=validColor(o.color||state.textColor,state.textColor);$('obj-spacing').value=o.spacing||0;$('obj-lineheight').value=o.lineHeight||105;qsa('#obj-align button').forEach(b=>b.classList.toggle('active',b.dataset.align===(o.align||'center')));}
    else {$('icon-select').innerHTML=Object.entries(allIcons()).map(([id,i])=>`<option value="${id}">${esc(i.label)}</option>`).join('');$('icon-select').value=state.iconId;$('icon-color').value=validColor(o.color||state.textColor,state.textColor);}
    $('obj-x').value=round1(o.x);$('obj-y').value=round1(o.y);$('obj-w').value=round1(o.w);$('obj-h').value=round1(o.h);$('obj-rotate').value=Math.round(o.rotation||0);
  }
  function updateInspectorObject(){
    if(!selectedObject)return;const o=state.elements[selectedObject];o.x=clamp(num($('obj-x').value,o.x),-20,120);o.y=clamp(num($('obj-y').value,o.y),-20,120);o.w=clamp(num($('obj-w').value,o.w),2,140);o.h=clamp(num($('obj-h').value,o.h),2,140);o.rotation=num($('obj-rotate').value,o.rotation||0);refreshObject(selectedObject);saveLocal();
  }
  function performEditAction(action){
    if(!selectedObject)return;const o=state.elements[selectedObject];
    if(action==='center-x')o.x=50; if(action==='center-y')o.y=50; if(action==='front')o.z=(o.z||4)+1; if(action==='back')o.z=Math.max(1,(o.z||4)-1);
    if(action==='duplicate'){toast('이 라벨은 기본 3개 객체 구조입니다. SVG를 하나 더 넣으려면 SVG 파일 추가 후 아이콘을 교체해 사용하세요.','info');return;}
    if(action==='delete'){o.visible=false;if(selectedObject==='icon')state.showIcon=false;selectedObject=null;renderAll();return;}
    renderStage();renderInspector();saveLocal();
  }

  function renderQueue(){
    const list=$('queue-list'); $('queue-count').textContent=String(state.queue.length); if(!state.queue.length){list.innerHTML='<div class="queue-empty">아직 출력할 라벨이 없습니다.<br>기본값을 고른 뒤 <b>출력 목록에 추가</b>를 누르세요.</div>';return;} list.innerHTML='';
    state.queue.forEach(item=>{
      const row=document.createElement('div');row.className='queue-item'+(editingId===item.id?' editing-item':'');row.dataset.id=item.id;const thumb=document.createElement('div');thumb.className='queue-thumb';const sc=Math.min(1,70/item.label.width,38/item.label.height);thumb.appendChild(createStage(item.label,{scale:sc,thumb:true}));row.appendChild(thumb);
      const text=document.createElement('div');text.innerHTML=`<strong>${esc(item.label.mainText)}</strong><small>${item.label.width} × ${round1(item.label.height)} mm · ${item.qty}장</small>`;row.appendChild(text);row.insertAdjacentHTML('beforeend','<div class="queue-actions-mini"><button data-action="edit">수정</button><button data-action="copy">복사</button><button data-action="delete" class="danger">삭제</button></div>');list.appendChild(row);
    });
  }
  function addOrUpdate(){
    const item={id:editingId||Date.now(),qty:Math.max(1,num(state.quantity,1)),label:labelSnapshot(state)};
    if(editingId){const idx=state.queue.findIndex(x=>x.id===editingId);if(idx>=0)state.queue[idx]=item;editingId=null;toast('출력 목록의 라벨을 수정했습니다.');}
    else {state.queue.push(item);toast('출력 목록에 추가했습니다.');}
    rightTab='queue';renderAll();
  }
  function editQueue(id){
    const item=state.queue.find(x=>x.id===id);if(!item)return;loadLabelIntoState(item.label);state.quantity=item.qty;editingId=id;rightTab='queue';renderAll();toast('목록 항목을 편집 중입니다. 수정 후 ‘수정 내용 저장’을 누르세요.','info');
  }

  function paperDims(size,orientation){
    const base=size==='A3'?[297,420]:[210,297];return orientation==='landscape'?[base[1],base[0]]:base;
  }
  function flattenQueue(){const arr=[];state.queue.forEach(item=>{for(let i=0;i<item.qty;i++)arr.push({label:item.label,sourceId:item.id});});return arr;}
  function pack(items,orientation){
    const [pw,ph]=paperDims(state.paperSize,orientation),m=num(state.paperMargin,8),gap=num(state.paperGap,4),innerW=pw-2*m,innerH=ph-2*m;const pages=[];let page={items:[],y:m,shelfH:0,x:m,used:0};
    const pushPage=()=>{pages.push(page);page={items:[],y:m,shelfH:0,x:m,used:0};};
    items.forEach(entry=>{const w=entry.label.width,h=entry.label.height;if(w>innerW||h>innerH){if(page.items.length)pushPage();page.items.push({...entry,x:m,y:m,w,h,oversize:true});pushPage();return;}if(page.x+w>pw-m+.001){page.x=m;page.y+=page.shelfH+gap;page.shelfH=0;}if(page.y+h>ph-m+.001){pushPage();}page.items.push({...entry,x:page.x,y:page.y,w,h});page.x+=w+gap;page.shelfH=Math.max(page.shelfH,h);page.used+=w*h;});if(page.items.length||!pages.length)pages.push(page);return {pages,pw,ph,innerW,innerH};
  }
  function choosePacking(){const items=flattenQueue();if(state.paperOrientation!=='auto')return {...pack(items,state.paperOrientation),orientation:state.paperOrientation};const p=pack(items,'portrait'),l=pack(items,'landscape');if(l.pages.length<p.pages.length)return {...l,orientation:'landscape'};if(p.pages.length<l.pages.length)return {...p,orientation:'portrait'};const pu=p.pages.reduce((n,x)=>n+x.used,0)/(p.pages.length*p.innerW*p.innerH||1),lu=l.pages.reduce((n,x)=>n+x.used,0)/(l.pages.length*l.innerW*l.innerH||1);return lu>pu?{...l,orientation:'landscape'}:{...p,orientation:'portrait'};}
  function renderSheet(){
    $('paper-size').value=state.paperSize;$('paper-orientation').value=state.paperOrientation;$('paper-gap').value=String(state.paperGap);const preview=$('paper-preview');preview.innerHTML='';if(!state.queue.length){$('sheet-plan').textContent='출력 목록이 비어 있습니다.';return;}const packInfo=choosePacking();const all=flattenQueue();let uniform=all.length&&all.every(x=>x.label.width===all[0].label.width&&x.label.height===all[0].label.height);let grid='';if(uniform){const m=state.paperMargin,g=state.paperGap,cols=Math.max(1,Math.floor((packInfo.pw-2*m+g)/(all[0].label.width+g))),rows=Math.max(1,Math.floor((packInfo.ph-2*m+g)/(all[0].label.height+g)));grid=` · 약 ${cols}열 × ${rows}행`;}$('sheet-plan').textContent=`${state.paperSize} ${packInfo.orientation==='portrait'?'세로':'가로'} · ${packInfo.pages.length}페이지 · ${all.length}장${grid}`;
    const mmPx=96/25.4;packInfo.pages.forEach((p,pi)=>{const page=document.createElement('div');page.className='paper-page';page.style.width=`${packInfo.pw}mm`;page.style.height=`${packInfo.ph}mm`;p.items.forEach(it=>{const pos=document.createElement('div');pos.className='print-label';pos.style.left=`${it.x}mm`;pos.style.top=`${it.y}mm`;pos.style.width=`${it.w}mm`;pos.style.height=`${it.h}mm`;pos.appendChild(createStage(it.label,{scale:mmPx,thumb:true}));page.appendChild(pos);});const idx=document.createElement('span');idx.className='page-index';idx.textContent=`${pi+1} / ${packInfo.pages.length}`;page.appendChild(idx);preview.appendChild(page);});
    const print=$('print-style');print.textContent=`@page{size:${state.paperSize} ${packInfo.orientation};margin:0}`;
  }

  function renderDesignDialog(){const box=$('design-gallery');box.innerHTML='';const group=state.kind==='pipe'?'pipe':'sign';C.designPresets.filter(d=>d.group===group).forEach(d=>box.appendChild(designButton(d,false)));}
  function renderTemplateDialog(){const list=C.templates.filter(t=>t.category===state.categoryId);$('template-dialog-title').textContent=`${C.categories.find(c=>c.id===state.categoryId)?.label||''} 템플릿`;$('template-dialog-grid').innerHTML='';list.forEach(t=>{const b=document.createElement('button');b.className='template-dialog-card'+(t.id===state.templateId?' active':'');b.type='button';b.dataset.template=t.id;const p=document.createElement('div');p.className='preview';const lab=previewLabelForTemplate(t);p.appendChild(createStage(lab,{scale:Math.min(1.2,130/lab.width,55/lab.height),thumb:true}));b.appendChild(p);b.insertAdjacentHTML('beforeend',`<strong>${esc(t.name)}</strong>`);$('template-dialog-grid').appendChild(b);});}
  function renderThemeDialog(){const box=$('theme-gallery');box.innerHTML=C.uiThemes.map(t=>`<button class="theme-card ${t.id===state.theme?'active':''}" data-theme-id="${t.id}" type="button"><div class="theme-swatches">${t.swatches.map(c=>`<i style="background:${c}"></i>`).join('')}</div><strong>${esc(t.name)}</strong><small>${esc(t.desc)}</small></button>`).join('');}
  function renderIconDialog(){const box=$('icon-gallery');box.innerHTML=Object.entries(allIcons()).filter(([id])=>id!=='none').map(([id,i])=>`<button class="icon-card ${id===state.iconId?'active':''}" data-icon="${id}" type="button">${i.svg}<span>${esc(i.label)}</span></button>`).join('');}

  function renderAdvanced(){
    $('label-width').value=state.width;$('label-height').value=round1(state.height);$('fill-color').value=validColor(state.fill,'#ffffff');$('accent-color').value=validColor(state.accent,'#333333');$('text-color').value=validColor(state.textColor,'#111111');$('border-width').value=state.borderWidth;$('corner-style').value=state.cornerStyle;$('show-icon').checked=!!state.showIcon;$('show-sub').checked=!!state.showSub;$('show-spec-advanced').checked=!!state.showSpec;
  }
  function openDrawer(){renderAdvanced();$('advanced-drawer').classList.add('open');$('advanced-drawer').setAttribute('aria-hidden','false');}
  function closeDrawer(){$('advanced-drawer').classList.remove('open');$('advanced-drawer').setAttribute('aria-hidden','true');}

  function sanitizeSvg(raw){
    const doc=new DOMParser().parseFromString(raw,'image/svg+xml');if(doc.querySelector('parsererror'))throw new Error('유효한 SVG가 아닙니다.');doc.querySelectorAll('script,foreignObject,iframe,object,embed,link,style').forEach(n=>n.remove());doc.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=a.value.trim().toLowerCase();if(n.startsWith('on')||((n==='href'||n==='xlink:href'||n==='src')&&(v.startsWith('http:')||v.startsWith('https:')||v.startsWith('javascript:')||v.startsWith('data:'))))el.removeAttribute(a.name)}));const svg=doc.documentElement;svg.removeAttribute('width');svg.removeAttribute('height');if(!svg.getAttribute('viewBox'))svg.setAttribute('viewBox','0 0 24 24');return new XMLSerializer().serializeToString(svg);
  }
  async function addSvg(file){
    if(!file)return;try{const svg=sanitizeSvg(await file.text());const name=file.name.replace(/\.svg$/i,'');const id='user-'+slug(name)+'-'+Date.now().toString(36);customIcons.push({id,name,svg});state.iconId=id;state.showIcon=true;state.elements.icon.visible=true;selectedObject='icon';directEdit=true;renderAll();rightTab='inspector';renderRightTabs();renderInspector();toast('SVG를 추가했습니다. 캔버스에서 바로 드래그·크기조절·회전할 수 있습니다.');}catch(e){toast(e.message,'error');}
  }

  function exportProject(){downloadText(`${slug(state.projectName)}-pipemark-v5.json`,JSON.stringify({type:'PipeMarkStudio_V5',version:5,exportedAt:new Date().toISOString(),state,customIcons},null,2),'application/json');}
  async function importProject(file){try{const data=JSON.parse(await file.text());if(data.type!=='PipeMarkStudio_V5'||!data.state)throw new Error('v5 프로젝트 백업 파일이 아닙니다.');suppressSave=true;state={...defaultState(),...data.state,version:5};state.elements={...defaultElements(state),...(data.state.elements||{})};customIcons=Array.isArray(data.customIcons)?data.customIcons:[];editingId=null;selectedObject=null;directEdit=false;suppressSave=false;renderAll();toast('프로젝트를 불러왔습니다.');}catch(e){suppressSave=false;toast(`불러오기 실패: ${e.message}`,'error');}}
  function saveProjectAs(){const name=$('project-save-name').value.trim()||state.projectName||'새 현장';const id=slug(name)+'-'+Date.now().toString(36);projects[id]={name,savedAt:new Date().toISOString(),state:deep(state),customIcons:deep(customIcons)};saveLocal();renderProjectList();toast('이 PC에 현장을 저장했습니다.');}
  function renderProjectList(){const entries=Object.entries(projects).sort((a,b)=>String(b[1].savedAt).localeCompare(String(a[1].savedAt)));$('project-list').innerHTML=entries.length?entries.map(([id,p])=>`<div class="project-item"><div><strong>${esc(p.name)}</strong><span>${new Date(p.savedAt).toLocaleString('ko-KR')} · ${(p.state?.queue||[]).length}종</span></div><div><button data-load="${id}" type="button">불러오기</button><button data-delete="${id}" type="button">삭제</button></div></div>`).join(''):'<div class="empty-state"><strong>저장된 현장이 없습니다.</strong></div>';}
  function downloadText(name,text,type){const b=new Blob([text],{type});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),500);}
  function validColor(v,f){return /^#[0-9a-f]{6}$/i.test(v||'')?v:f;}
  function toast(message,type='success'){const d=document.createElement('div');d.className=`toast ${type}`;d.textContent=message;$('toast-region').appendChild(d);setTimeout(()=>d.remove(),3300);}
  function openDialog(id){const d=$(id);if(!d)return;if(id==='design-dialog')renderDesignDialog();if(id==='template-dialog')renderTemplateDialog();if(id==='theme-dialog')renderThemeDialog();if(id==='icons-dialog')renderIconDialog();if(id==='projects-dialog')renderProjectList();d.showModal();}

  function bind(){
    $('category-select').addEventListener('change',e=>{const first=C.templates.find(t=>t.category===e.target.value);if(first)applyTemplate(first.id);});
    $('template-select').addEventListener('change',e=>applyTemplate(e.target.value));
    $('category-chips').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;const first=C.templates.find(t=>t.category===b.dataset.category);if(first)applyTemplate(first.id);});
    $('template-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)applyTemplate(b.dataset.template);});
    $('btn-template-all').addEventListener('click',()=>openDialog('template-dialog'));
    $('template-dialog-grid').addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(!b)return;applyTemplate(b.dataset.template);$('template-dialog').close();});

    $('pipe-family').addEventListener('change',e=>{state.familyId=e.target.value;state.specId=getFamily().items[0].id;applyPipeSize(true);renderAll();});
    $('pipe-spec').addEventListener('change',e=>{state.specId=e.target.value;applyPipeSize(true);renderAll();});
    $('pipe-purpose').addEventListener('change',e=>{applyPurpose(e.target.value,false);renderAll();});
    $('pipe-size-mode').addEventListener('change',e=>{state.pipeSizeMode=e.target.value;applyPipeSize(true);renderAll();});
    $('wrap-mode').addEventListener('change',e=>{state.wrapMode=e.target.value;applyPipeSize(true);renderAll();});
    $('pipe-direction').addEventListener('change',e=>{state.direction=e.target.value;renderAll();});
    $('sign-size-profile').addEventListener('change',e=>{applySignProfile(e.target.value,true);renderAll();});

    $('main-text').addEventListener('input',e=>{state.mainText=e.target.value;renderStage();saveLocal();});
    $('sub-text').addEventListener('input',e=>{state.subText=e.target.value;renderStage();saveLocal();});
    $('show-spec').addEventListener('change',e=>{state.showSpec=e.target.checked;renderAll();});
    $('quantity').addEventListener('input',e=>{state.quantity=Math.max(1,num(e.target.value,1));saveLocal();});
    $('line-mode').addEventListener('click',e=>{const b=e.target.closest('[data-line]');if(!b)return;state.lineMode=b.dataset.line;state.elements=defaultElements(state);renderAll();});

    $('design-strip').addEventListener('click',e=>{const b=e.target.closest('[data-design]');if(b)applyDesign(b.dataset.design);});
    $('btn-design-all').addEventListener('click',()=>openDialog('design-dialog'));
    $('design-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-design]');if(!b)return;applyDesign(b.dataset.design);$('design-dialog').close();});

    $('btn-direct-edit').addEventListener('click',()=>toggleDirectEdit());
    $('btn-advanced').addEventListener('click',openDrawer); qsa('[data-close-drawer]').forEach(b=>b.addEventListener('click',closeDrawer));
    $('label-width').addEventListener('input',e=>{state.width=Math.max(20,num(e.target.value,state.width));if(state.kind==='pipe')state.pipeSizeMode='custom';else state.signSizeProfile='custom';renderAll();});
    $('label-height').addEventListener('input',e=>{state.height=Math.max(10,num(e.target.value,state.height));if(state.kind==='pipe')state.pipeSizeMode='custom';else state.signSizeProfile='custom';renderAll();});
    $('fill-color').addEventListener('input',e=>{state.fill=e.target.value;renderStage();saveLocal();});$('accent-color').addEventListener('input',e=>{state.accent=e.target.value;renderStage();saveLocal();});$('text-color').addEventListener('input',e=>{state.textColor=e.target.value;renderStage();saveLocal();});
    $('border-width').addEventListener('input',e=>{state.borderWidth=clamp(num(e.target.value,.7),0,5);renderStage();saveLocal();});$('corner-style').addEventListener('change',e=>{state.cornerStyle=e.target.value;renderStage();saveLocal();});
    $('show-icon').addEventListener('change',e=>{state.showIcon=e.target.checked;state.elements.icon.visible=state.showIcon;renderAll();});$('show-sub').addEventListener('change',e=>{state.showSub=e.target.checked;renderAll();});$('show-spec-advanced').addEventListener('change',e=>{state.showSpec=e.target.checked;renderAll();});
    $('btn-reset-layout').addEventListener('click',()=>{state.elements=defaultElements(state);selectedObject=null;renderAll();toast('현재 디자인의 기본 배치로 되돌렸습니다.');});
    $('btn-reapply-smart').addEventListener('click',()=>{if(state.kind==='pipe'){state.pipeSizeMode='smart';applyPipeSize(true);}else{applySignProfile(state.signSizeProfile==='custom'?'near':state.signSizeProfile,true);}renderAll();renderAdvanced();});

    qsa('[data-right-tab]').forEach(b=>b.addEventListener('click',()=>{rightTab=b.dataset.rightTab;renderRightTabs();}));
    ['obj-x','obj-y','obj-w','obj-h','obj-rotate'].forEach(id=>$(id).addEventListener('input',updateInspectorObject));
    $('obj-text').addEventListener('input',e=>{if(selectedObject==='main')state.mainText=e.target.value;else if(selectedObject==='sub')state.subText=e.target.value;renderStage();saveLocal();});
    $('obj-font').addEventListener('input',e=>{if(selectedObject&&selectedObject!=='icon'){state.elements[selectedObject].fontPct=num(e.target.value);renderStage();saveLocal();}});$('obj-weight').addEventListener('change',e=>{if(selectedObject&&selectedObject!=='icon'){state.elements[selectedObject].weight=num(e.target.value);renderStage();saveLocal();}});$('obj-font-family').addEventListener('change',e=>{if(selectedObject&&selectedObject!=='icon'){state.elements[selectedObject].fontFamily=e.target.value;renderStage();saveLocal();}});$('obj-color').addEventListener('input',e=>{if(selectedObject&&selectedObject!=='icon'){state.elements[selectedObject].color=e.target.value;renderStage();saveLocal();}});$('obj-spacing').addEventListener('input',e=>{if(selectedObject&&selectedObject!=='icon'){state.elements[selectedObject].spacing=num(e.target.value);renderStage();saveLocal();}});$('obj-lineheight').addEventListener('input',e=>{if(selectedObject&&selectedObject!=='icon'){state.elements[selectedObject].lineHeight=num(e.target.value);renderStage();saveLocal();}});
    $('obj-align').addEventListener('click',e=>{const b=e.target.closest('[data-align]');if(!b||!selectedObject||selectedObject==='icon')return;state.elements[selectedObject].align=b.dataset.align;renderStage();renderInspector();saveLocal();});
    $('icon-select').addEventListener('change',e=>{state.iconId=e.target.value;state.showIcon=e.target.value!=='none';renderAll();});$('icon-color').addEventListener('input',e=>{if(state.elements.icon){state.elements.icon.color=e.target.value;renderStage();saveLocal();}});$('btn-svg-upload').addEventListener('click',()=>$('svg-file').click());$('svg-file').addEventListener('change',e=>{addSvg(e.target.files[0]);e.target.value='';});$('btn-icon-library').addEventListener('click',()=>openDialog('icons-dialog'));$('icon-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-icon]');if(!b)return;state.iconId=b.dataset.icon;state.showIcon=true;state.elements.icon.visible=true;selectedObject='icon';directEdit=true;$('icons-dialog').close();renderAll();});
    $('edit-toolbar').addEventListener('click',e=>{const b=e.target.closest('[data-edit-action]');if(b)performEditAction(b.dataset.editAction);});
    $('canvas-space').addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files')){e.preventDefault();e.dataTransfer.dropEffect='copy';}});$('canvas-space').addEventListener('drop',e=>{e.preventDefault();const file=[...e.dataTransfer.files].find(f=>f.type==='image/svg+xml'||/\.svg$/i.test(f.name));if(file)addSvg(file);});

    $('btn-add').addEventListener('click',addOrUpdate);$('btn-clear').addEventListener('click',()=>{if(state.queue.length&&confirm('출력 목록을 모두 삭제할까요?')){state.queue=[];editingId=null;renderAll();}});$('queue-list').addEventListener('click',e=>{const row=e.target.closest('.queue-item'),b=e.target.closest('[data-action]');if(!row||!b)return;const id=num(row.dataset.id),idx=state.queue.findIndex(x=>x.id===id);if(idx<0)return;if(b.dataset.action==='edit')editQueue(id);if(b.dataset.action==='copy'){const c=deep(state.queue[idx]);c.id=Date.now();state.queue.splice(idx+1,0,c);renderAll();}if(b.dataset.action==='delete'){state.queue.splice(idx,1);if(editingId===id)editingId=null;renderAll();}});

    qsa('[data-view]').forEach(b=>b.addEventListener('click',()=>{currentView=b.dataset.view;qsa('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('edit-view').hidden=currentView!=='edit';$('sheet-view').hidden=currentView!=='sheet';if(currentView==='sheet')renderSheet();}));$('paper-size').addEventListener('change',e=>{state.paperSize=e.target.value;renderSheet();saveLocal();});$('paper-orientation').addEventListener('change',e=>{state.paperOrientation=e.target.value;renderSheet();saveLocal();});$('paper-gap').addEventListener('change',e=>{state.paperGap=num(e.target.value,4);renderSheet();saveLocal();});

    $('btn-theme').addEventListener('click',()=>openDialog('theme-dialog'));$('theme-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-theme-id]');if(!b)return;state.theme=b.dataset.themeId;document.documentElement.dataset.theme=state.theme;renderThemeDialog();saveLocal();});
    qsa('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.closeDialog).close()));
    $('project-name').addEventListener('input',e=>{state.projectName=e.target.value;saveLocal();});$('btn-export').addEventListener('click',exportProject);$('btn-import').addEventListener('click',()=>$('file-import').click());$('file-import').addEventListener('change',e=>{if(e.target.files[0])importProject(e.target.files[0]);e.target.value='';});$('btn-save-project').addEventListener('click',()=>{$('project-save-name').value=state.projectName;openDialog('projects-dialog');});$('btn-projects').addEventListener('click',()=>openDialog('projects-dialog'));$('btn-project-save-as').addEventListener('click',saveProjectAs);$('project-list').addEventListener('click',e=>{const l=e.target.closest('[data-load]'),d=e.target.closest('[data-delete]');if(l){const p=projects[l.dataset.load];if(p){state={...defaultState(),...deep(p.state),version:5};state.elements={...defaultElements(state),...(p.state.elements||{})};customIcons=deep(p.customIcons||[]);editingId=null;directEdit=false;selectedObject=null;$('projects-dialog').close();renderAll();}}if(d&&confirm('이 현장 저장본을 삭제할까요?')){delete projects[d.dataset.delete];saveLocal();renderProjectList();}});
    $('btn-print').addEventListener('click',()=>{if(!state.queue.length){toast('먼저 출력 목록에 라벨을 추가하세요.','error');return;}currentView='sheet';$('edit-view').hidden=true;$('sheet-view').hidden=false;qsa('[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view==='sheet'));renderSheet();setTimeout(()=>window.print(),150);});
    window.addEventListener('resize',()=>{if(currentView==='edit')renderStage();});
  }

  function init(){
    bind(); const t=getTemplate(); if(!t)applyTemplate('pipe-cooling'); document.documentElement.dataset.theme=state.theme||'studio'; renderAll(); if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }
  init();
})();
