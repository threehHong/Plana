# 📘 Plana

프로젝트 관리 웹 애플리케이션

<br>

## 📅 작업 기간

- 25.01.25 ~

<br>

## 📌 주요 기능

- 회원가입

  - 이메일 가입 후, 사용자에게 전송된 승인 메일을 클릭하여 가입을 완료하는 방식입니다.
  - Supabase의 auth 테이블에 저장된 사용자의 정보를 트리거와 함수를 통해 public 테이블에 자동으로 저장하는 방식입니다.
  - 사용자가 회원가입을 하면 auth.users 테이블에 정보가 저장되고, 트리거를 통해 함수가 실행되어 public.users 테이블에 사용자 이메일과 ID가 추가됩니다.

- 로그인

- 게시글 CRUD (생성, 조회, 수정, 삭제)

- 게시물 조회

<br>

## 🛠️ 기술 스택

### Frontend

- React

- Tailwind CSS

- Shacn UI

- Zustand

### Backend

- Supabase

- Vercel
