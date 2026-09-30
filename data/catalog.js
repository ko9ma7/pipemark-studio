(() => {
  const pipeFamilies = [
    {id:'pvc-vp',name:'PVC VP',geometry:'round',standard:'JIS K 6741 계열 참고',items:[['13',18],['16',22],['20',26],['25',32],['30',38],['40',48],['50',60],['65',76],['75',89],['100',114],['125',140],['150',165],['200',216],['250',267],['300',318]].map(([n,od])=>({id:`VP-${n}`,label:`VP ${n}`,nominal:n,od}))},
    {id:'pvc-vu',name:'PVC VU',geometry:'round',standard:'JIS K 6741 계열 참고',items:[['40',48],['50',60],['65',76],['75',89],['100',114],['125',140],['150',165],['200',216],['250',267],['300',318]].map(([n,od])=>({id:`VU-${n}`,label:`VU ${n}`,nominal:n,od}))},
    {id:'steel-sgp',name:'강관 SGP',geometry:'round',standard:'JIS G 3452 계열 참고',items:[['15A',21.7],['20A',27.2],['25A',34],['32A',42.7],['40A',48.6],['50A',60.5],['65A',76.3],['80A',89.1],['90A',101.6],['100A',114.3],['125A',139.8],['150A',165.2],['200A',216.3],['250A',267.4],['300A',318.5]].map(([n,od])=>({id:`SGP-${n}`,label:`SGP ${n}`,nominal:n,od}))},
    {id:'sus',name:'SUS 배관',geometry:'round',standard:'JIS 계열 외경 참고',items:[['15A',21.7],['20A',27.2],['25A',34],['32A',42.7],['40A',48.6],['50A',60.5],['65A',76.3],['80A',89.1],['100A',114.3],['125A',139.8],['150A',165.2],['200A',216.3]].map(([n,od])=>({id:`SUS-${n}`,label:`SUS ${n}`,nominal:n,od}))},
    {id:'square',name:'정사각 각관',geometry:'rect',standard:'일반 규격 예시',items:[20,25,30,40,50,60,75,80,100,125,150,200].map(a=>({id:`SQ-${a}`,label:`${a} × ${a} mm`,a,b:a}))},
    {id:'rect',name:'직사각 각관',geometry:'rect',standard:'일반 규격 예시',items:[[30,20],[40,20],[40,25],[50,25],[50,30],[60,30],[75,45],[80,40],[100,50],[100,75],[125,75],[150,100],[200,100]].map(([a,b])=>({id:`RT-${a}-${b}`,label:`${a} × ${b} mm`,a,b}))},
    {id:'custom-round',name:'원형 직접 입력',geometry:'round',standard:'사용자 입력',items:[{id:'CUSTOM-R',label:'외경 직접 입력',nominal:'직접',od:26,custom:true}]},
    {id:'custom-flat',name:'평면 직접 입력',geometry:'flat',standard:'사용자 입력',items:[{id:'CUSTOM-F',label:'면 크기 직접 입력',a:100,b:50,custom:true}]}
  ];

  const pipePurposes = [
    ['water','일반 용수','용수','WATER','#14895C','#0A5A3B','#FFFFFF','droplet'],
    ['potable','상수 / 음용수','상수','POTABLE WATER','#14895C','#0A5A3B','#FFFFFF','droplet'],
    ['cooling','냉각수','냉각수','COOLING WATER','#128B63','#075B42','#FFFFFF','snow'],
    ['chilled','냉수 / CHW','냉수','CHILLED WATER','#168E9B','#0A5560','#FFFFFF','snow'],
    ['air','압축공기','압축공기','COMPRESSED AIR','#2D6DD2','#173C78','#FFFFFF','wind'],
    ['steam','스팀 / 증기','스팀','STEAM','#9BA1A7','#525960','#111111','steam'],
    ['hotwater','온수 / 급탕','온수','HOT WATER','#A96D39','#6A3D19','#FFFFFF','hot'],
    ['fire','소방','소방용수','FIRE WATER','#D82432','#86131C','#FFFFFF','extinguisher'],
    ['gas','가스 / 가연성','가스','GAS','#F4C43C','#6C5200','#111111','flame'],
    ['chemical','화학 / 부식','화학물질','CHEMICAL','#F07A22','#813600','#111111','flask'],
    ['waste','폐수 / 배수','폐수','WASTE WATER','#36454F','#131B20','#FFFFFF','waste'],
    ['oil','오일 / 윤활유','오일','OIL / LUBE','#8B5A2B','#4B2D12','#FFFFFF','droplet'],
    ['nitrogen','질소 N₂','질소','NITROGEN N₂','#A995DD','#58458F','#111111','wind'],
    ['oxygen','산소 O₂','산소','OXYGEN O₂','#78C86A','#3A6F31','#10200D','wind'],
    ['vacuum','진공','진공','VACUUM','#F4F6F8','#27323B','#111827','gauge'],
    ['drain','드레인','드레인','DRAIN','#60717C','#334149','#FFFFFF','waste'],
    ['custom','사용자 지정','사용자','CUSTOM','#F8FAFC','#334155','#111827','tag']
  ].map(([id,label,main,sub,fill,accent,text,icon])=>({id,label,main,sub,fill,accent,text,icon}));

  const categories = [
    ['pipe','배관 · 유체','pipe'],['warning','위험 · 경고','warning'],['prohibition','금지 · 제한','prohibition'],['mandatory','보호구 · 지시','mandatory'],
    ['emergency','비상 · 소방','cross'],['loto','LOTO · 점검','lock'],['electrical','전기 · 에너지','bolt'],['machine','기계 · 설비','gear'],
    ['chemical','화학 · 물질','flask'],['logistics','물류 · 통행','forklift'],['floor','구역 · 바닥','arrow'],['warehouse','창고 · 적재','load'],
    ['asset','명판 · 자산','tag'],['custom','사용자 라벨','tag']
  ].map(([id,label,icon])=>({id,label,icon}));

  const templates = [];
  const add = (category,id,name,icon,main,sub,tone='neutral',design='panel',sizeProfile='near',extra={}) => templates.push({category,id,name,icon,main,sub,tone,design,sizeProfile,kind:'sign',...extra});
  const pipeTemplate = (id,name,icon,purposeId)=>templates.push({category:'pipe',id,name,icon,main:'',sub:'',purposeId,kind:'pipe',tone:'pipe',design:'classic-arrow',sizeProfile:'smart'});

  [
    ['pipe-water','용수 배관','droplet','water'],['pipe-cooling','냉각수 배관','snow','cooling'],['pipe-chilled','냉수 CHW','snow','chilled'],['pipe-air','압축공기 배관','wind','air'],
    ['pipe-steam','스팀 배관','steam','steam'],['pipe-hotwater','온수 배관','hot','hotwater'],['pipe-gas','가스 배관','flame','gas'],['pipe-fire','소방 배관','extinguisher','fire'],
    ['pipe-chemical','화학 배관','flask','chemical'],['pipe-waste','폐수 배관','waste','waste'],['pipe-oil','오일 배관','droplet','oil'],['pipe-nitrogen','질소 배관','wind','nitrogen'],
    ['pipe-oxygen','산소 배관','wind','oxygen'],['pipe-vacuum','진공 배관','gauge','vacuum'],['pipe-drain','드레인 배관','waste','drain']
  ].forEach(x=>pipeTemplate(...x));

  add('warning','pinch','손 끼임 위험','pinch','손 끼임 위험','PINCH POINT','danger','safety-header','near');
  add('warning','electric','감전 위험','bolt','감전 위험','ELECTRICAL HAZARD','danger','safety-header','near');
  add('warning','hot','고온 표면','hot','고온 표면','HOT SURFACE','warning','symbol-left','near');
  add('warning','rotation','회전체 주의','rotation','회전체 주의','ROTATING PARTS','warning','hazard-stripe','near');
  add('warning','fall','추락 위험','fall','추락 위험','FALL HAZARD','danger','safety-header','wall');
  add('warning','slip','미끄럼 주의','slip','미끄럼 주의','SLIPPERY FLOOR','warning','symbol-left','near');
  add('warning','cut','절단 위험','cut','절단 위험','CUT HAZARD','danger','safety-header','near');
  add('warning','pressure','고압 주의','gauge','고압 주의','HIGH PRESSURE','warning','technical','near');
  add('warning','crush','협착 위험','crush','협착 위험','CRUSH HAZARD','danger','safety-header','near');
  add('warning','laser','레이저 주의','laser','레이저 방사','LASER RADIATION','warning','hazard-stripe','near');
  add('warning','overhead','낙하물 주의','load','낙하물 주의','OVERHEAD LOAD','warning','hazard-stripe','wall');

  add('prohibition','no-entry','출입 금지','no-entry','출입 금지','AUTHORIZED PERSONNEL ONLY','prohibition','round-split','wall');
  add('prohibition','no-operation','작동 금지','hand-stop','작동 금지','DO NOT OPERATE','prohibition','round-split','near');
  add('prohibition','no-smoking','금연','smoking','금연','NO SMOKING','prohibition','round-split','near');
  add('prohibition','no-flame','화기 금지','flame','화기 금지','NO OPEN FLAME','prohibition','round-split','near');
  add('prohibition','do-not-touch','손대지 마시오','hand-stop','손대지 마시오','DO NOT TOUCH','prohibition','round-split','near');
  add('prohibition','speed10','제한속도 10','speed','10','km/h 제한','prohibition','round','near',{width:80,height:80});

  add('mandatory','helmet','안전모 착용','helmet','안전모 착용','SAFETY HELMET','mandatory','symbol-top','near');
  add('mandatory','glasses','보안경 착용','glasses','보안경 착용','EYE PROTECTION','mandatory','symbol-top','near');
  add('mandatory','gloves','보호장갑 착용','glove','보호장갑 착용','WEAR GLOVES','mandatory','symbol-top','near');
  add('mandatory','hearing','청력 보호구','hearing','귀마개 착용','HEARING PROTECTION','mandatory','symbol-top','near');
  add('mandatory','shoes','안전화 착용','boot','안전화 착용','SAFETY SHOES','mandatory','symbol-top','near');
  add('mandatory','mask','마스크 착용','mask','보호마스크 착용','RESPIRATORY PROTECTION','mandatory','symbol-top','near');
  add('mandatory','harness','안전대 착용','harness','안전대 착용','FALL PROTECTION','mandatory','symbol-top','near');

  add('emergency','exit','비상구','exit','비상구','EMERGENCY EXIT','emergency','direction-panel','wall');
  add('emergency','extinguisher','소화기','extinguisher','소화기','FIRE EXTINGUISHER','fire','symbol-left','wall');
  add('emergency','firstaid','응급처치함','cross','응급처치함','FIRST AID','emergency','symbol-left','near');
  add('emergency','aed','AED','aed','자동심장충격기','AED','emergency','symbol-left','near');
  add('emergency','eyewash','세안대','eyewash','비상 세안대','EYE WASH','emergency','symbol-left','near');
  add('emergency','shower','비상 샤워','shower','비상 샤워','SAFETY SHOWER','emergency','symbol-left','near');

  add('loto','maintenance','점검 중','wrench','점검 중','MAINTENANCE IN PROGRESS','notice','work-tag','equipment');
  add('loto','lockout','LOTO 잠금','lock','잠금 · 표찰 실시','LOCK OUT / TAG OUT','danger','work-tag','equipment');
  add('loto','do-not-start','기동 금지','hand-stop','기동 금지','DO NOT START','danger','work-tag','equipment');
  add('loto','out-service','사용 금지','wrench','사용 금지','OUT OF SERVICE','danger','work-tag','equipment');
  add('loto','inspection','검사 중','wrench','검사 중','INSPECTION IN PROGRESS','notice','work-tag','equipment');

  add('electrical','high-voltage','고전압','bolt','고전압 위험','HIGH VOLTAGE','danger','safety-header','near');
  add('electrical','panel','분전반','bolt','분전반','DISTRIBUTION PANEL','notice','technical','equipment');
  add('electrical','emergency-stop','비상정지','hand-stop','비상정지','EMERGENCY STOP','danger','button','equipment');
  add('electrical','ground','접지','bolt','접지','GROUND','mandatory','technical','equipment');
  add('electrical','breaker-off','차단기 OFF','bolt','차단기 OFF','BREAKER OFF','notice','work-tag','equipment');

  add('machine','running','기계 가동 중','gear','기계 가동 중','MACHINE RUNNING','warning','technical','equipment');
  add('machine','pump','펌프 명판','gear','P-101','COOLING WATER PUMP','neutral','nameplate','asset');
  add('machine','valve-open','밸브 열림','valve','VALVE OPEN','OPEN','notice','compact-tag','equipment');
  add('machine','valve-close','밸브 닫힘','valve','VALVE CLOSED','CLOSED','prohibition','compact-tag','equipment');
  add('machine','manual-auto','수동/자동','gear','MANUAL / AUTO','운전 모드','neutral','technical','equipment');
  add('machine','lubrication','급유 위치','droplet','급유 위치','LUBRICATION POINT','notice','compact-tag','equipment');

  add('chemical','acid','산 / 알칼리','flask','산 · 알칼리 주의','ACID / ALKALI','warning','symbol-left','near');
  add('chemical','flammable','인화성 물질','flame','인화성 물질','FLAMMABLE','danger','safety-header','near');
  add('chemical','chemical-area','화학물질 취급구역','flask','화학물질 취급구역','CHEMICAL AREA','warning','hazard-stripe','wall');
  add('chemical','waste-chemical','폐화학물','flask','폐화학물','CHEMICAL WASTE','notice','technical','near');
  add('chemical','spill','누출 대응','flask','누출 대응 키트','SPILL KIT','emergency','symbol-left','near');

  add('logistics','forklift','지게차 주의','forklift','지게차 통행 주의','FORKLIFT TRAFFIC','warning','hazard-stripe','wall');
  add('logistics','loading','상하차 구역','forklift','상하차 구역','LOADING ZONE','notice','technical','wall');
  add('logistics','oneway','일방통행','arrow','일방통행','ONE WAY','notice','direction-panel','wall');
  add('logistics','pedestrian','보행자 통로','pedestrian','보행자 통로','PEDESTRIAN ROUTE','mandatory','direction-panel','wall');

  add('floor','keep-clear','통로 확보','arrow','통로 확보','KEEP CLEAR','warning','floor-stripe','wall');
  add('floor','restricted','통제구역','no-entry','통제구역','RESTRICTED AREA','prohibition','floor-stripe','wall');
  add('floor','ppe-zone','보호구 착용구역','helmet','보호구 착용구역','PPE REQUIRED','mandatory','floor-stripe','wall');
  add('floor','hot-zone','고온 작업구역','hot','고온 작업구역','HOT WORK AREA','warning','floor-stripe','wall');

  add('warehouse','rack-max','랙 최대하중','load','최대 적재하중','MAX LOAD 1,000 kg','warning','technical','wall');
  add('warehouse','location','로케이션','tag','A-01-03','WAREHOUSE LOCATION','neutral','nameplate','asset');
  add('warehouse','fifo','FIFO','arrow','선입선출','FIFO','notice','technical','near');
  add('warehouse','quarantine','격리품','no-entry','격리품','QUARANTINE','warning','hazard-stripe','near');
  add('warehouse','completed','완료품','mandatory','완료품','FINISHED GOODS','notice','technical','near');

  add('asset','asset-id','자산 번호표','tag','ASSET-0001','설비 자산번호','neutral','nameplate','asset');
  add('asset','qr-area','QR 명판','tag','설비 정보','QR / ID 영역','neutral','nameplate','asset');
  add('asset','cable-tag','케이블 태그','bolt','CBL-01-001','FROM → TO','neutral','compact-tag','equipment');
  add('asset','panel-id','판넬 번호','bolt','MCC-01','MOTOR CONTROL CENTER','neutral','nameplate','asset');
  add('asset','room-id','실명 표지','tag','기계실','MACHINE ROOM','neutral','panel','wall');

  add('custom','blank','빈 라벨','tag','사용자 라벨','내용을 입력하세요','neutral','panel','near');
  add('custom','custom-arrow','방향 안내','arrow','방향 안내','DIRECTION','notice','direction-panel','near');
  add('custom','custom-round','원형 표지','prohibition','사용자 표지','CUSTOM SIGN','prohibition','round','near',{width:80,height:80});

  const tones = {
    neutral:{fill:'#FFFFFF',accent:'#26323A',text:'#111827'}, notice:{fill:'#EAF4FB',accent:'#176B9A',text:'#10212C'},
    danger:{fill:'#FFFFFF',accent:'#C62828',text:'#111111'}, warning:{fill:'#FFF4CF',accent:'#F0A000',text:'#111111'},
    prohibition:{fill:'#FFFFFF',accent:'#D32F2F',text:'#111111'}, mandatory:{fill:'#E9F2FF',accent:'#1565C0',text:'#0C2742'},
    emergency:{fill:'#ECF8EF',accent:'#138A49',text:'#0D3A22'}, fire:{fill:'#FFF0F0',accent:'#C62828',text:'#5A1111'}, pipe:{fill:'#168A5B',accent:'#0B5137',text:'#FFFFFF'}
  };

  const signSizeProfiles = [
    {id:'equipment',label:'장비 부착 소형',desc:'30~100 cm 거리에서 보는 밸브·장비·태그',w:80,h:40},
    {id:'near',label:'근거리 표준',desc:'작업자 주변 약 1~2 m에서 보는 일반 표지',w:120,h:60},
    {id:'wall',label:'일반 벽면',desc:'통로·출입구·작업구역 약 2~5 m',w:150,h:75},
    {id:'distance',label:'원거리 강조',desc:'넓은 작업장·창고 등 멀리서 식별',w:200,h:100},
    {id:'asset',label:'명판형',desc:'설비명·자산번호·상세정보',w:100,h:50},
    {id:'custom',label:'직접 입력',desc:'가로·세로를 직접 입력',w:120,h:60}
  ];

  const pipeSizingModes = [
    {id:'smart',label:'배관 규격 연동형',desc:'외경이 커질수록 라벨 높이와 글자 크기도 자연스럽게 커집니다.'},
    {id:'compact',label:'A4 절약형',desc:'A4 한 장에 더 많이 배치하도록 폭과 높이를 조금 줄입니다.'},
    {id:'reference',label:'표준 참고형',desc:'큰 식별성과 긴 색상대를 우선하는 참고 프리셋입니다. 현장 규정이 우선입니다.'},
    {id:'custom',label:'직접 크기',desc:'현재 설치 공간에 맞게 직접 지정합니다.'}
  ];

  const wrapModes = [
    {id:'flat',label:'평면 / 한 면',ratio:0,desc:'일반적인 한 면 부착'},
    {id:'half',label:'반둘레 1/2',ratio:.5,desc:'원주 절반 정도 감싸기'},
    {id:'threeQuarter',label:'3/4 둘레',ratio:.75,desc:'원주 대부분 감싸기'},
    {id:'full',label:'한바퀴 360°',ratio:1,desc:'원주 전체 감싸기'}
  ];

  const designPresets = [
    {id:'classic-arrow',group:'pipe',name:'기본 화살표',desc:'가장 익숙한 산업 배관 화살표'},
    {id:'soft-arrow',group:'pipe',name:'소프트 화살표',desc:'둥근 모서리와 넓은 여백'},
    {id:'band-arrow',group:'pipe',name:'밴드 화살표',desc:'색상 띠 + 방향 강조'},
    {id:'double-arrow',group:'pipe',name:'양끝 화살표',desc:'양방향 흐름에 적합'},
    {id:'chevron',group:'pipe',name:'쉐브론',desc:'짧은 라벨에서 방향성이 큼'},
    {id:'outline-arrow',group:'pipe',name:'아웃라인',desc:'잉크 사용을 줄이는 선형'},
    {id:'split-arrow',group:'pipe',name:'분할 정보형',desc:'아이콘/문구 영역을 분리'},
    {id:'minimal-arrow',group:'pipe',name:'미니멀',desc:'문구를 크게 보여주는 간결형'},
    {id:'panel',group:'sign',name:'클린 패널',desc:'범용 표지'},
    {id:'safety-header',group:'sign',name:'신호어 헤더',desc:'위험·경고 문구를 상단에 강조'},
    {id:'symbol-left',group:'sign',name:'심볼 좌측',desc:'아이콘과 문구를 가로 배치'},
    {id:'symbol-top',group:'sign',name:'심볼 상단',desc:'보호구·지시 표지에 적합'},
    {id:'hazard-stripe',group:'sign',name:'경고 스트라이프',desc:'검정/강조색 사선 띠'},
    {id:'technical',group:'sign',name:'테크니컬',desc:'설비·명판 스타일'},
    {id:'work-tag',group:'sign',name:'작업 태그',desc:'LOTO·점검 상태표'},
    {id:'nameplate',group:'sign',name:'명판',desc:'설비명과 보조정보'},
    {id:'round',group:'sign',name:'원형',desc:'속도·금지 표지'},
    {id:'round-split',group:'sign',name:'금지 심볼형',desc:'원형 심볼과 문구를 함께 표시'},
    {id:'direction-panel',group:'sign',name:'방향 안내',desc:'통행·비상구·동선'},
    {id:'floor-stripe',group:'sign',name:'바닥 구역',desc:'바닥/통로용 강한 테두리'},
    {id:'compact-tag',group:'sign',name:'콤팩트 태그',desc:'밸브·케이블·소형 부착'},
    {id:'button',group:'sign',name:'버튼 표지',desc:'비상정지·조작부'}
  ];

  const stylePacks = [
    {id:'spectrum',name:'Spectrum Studio',source:'Adobe Spectrum',desc:'전문 제작 도구형 · 촘촘하지만 읽기 쉬운 편집 UI',ui:'spectrum',label:{skin:'spectrum',font:'sans',weight:800,corner:'soft',border:0.8,tip:24,shaft:12,shadow:'soft'}},
    {id:'fluent',name:'Fluent Workshop',source:'Fluent 2',desc:'차분한 계층 · 둥근 컨트롤 · 은은한 깊이',ui:'fluent',label:{skin:'fluent',font:'sans',weight:800,corner:'soft',border:0.7,tip:25,shaft:10,shadow:'soft'}},
    {id:'swiss',name:'Swiss Precision',source:'Minimalism & Swiss Style',desc:'격자 · 강한 위계 · 불필요한 장식 없는 정밀형',ui:'swiss',label:{skin:'swiss',font:'condensed',weight:900,corner:'square',border:1.0,tip:28,shaft:9,shadow:'none'}},
    {id:'glass',name:'Glass Lab',source:'Glassmorphism',desc:'반투명 패널 · 레이어 깊이 · 현대적 제작 화면',ui:'glass',label:{skin:'glass',font:'sans',weight:800,corner:'round',border:0.6,tip:23,shaft:12,shadow:'soft'}},
    {id:'soft',name:'Soft Tool',source:'Neumorphism / Soft UI',desc:'부드러운 입체감 · 큰 조작부 · 편안한 작업 화면',ui:'soft',label:{skin:'soft',font:'sans',weight:800,corner:'round',border:0.6,tip:22,shaft:12,shadow:'soft'}},
    {id:'brutal',name:'Industrial Brutal',source:'Brutalism',desc:'굵은 선 · 강한 대비 · 현장 표지에 어울리는 거친 인상',ui:'brutal',label:{skin:'brutal',font:'condensed',weight:900,corner:'square',border:1.4,tip:30,shaft:8,shadow:'hard'}},
    {id:'dark',name:'Dark Control',source:'Dark Mode (OLED)',desc:'저조도 제어실 · 높은 대비 · 네온 포커스',ui:'dark',label:{skin:'dark',font:'sans',weight:800,corner:'soft',border:0.8,tip:25,shaft:11,shadow:'soft'}},
    {id:'blueprint',name:'Blueprint Tech',source:'Data-Dense / Technical',desc:'도면 감성 · 얇은 선 · 기술 명판과 설비 표시에 적합',ui:'blueprint',label:{skin:'blueprint',font:'mono',weight:700,corner:'square',border:0.7,tip:26,shaft:10,shadow:'none'}}
  ];

  const uiThemes = stylePacks.map(p=>({id:p.id,name:p.name,desc:p.desc,source:p.source,ui:p.ui,label:p.label,swatches:({
    spectrum:['#F4F5F7','#FFFFFF','#1473E6','#2D2D2D'],fluent:['#F5F5F5','#FFFFFF','#0F6CBD','#242424'],swiss:['#F7F7F5','#FFFFFF','#111111','#E21D2F'],glass:['#E9F1F7','#FFFFFFAA','#315B9B','#50C5B7'],soft:['#E7ECF2','#E7ECF2','#526B8A','#7C6FE8'],brutal:['#FFF7DA','#FFFFFF','#111111','#FFB000'],dark:['#0B0F12','#151A1E','#E7EEF3','#37D99B'],blueprint:['#0B2740','#103856','#D9F2FF','#42C8F5']
  })[p.id]}));

  window.PM_CATALOG = {version:6,pipeFamilies,pipePurposes,categories,templates,tones,signSizeProfiles,pipeSizingModes,wrapModes,designPresets,uiThemes,stylePacks};
})();
