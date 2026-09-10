# GooDongWoo.github.io

구동우의 포트폴리오, CV, 기술 블로그를 제공하는 Jekyll 기반 GitHub Pages 사이트입니다.

## 콘텐츠 관리

- 프로필과 연락처: `_data/profile.yml`
- 대표 프로젝트: `_data/projects.yml`
- 전역 메뉴: `_data/navigation.yml`
- 기술 글: `_posts/YYYY-MM-DD-title.md`
- 상세 CV: `cv/index.html`

공통 헤더와 푸터는 `_includes/site-header.html`, `_includes/site-footer.html`에서 관리합니다. 페이지별 스타일은 공통 `assets/css/site-shell.css` 위에 포트폴리오, 블로그, CV 스타일을 각각 추가합니다.

## 로컬 실행

Ruby와 Bundler를 설치한 뒤 실행합니다.

```sh
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://localhost:4000`을 엽니다. 배포 전 정적 빌드는 다음 명령으로 확인합니다.

```sh
bundle exec jekyll build
powershell -ExecutionPolicy Bypass -File tests/site-structure.ps1
```

## 배포

`master` 브랜치에 푸시하면 GitHub Pages가 빌드하고 배포합니다. `.github/workflows/jekyll-build.yml`은 pull request와 push마다 구조 및 내비게이션 동작 검사를 실행합니다.
