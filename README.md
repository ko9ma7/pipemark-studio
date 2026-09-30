# PipeMark Studio v4

배관 마커, 위험·경고·금지·보호구·비상·설비·물류·창고·자산 라벨을 **기본값은 선택만으로 빠르게 만들고**, 예외 상황에서는 미리보기 위에서 글자와 SVG를 직접 편집할 수 있는 GitHub Pages용 로컬 우선 웹 도구입니다.

## Preview

- 빠른 제작: 카테고리 → 템플릿 → 규격/사용범위 → 문구 → 출력 목록
- 직접 편집: 글자/SVG 클릭 → 드래그 이동 → 모서리 핸들 크기조절 → 회전 핸들 회전
- 출력 용지: A4/A3에서 실제 mm 크기로 자동 패킹. `자동 최적화`는 세로/가로 중 페이지 수가 적은 방향을 고릅니다.

## 이번 v4의 설계 원칙

1. **세부 설정은 기본 화면에서 숨깁니다.** 대부분의 작업은 콤보박스만으로 끝낼 수 있습니다.
2. **기본값은 용도에 따라 다릅니다.** 배관은 외경/기준 모드, 안전표지는 사용 거리·설치 위치에 따라 크기를 다르게 제안합니다.
3. **기본값은 잠금값이 아닙니다.** 공간이 좁거나 문구가 길거나 지정색이 있으면 `직접 편집`에서 현재 기본값을 출발점으로 수정합니다.
4. **SVG는 좌표 입력만 요구하지 않습니다.** 미리보기에서 아이콘을 직접 끌고, 크기와 회전을 손으로 조절할 수 있습니다.
5. **목록에 넣은 뒤에도 수정 가능합니다.** 출력 목록의 `수정`을 누르면 해당 라벨을 편집기로 다시 불러와 수정 후 저장합니다.

## 주요 카테고리

- 배관 · 유체
- 위험 · 경고
- 금지 · 제한
- 보호구 · 지시
- 비상 · 소방
- LOTO · 점검
- 전기 · 에너지
- 기계 · 설비
- 화학 · 물질
- 물류 · 통행
- 구역 · 바닥
- 창고 · 적재
- 명판 · 자산
- 사용자 라벨

기본 템플릿은 손 끼임, 감전, 고온, 회전체, 추락, 협착, 출입금지, 금연, 안전모/보안경/장갑/안전화, 비상구, 소화기, AED, LOTO, 지게차, 낙하물, 적재하중, 설비번호 등 현장에서 자주 필요한 항목을 포함합니다.

## 배관 크기 기준

### A4 현장 절약형 — 기본

A4에 여러 장 배치하기 쉽도록 만든 **이 프로그램의 실용 프리셋**입니다. 법정 표준 적합을 의미하지 않습니다. 작은 배관은 90 × 25 mm부터 시작하고 외경이 커질수록 라벨과 글자 크기가 단계적으로 커집니다.

### ASME A13.1 참고

ASME A13.1 계열에서 흔히 인용되는 배관 외경별 색상대 길이와 문자 높이를 참고하는 모드입니다. 예를 들어 외경 18–33 mm 구간은 색상대 길이 약 200 mm / 문자 높이 약 13 mm가 제시되는 자료가 있습니다. 이 모드는 A4 절약형보다 훨씬 크게 보일 수 있습니다.

참고 자료:
- Seton Pipe Markers / ANSI-ASME sizing reference: https://www.seton.com/pipe-markers.html
- ANSI Pipe Marker Selection Guide: https://www.seton.com/resource-center/wp-content/uploads/2018/04/SUS_ANSI_Pipe_Marker_Selection_Guide_FINAL.pdf

현장 발주처, 사업장 표준, 국내 법령 또는 사내 표준이 있으면 그것을 우선하고 `직접 크기`에서 조정하세요.

## 안전표지 크기

ISO 7010은 안전표지 원본과 형상·색상 체계를 제공하며 실제 적용 시 확대/축소가 가능합니다. 이 프로젝트의 `장비 부착 소형 / 근거리 표준 / 일반 벽면 / 원거리 강조`는 **편집 시작용 프리셋**이며 법정 최소 크기 판정 기능이 아닙니다.

참고: https://www.iso.org/standard/72424.html

## SVG 직접 편집

1. `직접 편집`을 누릅니다.
2. 미리보기의 SVG를 클릭합니다.
3. 그대로 끌면 이동합니다.
4. 오른쪽 아래 원형 핸들을 끌면 크기가 바뀝니다.
5. 위쪽 핸들을 돌리면 회전합니다.
6. 세부 설정의 `SVG 파일 추가`로 사용자 SVG를 넣을 수 있습니다.

