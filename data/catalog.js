(() => {
  const pipeFamilies = [
    {id:'pvc-vp',name:'PVC VP',geometry:'round',standard:'JIS K 6741 계열 참고',items:[['13',18],['16',22],['20',26],['25',32],['30',38],['40',48],['50',60],['65',76],['75',89],['100',114],['125',140],['150',165],['200',216],['250',267],['300',318]].map(([n,od])=>({id:`VP-${n}`,label:`VP ${n}`,od}))},
    {id:'pvc-vu',name:'PVC VU',geometry:'round',standard:'JIS K 6741 계열 참고',items:[['40',48],['50',60],['65',76],['75',89],['100',114],['125',140],['150',165],['200',216],['250',267],['300',318]].map(([n,od])=>({id:`VU-${n}`,label:`VU ${n}`,od}))},
    {id:'steel-sgp',name:'강관 SGP',geometry:'round',standard:'JIS G 3452 계열 참고',items:[['15A',21.7],['20A',27.2],['25A',34],['32A',42.7],['40A',48.6],['50A',60.5],['65A',76.3],['80A',89.1],['90A',101.6],['100A',114.3],['125A',139.8],['150A',165.2],['200A',216.3],['250A',267.4],['300A',318.5]].map(([n,od])=>({id:`SGP-${n}`,label:`SGP ${n}`,od}))},
    {id:'sus',name:'SUS 배관',geometry:'round',standard:'JIS 계열 외경 참고',items:[['15A',21.7],['20A',27.2],['25A',34],['32A',42.7],['40A',48.6],['50A',60.5],['65A',76.3],['80A',89.1],['100A',114.3],['125A',139.8],['150A',165.2]].map(([n,od])=>({id:`SUS-${n}`,label:`SUS ${n}`,od}))},
    {id:'square',name:'정사각 각관',geometry:'rect',standard:'일반 규격 예시',items:[20,25,30,40,50,60,75,80,100,125,150].map(a=>({id:`SQ-${a}`,label:`${a} × ${a} mm`,a,b:a}))},
    {id:'rect',name:'직사각 각관',geometry:'rect',standard:'일반 규격 예시',items:[[30,20],[40,20],[40,25],[50,25],[50,30],[60,30],[75,45],[80,40],[100,50],[100,75],[125,75],[150,100],[200,100]].map(([a,b])=>({id:`RT-${a}-${b}`,label:`${a} × ${b} mm`,a,b}))},
    {id:'custom-round',name:'원형 직접 입력',geometry:'round',standard:'사용자 입력',items:[{id:'CUSTOM-R',label:'외경 직접 입력',od:26,custom:true}]},
    {id:'custom-flat',name:'평면 직접 입력',geometry:'flat',standard:'사용자 입력',items:[{id:'CUSTOM-F',label:'면 크기 직접 입력',a:100,b:50,custom:true}]}
  ];

  const pipePurposes = [
    ['water','일반 용수','#168A5B','#0B5137','#FFFFFF','droplet','용수 WATER'],
    ['potable','상수 / 음용수','#168A5B','#0B5137','#FFFFFF','droplet','상수 WATER'],
    ['cooling','냉각수','#168A5B','#0B5137','#FFFFFF','snow','냉각수 COOLING WATER'],
    ['chilled','냉수 / CHW','#168A5B','#0B5137','#FFFFFF','snow','CHILLED WATER'],
    ['air','압축공기','#2E6FD0','#173D78','#FFFFFF','wind','압축공기 AIR'],
    ['steam','스팀 / 증기','#9AA0A6','#555B60','#111111','steam','STEAM'],
    ['hotwater','온수 / 급탕','#9AA0A6','#555B60','#111111','hot','HOT WATER'],
    ['fire','소방','#D92532','#7B1018','#FFFFFF','extinguisher','FIRE WATER'],
    ['gas','가스 / 가연성','#F5C542','#624A00','#111111','flame','GAS'],
    ['chemical','화학 / 부식','#F07A22','#7A3300','#111111','flask','CHEMICAL'],
    ['waste','폐수 / 배수','#263238','#000000','#FFFFFF','waste','WASTE WATER'],
    ['nitrogen','질소 N₂','#B19CE5','#56408D','#111111','wind','NITROGEN N₂'],
    ['oxygen','산소 O₂','#7BCB68','#356A2B','#10200D','wind','OXYGEN O₂'],
    ['vacuum','진공','#F2F4F7','#27313A','#111827','gauge','VACUUM'],
    ['custom','사용자 지정','#F8FAFC','#334155','#111827','tag','CUSTOM']
  ].map(([id,label,fill,stroke,text,icon,defaultText])=>({id,label,fill,stroke,text,icon,defaultText}));

  const categories = [
    ['pipe','배관 · 유체'],['warning','위험 · 경고'],['prohibition','금지 · 제한'],['mandatory','보호구 · 지시'],
    ['emergency','비상 · 소방'],['loto','LOTO · 점검'],['electrical','전기 · 에너지'],['machine','기계 · 설비'],
    ['chemical','화학 · 물질'],['logistics','물류 · 통행'],['floor','구역 · 바닥'],['warehouse','창고 · 적재'],
    ['asset','명판 · 자산'],['custom','사용자 라벨']
  ].map(([id,label])=>({id,label}));

  const T = [];
  const add = (category,id,name,icon,text,subtext,tone='neutral',style='panel',sizeProfile='near',extra={}) => T.push({category,id,name,icon,text,subtext,tone,style,sizeProfile,kind:'sign',...extra});

  // pipe
  [
    ['pipe-water','용수 배관','droplet','용수 WATER','water'],['pipe-cooling','냉각수 배관','snow','냉각수 COOLING WATER','cooling'],
    ['pipe-air','압축공기 배관','wind','압축공기 AIR','air'],['pipe-steam','스팀 배관','steam','STEAM','steam'],
    ['pipe-gas','가스 배관','flame','GAS','gas'],['pipe-fire','소방 배관','extinguisher','FIRE WATER','fire'],
    ['pipe-chemical','화학 배관','flask','CHEMICAL','chemical'],['pipe-drain','드레인 배관','waste','DRAIN','waste'],
    ['pipe-nitrogen','질소 배관','wind','NITROGEN N₂','nitrogen'],['pipe-oxygen','산소 배관','wind','OXYGEN O₂','oxygen']
  ].forEach(([id,name,icon,text,purposeId])=>T.push({category:'pipe',id,name,icon,text,subtext:'',purposeId,kind:'pipe',tone:'pipe',style:'pipe-arrow',sizeProfile:'pipe-compact'}));

  // warning
  add('warning','pinch','손 끼임 위험','pinch','손 끼임 위험','가동 중 손을 넣지 마십시오','danger','signal','near');
  add('warning','electric','감전 위험','bolt','감전 위험','전원 차단 후 작업','danger','signal','near');
  add('warning','hot','고온 표면','hot','고온 표면','접촉 시 화상 위험','warning','symbol','near');
  add('warning','rotation','회전체 주의','rotation','회전체 주의','가동 중 접근 금지','warning','hazard','near');
  add('warning','fall','추락 위험','fall','추락 위험','안전대 체결','danger','signal','wall');
  add('warning','slip','미끄럼 주의','slip','미끄럼 주의','바닥 상태 확인','warning','symbol','near');
  add('warning','cut','절단 위험','cut','절단 위험','보호장갑 착용','danger','signal','near');
  add('warning','pressure','고압 주의','gauge','고압 주의','압력 제거 후 분해','warning','technical','near');
  add('warning','crush','협착 위험','crush','협착 위험','작동 반경 접근 금지','danger','signal','near');
  add('warning','laser','레이저 주의','laser','레이저 방사','보호안경 착용','warning','hazard','near');

  // prohibition
  add('prohibition','no-entry','출입 금지','no-entry','출입 금지','관계자 외 출입 금지','prohibition','symbol','wall');
  add('prohibition','no-operation','작동 금지','hand-stop','작동 금지','점검 작업 중','prohibition','symbol','near');
  add('prohibition','no-smoking','금연','smoking','금연','NO SMOKING','prohibition','symbol','near');
  add('prohibition','no-flame','화기 금지','flame','화기 금지','NO OPEN FLAME','prohibition','symbol','near');
  add('prohibition','do-not-touch','손대지 마시오','hand-stop','손대지 마시오','DO NOT TOUCH','prohibition','symbol','near');
  add('prohibition','speed10','제한속도 10','speed','10','km/h 제한','prohibition','round','near',{width:80,height:80});

  // mandatory
  add('mandatory','helmet','안전모 착용','helmet','안전모 착용','SAFETY HELMET','mandatory','symbol','near');
  add('mandatory','glasses','보안경 착용','glasses','보안경 착용','EYE PROTECTION','mandatory','symbol','near');
  add('mandatory','gloves','보호장갑 착용','glove','보호장갑 착용','WEAR GLOVES','mandatory','symbol','near');
  add('mandatory','hearing','청력 보호구','hearing','귀마개 착용','HEARING PROTECTION','mandatory','symbol','near');
  add('mandatory','shoes','안전화 착용','boot','안전화 착용','SAFETY SHOES','mandatory','symbol','near');
  add('mandatory','mask','마스크 착용','mask','보호마스크 착용','RESPIRATORY PROTECTION','mandatory','symbol','near');
  add('mandatory','harness','안전대 착용','harness','안전대 착용','FALL PROTECTION','mandatory','symbol','near');

  // emergency/fire
  add('emergency','exit','비상구','exit','비상구','EMERGENCY EXIT','emergency','symbol','wall');
  add('emergency','extinguisher','소화기','extinguisher','소화기','FIRE EXTINGUISHER','fire','symbol','wall');
  add('emergency','firstaid','응급처치함','cross','응급처치함','FIRST AID','emergency','symbol','near');
  add('emergency','aed','AED','aed','자동심장충격기','AED','emergency','symbol','near');
  add('emergency','eyewash','세안대','eyewash','비상 세안대','EYE WASH','emergency','symbol','near');
  add('emergency','shower','비상 샤워','shower','비상 샤워','SAFETY SHOWER','emergency','symbol','near');

  // loto/maintenance
  add('loto','maintenance','점검 중','wrench','점검 중','MAINTENANCE IN PROGRESS','notice','tag','equipment');
  add('loto','lockout','LOTO 잠금','lock','잠금 · 표찰 실시','LOCK OUT / TAG OUT','danger','tag','equipment');
  add('loto','do-not-start','기동 금지','hand-stop','기동 금지','DO NOT START','danger','tag','equipment');
  add('loto','out-service','사용 금지','wrench','사용 금지','OUT OF SERVICE','danger','tag','equipment');
  add('loto','inspection','검사 중','wrench','검사 중','INSPECTION IN PROGRESS','notice','tag','equipment');

  // electrical
  add('electrical','high-voltage','고전압','bolt','고전압 위험','HIGH VOLTAGE','danger','signal','near');
  add('electrical','panel','분전반','bolt','분전반','DISTRIBUTION PANEL','notice','technical','equipment');
  add('electrical','emergency-stop','비상정지','hand-stop','비상정지','EMERGENCY STOP','danger','button','equipment');
  add('electrical','ground','접지','bolt','접지','GROUND','mandatory','technical','equipment');
  add('electrical','breaker-off','차단기 OFF','bolt','차단기 OFF','BREAKER OFF','notice','tag','equipment');

  // machine/equipment
  add('machine','running','기계 가동 중','gear','기계 가동 중','MACHINE RUNNING','warning','technical','equipment');
  add('machine','pump','펌프 명판','gear','P-101','COOLING WATER PUMP','neutral','nameplate','asset');
  add('machine','valve-open','밸브 열림','valve','VALVE OPEN','열림 상태 유지','notice','small','equipment');
  add('machine','valve-close','밸브 닫힘','valve','VALVE CLOSED','닫힘 상태 유지','prohibition','small','equipment');
  add('machine','manual-auto','수동/자동','gear','MANUAL / AUTO','운전 모드 표시','neutral','technical','equipment');
  add('machine','lubrication','급유 위치','droplet','급유 위치','LUBRICATION POINT','notice','small','equipment');

  // chemical
  add('chemical','acid','산 / 알칼리','flask','산 · 알칼리 주의','ACID / ALKALI','warning','symbol','near');
  add('chemical','flammable','인화성 물질','flame','인화성 물질','FLAMMABLE','danger','signal','near');
  add('chemical','chemical-area','화학물질 취급구역','flask','화학물질 취급구역','CHEMICAL AREA','warning','hazard','wall');
  add('chemical','waste-chemical','폐화학물','flask','폐화학물','CHEMICAL WASTE','notice','technical','near');
  add('chemical','spill','누출 대응','flask','누출 대응 키트','SPILL KIT','emergency','symbol','near');

  // logistics
  add('logistics','forklift','지게차 주의','forklift','지게차 통행 주의','FORKLIFT TRAFFIC','warning','hazard','wall');
  add('logistics','overhead','낙하물 주의','load','낙하물 주의','OVERHEAD LOAD','warning','signal','wall');
  add('logistics','pedestrian','보행자 통로','pedestrian','보행자 통로','PEDESTRIAN ROUTE','mandatory','symbol','wall');
  add('logistics','loading','상하차 구역','forklift','상하차 구역','LOADING ZONE','notice','technical','wall');
  add('logistics','oneway','일방통행','arrow','일방통행','ONE WAY','notice','direction','wall');

  // floor/area
  add('floor','keep-clear','통로 확보','arrow','통로 확보','KEEP CLEAR','warning','floor','wall');
  add('floor','restricted','통제구역','no-entry','통제구역','RESTRICTED AREA','prohibition','floor','wall');
  add('floor','ppe-zone','보호구 착용구역','helmet','보호구 착용구역','PPE REQUIRED','mandatory','floor','wall');
  add('floor','hot-zone','고온 작업구역','hot','고온 작업구역','HOT WORK AREA','warning','floor','wall');
  add('floor','clean-zone','청정구역','mandatory','청정구역','CLEAN AREA','notice','floor','wall');

  // warehouse
  add('warehouse','rack-max','랙 최대하중','load','최대 적재하중','MAX LOAD 1,000 kg','warning','technical','wall');
  add('warehouse','location','로케이션','tag','A-01-03','WAREHOUSE LOCATION','neutral','nameplate','asset');
  add('warehouse','fifo','FIFO','arrow','선입선출','FIFO','notice','technical','near');
  add('warehouse','quarantine','격리품','no-entry','격리품','QUARANTINE','warning','hazard','near');
  add('warehouse','completed','완료품','mandatory','완료품','FINISHED GOODS','notice','technical','near');

  // asset/nameplate
  add('asset','asset-id','자산 번호표','tag','ASSET-0001','설비 자산번호','neutral','nameplate','asset');
  add('asset','qr-area','QR 명판','tag','설비 정보','QR / ID 영역','neutral','nameplate','asset');
  add('asset','cable-tag','케이블 태그','bolt','CBL-01-001','FROM → TO','neutral','small','equipment');
  add('asset','panel-id','판넬 번호','bolt','MCC-01','MOTOR CONTROL CENTER','neutral','nameplate','asset');
  add('asset','room-id','실명 표지','tag','기계실','MACHINE ROOM','neutral','panel','wall');

  // custom
  add('custom','blank','빈 라벨','tag','사용자 라벨','내용을 입력하세요','neutral','panel','near');
  add('custom','custom-arrow','방향 안내','arrow','방향 안내','','notice','direction','near');
  add('custom','custom-round','원형 표지','prohibition','사용자 표지','','prohibition','round','near',{width:80,height:80});

  const tones = {
    neutral:{fill:'#FFFFFF',accent:'#26323A',text:'#111827'}, notice:{fill:'#EAF4FB',accent:'#176B9A',text:'#10212C'},
    danger:{fill:'#FFFFFF',accent:'#C62828',text:'#111111'}, warning:{fill:'#FFF4CF',accent:'#F0A000',text:'#111111'},
    prohibition:{fill:'#FFFFFF',accent:'#D32F2F',text:'#111111'}, mandatory:{fill:'#E9F2FF',accent:'#1565C0',text:'#0C2742'},
    emergency:{fill:'#ECF8EF',accent:'#138A49',text:'#0D3A22'}, fire:{fill:'#FFF0F0',accent:'#C62828',text:'#5A1111'}, pipe:{fill:'#168A5B',accent:'#0B5137',text:'#FFFFFF'}
  };

  const signSizeProfiles = [
    {id:'equipment',label:'장비 부착 소형',desc:'가까이에서 보는 장비·밸브·태그',w:80,h:40},
    {id:'near',label:'근거리 표준',desc:'작업자 근처 표지 / 장비 주변',w:120,h:60},
    {id:'wall',label:'일반 벽면',desc:'통로·출입구·작업구역',w:150,h:75},
    {id:'distance',label:'원거리 강조',desc:'넓은 작업장·창고에서 멀리 식별',w:200,h:100},
    {id:'asset',label:'명판형',desc:'자산·설비번호 / 세부정보',w:100,h:50},
    {id:'custom',label:'직접 입력',desc:'가로·세로를 직접 입력',w:120,h:60}
  ];

  const pipeSizingModes = [
    {id:'compact',label:'A4 현장 절약형',desc:'A4에 여러 장 배치하기 쉬운 실용 기본값. 법정·표준 적합을 의미하지 않음.'},
    {id:'asme',label:'ASME A13.1 참고',desc:'배관 외경에 따른 색상대 길이·문자 높이 참고값. 현장 규정 우선.'},
    {id:'custom',label:'직접 크기',desc:'현재 설치 공간에 맞게 직접 지정'}
  ];

  window.PM_CATALOG = {version:4,pipeFamilies,pipePurposes,categories,templates:T,tones,signSizeProfiles,pipeSizingModes};
})();
