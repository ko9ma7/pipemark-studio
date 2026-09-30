# PipeMark Studio v3

배관 마커뿐 아니라 **위험·경고·금지·보호구·설비 점검·비상·소방·물류 표지**를 같은 편집 흐름에서 만들 수 있는 GitHub Pages용 정적 웹앱입니다.

## 이번 버전에서 달라진 점

- `index.html`을 파일로 직접 열어도 템플릿/디자인/아이콘 선택이 동작하도록 모든 선택 상태를 JavaScript 내부 상태와 직접 연결했습니다. 외부 API나 `fetch()`에 의존하지 않습니다.
- 왼쪽은 **라벨 라이브러리**, 가운데는 **현재 라벨 편집**, 오른쪽은 **실시간 미리보기 + 출력 목록**으로 재구성했습니다.
- 배관 외에 손 끼임, 감전, 고온, 회전체, 추락, 미끄럼, 절단, 협착, 고압, 출입금지, 금연, 보호구 착용, LOTO, 점검중, 비상구, 소화기, AED, 세안대, 지게차 등 다수의 템플릿을 내장했습니다.
- 기존 기본 산업용 화살표 형태를 복원하고 포인터/리본/쉐브론/양방향 선택을 추가했습니다.
- `세부 설정`은 별도 새 작업을 만드는 메뉴가 아니라 **현재 선택한 기본 옵션을 추가 전에 조정하거나, 출력 목록의 항목을 불러와 수정하는 편집 영역**입니다.
- 사용자 SVG 파일을 안전하게 정리한 뒤 브라우저 로컬에 저장하여 픽토그램 라이브러리에 추가할 수 있습니다.
- 서버/DB 없이 LocalStorage + JSON 백업/복원으로 동작합니다.

## 실행

가장 간단한 방법은 `index.html`을 더블클릭하는 것입니다. Chrome/Edge의 `file://` 환경에서도 선택과 편집 기능이 동작하도록 구성했습니다.

로컬 서버 방식으로 확인하려면 Windows에서 다음 파일을 실행하세요.

```text
start-local.cmd
```

Python이 설치되어 있으면 `http://localhost:8765/`로 열립니다. Python이 없으면 `index.html`을 직접 엽니다.

## GitHub Pages 게시

Windows에서는 프로젝트 폴더에서 다음 파일을 실행합니다.

```text
github-bootstrap.cmd
```

이 파일은 실제 게시 로직을 `github-publish.ps1`에 맡기며, **성공하거나 오류가 나도 CMD 창이 자동으로 닫히지 않습니다.** 전체 진행 내용은 다음 로그 파일에도 남습니다.

```text
github-bootstrap.log
```

진행 순서는 다음과 같습니다.

1. Git / GitHub CLI 확인
2. GitHub 로그인 확인 — 필요하면 브라우저 로그인
3. Repository 이름 입력
4. Git 초기화 / commit
5. GitHub Repository 생성 또는 기존 Repository 확인
6. `git push`
7. GitHub Pages를 GitHub Actions 방식으로 활성화
8. 배포 workflow 결과 확인
9. Repository / Actions / Pages 주소 표시

기존 Repository가 같은 이름으로 존재하면 자동으로 덮어쓰지 않고 확인 질문을 합니다.

## 수동 게시

```bash
git init
git branch -M main
git add .
git commit -m "feat: publish PipeMark Studio"
gh repo create pipemark-studio --public --source . --remote origin
git push -u origin main
```

그 다음 Repository **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.

자동 배포 workflow는 `.github/workflows/deploy.yml`에 포함되어 있습니다.

## 데이터 저장

- 현재 편집 상태: LocalStorage
- 출력 대기 목록: LocalStorage
- 사용자 SVG 아이콘: LocalStorage
- 현장별 저장: LocalStorage
- PC 백업/복원: JSON 파일

브라우저 데이터 삭제 시 LocalStorage 데이터도 사라질 수 있으므로 중요한 현장 설정은 상단의 JSON 백업을 함께 사용하세요.

## 내장 표지 분류

- 배관 · 유체
- 위험 · 경고
- 금지
- 보호구 · 지시
- 설비 · 점검
- 비상 · 소방
- 물류 · 통행
- 사용자 라벨

## 규격과 안전표지에 대한 주의

내장 배관 규격과 표지 문구/색상은 빠른 제작을 위한 기본 라이브러리입니다. 실제 현장 적용 시에는 **제조사 실측 규격, 발주처 표준, 사업장 안전표지 기준, 관련 법규/사내 규정**을 우선 확인하고 세부 설정에서 수정하세요. 이 웹앱이 특정 법규 또는 표준 적합성을 자동 인증하는 것은 아닙니다.

## Project Structure

```text
/
├─ index.html
├─ style.css
├─ app.js
├─ data/catalog.js
├─ start-local.cmd
├─ github-bootstrap.cmd
├─ github-publish.ps1
├─ manifest.webmanifest
├─ sw.js
├─ 404.html
├─ robots.txt
├─ sitemap.xml
├─ assets/
└─ .github/workflows/deploy.yml
```

## GitHub Pages URL

게시 도우미가 아래 자리표시자를 실제 계정/Repository 주소로 바꿉니다.

```text
https://ko9ma7.github.io/pipemark-studio/
```

예: `https://USERNAME.github.io/REPOSITORY/`

## License

MIT License. 프로젝트에 포함된 자체 제작 UI/SVG 픽토그램은 프로젝트 코드와 함께 사용·수정할 수 있습니다. 사용자가 별도로 추가하는 SVG는 해당 원본의 라이선스를 확인하세요.


## Windows GitHub 게시 문제 해결 (v3.1)

Windows CMD에서 UTF-8 한글이 깨지며 `?`, `ass`, `epository` 같은 조각이 명령으로 실행되는 문제를 막기 위해 `github-bootstrap.cmd`, `github-publish.ps1`, `start-local.cmd`를 **ASCII + CRLF** 형식으로 다시 작성했습니다.

1. ZIP을 완전히 압축 해제합니다.
2. 프로젝트 폴더 안의 `github-bootstrap.cmd`를 실행합니다.
3. GitHub 브라우저 로그인 후 CMD 창으로 돌아옵니다.
4. 실패해도 창이 자동 종료되지 않습니다.
5. 같은 폴더의 `github-bootstrap.log`에서 `[ERROR]` 직전 내용을 확인할 수 있습니다.

배치 파일을 실행하지 않고 직접 테스트하려면 PowerShell에서 다음을 실행할 수도 있습니다.

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\github-publish.ps1
```