업로드 SVG는 `script`, `foreignObject`, 외부 URL 참조 및 이벤트 속성을 제거한 뒤 브라우저 로컬에 저장합니다.

## 글자 편집

- 기본 문구는 왼쪽 `큰 문구 / 보조 문구` 입력에서 수정합니다.
- `직접 편집`에서 글자를 클릭하면 위치·글자 크기·회전·굵기·정렬·자간·텍스트 영역 너비를 조절할 수 있습니다.
- 글자를 더블클릭하면 미리보기 안에서 바로 문구를 수정할 수도 있습니다.
- 기본 자동 맞춤은 지정한 글자 크기보다 문구가 너무 길 때만 글자를 축소해 잘림을 줄입니다.

## A4/A3 출력 배치

`출력 용지` 탭의 `방향: 자동 최적화`는 라벨 실측 크기와 수량을 기준으로 세로/가로 배치를 둘 다 계산한 뒤 더 적은 페이지가 필요한 방향을 선택합니다.

예를 들어 작은 90 mm 폭 라벨은 A4 세로에서도 2열 배치가 가능하고, 110–130 mm 폭 라벨은 A4 가로에서 2열이 되는 경우가 많습니다. 서로 다른 크기의 라벨을 한 목록에 넣어도 빈 공간을 따라 순서대로 패킹합니다.

## 데이터 저장

서버 DB를 사용하지 않습니다.

- 현재 작업: LocalStorage 자동 저장
- 현장별 저장본: LocalStorage
- 사용자 SVG: LocalStorage
- PC 백업/복원: JSON

브라우저 저장소를 삭제하면 로컬 데이터도 사라질 수 있으므로 중요한 현장은 JSON 백업을 권장합니다.

## Local Development

`index.html`을 직접 열어도 핵심 편집 기능이 동작하도록 구성했습니다. 브라우저의 `file://` 저장 정책이 제한적인 경우에는 아래 방법을 권장합니다.

Windows:

```text
start-local.cmd
```

또는 Python이 있다면:

```bash
python -m http.server 8765
```

그 뒤 `http://localhost:8765/`로 접속합니다.

## GitHub Pages Deployment

Windows에서 가장 간단한 방법:

```text
github-bootstrap.cmd
```

게시 스크립트는 다음을 수행합니다.

1. Git / GitHub CLI 확인
2. GitHub 브라우저 로그인 확인
3. Repository 신규 생성 또는 기존 Repository 연결
4. 기존 Repository라면 원격 `main` 이력을 유지하면서 새 프로젝트 파일을 업데이트 커밋으로 연결
5. GitHub Repository **Description / Website / Topics** 자동 작성
6. `main` push
7. GitHub Pages를 Actions 방식으로 설정
8. 배포 Workflow 확인
9. 최종 Repository / Actions / Pages URL 출력

GitHub의 Repository `About` 영역에는 자동으로 다음 정보가 채워집니다.

- Description
- Website: 실제 GitHub Pages URL
- Topics: `github-pages`, `label-maker`, `svg`, `pipe-markers`, `safety-signs`, `industrial`, `local-first`, `print-tools`

Repository Social Preview 이미지는 `assets/repository-social-preview.png`에 포함되어 있습니다. GitHub는 Social Preview 업로드를 일반 Repository API로 자동 변경하는 기능이 제한적이므로, 필요한 경우 Repository → Settings → General → Social preview에서 이 파일을 한 번 업로드하세요.

## Existing Repository Update

이전 버전의 `pipemark-studio` Repository가 이미 있어도 새 압축을 풀어 `github-bootstrap.cmd`를 실행할 수 있습니다. 스크립트가 원격 `main`을 fetch하고, 압축을 새로 푼 폴더의 독립된 Git 이력을 원격 이력 위에 업데이트 커밋으로 다시 연결합니다.

## Project Structure

```text
/
├─ index.html
├─ style.css
├─ app.js
├─ data/
│  └─ catalog.js
├─ assets/
├─ manifest.webmanifest
├─ sw.js
├─ 404.html
├─ github-bootstrap.cmd
├─ github-publish.ps1
├─ start-local.cmd
└─ .github/workflows/deploy.yml
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript ES6+
- SVG
- LocalStorage
- GitHub Pages / GitHub Actions

별도 프레임워크나 서버 DB가 필요하지 않습니다.

## License

MIT License. 실제 산업안전 표지의 법정 적합성, 색상, 문구, 설치 위치 및 크기는 사용 현장의 적용 법령·발주처·사업장 기준을 별도로 확인하세요.


