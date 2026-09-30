(() => {
  'use strict';

  const C = window.PM_CATALOG;
  const STORAGE_KEY = 'pipemark-studio-v3-state';
  const PROJECTS_KEY = 'pipemark-studio-v3-projects';
  const ICONS_KEY = 'pipemark-studio-v3-icons';

  const ICONS = {
    none:{label:'없음',svg:''},
    pipe:{label:'배관',svg:'<svg viewBox="0 0 24 24"><path d="M3 8h13a4 4 0 0 1 0 8H3M7 5v14M17 5v14" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    droplet:{label:'물',svg:'<svg viewBox="0 0 24 24"><path d="M12 2C9 6.4 5.6 10.2 5.6 14a6.4 6.4 0 0 0 12.8 0C18.4 10.2 15 6.4 12 2Z" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M9.1 15.2c.5 1.4 1.5 2.2 3 2.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    snow:{label:'냉각',svg:'<svg viewBox="0 0 24 24"><path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 3 3-3M9 20l3-3 3 3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'},
    wind:{label:'공기',svg:'<svg viewBox="0 0 24 24"><path d="M3 8h10c2.8 0 2.8-4 0-4-1.5 0-2.3.7-2.6 1.5M3 12h15c3 0 3 4.5 0 4.5-1.4 0-2.2-.6-2.6-1.4M3 16h7" fill="none" stroke="currentColor" stroke-width="1.9"/></svg>'},
    steam:{label:'스팀',svg:'<svg viewBox="0 0 24 24"><path d="M7 21c-3-3 3-5 0-8s2-5 1-9M12 21c-3-3 3-5 0-8s2-5 1-9M17 21c-3-3 3-5 0-8s2-5 1-9" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    hot:{label:'고온',svg:'<svg viewBox="0 0 24 24"><path d="M6 18h12M8 15c-2-2 2-3.2 0-5.2S9 6.5 9 4M12 15c-2-2 2-3.2 0-5.2S13 6.5 13 4M16 15c-2-2 2-3.2 0-5.2S17 6.5 17 4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    flame:{label:'화염',svg:'<svg viewBox="0 0 24 24"><path d="M12 22c-4 0-7-2.8-7-6.6 0-4.6 4.5-6.2 5.3-11.4 4.3 2.7 7.8 6.6 7.8 11.2C18.1 19.1 15.6 22 12 22Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 19c-1.8 0-3-1.2-3-2.8 0-2 1.8-2.7 2.2-5 2 1.3 3.5 3 3.5 5 0 1.7-1.1 2.8-2.7 2.8Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'},
    extinguisher:{label:'소화기',svg:'<svg viewBox="0 0 24 24"><path d="M9 5h6v3a4 4 0 0 1 3 4v8H6v-8a4 4 0 0 1 3-4zM10 5V3h5l2 2M9 12h6M12 10v5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    flask:{label:'화학',svg:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 16h9" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    waste:{label:'배수',svg:'<svg viewBox="0 0 24 24"><path d="M3 17c2.5-2.3 4.7-2.3 7 0s4.5 2.3 7 0 3.5-2 4-1.5M3 12c2.5-2.3 4.7-2.3 7 0s4.5 2.3 7 0 3.5-2 4-1.5M12 3v5M9 6l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    bolt:{label:'감전',svg:'<svg viewBox="0 0 24 24"><path d="M13 2 5 14h7l-1 8 8-12h-7z" fill="currentColor"/></svg>'},
    gauge:{label:'압력',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 13l4-4M7 18h10M12 5V3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    tag:{label:'태그',svg:'<svg viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-7 7z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></svg>'},
    warning:{label:'경고',svg:'<svg viewBox="0 0 24 24"><path d="M12 3 22 20H2Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v6M12 17h.01" fill="none" stroke="currentColor" stroke-width="2"/></svg>'},
    prohibition:{label:'금지',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 5.5 18.5 18.5" stroke="currentColor" stroke-width="2"/></svg>'},
    mandatory:{label:'지시',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m8 12 2.5 2.5L16 9" fill="none" stroke="currentColor" stroke-width="2"/></svg>'},
    pinch:{label:'손 끼임',svg:'<svg viewBox="0 0 24 24"><path d="M3 6h5v12H3zM16 6h5v12h-5z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 13h6M10 10l2 2 2-2M10 16l2-2 2 2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    rotation:{label:'회전체',svg:'<svg viewBox="0 0 24 24"><path d="M7 7a7 7 0 0 1 11 2l2-1-1 5-5-1 2-1a4.5 4.5 0 0 0-8-2M17 17a7 7 0 0 1-11-2l-2 1 1-5 5 1-2 1a4.5 4.5 0 0 0 8 2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'},
    fall:{label:'추락',svg:'<svg viewBox="0 0 24 24"><circle cx="9" cy="5" r="2" fill="currentColor"/><path d="M9 8l2 4 4 1M10 11l-3 4M11 12l2 5M15 3h6v18M15 18h6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    slip:{label:'미끄럼',svg:'<svg viewBox="0 0 24 24"><circle cx="10" cy="5" r="2" fill="currentColor"/><path d="M10 8l2 4 4 2M11 11l-5 2M12 12l-2 5M16 14l3 4M4 20h16" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    cut:{label:'절단',svg:'<svg viewBox="0 0 24 24"><path d="M4 15h6l2-8 2 8h6M4 18h16" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m10 15 2 3 2-3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    crush:{label:'협착',svg:'<svg viewBox="0 0 24 24"><path d="M3 5h6v14H3zM15 5h6v14h-6zM10 12h4M11 9l2 3-2 3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    laser:{label:'레이저',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6 9 9M15 15l3.4 3.4M18.4 5.6 15 9M9 15l-3.4 3.4" stroke="currentColor" stroke-width="1.6"/></svg>'},
    'no-entry':{label:'출입 금지',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 12h14" stroke="currentColor" stroke-width="3"/></svg>'},
    'hand-stop':{label:'손대지 마시오',svg:'<svg viewBox="0 0 24 24"><path d="M8 12V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-4a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v5c0 4-3 7-7 7h-1c-3 0-5-2-7-5l-2-3a1.6 1.6 0 0 1 2.5-2z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'},
    smoking:{label:'금연',svg:'<svg viewBox="0 0 24 24"><path d="M3 14h14v4H3zM18 14h3v4h-3M9 10c0-2 4-2 4-5M13 10c0-2 4-2 4-5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    helmet:{label:'안전모',svg:'<svg viewBox="0 0 24 24"><path d="M5 14a7 7 0 0 1 14 0M3 14h18v3H3zM9 14V8M15 14V8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    glasses:{label:'보안경',svg:'<svg viewBox="0 0 24 24"><path d="M3 10h5l2 2h4l2-2h5M4 11l1 5h5l1-4M20 11l-1 5h-5l-1-4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    glove:{label:'장갑',svg:'<svg viewBox="0 0 24 24"><path d="M7 11V5a1.3 1.3 0 0 1 2.6 0v5-7a1.3 1.3 0 0 1 2.6 0v7-6a1.3 1.3 0 0 1 2.6 0v6-4a1.3 1.3 0 0 1 2.6 0v8c0 4-3 7-7 7h-1c-3 0-5-2-6-5l-1-3a1.4 1.4 0 0 1 2.4-1.3z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'},
    hearing:{label:'귀마개',svg:'<svg viewBox="0 0 24 24"><path d="M5 13V9a7 7 0 0 1 14 0v4M5 12H3v6h4v-7H5M19 12h2v6h-4v-7h2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    boot:{label:'안전화',svg:'<svg viewBox="0 0 24 24"><path d="M7 4h6v8l3 3h5v4H4v-5l3-2z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4 17h17" stroke="currentColor" stroke-width="1.7"/></svg>'},
    mask:{label:'마스크',svg:'<svg viewBox="0 0 24 24"><path d="M7 9c3-2 7-2 10 0v7c-3 2-7 2-10 0zM7 11 3 9M17 11l4-2M9 12h6M9 15h6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'},
    harness:{label:'안전대',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2" fill="currentColor"/><path d="M8 9h8M9 8l3 5 3-5M12 13v7M8 20l4-7 4 7M6 9l3 4M18 9l-3 4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    gear:{label:'설비',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="1.7"/></svg>'},
    wrench:{label:'점검',svg:'<svg viewBox="0 0 24 24"><path d="M14 6a5 5 0 0 0-6 6L3 17l4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    lock:{label:'잠금',svg:'<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'},
    valve:{label:'밸브',svg:'<svg viewBox="0 0 24 24"><path d="M4 12h16M8 8l4 4-4 4M16 8l-4 4 4 4M12 8V4M8 4h8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    cross:{label:'응급',svg:'<svg viewBox="0 0 24 24"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor"/></svg>'},
    exit:{label:'비상구',svg:'<svg viewBox="0 0 24 24"><path d="M4 3h10v18H4zM14 12h7M18 9l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><path d="M9 11v4l3 2M9 13l-2 3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'},
    aed:{label:'AED',svg:'<svg viewBox="0 0 24 24"><path d="M12 20S4 15 4 9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6-6 11-6 11Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m13 7-3 5h3l-2 5 5-7h-3z" fill="currentColor"/></svg>'},
    eyewash:{label:'세안대',svg:'<svg viewBox="0 0 24 24"><path d="M3 7h18M7 7v3M17 7v3M6 12c1 0 2 1 2 2M18 12c-1 0-2 1-2 2M8 18h8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 11c-2 2-2 4 0 5M16 11c2 2 2 4 0 5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    shower:{label:'비상 샤워',svg:'<svg viewBox="0 0 24 24"><path d="M4 4h7a5 5 0 0 1 5 5v1M13 10h7M15 13v2M18 13v2M21 13v2M14 18h8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    forklift:{label:'지게차',svg:'<svg viewBox="0 0 24 24"><path d="M4 6h8v9H4zM12 10h4l3 5h-7M19 5v10h3M19 15h3v2h-3M6 18a2 2 0 1 0 0 .1M16 18a2 2 0 1 0 0 .1" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    load:{label:'낙하물',svg:'<svg viewBox="0 0 24 24"><path d="M5 4h14v7H5zM8 15h8M10 12l2 3 2-3M4 20h16" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    pedestrian:{label:'보행자',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M12 7v6M8 10l4-2 4 2M12 13l-4 7M12 13l5 7" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'},
    speed:{label:'속도',svg:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7l10 10" stroke="currentColor" stroke-width="2"/></svg>'},
    arrow:{label:'방향',svg:'<svg viewBox="0 0 24 24"><path d="M3 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>'}
  };

  const $ = id => document.getElementById(id);
  const qsa = sel => [...document.querySelectorAll(sel)];
  const deep = value => JSON.parse(JSON.stringify(value));
  let persistAvailable = true;
  let customIcons = loadJSON(ICONS_KEY, []);
  let projects = loadJSON(PROJECTS_KEY, {});
  let state = loadState();
  let editingId = null;
  let pendingSvg = '';
  let previewTab = 'live';

  function defaultState(){
    return {
      projectName:'기본 현장',theme:'industrial',categoryId:'pipe',templateId:'pipe-water',kind:'pipe',
      text:'용수 WATER',subtext:'',signalWord:'',tone:'notice',iconId:'droplet',iconPosition:'left',
      familyId:'pvc-vp',specId:'VP-20',purposeId:'water',coverageId:'half',
      styleId:'classic-arrow',arrowStyle:'standard',direction:'right',repeatCount:'auto',
      fill:'#168A5B',accent:'#0B5137',textColor:'#FFFFFF',borderWidth:.8,borderEnabled:true,textAlign:'center',showSpec:false,
      autoSize:true,width:120,height:41,od:26,faceA:100,faceB:50,quantity:1,
      paperSize:'A4',paperOrientation:'portrait',zoom:'1',queue:[]
    };
  }
  function loadJSON(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch(e){persistAvailable=false;return fallback}}
  function loadState(){return {...defaultState(),...loadJSON(STORAGE_KEY,{})}}
  function persist(){
    try{
      state.projectName=$('project-name').value.trim()||'기본 현장';
      localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
      localStorage.setItem(ICONS_KEY,JSON.stringify(customIcons));
      localStorage.setItem(PROJECTS_KEY,JSON.stringify(projects));
      persistAvailable=true;
    }catch(e){persistAvailable=false}
    const dot=document.querySelector('.saved-dot');
    if(dot) dot.innerHTML=persistAvailable?'<i></i> 이 PC 자동 저장':'저장 제한 · JSON 백업 권장';
  }

  function getTemplate(id=state.templateId){return C.templates.find(t=>t.id===id)||C.templates[0]}
  function getCategory(id=state.categoryId){return C.categories.find(x=>x.id===id)||C.categories[0]}
  function getFamily(id=state.familyId){return C.productFamilies.find(x=>x.id===id)||C.productFamilies[0]}
  function getSpec(){const f=getFamily();return f.items.find(x=>x.id===state.specId)||f.items[0]}
  function getPurpose(id=state.purposeId){return C.pipePurposes.find(x=>x.id===id)||C.pipePurposes[0]}
  function getTone(id=state.tone){return C.tones[id]||C.tones.neutral}
  function getLayout(id=state.styleId){return C.layouts.find(x=>x.id===id)||C.layouts[0]}
  function getCoverage(){const list=C.coverage[getFamily().geometry]||C.coverage.flat;return list.find(x=>x.id===state.coverageId)||list[0]}
  function allIcons(){const out={...ICONS};customIcons.forEach(i=>out[i.id]={label:i.name,svg:i.svg,custom:true});return out}

  function applyTemplate(templateId,{keepSize=false}={}){
    const t=getTemplate(templateId); state.templateId=t.id;state.categoryId=t.category;state.kind=t.kind;state.text=t.text||'';state.subtext=t.subtext||'';state.iconId=t.icon||'tag';state.styleId=t.styleId||'boxed';state.quantity=1;state.textAlign='center';state.showSpec=false;state.borderWidth=.8;state.borderEnabled=true;
    if(t.kind==='pipe'){
      state.purposeId=t.purposeId||'water';const p=getPurpose();state.fill=p.fill;state.accent=p.stroke;state.textColor=p.text;state.signalWord='';state.tone='notice';state.iconPosition='left';state.arrowStyle='standard';state.direction='right';state.repeatCount='auto';
      if(!getFamily()) state.familyId='pvc-vp'; if(!getFamily().items.some(x=>x.id===state.specId)) state.specId=getFamily().items[0].id; if(!state.coverageId) state.coverageId='half';
      syncGeometryFromSpec();if(!keepSize) autoSize();
    }else{
      state.tone=t.tone||'neutral';const tone=getTone();state.fill=tone.fill;state.accent=tone.accent;state.textColor=tone.text;state.signalWord=[t.signalKo,t.signal].filter(Boolean).join(' · ');state.iconPosition=t.styleId==='iso-panel'?'top':'left';state.arrowStyle='none';state.direction='none';state.repeatCount='1';state.coverageId='flat';
      if(!keepSize){state.width=t.width||120;state.height=t.height||55;state.autoSize=false}
    }
    editingId=null;renderAll();persist();
  }

  function syncGeometryFromSpec(){const s=getSpec();if(s.od)state.od=s.od;if(s.a)state.faceA=s.a;if(s.b)state.faceB=s.b;const list=C.coverage[getFamily().geometry]||C.coverage.flat;if(!list.some(x=>x.id===state.coverageId))state.coverageId=list[0].id}
  function autoSize(){if(!state.autoSize)return; if(state.kind!=='pipe')return; const f=getFamily(),c=getCoverage(); if(f.geometry==='round'){const od=num(state.od,26);state.width=recommendedPipeWidth(od);if(c.ratio){state.height=round(Math.PI*od*c.ratio+(c.id==='full'?Math.max(6,Math.min(15,od*.15)):0),1)}else state.height=clamp(round(od*.95,1),24,60)}else{const a=num(state.faceA,100),b=num(state.faceB,50);state.width=clamp(round(a*2.2,5),90,500);if(c.faces==='a')state.height=a;else if(c.faces==='b')state.height=b;else if(c.faces==='ab')state.height=a+b;else if(c.faces==='perimeter')state.height=2*(a+b)+8;else state.height=b}}
  function recommendedPipeWidth(od){const map={18:100,22:110,26:120,27.2:120,32:140,34:150,38:160,42.7:180,48:190,48.6:200,60:210,60.5:220,76:240,76.3:250,89:270,89.1:280,101.6:290,114:300,114.3:300,140:320,139.8:320,165:340,165.2:340,216:380,216.3:380,267:420,267.4:420,318:460,318.5:460};const k=Object.keys(map).find(k=>Math.abs(Number(k)-od)<.16);return k?map[k]:clamp(round(80+od*2,5),100,500)}

  function renderAll(){
    $('project-name').value=state.projectName||'기본 현장';document.documentElement.dataset.theme=state.theme||'industrial';
    renderCategories();renderTemplates();renderEditor();renderLayouts();renderIcons();renderPreview();renderQueue();renderSheet();renderThemes();updatePrintPage();persist();
  }
  function renderCategories(){ $('category-tabs').innerHTML=C.categories.map(c=>`<button type="button" class="${state.categoryId===c.id?'active':''}" data-category="${c.id}"><span class="cat-icon">${categoryGlyph(c.id)}</span>${esc(c.label)}</button>`).join('') }
  function categoryGlyph(id){return {pipe:'↔',warning:'⚠',prohibition:'⊘',mandatory:'✓',equipment:'⚙',emergency:'✚',logistics:'▣',custom:'＋'}[id]||'•'}
  function renderTemplates(){
    const query=($('template-search').value||'').trim().toLowerCase();let items=C.templates.filter(t=>t.category===state.categoryId);if(query)items=items.filter(t=>`${t.name} ${t.text} ${t.subtext||''}`.toLowerCase().includes(query));
    $('library-title').textContent=getCategory().label;$('library-count').textContent=`${items.length}개`;
    $('template-grid').innerHTML=items.map(t=>`<button type="button" class="template-card ${state.templateId===t.id?'active':''}" data-template="${t.id}"><div class="template-thumb">${templateThumb(t)}</div><strong>${esc(t.name)}</strong><small>${esc(t.text)}</small></button>`).join('')||'<div class="queue-empty" style="grid-column:1/-1"><strong>검색 결과가 없습니다.</strong><span>다른 단어로 검색해보세요.</span></div>';
  }
  function templateThumb(t){
    const pseudo={...defaultState(),kind:t.kind,text:t.text,subtext:t.subtext||'',styleId:t.styleId||'boxed',iconId:t.icon||'tag',tone:t.tone||'neutral',signalWord:[t.signalKo,t.signal].filter(Boolean).join(' · '),width:100,height:44,repeatCount:'1',borderEnabled:true,borderWidth:.8,iconPosition:t.styleId==='iso-panel'?'top':'left'};
    if(t.kind==='pipe'){const p=getPurpose(t.purposeId);Object.assign(pseudo,{fill:p.fill,accent:p.stroke,textColor:p.text,purposeId:p.id,arrowStyle:'standard',direction:'right'})}else{const tone=C.tones[t.tone]||C.tones.neutral;Object.assign(pseudo,{fill:tone.fill,accent:tone.accent,textColor:tone.text})}
    return `<div class="thumb-render">${renderLabel(pseudo,{compact:true})}</div>`;
  }

  function renderEditor(){
    const t=getTemplate();$('editor-title').textContent=t.name;$('editor-hint').textContent=state.kind==='pipe'?'규격·용도·덮음 방식과 화살표를 기본값에서 조정합니다.':'문구·크기·아이콘·색상을 기본값에서 조정합니다.';
    $('edit-mode-banner').hidden=!editingId;$('edit-mode-text').textContent=editingId?`#${editingId} · 수정 저장 전까지 원본 목록은 유지됩니다.`:'';$('btn-add-text').textContent=editingId?'수정 내용 저장':'출력 목록에 추가';
    $('label-text').value=state.text;$('label-subtext').value=state.subtext||'';$('quantity').value=state.quantity;$('icon-position').value=state.iconPosition||'left';
    $('pipe-basic').hidden=state.kind!=='pipe';$('sign-basic').hidden=state.kind==='pipe';$('arrow-group').hidden=state.kind!=='pipe';
    if(state.kind==='pipe')renderPipeEditor();else renderSignEditor();
    $('auto-size').checked=!!state.autoSize;$('label-width').value=fmt(state.width);$('label-height').value=fmt(state.height);renderGeometryFields();
    $('arrow-style').value=state.arrowStyle||'standard';$('direction').value=state.direction||'right';$('fill-color').value=validColor(state.fill,'#ffffff');$('accent-color').value=validColor(state.accent,'#333333');$('text-color').value=validColor(state.textColor,'#111111');$('border-width').value=state.borderWidth;$('border-enabled').checked=!!state.borderEnabled;$('text-align').value=state.textAlign||'center';$('repeat-count').value=String(state.repeatCount||'auto');$('show-spec').checked=!!state.showSpec;
  }
  function renderPipeEditor(){
    $('product-family').innerHTML=C.productFamilies.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('');$('product-family').value=state.familyId;
    const f=getFamily();$('product-spec').innerHTML=f.items.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('');if(!f.items.some(s=>s.id===state.specId)){state.specId=f.items[0].id;syncGeometryFromSpec()}$('product-spec').value=state.specId;
    const s=getSpec();$('pipe-geometry').innerHTML=f.geometry==='round'?`선택 규격 <strong>${esc(s.label)}</strong> · 외경 <strong>${fmt(state.od)} mm</strong> · 계산 원주 <strong>${fmt(Math.PI*state.od)} mm</strong>`:`선택 규격 <strong>${esc(s.label)}</strong> · A ${fmt(state.faceA)} mm / B ${fmt(state.faceB)} mm`;
    $('purpose-chips').innerHTML=C.pipePurposes.map(p=>`<button type="button" class="${state.purposeId===p.id?'active':''}" data-purpose="${p.id}">${esc(p.label)}</button>`).join('');
    const cov=C.coverage[f.geometry]||C.coverage.flat;$('coverage-chips').innerHTML=cov.map(c=>`<button type="button" class="${state.coverageId===c.id?'active':''}" data-coverage="${c.id}">${esc(c.label)}</button>`).join('');
  }
  function renderSignEditor(){
    $('size-presets').innerHTML=C.sizePresets.map(s=>`<button type="button" class="${Math.abs(state.width-s.w)<.1&&Math.abs(state.height-s.h)<.1?'active':''}" data-size="${s.id}">${s.label}</button>`).join('');
    $('signal-word').value=state.signalWord||'';$('tone-select').innerHTML=Object.keys(C.tones).map(id=>`<option value="${id}">${toneLabel(id)}</option>`).join('');$('tone-select').value=state.tone;
  }
  function toneLabel(id){return {neutral:'중립',notice:'안내',danger:'위험 · 빨강',warning:'경고 · 주황',caution:'주의 · 노랑',prohibition:'금지 · 빨강',mandatory:'지시 · 파랑',emergency:'비상 · 초록',fire:'소방 · 빨강'}[id]||id}
  function renderGeometryFields(){const box=$('geometry-fields');if(state.kind!=='pipe'){box.innerHTML='';return}const f=getFamily();if(f.geometry==='round')box.innerHTML=`<label class="field"><span>외경 OD (mm)</span><input id="geometry-od" type="number" min="1" step="0.1" value="${fmt(state.od)}"></label><label class="field"><span>기준</span><input value="${esc(f.standard)}" readonly></label>`;else box.innerHTML=`<label class="field"><span>A면 (mm)</span><input id="geometry-a" type="number" min="1" step="0.1" value="${fmt(state.faceA)}"></label><label class="field"><span>B면 (mm)</span><input id="geometry-b" type="number" min="1" step="0.1" value="${fmt(state.faceB)}"></label>`}

  function availableLayouts(){return C.layouts.filter(l=>l.group==='all'||(state.kind==='pipe'?l.group==='pipe':l.group==='sign'))}
  function renderLayouts(){
    const layouts=availableLayouts();if(!layouts.some(x=>x.id===state.styleId))state.styleId=layouts[0].id;
    $('layout-strip').innerHTML=layouts.slice(0,8).map(l=>layoutCard(l,false)).join('');$('layout-gallery').innerHTML=layouts.map(l=>layoutCard(l,true)).join('')
  }
  function layoutCard(l,gallery){const preview={...snapshotLabel(),styleId:l.id,width:100,height:44,repeatCount:'1'};return `<button type="button" class="${gallery?'gallery-card':'layout-choice'} ${state.styleId===l.id?'active':''}" data-layout="${l.id}">${gallery?`<div class="gallery-preview"><div class="thumb-render">${renderLabel(preview,{compact:true})}</div></div><strong>${esc(l.label)}</strong><small>${esc(l.desc)}</small>`:`<span class="layout-mini"><div class="thumb-render">${renderLabel(preview,{compact:true})}</div></span><strong>${esc(l.label)}</strong>`}</button>`}

  function renderIcons(){const icons=allIcons();const ids=Object.keys(icons);$('icon-grid').innerHTML=ids.map(id=>`<button type="button" class="icon-choice ${state.iconId===id?'active':''}" data-icon="${id}" title="${esc(icons[id].label)}">${icons[id].svg||'—'}</button>`).join('')}

  function snapshotLabel(){
    const keys=['kind','templateId','text','subtext','signalWord','tone','iconId','iconPosition','familyId','specId','purposeId','coverageId','styleId','arrowStyle','direction','repeatCount','fill','accent','textColor','borderWidth','borderEnabled','textAlign','showSpec','autoSize','width','height','od','faceA','faceB','quantity'];const out={};keys.forEach(k=>out[k]=deep(state[k]));return out
  }
  function loadLabel(label){Object.assign(state,deep(label));if(!state.kind)state.kind=getTemplate(state.templateId).kind;renderAll()}

  function actualRepeats(label=state){if(label.kind!=='pipe')return 1;if(label.repeatCount!=='auto')return Math.max(1,Number(label.repeatCount)||1);const f=C.productFamilies.find(x=>x.id===label.familyId)||getFamily();const cov=(C.coverage[f.geometry]||C.coverage.flat).find(x=>x.id===label.coverageId);return cov?.repeats||1}
  function renderPreview(){const label=snapshotLabel();$('dimension-readout').textContent=`${fmt(label.width)} × ${fmt(label.height)} mm · ${state.kind==='pipe'?getSpec().label:getLayout().label}`;$('live-preview').innerHTML=renderLabel(label)}
  function renderLabel(label,{compact=false}={}){
    const icons=allIcons(),icon=icons[label.iconId]||icons.none;const border=label.borderEnabled?`${num(label.borderWidth,.8)}mm`:'0mm';const style=`--label-fill:${label.fill};--label-accent:${label.accent};--label-text:${label.textColor};--label-border:${border};width:${fmt(label.width)}mm;height:${fmt(label.height)}mm;`;
    if(label.kind==='pipe')return renderPipe(label,icon,style,compact);return renderSign(label,icon,style,compact)
  }
  function renderPipe(label,icon,style,compact){
    const repeats=actualRepeats(label),rowH=label.height/repeats;let rows='';for(let i=0;i<repeats;i++){
      const shape=pipeShape(label);const fill=label.styleId==='outline'?'#ffffff':label.fill;const textColor=label.styleId==='outline'?label.accent:label.textColor;const iconHtml=label.iconPosition!=='none'&&icon.svg?`<span class="label-icon">${icon.svg}</span>`:'';const spec=label.showSpec?`<span class="spec-text">${esc(specLabelFor(label))}</span>`:'';
      rows+=`<div class="pipe-row" style="height:${fmt(rowH)}mm;color:${textColor}"><svg class="pipe-shape" viewBox="0 0 100 40" preserveAspectRatio="none"><polygon points="${shape}" fill="${fill}" stroke="${label.borderEnabled?label.accent:'none'}" stroke-width="${label.borderEnabled?Math.max(.4,num(label.borderWidth,.8)*.7):0}" vector-effect="non-scaling-stroke"/></svg><div class="content">${iconHtml}<span class="words"><span class="main-text" style="font-size:${compact?8:pipeFont(label,rowH)}${compact?'px':'mm'}">${esc(label.text)}</span>${label.subtext?`<span class="sub-text" style="font-size:${compact?5:Math.max(3,pipeFont(label,rowH)*.42)}${compact?'px':'mm'}">${esc(label.subtext)}</span>`:''}${spec}</span></div></div>`
    }
    return `<div class="label-output pipe-label layout-${escAttr(label.styleId)} align-${escAttr(label.textAlign||'center')}" style="${style}">${rows}</div>`
  }
  function pipeFont(label,rowH){const len=[...String(label.text||'')].reduce((n,c)=>n+(/[가-힣]/.test(c)?1:.65),0)+(label.iconPosition!=='none'?2:0);const usable=Math.max(20,label.width*.72);return clamp(Math.min(rowH*.38,usable/Math.max(4,len)*1.45,22),3.5,22)}
  function pipeShape(label){
    const style=label.styleId,dir=style==='double-arrow'?'both':label.direction,shape=style==='ribbon-arrow'?'ribbon':label.arrowStyle;
    if(shape==='none'||dir==='none'||['boxed','outline','capsule','technical'].includes(style))return '1,1 99,1 99,39 1,39';
    if(shape==='pointer'){if(dir==='left')return '18,1 99,1 99,39 18,39 1,20';if(dir==='both')return '18,1 82,1 99,20 82,39 18,39 1,20';return '1,1 82,1 99,20 82,39 1,39'}
    if(shape==='ribbon'){if(dir==='left')return '99,1 18,1 1,20 18,39 99,39 86,20';if(dir==='both')return '18,1 82,1 99,20 82,39 18,39 1,20';return '1,1 82,1 99,20 82,39 1,39 14,20'}
    if(shape==='chevron'){return '1,1 76,1 99,20 76,39 1,39 22,20'}
    // 원래 기본 화살표: 본체는 좁은 띠, 화살촉은 전체 높이
    if(dir==='left')return '99,8 20,8 20,1 1,20 20,39 20,32 99,32';
    if(dir==='both')return '20,1 20,8 80,8 80,1 99,20 80,39 80,32 20,32 20,39 1,20';
    return '1,8 80,8 80,1 99,20 80,39 80,32 1,32';
  }
  function specLabelFor(label){const f=C.productFamilies.find(x=>x.id===label.familyId);return f?.items.find(x=>x.id===label.specId)?.label||''}
  function renderSign(label,icon,style,compact){
    const l=label.styleId;const tone=label.tone;const signal=label.signalWord||toneLabel(tone).replace(/ ·.*/,'');const iconHtml=label.iconPosition==='none'?'':`<span class="label-icon">${icon.svg}</span>`;const sizeMain=compact?8:signFont(label);const unit=compact?'px':'mm';
    const words=`<span class="words"><span class="main-text" style="font-size:${sizeMain}${unit}">${esc(label.text)}</span>${label.subtext?`<span class="sub-text" style="font-size:${compact?5:Math.max(3,sizeMain*.42)}${unit}">${esc(label.subtext)}</span>`:''}</span>`;
    let inner='';if(l==='ansi-header'){inner=`<div class="signal-bar">${esc(signal)}</div><div class="content">${iconHtml}${words}</div>`}else if(l==='speed-sign'){inner=`<div class="content"><span class="words"><span class="main-text" style="font-size:${compact?13:Math.min(label.width,label.height)*.42}${unit}">${esc(label.text)}</span><span class="sub-text">${esc(label.subtext||'km/h')}</span></span></div>`}else if(l==='direction-sign'){inner=`<div class="content">${ICONS.arrow.svg}${words}</div>`}else{inner=`<div class="content">${iconHtml}${words}</div>`}
    return `<div class="label-output layout-${escAttr(l)} tone-${escAttr(tone)} align-${escAttr(label.textAlign||'center')}" style="${style}">${inner}</div>`
  }
  function signFont(label){const len=[...String(label.text||'')].reduce((n,c)=>n+(/[가-힣]/.test(c)?1:.62),0);const maxByW=label.width/(Math.max(4,len)*.66);return clamp(Math.min(label.height*.24,maxByW,18),4,18)}

  function renderQueue(){
    $('queue-count').textContent=String(state.queue.reduce((n,x)=>n+(x.label.quantity||1),0));$('queue-empty').hidden=state.queue.length>0;
    $('queue-list').innerHTML=state.queue.map(item=>`<div class="queue-item" data-id="${item.id}"><div class="queue-mini"><div class="thumb-render">${renderLabel({...item.label,width:100,height:44,repeatCount:'1'},{compact:true})}</div></div><div class="queue-copy"><strong>${esc(item.label.text)}</strong><span>${item.label.kind==='pipe'?esc(specLabelFor(item.label))+' · ':''}${fmt(item.label.width)} × ${fmt(item.label.height)} mm · ${item.label.quantity}장</span></div><div class="queue-actions"><button type="button" data-action="edit" title="수정"><svg><use href="#i-edit"></use></svg></button><button type="button" data-action="copy" title="복제"><svg><use href="#i-copy"></use></svg></button><button type="button" data-action="svg" title="SVG 저장">SVG</button><button type="button" class="danger" data-action="delete" title="삭제"><svg><use href="#i-trash"></use></svg></button></div></div>`).join('')
  }
  function renderSheet(){let html='';state.queue.forEach(item=>{for(let i=0;i<(item.label.quantity||1);i++)html+=renderLabel(item.label)});$('print-area').innerHTML=html;$('print-area').className=`paper ${state.paperSize} ${state.paperOrientation}`;$('print-area').style.transform=`scale(${state.zoom})`;const sheet=$('sheet-workspace');const live=$('live-workspace');sheet.hidden=previewTab!=='sheet';live.hidden=previewTab==='sheet';qsa('[data-preview-tab]').forEach(b=>b.classList.toggle('active',b.dataset.previewTab===previewTab))}
  function updatePrintPage(){const size=`${state.paperSize} ${state.paperOrientation}`;$('print-style').textContent=`@page{size:${size};margin:8mm}`;$('paper-size').value=state.paperSize;$('paper-orientation').value=state.paperOrientation;$('preview-zoom').value=state.zoom}

  function renderThemes(){const palette={industrial:['#173f5c','#edf1f4','#fff'],blueprint:['#0b5b8d','#dfeaf2','#fafdff'],workshop:['#3d5142','#ece7dd','#fffdf8'],light:['#243b53','#f5f6f8','#fff'],dark:['#63a9d8','#0c1318','#121c23'],mono:['#202020','#ececec','#fff']};$('theme-grid').innerHTML=C.themes.map(t=>{const p=palette[t.id];return `<button type="button" class="theme-card ${state.theme===t.id?'active':''}" data-theme="${t.id}"><div class="theme-swatch" style="--t1:${p[0]};--t2:${p[1]};--t3:${p[2]}"></div><strong>${esc(t.label)}</strong><small>${esc(t.desc)}</small></button>`}).join('')}

  function applyPurpose(id){state.purposeId=id;const p=getPurpose(id);state.text=p.defaultText;state.fill=p.fill;state.accent=p.stroke;state.textColor=p.text;state.iconId=p.icon;if(state.autoSize)autoSize();renderAll()}
  function applyTone(id){state.tone=id;const tone=getTone(id);state.fill=tone.fill;state.accent=tone.accent;state.textColor=tone.text;renderAll()}
  function resetRecommendedColors(){if(state.kind==='pipe'){const p=getPurpose();state.fill=p.fill;state.accent=p.stroke;state.textColor=p.text}else{const tone=getTone();state.fill=tone.fill;state.accent=tone.accent;state.textColor=tone.text}renderAll()}

  function addOrUpdate(){const label=snapshotLabel();if(!label.text.trim())return toast('큰 문구를 입력하세요.','error');if(editingId){const idx=state.queue.findIndex(x=>x.id===editingId);if(idx>=0)state.queue[idx]={...state.queue[idx],label};toast('목록의 라벨을 수정했습니다.','success');editingId=null}else{state.queue.push({id:Date.now(),createdAt:new Date().toISOString(),label});toast('출력 목록에 추가했습니다.','success')}renderAll()}
  function duplicateCurrent(){const label=snapshotLabel();state.queue.push({id:Date.now(),createdAt:new Date().toISOString(),label:deep(label)});editingId=null;toast('현재 설정을 사본으로 추가했습니다.','success');renderAll()}
  function editQueue(id){const item=state.queue.find(x=>x.id===id);if(!item)return;editingId=id;loadLabel(item.label);$('edit-mode-banner').hidden=false;$('editor-panel')?.scrollTo?.({top:0,behavior:'smooth'})}

  function exportProject(){const data={type:'PipeMarkStudio_V3',version:3,exportedAt:new Date().toISOString(),projectName:state.projectName,state,customIcons};downloadText(`${slug(state.projectName)}-pipemark.json`,JSON.stringify(data,null,2),'application/json')}
  async function importProject(file){try{const data=JSON.parse(await file.text());if(data.type==='PipeMarkStudio_V3'&&data.state){state={...defaultState(),...data.state};customIcons=Array.isArray(data.customIcons)?data.customIcons:customIcons}else if(data.queue||data.presets){state={...defaultState(),projectName:'구버전 가져오기',queue:[]};toast('구버전 파일은 설정 구조가 달라 기본 프로젝트로 열었습니다. 기존 원본은 그대로 유지됩니다.','success')}else throw new Error('PipeMark Studio 백업 파일이 아닙니다.');editingId=null;renderAll();toast('프로젝트를 불러왔습니다.','success')}catch(e){toast(`불러오기 실패: ${e.message}`,'error')}}

  function saveProjectAs(){const name=$('project-save-name').value.trim()||state.projectName||'새 현장';const id=slug(name)+'-'+Date.now().toString(36);projects[id]={name,savedAt:new Date().toISOString(),state:deep(state),customIcons:deep(customIcons)};persist();renderProjectList();$('project-save-name').value='';toast('이 PC에 현장 상태를 저장했습니다.','success')}
  function renderProjectList(){const entries=Object.entries(projects).sort((a,b)=>String(b[1].savedAt).localeCompare(String(a[1].savedAt)));$('project-list').innerHTML=entries.length?entries.map(([id,p])=>`<div class="project-item"><div><strong>${esc(p.name)}</strong><span>${new Date(p.savedAt).toLocaleString('ko-KR')} · ${p.state?.queue?.length||0}종</span></div><div><button type="button" data-project-load="${id}">불러오기</button><button type="button" data-project-delete="${id}">삭제</button></div></div>`).join(''):'<div class="queue-empty"><strong>저장된 현장이 없습니다.</strong><span>현재 상태를 이름 붙여 저장하세요.</span></div>'}

  function sanitizeSvg(raw){const doc=new DOMParser().parseFromString(raw,'image/svg+xml');if(doc.querySelector('parsererror'))throw new Error('유효한 SVG가 아닙니다.');doc.querySelectorAll('script,foreignObject,iframe,object,embed,link,style').forEach(n=>n.remove());doc.querySelectorAll('*').forEach(el=>{[...el.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=a.value.trim().toLowerCase();if(n.startsWith('on')||((n==='href'||n==='xlink:href'||n==='src')&&(v.startsWith('http:')||v.startsWith('https:')||v.startsWith('javascript:')||v.startsWith('data:'))))el.removeAttribute(a.name)});});const svg=doc.documentElement;svg.removeAttribute('width');svg.removeAttribute('height');if(!svg.getAttribute('viewBox'))svg.setAttribute('viewBox','0 0 24 24');return new XMLSerializer().serializeToString(svg)}
  async function loadSvgFile(file){try{pendingSvg=sanitizeSvg(await file.text());$('custom-icon-preview').innerHTML=pendingSvg;$('btn-save-icon').disabled=false;if(!$('custom-icon-name').value)$('custom-icon-name').value=file.name.replace(/\.svg$/i,'')}catch(e){pendingSvg='';$('custom-icon-preview').textContent=e.message;$('btn-save-icon').disabled=true}}
  function saveCustomIcon(){const name=$('custom-icon-name').value.trim();if(!name||!pendingSvg)return toast('아이콘 이름과 SVG 파일을 확인하세요.','error');const id='user-'+slug(name)+'-'+Date.now().toString(36);customIcons.push({id,name,svg:pendingSvg});state.iconId=id;persist();renderIcons();$('svg-dialog').close();toast('SVG 아이콘을 저장했습니다.','success')}

  function labelToSvg(label){
    const width=label.width,height=label.height;const html=renderLabel(label).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const css=`body{margin:0}.wrap{width:${width}mm;height:${height}mm;overflow:hidden;font-family:Arial,sans-serif}.note{font-size:4mm;padding:2mm}`;
    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}"><foreignObject width="${width}" height="${height}"><xhtml:div class="wrap"><xhtml:style>${css}</xhtml:style><xhtml:div class="note">${escXML(label.text)} · ${width}×${height} mm</xhtml:div></xhtml:div></foreignObject></svg>`
  }

  function bind(){
    $('template-search').addEventListener('input',renderTemplates);
    $('category-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;state.categoryId=b.dataset.category;const first=C.templates.find(t=>t.category===state.categoryId);if(first)applyTemplate(first.id)});
    $('template-grid').addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)applyTemplate(b.dataset.template)});
    $('label-text').addEventListener('input',e=>{state.text=e.target.value;renderPreview();renderLayouts();persist()});$('label-subtext').addEventListener('input',e=>{state.subtext=e.target.value;renderPreview();renderLayouts();persist()});$('quantity').addEventListener('input',e=>{state.quantity=Math.max(1,Number(e.target.value)||1);persist()});$('icon-position').addEventListener('change',e=>{state.iconPosition=e.target.value;renderPreview();persist()});
    $('product-family').addEventListener('change',e=>{state.familyId=e.target.value;state.specId=getFamily().items[0].id;syncGeometryFromSpec();autoSize();renderAll()});$('product-spec').addEventListener('change',e=>{state.specId=e.target.value;syncGeometryFromSpec();autoSize();renderAll()});
    $('purpose-chips').addEventListener('click',e=>{const b=e.target.closest('[data-purpose]');if(b)applyPurpose(b.dataset.purpose)});$('coverage-chips').addEventListener('click',e=>{const b=e.target.closest('[data-coverage]');if(!b)return;state.coverageId=b.dataset.coverage;autoSize();renderAll()});
    $('size-presets').addEventListener('click',e=>{const b=e.target.closest('[data-size]');if(!b)return;const s=C.sizePresets.find(x=>x.id===b.dataset.size);state.width=s.w;state.height=s.h;state.autoSize=false;renderAll()});$('signal-word').addEventListener('input',e=>{state.signalWord=e.target.value;renderPreview();persist()});$('tone-select').addEventListener('change',e=>applyTone(e.target.value));
    $('layout-strip').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(!b)return;state.styleId=b.dataset.layout;if(state.styleId==='double-arrow'){state.direction='both';state.arrowStyle='standard'}renderAll()});$('layout-gallery').addEventListener('click',e=>{const b=e.target.closest('[data-layout]');if(!b)return;state.styleId=b.dataset.layout;if(state.styleId==='double-arrow'){state.direction='both';state.arrowStyle='standard'}$('design-dialog').close();renderAll()});
    $('btn-design-all').addEventListener('click',()=>{renderLayouts();$('design-dialog').showModal()});
    $('auto-size').addEventListener('change',e=>{state.autoSize=e.target.checked;if(state.autoSize)autoSize();renderAll()});$('label-width').addEventListener('input',e=>{state.width=Math.max(20,num(e.target.value,120));state.autoSize=false;$('auto-size').checked=false;renderPreview();persist()});$('label-height').addEventListener('input',e=>{state.height=Math.max(10,num(e.target.value,55));state.autoSize=false;$('auto-size').checked=false;renderPreview();persist()});
    $('geometry-fields').addEventListener('input',e=>{if(e.target.id==='geometry-od')state.od=num(e.target.value,state.od);if(e.target.id==='geometry-a')state.faceA=num(e.target.value,state.faceA);if(e.target.id==='geometry-b')state.faceB=num(e.target.value,state.faceB);if(state.autoSize)autoSize();renderPreview();persist()});
    $('arrow-style').addEventListener('change',e=>{state.arrowStyle=e.target.value;renderPreview();persist()});$('direction').addEventListener('change',e=>{state.direction=e.target.value;renderPreview();persist()});$('fill-color').addEventListener('input',e=>{state.fill=e.target.value;renderPreview();renderLayouts();persist()});$('accent-color').addEventListener('input',e=>{state.accent=e.target.value;renderPreview();renderLayouts();persist()});$('text-color').addEventListener('input',e=>{state.textColor=e.target.value;renderPreview();persist()});$('border-width').addEventListener('input',e=>{state.borderWidth=Math.max(0,num(e.target.value,.8));renderPreview();persist()});$('border-enabled').addEventListener('change',e=>{state.borderEnabled=e.target.checked;renderPreview();persist()});$('text-align').addEventListener('change',e=>{state.textAlign=e.target.value;renderPreview();persist()});$('repeat-count').addEventListener('change',e=>{state.repeatCount=e.target.value;renderPreview();persist()});$('show-spec').addEventListener('change',e=>{state.showSpec=e.target.checked;renderPreview();persist()});$('btn-color-reset').addEventListener('click',resetRecommendedColors);
    $('icon-grid').addEventListener('click',e=>{const b=e.target.closest('[data-icon]');if(!b)return;state.iconId=b.dataset.icon;renderAll()});
    $('btn-svg-add').addEventListener('click',()=>{pendingSvg='';$('custom-icon-name').value='';$('custom-icon-file').value='';$('custom-icon-preview').textContent='미리보기';$('btn-save-icon').disabled=true;$('svg-dialog').showModal()});$('custom-icon-file').addEventListener('change',e=>loadSvgFile(e.target.files[0]));$('btn-save-icon').addEventListener('click',saveCustomIcon);
    $('btn-add').addEventListener('click',addOrUpdate);$('btn-duplicate-current').addEventListener('click',duplicateCurrent);$('btn-cancel-edit').addEventListener('click',()=>{editingId=null;renderAll()});$('btn-reset-current').addEventListener('click',()=>applyTemplate(state.templateId));
    $('queue-list').addEventListener('click',e=>{const item=e.target.closest('.queue-item'),b=e.target.closest('[data-action]');if(!item||!b)return;const id=Number(item.dataset.id),idx=state.queue.findIndex(x=>x.id===id);if(idx<0)return;const act=b.dataset.action;if(act==='edit')editQueue(id);if(act==='copy'){const copy=deep(state.queue[idx]);copy.id=Date.now();copy.createdAt=new Date().toISOString();state.queue.splice(idx+1,0,copy);renderAll();toast('라벨을 복제했습니다.','success')}if(act==='delete'){state.queue.splice(idx,1);if(editingId===id)editingId=null;renderAll()}if(act==='svg'){downloadText(`${slug(state.queue[idx].label.text)}.svg`,labelToSvg(state.queue[idx].label),'image/svg+xml')}});$('btn-clear-queue').addEventListener('click',()=>{if(state.queue.length&&confirm('출력 목록을 모두 삭제할까요?')){state.queue=[];editingId=null;renderAll()}});
    qsa('[data-preview-tab]').forEach(b=>b.addEventListener('click',()=>{previewTab=b.dataset.previewTab;renderSheet()}));$('paper-size').addEventListener('change',e=>{state.paperSize=e.target.value;renderAll()});$('paper-orientation').addEventListener('change',e=>{state.paperOrientation=e.target.value;renderAll()});$('preview-zoom').addEventListener('change',e=>{state.zoom=e.target.value;renderAll()});
    $('btn-print').addEventListener('click',()=>{if(!state.queue.length)return toast('먼저 출력 목록에 라벨을 추가하세요.','error');window.print()});$('btn-export').addEventListener('click',exportProject);$('btn-import').addEventListener('click',()=>$('file-import').click());$('file-import').addEventListener('change',e=>{if(e.target.files[0])importProject(e.target.files[0]);e.target.value='' });
    $('btn-theme').addEventListener('click',()=>{$('theme-dialog').showModal()});$('theme-grid').addEventListener('click',e=>{const b=e.target.closest('[data-theme]');if(!b)return;state.theme=b.dataset.theme;document.documentElement.dataset.theme=state.theme;$('theme-dialog').close();renderAll()});
    $('btn-save-project').addEventListener('click',()=>{$('project-save-name').value=state.projectName;$('project-dialog').showModal();renderProjectList()});$('btn-projects').addEventListener('click',()=>{$('project-save-name').value='';$('project-dialog').showModal();renderProjectList()});$('btn-project-save-as').addEventListener('click',saveProjectAs);$('project-list').addEventListener('click',e=>{const load=e.target.closest('[data-project-load]'),del=e.target.closest('[data-project-delete]');if(load){const p=projects[load.dataset.projectLoad];if(p){state={...defaultState(),...deep(p.state)};customIcons=deep(p.customIcons||customIcons);editingId=null;$('project-dialog').close();renderAll();toast('현장을 불러왔습니다.','success')}}if(del&&confirm('이 현장 저장본을 삭제할까요?')){delete projects[del.dataset.projectDelete];persist();renderProjectList()}});
    qsa('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.closeDialog).close()));$('project-name').addEventListener('input',e=>{state.projectName=e.target.value;persist()});
  }

  function init(){
    if(!C) return;
    bind();
    const initialTemplate=getTemplate(state.templateId);if(!initialTemplate){state=defaultState()}else{state.kind=initialTemplate.kind||state.kind}
    renderAll();
    if(!persistAvailable)toast('브라우저가 로컬 저장을 제한했습니다. 선택 기능은 정상 동작하며 JSON 백업을 권장합니다.','error');
    if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }

  function toast(message,type='success'){const d=document.createElement('div');d.className=`toast ${type}`;d.textContent=message;$('toast-region').appendChild(d);setTimeout(()=>d.remove(),3200)}
  function downloadText(name,text,type){const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
  function num(v,f=0){const n=Number(v);return Number.isFinite(n)?n:f}function clamp(v,min,max){return Math.max(min,Math.min(max,v))}function round(v,step=1){return Math.round(v/step)*step}function fmt(v){const n=Number(v);return Number.isInteger(n)?String(n):n.toFixed(1).replace(/\.0$/,'')}function validColor(v,f){return /^#[0-9a-f]{6}$/i.test(v||'')?v:f}
  function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function escAttr(s=''){return String(s).replace(/[^a-z0-9_-]/gi,'')}function escXML(s=''){return esc(s)}function slug(s=''){return String(s).trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g,'-').replace(/^-+|-+$/g,'')||'label'}

  document.addEventListener('DOMContentLoaded',init);
})();
