# 시그마 인텔리전스 서비스 - 서버

`Nest` `Prisma` `TypeScript`

## 실행 방법

1. [yarn](https://classic.yarnpkg.com/en/docs/install) 설치 `npm install --global yarn`
2. `yarn install`으로 node_modules 설치
3. `yarn run start:dev` 실행

## 권장 VSCode 플러그인

여기 목록의 내용들은 .vscode/extensions.json에 명시해놓았기 때문에 VSCode로 처음 폴더 열 때 설치할 건지 물어봅니다.

-   **Prisma** `Prisma.prisma` schema.prisma 파일 수정 시 오류 검사 및 자동완성 제공
-   **ESLint** `dbaeumer.vscode-eslint` ESLint 에러 표시
-   **Prettier** `esbenp.prettier-vscode` 코드 포매팅 시 사용 가능
-   **Code Spell Checker** `streetsidesoftware.code-spell-checker` 영어 단어 spelling 검사, 의도치 않은 오타 방지에 좋음

## Prisma와 함께하는 협업

### 개발 전

`yarn install` 및 `yarn run prisma:push` 실행해야 제대로 체인지 반영 가능

### 개발 후

DB 설계 확정되면 PR 올리기 전 `yarn run migrate:dev` 실행하여 migration 파일들 생성

## API 테스트 시 주의 사항 (Postman, Insomnia, 혹은 브라우저)

**[중요]** /auth/login 엔드포인트에 POST 메소드로 로그인해서 쿠키를 받아야 함

-   처음 실행하는 경우
-   다른 API 호출했는데 403 에러 나는 경우 (일정 시간 지나면 로그인 만료되기 때문)

![image](https://user-images.githubusercontent.com/63445490/213865757-ac14a1fc-1112-4a73-b8f8-0d312b684bef.png)

### Postman 사용 시 추가 단계

-   위 로그인 API를 호출한 뒤, Cookies 탭에서 저장된 쿠키를 찾아서 Secure; 부분만 지워줘야 다른 API 호출할 때 쿠키가 잘
    사용됨 - [연관 이슈](https://github.com/postmanlabs/postman-app-support/issues/11467)
