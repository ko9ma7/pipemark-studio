
(() => {
  'use strict';
  const C = window.PM_CATALOG;
  const STORAGE_KEY='pipemark-studio-v4-state';
  const PROJECTS_KEY='pipemark-studio-v4-projects';
  const ICONS_KEY='pipemark-studio-v4-icons';
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

  const $=id=>document.getElementById(id);
  const qsa=s=>[...document.querySelectorAll(s)];
  const deep=v=>JSON.parse(JSON.stringify(v));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
  const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=(s='')=>String(s).trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g,'-').replace(/^-+|-+$/g,'')||'label';

  let persistAvailable=true;
  let customIcons=loadJSON(ICONS_KEY,[]);
  let projects=loadJSON(PROJECTS_KEY,{});
  let state=loadState();
  let selectedObject=null;
  let directEdit=false;
  let editingId=null;
  let currentView='edit';
  let gesture=null;

  function loadJSON(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch(e){persistAvailable=false;return fallback}}
  function saveLocal(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));localStorage.setItem(ICONS_KEY,JSON.stringify(customIcons));localStorage.setItem(PROJECTS_KEY,JSON.stringify(projects));persistAvailable=true}catch(e){persistAvailable=false}renderSaveStatus()}
  function renderSaveStatus(){const el=$('save-status');if(!el)return;el.innerHTML=persistAvailable?'<i></i> 이 PC 자동 저장':'저장 제한 · JSON 백업 권장'}

  function defaultState(){
    return {projectName:'기본 현장',categoryId:'pipe',templateId:'pipe-water',kind:'pipe',familyId:'pvc-vp',specId:'VP-20',purposeId:'water',pipeSizeMode:'compact',direction:'right',style:'pipe-arrow',signSizeProfile:'near',
      width:90,height:25,fill:'#168A5B',accent:'#0B5137',textColor:'#FFFFFF',tone:'pipe',mainText:'용수 WATER',subText:'',iconId:'droplet',quantity:1,padding:'normal',
      elements:defaultElements('pipe',90,25),queue:[],paperSize:'A4',paperOrientation:'auto',paperGap:4};
  }
  function loadState(){const d=defaultState();const s=loadJSON(STORAGE_KEY,null);return s?{...d,...s,elements:{...d.elements,...(s.elements||{})},queue:Array.isArray(s.queue)?s.queue:[]}:d}

  function defaultElements(kind,w,h,style='panel'){
    if(kind==='pipe') return {
      icon:{x:13,y:50,size:55,rotate:0,visible:true},
      main:{x:51,y:50,width:55,fontSize:Math.max(6,Math.min(12,h*.38)),weight:900,align:'center',spacing:-.02,rotate:0},
      sub:{x:51,y:73,width:55,fontSize:Math.max(3.5,h*.13),weight:700,align:'center',spacing:.02,rotate:0,visible:false}
    };
    if(style==='round') return {icon:{x:50,y:32,size:32,rotate:0,visible:true},main:{x:50,y:60,width:72,fontSize:Math.max(8,h*.18),weight:900,align:'center',spacing:-.02,rotate:0},sub:{x:50,y:76,width:70,fontSize:Math.max(4,h*.08),weight:700,align:'center',spacing:.01,rotate:0,visible:true}};
    return {icon:{x:18,y:53,size:48,rotate:0,visible:true},main:{x:62,y:49,width:60,fontSize:Math.max(8,Math.min(15,h*.22)),weight:900,align:'center',spacing:-.02,rotate:0},sub:{x:62,y:70,width:60,fontSize:Math.max(4,Math.min(7,h*.095)),weight:700,align:'center',spacing:.02,rotate:0,visible:true}};
  }

  function getTemplate(id=state.templateId){return C.templates.find(x=>x.id===id)||C.templates[0]}
  function getFamily(){return C.pipeFamilies.find(x=>x.id===state.familyId)||C.pipeFamilies[0]}
  function getSpec(){return getFamily().items.find(x=>x.id===state.specId)||getFamily().items[0]}
  function getPurpose(){return C.pipePurposes.find(x=>x.id===state.purposeId)||C.pipePurposes[0]}
  function getSizeProfile(){return C.signSizeProfiles.find(x=>x.id===state.signSizeProfile)||C.signSizeProfiles[1]}
  function allIcons(){const out={...ICONS};customIcons.forEach(i=>out[i.id]={label:i.name,svg:i.svg,custom:true});return out}

  function applyTemplate(id,keepQueue=true){
    const t=getTemplate(id);state.templateId=t.id;state.categoryId=t.category;state.kind=t.kind;state.mainText=t.text;state.subText=t.subtext||'';state.iconId=t.icon||'tag';state.style=t.style||'panel';state.tone=t.tone||'neutral';
    if(t.kind==='pipe'){
      state.purposeId=t.purposeId||'water';const p=getPurpose();state.fill=p.fill;state.accent=p.stroke;state.textColor=p.text;state.direction='right';state.pipeSizeMode=state.pipeSizeMode||'compact';applyPipeSize();
    }else{
      const tone=C.tones[t.tone]||C.tones.neutral;state.fill=tone.fill;state.accent=tone.accent;state.textColor=tone.text;state.signSizeProfile=t.sizeProfile||'near';const s=C.signSizeProfiles.find(x=>x.id===state.signSizeProfile)||getSizeProfile();state.width=t.width||s.w;state.height=t.height||s.h;state.elements=defaultElements('sign',state.width,state.height,state.style);
    }
    selectedObject=null;directEdit=false;renderAll();
  }

  function applyPipeSize(){
    const spec=getSpec();const od=num(spec.od,26);const mode=state.pipeSizeMode;
    let w=90,h=25,font=9;
    if(mode==='compact'){
      if(od<=33){w=90;h=25;font=9}else if(od<=61){w=110;h=30;font=11}else if(od<=170){w=130;h=36;font=13}else if(od<=254){w=160;h=44;font=16}else{w=190;h=52;font=19}
    }else if(mode==='asme'){
      if(od<=33){w=200;h=30;font=13}else if(od<=61){w=200;h=38;font=19}else if(od<=170){w=300;h=58;font=32}else if(od<=254){w=600;h=90;font=64}else{w=800;h=120;font=89}
    }else{return}
    state.width=w;state.height=h;state.elements=defaultElements('pipe',w,h,state.style);state.elements.main.fontSize=Math.min(font,h*.55);
  }

  function applyPurpose(id){state.purposeId=id;const p=getPurpose();state.fill=p.fill;state.accent=p.stroke;state.textColor=p.text;state.iconId=p.icon;state.mainText=p.defaultText;renderAll()}
  function applySignProfile(id){state.signSizeProfile=id;if(id!=='custom'){const s=getSizeProfile();state.width=s.w;state.height=s.h;state.elements=defaultElements('sign',state.width,state.height,state.style)}renderAll()}

  function renderAll(){renderSelectors();renderShortcuts();renderStage();renderInspector();renderQueue();renderSheet();renderSaveStatus();saveLocal()}

  function renderSelectors(){
    $('project-name').value=state.projectName;
    $('category-select').innerHTML=C.categories.map(c=>`<option value="${c.id}">${esc(c.label)}</option>`).join('');$('category-select').value=state.categoryId;
    const templates=C.templates.filter(t=>t.category===state.categoryId);$('template-select').innerHTML=templates.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join('');if(!templates.some(t=>t.id===state.templateId)){state.templateId=templates[0]?.id||C.templates[0].id}$('template-select').value=state.templateId;
    $('pipe-options').hidden=state.kind!=='pipe';$('sign-options').hidden=state.kind==='pipe';
    if(state.kind==='pipe'){
      $('pipe-family').innerHTML=C.pipeFamilies.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('');$('pipe-family').value=state.familyId;
      const family=getFamily();$('pipe-spec').innerHTML=family.items.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('');if(!family.items.some(s=>s.id===state.specId))state.specId=family.items[0].id;$('pipe-spec').value=state.specId;
      $('pipe-purpose').innerHTML=C.pipePurposes.map(p=>`<option value="${p.id}">${esc(p.label)}</option>`).join('');$('pipe-purpose').value=state.purposeId;
      $('pipe-size-mode').innerHTML=C.pipeSizingModes.map(m=>`<option value="${m.id}">${esc(m.label)}</option>`).join('');$('pipe-size-mode').value=state.pipeSizeMode;
      $('pipe-direction').value=state.direction;$('pipe-style').value=state.style;
      const sp=getSpec();const mode=C.pipeSizingModes.find(x=>x.id===state.pipeSizeMode);$('pipe-standard-note').innerHTML=`<b>${esc(sp.label)}</b> · ${sp.od?`외경 ${sp.od} mm · `:''}${esc(getFamily().standard)}<br>${esc(mode?.desc||'')}`;
    } else {
      $('sign-size-profile').innerHTML=C.signSizeProfiles.map(s=>`<option value="${s.id}">${esc(s.label)} — ${s.w}×${s.h} mm</option>`).join('');$('sign-size-profile').value=state.signSizeProfile;
      const s=getSizeProfile();$('sign-size-note').innerHTML=`<b>${esc(s.label)}</b> · ${esc(s.desc)}<br>기본 ${s.w} × ${s.h} mm · 설치거리/현장 규정에 따라 직접 편집 가능`;$('sign-style').value=state.style;
    }
    $('main-text').value=state.mainText;$('sub-text').value=state.subText;$('quantity').value=state.quantity;$('label-padding').value=state.padding;
    $('label-width').value=state.width;$('label-height').value=state.height;$('fill-color').value=validColor(state.fill,'#ffffff');$('accent-color').value=validColor(state.accent,'#26323a');$('text-color').value=validColor(state.textColor,'#111827');
    $('advanced-panel').hidden=!directEdit;$('btn-custom-edit').classList.toggle('open',directEdit);$('btn-custom-edit').querySelector('b').textContent=directEdit?'닫기':'열기';$('btn-custom-edit-top').classList.toggle('active',directEdit);$('btn-custom-edit-top').textContent=directEdit?'직접 편집 종료':'직접 편집';$('drag-help').hidden=!directEdit;
    $('current-title').textContent=getTemplate().name;$('current-meta').textContent=`${state.width} × ${state.height} mm · ${state.kind==='pipe'?'배관 마커':'산업 표지'}`;
    $('btn-add').textContent=editingId?'수정 내용 저장':'출력 목록에 추가';
  }

  function renderShortcuts(){const list=C.templates.filter(t=>t.category===state.categoryId).slice(0,6);$('template-shortcuts').innerHTML=list.map(t=>`<button class="shortcut ${t.id===state.templateId?'active':''}" data-template="${t.id}" type="button"><strong>${esc(t.name)}</strong><span>${esc(t.text)}</span></button>`).join('')}

  function fitFont(text,obj,label){const len=[...String(text||'')].reduce((n,c)=>n+(c.charCodeAt(0)>127?1:.62),0)||1;const availableMm=label.width*(obj.width/100);return Math.max(2.6,Math.min(obj.fontSize,availableMm/(len*.72)))}

  function createStage(label,interactive=false,scaleOverride=null){
    const stage=document.createElement('div');stage.className='label-stage'+(interactive&&directEdit?' editing':'');stage.dataset.interactive=interactive?'1':'0';
    const maxW=interactive?Math.min(760,window.innerWidth-430):label.width*2;const maxH=interactive?390:label.height*2;const scale=scaleOverride||Math.min(4,maxW/label.width,maxH/label.height);stage.dataset.scale=String(scale);stage.style.width=`${label.width*scale}px`;stage.style.height=`${label.height*scale}px`;
    const art=document.createElement('div');let style=label.style||'panel';if(label.kind==='pipe'&&label.direction==='none'&&style==='pipe-arrow')style='pipe-outline';art.className=`label-art ${style} ${label.direction||''}`;art.style.setProperty('--label-fill',label.fill);art.style.setProperty('--label-accent',label.accent);art.style.setProperty('--label-text',label.textColor);art.style.setProperty('--label-border',`${Math.max(1,scale*.28)}px`);
    if(style==='signal'){const sig={danger:'위험 / DANGER',warning:'경고 / WARNING',prohibition:'금지 / PROHIBITION',mandatory:'지시 / MANDATORY',emergency:'비상 / EMERGENCY',fire:'소방 / FIRE'}[label.tone]||'주의 / CAUTION';art.innerHTML=`<div class="signal-strip">${sig}</div>`;}stage.appendChild(art);
    const elements=label.elements||defaultElements(label.kind,label.width,label.height,label.style);const icons=allIcons();
    const addObj=(key)=>{
      const o=elements[key];if(!o||o.visible===false)return;const el=document.createElement('div');el.className=`label-object ${key==='icon'?'icon':'text '+key}${interactive&&selectedObject===key?' selected':''}`;el.dataset.object=key;el.style.left=`${o.x}%`;el.style.top=`${o.y}%`;el.style.setProperty('--rot',`${o.rotate||0}deg`);el.style.color=label.textColor;
      if(key==='icon'){
        const px=label.height*scale*(o.size/100);el.style.width=`${px}px`;el.style.height=`${px}px`;el.innerHTML=icons[label.iconId]?.svg||'';
      }else{
        const text=key==='main'?label.mainText:label.subText;if(!text)return;const fs=fitFont(text,o,label)*scale;el.style.width=`${o.width}%`;el.style.fontSize=`${fs}px`;el.style.fontWeight=o.weight||700;el.style.textAlign=o.align||'center';el.style.justifyContent=o.align==='left'?'flex-start':o.align==='right'?'flex-end':'center';el.style.letterSpacing=`${o.spacing||0}em`;el.textContent=text;
      }
      if(interactive&&directEdit){el.innerHTML+=`<i class="handle resize" data-handle="resize"></i><i class="handle rotate" data-handle="rotate"></i>`}
      stage.appendChild(el);
    };
    addObj('icon');addObj('main');addObj('sub');return stage;
  }

  function currentLabel(){return {kind:state.kind,tone:state.tone,width:num(state.width,120),height:num(state.height,60),style:state.style,direction:state.direction,fill:state.fill,accent:state.accent,textColor:state.textColor,mainText:state.mainText,subText:state.subText,iconId:state.iconId,elements:deep(state.elements),templateId:state.templateId,purposeId:state.purposeId,familyId:state.familyId,specId:state.specId,pipeSizeMode:state.pipeSizeMode,signSizeProfile:state.signSizeProfile,padding:state.padding}}
  function renderStage(){const stage=$('label-stage');stage.replaceWith(createStage(currentLabel(),true));const newStage=document.querySelector('.canvas-wrap > .label-stage');newStage.id='label-stage';bindStage(newStage);$('canvas-hint-text').textContent=directEdit?'객체를 클릭해 이동·크기조절·회전하세요. 글자는 더블클릭하면 바로 수정됩니다.':'기본값 그대로 출력 가능 · 필요할 때만 직접 편집을 여세요.'}

  function markSelection(stage,key){
    stage.querySelectorAll('.label-object').forEach(el=>el.classList.toggle('selected',el.dataset.object===key));
  }
  function refreshLiveObject(key){
    const stage=$('label-stage');if(!stage)return;const el=stage.querySelector(`[data-object="${key}"]`);if(!el)return;const o=state.elements[key];const scale=num(stage.dataset.scale,1);
    el.style.left=`${o.x}%`;el.style.top=`${o.y}%`;el.style.setProperty('--rot',`${o.rotate||0}deg`);
    if(key==='icon'){
      const px=state.height*scale*(o.size/100);el.style.width=`${px}px`;el.style.height=`${px}px`;
    }else{
      const text=key==='main'?state.mainText:state.subText;el.style.width=`${o.width}%`;el.style.fontSize=`${fitFont(text,o,currentLabel())*scale}px`;el.style.fontWeight=o.weight||700;el.style.textAlign=o.align||'center';el.style.justifyContent=o.align==='left'?'flex-start':o.align==='right'?'flex-end':'center';el.style.letterSpacing=`${o.spacing||0}em`;
    }
  }
  function bindStage(stage){
    stage.addEventListener('pointerdown',e=>{
      if(!directEdit)return;const obj=e.target.closest('.label-object');if(!obj)return;e.preventDefault();e.stopPropagation();
      const key=obj.dataset.object;selectedObject=key;markSelection(stage,key);renderInspector();
      const handle=e.target.dataset.handle||null;const rect=stage.getBoundingClientRect();const o=state.elements[key];const center={x:rect.left+rect.width*o.x/100,y:rect.top+rect.height*o.y/100};
      gesture={type:handle||'drag',key,startX:e.clientX,startY:e.clientY,orig:deep(o),rect,center,pointerId:e.pointerId};
      try{obj.setPointerCapture(e.pointerId)}catch(_){ }
    });
    stage.addEventListener('dblclick',e=>{
      if(!directEdit)return;const obj=e.target.closest('.label-object.text');if(!obj)return;e.preventDefault();e.stopPropagation();
      const key=obj.dataset.object;selectedObject=key;markSelection(stage,key);renderInspector();
      obj.contentEditable='true';obj.spellcheck=false;obj.focus();
      const handles=[...obj.querySelectorAll('.handle')];handles.forEach(h=>h.style.display='none');
      const range=document.createRange();range.selectNodeContents(obj);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
      obj.addEventListener('blur',()=>{
        obj.contentEditable='false';const clone=obj.cloneNode(true);clone.querySelectorAll('.handle').forEach(h=>h.remove());const txt=clone.textContent.trim();
        if(key==='main')state.mainText=txt;else state.subText=txt;renderAll();
      },{once:true});
    });
  }
  document.addEventListener('pointermove',e=>{
    if(!gesture)return;const {type,key,orig,rect,center}=gesture;const o=state.elements[key];
    if(type==='drag'){
      o.x=clamp(orig.x+(e.clientX-gesture.startX)/rect.width*100,0,100);o.y=clamp(orig.y+(e.clientY-gesture.startY)/rect.height*100,0,100);
    }else if(type==='resize'){
      const dx=e.clientX-gesture.startX,dy=e.clientY-gesture.startY;const delta=Math.abs(dx)>Math.abs(dy)?dx:dy;
      if(key==='icon')o.size=clamp(orig.size+delta/Math.min(rect.width,rect.height)*100,5,120);else o.fontSize=clamp(orig.fontSize+delta/rect.height*state.height,2,80);
    }else if(type==='rotate'){
      o.rotate=Math.round(Math.atan2(e.clientY-center.y,e.clientX-center.x)*180/Math.PI+90);
    }
    refreshLiveObject(key);renderInspector(false);
  });
  document.addEventListener('pointerup',()=>{if(gesture){gesture=null;saveLocal();renderStage();renderInspector()}});

  function renderInspector(rerender=true){const empty=$('selection-empty'),box=$('object-inspector');if(!directEdit||!selectedObject){empty.hidden=false;box.hidden=true;return}empty.hidden=true;box.hidden=false;qsa('.object-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.object===selectedObject));const o=state.elements[selectedObject];$('obj-x').value=round1(o.x);$('obj-y').value=round1(o.y);$('obj-rotate').value=Math.round(o.rotate||0);$('obj-size').value=round1(selectedObject==='icon'?o.size:o.fontSize);$('text-inspector').hidden=selectedObject==='icon';$('icon-inspector').hidden=selectedObject!=='icon';if(selectedObject!=='icon'){$('obj-weight').value=String(o.weight||700);$('obj-align').value=o.align||'center';$('obj-spacing').value=o.spacing||0;$('obj-width').value=o.width||60}else{const icons=allIcons();$('icon-select').innerHTML=Object.entries(icons).map(([id,v])=>`<option value="${id}">${esc(v.label)}</option>`).join('');$('icon-select').value=state.iconId}}

  function updateObjectFromInspector(){if(!selectedObject)return;const o=state.elements[selectedObject];o.x=clamp(num($('obj-x').value,o.x),0,100);o.y=clamp(num($('obj-y').value,o.y),0,100);o.rotate=num($('obj-rotate').value,o.rotate);if(selectedObject==='icon')o.size=clamp(num($('obj-size').value,o.size),5,120);else{o.fontSize=clamp(num($('obj-size').value,o.fontSize),2,80);o.weight=num($('obj-weight').value,o.weight);o.align=$('obj-align').value;o.spacing=num($('obj-spacing').value,o.spacing);o.width=clamp(num($('obj-width').value,o.width),10,100)}renderStage();saveLocal()}

  function resetLayout(){state.elements=defaultElements(state.kind,state.width,state.height,state.style);selectedObject=null;renderAll()}

  function renderQueue(){const list=$('queue-list');$('queue-count').textContent=state.queue.reduce((n,q)=>n+(q.qty||1),0);if(!state.queue.length){list.innerHTML='<div class="queue-empty">아직 출력할 라벨이 없습니다.<br>기본값을 고른 뒤 바로 추가해 보세요.</div>';return}list.innerHTML='';state.queue.forEach(item=>{const row=document.createElement('div');row.className='queue-item'+(editingId===item.id?' editing-item':'');row.dataset.id=item.id;const thumb=document.createElement('div');thumb.className='queue-thumb';const s=createStage(item.label,false,0.55);s.classList.add('mini');thumb.appendChild(s);const info=document.createElement('div');info.innerHTML=`<strong>${esc(item.label.mainText)}</strong><span>${item.label.width} × ${item.label.height} mm · ${item.qty}장</span>`;const buttons=document.createElement('div');buttons.className='queue-buttons';buttons.innerHTML='<button data-action="edit">수정</button><button data-action="copy">복제</button><button class="danger" data-action="delete">삭제</button>';row.append(thumb,info,buttons);list.appendChild(row)})}

  function addOrUpdate(){const snap=currentLabel();const qty=Math.max(1,num(state.quantity,1));if(editingId){const idx=state.queue.findIndex(x=>x.id===editingId);if(idx>=0)state.queue[idx]={...state.queue[idx],label:deep(snap),qty};editingId=null;toast('목록 항목을 수정했습니다.')}else{state.queue.push({id:Date.now(),qty,label:deep(snap)}) ;toast('출력 목록에 추가했습니다.')}renderAll()}
  function editQueue(id){const item=state.queue.find(x=>x.id===id);if(!item)return;const l=deep(item.label);Object.assign(state,l);state.elements=deep(l.elements);state.quantity=item.qty;state.kind=l.kind;state.categoryId=getTemplate(l.templateId)?.category||state.categoryId;editingId=id;directEdit=true;selectedObject=null;renderAll();document.querySelector('.quick-panel').scrollTo({top:0,behavior:'smooth'})}

  function paperDims(size,orient){const base=size==='A3'?[297,420]:[210,297];return orient==='landscape'?[base[1],base[0]]:base}
  function expandQueue(){const out=[];state.queue.forEach(q=>{for(let i=0;i<(q.qty||1);i++)out.push(q.label)});return out}
  function packLabels(labels,size,orientation,gap){const [pw,ph]=paperDims(size,orientation);const m=8,uw=pw-m*2,uh=ph-m*2;let pages=[[]],x=m,y=m,rowH=0;for(const label of labels){const w=label.width,h=label.height;if(w>uw||h>uh){pages[pages.length-1].push({label,x:m,y:m,overflow:true});pages.push([]);x=m;y=m;rowH=0;continue}if(x>m&&x+w>m+uw){x=m;y+=rowH+gap;rowH=0}if(y>m&&y+h>m+uh){pages.push([]);x=m;y=m;rowH=0}pages[pages.length-1].push({label,x,y});x+=w+gap;rowH=Math.max(rowH,h)}if(pages.length>1&&!pages.at(-1).length)pages.pop();return {pages,pw,ph,orientation}}
  function choosePlan(labels){const gap=num(state.paperGap,4);if(state.paperOrientation!=='auto')return packLabels(labels,state.paperSize,state.paperOrientation,gap);const p=packLabels(labels,state.paperSize,'portrait',gap),l=packLabels(labels,state.paperSize,'landscape',gap);if(l.pages.length<p.pages.length)return l;if(p.pages.length<l.pages.length)return p;const fill=plan=>plan.pages.reduce((n,p)=>n+p.length,0)/plan.pages.length;return fill(l)>fill(p)?l:p}
  function renderSheet(){if(currentView!=='sheet')return;const labels=expandQueue();const preview=labels.length?labels:[currentLabel()];const plan=choosePlan(preview);$('paper-size').value=state.paperSize;$('paper-orientation').value=state.paperOrientation;$('paper-gap').value=state.paperGap;const firstPage=plan.pages[0]||[];const xs=[...new Set(firstPage.map(x=>x.x))];const ys=[...new Set(firstPage.map(x=>x.y))];const gridInfo=firstPage.length?`${xs.length}열 × ${ys.length}행`:'';$('sheet-plan').textContent=`${plan.orientation==='portrait'?'세로':'가로'} · ${gridInfo}${gridInfo?' · ':''}${labels.length?plan.pages.length:'미리보기'}페이지 · 자동 배치`;$('print-style').textContent=`@page{size:${state.paperSize} ${plan.orientation};margin:0}`;const host=$('paper-preview');host.innerHTML='';plan.pages.forEach((items,pi)=>{const page=document.createElement('div');page.className='paper-page';page.style.width=`${plan.pw}mm`;page.style.height=`${plan.ph}mm`;page.style.setProperty('--paper-gap',`${state.paperGap}mm`);items.forEach(it=>{const wrap=document.createElement('div');wrap.className='print-label';wrap.style.left=`${it.x}mm`;wrap.style.top=`${it.y}mm`;wrap.style.width=`${it.label.width}mm`;wrap.style.height=`${it.label.height}mm`;wrap.appendChild(createStage(it.label,false,96/25.4));page.appendChild(wrap)});const ix=document.createElement('span');ix.className='page-index';ix.textContent=`${pi+1} / ${plan.pages.length}`;page.appendChild(ix);host.appendChild(page)})}

  function exportProject(){downloadText(`${slug(state.projectName)}-pipemark-v4.json`,JSON.stringify({type:'PipeMarkStudio_V4',version:4,exportedAt:new Date().toISOString(),state,customIcons},null,2),'application/json')}
  async function importProject(file){try{const data=JSON.parse(await file.text());if(data.type!=='PipeMarkStudio_V4'||!data.state)throw new Error('v4 프로젝트 백업 파일이 아닙니다.');state={...defaultState(),...data.state};customIcons=Array.isArray(data.customIcons)?data.customIcons:[];editingId=null;selectedObject=null;directEdit=false;renderAll();toast('프로젝트를 불러왔습니다.')}catch(e){toast(`불러오기 실패: ${e.message}`,'error')}}
  function saveProjectAs(){const name=$('project-save-name').value.trim()||state.projectName||'새 현장';const id=slug(name)+'-'+Date.now().toString(36);projects[id]={name,savedAt:new Date().toISOString(),state:deep(state),customIcons:deep(customIcons)};saveLocal();renderProjectList();toast('이 PC에 현장을 저장했습니다.')}
  function renderProjectList(){const entries=Object.entries(projects).sort((a,b)=>String(b[1].savedAt).localeCompare(String(a[1].savedAt)));$('project-list').innerHTML=entries.length?entries.map(([id,p])=>`<div class="project-item"><div><strong>${esc(p.name)}</strong><span>${new Date(p.savedAt).toLocaleString('ko-KR')} · ${(p.state?.queue||[]).length}종</span></div><div><button data-load="${id}" type="button">불러오기</button><button data-delete="${id}" type="button">삭제</button></div></div>`).join(''):'<div class="selection-empty">저장된 현장이 없습니다.</div>'}

  function sanitizeSvg(raw){const doc=new DOMParser().parseFromString(raw,'image/svg+xml');if(doc.querySelector('parsererror'))throw new Error('유효한 SVG가 아닙니다.');doc.querySelectorAll('script,foreignObject,iframe,object,embed,link,style').forEach(n=>n.remove());doc.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=a.value.trim().toLowerCase();if(n.startsWith('on')||((n==='href'||n==='xlink:href'||n==='src')&&(v.startsWith('http:')||v.startsWith('https:')||v.startsWith('javascript:')||v.startsWith('data:'))))el.removeAttribute(a.name)}));const svg=doc.documentElement;svg.removeAttribute('width');svg.removeAttribute('height');if(!svg.getAttribute('viewBox'))svg.setAttribute('viewBox','0 0 24 24');return new XMLSerializer().serializeToString(svg)}
  async function addSvg(file){if(!file)return;try{const svg=sanitizeSvg(await file.text());const name=file.name.replace(/\.svg$/i,'');const id='user-'+slug(name)+'-'+Date.now().toString(36);customIcons.push({id,name,svg});state.iconId=id;state.elements.icon.visible=true;selectedObject='icon';renderAll();toast('SVG를 추가했습니다. 이제 미리보기에서 직접 이동·크기조절·회전할 수 있습니다.')}catch(e){toast(e.message,'error')}}

  function bind(){
    $('category-select').addEventListener('change',e=>{state.categoryId=e.target.value;const t=C.templates.find(x=>x.category===state.categoryId);if(t)applyTemplate(t.id)});
    $('template-select').addEventListener('change',e=>applyTemplate(e.target.value));$('template-shortcuts').addEventListener('click',e=>{const b=e.target.closest('[data-template]');if(b)applyTemplate(b.dataset.template)});
    $('pipe-family').addEventListener('change',e=>{state.familyId=e.target.value;state.specId=getFamily().items[0].id;if(state.pipeSizeMode!=='custom')applyPipeSize();renderAll()});$('pipe-spec').addEventListener('change',e=>{state.specId=e.target.value;if(state.pipeSizeMode!=='custom')applyPipeSize();renderAll()});$('pipe-purpose').addEventListener('change',e=>applyPurpose(e.target.value));$('pipe-size-mode').addEventListener('change',e=>{state.pipeSizeMode=e.target.value;if(state.pipeSizeMode!=='custom')applyPipeSize();renderAll()});$('pipe-direction').addEventListener('change',e=>{state.direction=e.target.value;renderAll()});$('pipe-style').addEventListener('change',e=>{state.style=e.target.value;renderAll()});
    $('sign-size-profile').addEventListener('change',e=>applySignProfile(e.target.value));$('sign-style').addEventListener('change',e=>{state.style=e.target.value;state.elements=defaultElements('sign',state.width,state.height,state.style);renderAll()});
    $('main-text').addEventListener('input',e=>{state.mainText=e.target.value;renderStage();saveLocal()});$('sub-text').addEventListener('input',e=>{state.subText=e.target.value;state.elements.sub.visible=!!state.subText;renderStage();saveLocal()});$('quantity').addEventListener('input',e=>{state.quantity=Math.max(1,num(e.target.value,1));saveLocal()});$('label-padding').addEventListener('change',e=>{state.padding=e.target.value;saveLocal()});
    const toggleDirectEdit=()=>{directEdit=!directEdit;if(!directEdit)selectedObject=null;renderAll();if(directEdit)setTimeout(()=>$('advanced-panel').scrollIntoView({block:'nearest',behavior:'smooth'}),30)};$('btn-custom-edit').addEventListener('click',toggleDirectEdit);$('btn-custom-edit-top').addEventListener('click',toggleDirectEdit);$('btn-reset-layout').addEventListener('click',resetLayout);
    $('label-width').addEventListener('input',e=>{state.width=Math.max(20,num(e.target.value,state.width));if(state.kind==='pipe')state.pipeSizeMode='custom';else state.signSizeProfile='custom';renderAll()});$('label-height').addEventListener('input',e=>{state.height=Math.max(10,num(e.target.value,state.height));if(state.kind==='pipe')state.pipeSizeMode='custom';else state.signSizeProfile='custom';renderAll()});
    $('fill-color').addEventListener('input',e=>{state.fill=e.target.value;renderStage();saveLocal()});$('accent-color').addEventListener('input',e=>{state.accent=e.target.value;renderStage();saveLocal()});$('text-color').addEventListener('input',e=>{state.textColor=e.target.value;renderStage();saveLocal()});
    qsa('.object-tabs button').forEach(b=>b.addEventListener('click',()=>{selectedObject=b.dataset.object;renderStage();renderInspector()}));['obj-x','obj-y','obj-size','obj-rotate','obj-weight','obj-align','obj-spacing','obj-width'].forEach(id=>$(id).addEventListener('input',updateObjectFromInspector));$('icon-select').addEventListener('change',e=>{state.iconId=e.target.value;state.elements.icon.visible=e.target.value!=='none';renderStage();saveLocal()});$('btn-icon-hide').addEventListener('click',()=>{state.elements.icon.visible=false;renderAll()});$('btn-svg-upload').addEventListener('click',()=>$('svg-file').click());$('svg-file').addEventListener('change',e=>{addSvg(e.target.files[0]);e.target.value=''});
    $('btn-add').addEventListener('click',addOrUpdate);$('btn-duplicate').addEventListener('click',()=>{state.queue.push({id:Date.now(),qty:Math.max(1,num(state.quantity,1)),label:deep(currentLabel())});renderAll();toast('현재 라벨 사본을 목록에 추가했습니다.')});$('btn-clear').addEventListener('click',()=>{if(state.queue.length&&confirm('출력 목록을 모두 삭제할까요?')){state.queue=[];editingId=null;renderAll()}});
    $('queue-list').addEventListener('click',e=>{const row=e.target.closest('.queue-item'),b=e.target.closest('[data-action]');if(!row||!b)return;const id=num(row.dataset.id);const idx=state.queue.findIndex(x=>x.id===id);if(idx<0)return;if(b.dataset.action==='edit')editQueue(id);if(b.dataset.action==='copy'){const c=deep(state.queue[idx]);c.id=Date.now();state.queue.splice(idx+1,0,c);renderAll()}if(b.dataset.action==='delete'){state.queue.splice(idx,1);if(editingId===id)editingId=null;renderAll()}});
    qsa('[data-view]').forEach(b=>b.addEventListener('click',()=>{currentView=b.dataset.view;qsa('[data-view]').forEach(x=>x.classList.toggle('active',x===b));$('edit-view').hidden=currentView!=='edit';$('sheet-view').hidden=currentView!=='sheet';renderSheet()}));$('paper-size').addEventListener('change',e=>{state.paperSize=e.target.value;renderSheet();saveLocal()});$('paper-orientation').addEventListener('change',e=>{state.paperOrientation=e.target.value;renderSheet();saveLocal()});$('paper-gap').addEventListener('change',e=>{state.paperGap=num(e.target.value,4);renderSheet();saveLocal()});
    $('project-name').addEventListener('input',e=>{state.projectName=e.target.value;saveLocal()});$('btn-export').addEventListener('click',exportProject);$('btn-import').addEventListener('click',()=>$('file-import').click());$('file-import').addEventListener('change',e=>{importProject(e.target.files[0]);e.target.value=''});$('btn-save-project').addEventListener('click',()=>{$('project-save-name').value=state.projectName;renderProjectList();$('projects-dialog').showModal()});$('btn-projects').addEventListener('click',()=>{renderProjectList();$('projects-dialog').showModal()});$('btn-project-save-as').addEventListener('click',saveProjectAs);$('project-list').addEventListener('click',e=>{const l=e.target.closest('[data-load]'),d=e.target.closest('[data-delete]');if(l){const p=projects[l.dataset.load];if(p){state={...defaultState(),...deep(p.state)};customIcons=deep(p.customIcons||[]);editingId=null;directEdit=false;selectedObject=null;$('projects-dialog').close();renderAll()}}if(d&&confirm('이 현장 저장본을 삭제할까요?')){delete projects[d.dataset.delete];saveLocal();renderProjectList()}});
    $('btn-print').addEventListener('click',()=>{if(!state.queue.length){toast('먼저 출력 목록에 라벨을 추가하세요.','error');return}currentView='sheet';$('edit-view').hidden=true;$('sheet-view').hidden=false;renderSheet();setTimeout(()=>window.print(),120)});
  }

  function init(){if(!C)return;bind();const t=getTemplate();if(!t){state=defaultState()}else{state.kind=t.kind}renderAll();if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{})}
  function validColor(v,f){return /^#[0-9a-f]{6}$/i.test(v||'')?v:f}function round1(v){return Math.round(v*10)/10}
  function toast(message,type='success'){const d=document.createElement('div');d.className=`toast ${type}`;d.textContent=message;$('toast-region').appendChild(d);setTimeout(()=>d.remove(),3200)}
  function downloadText(name,text,type){const b=new Blob([text],{type});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),500)}
  init();
})();
