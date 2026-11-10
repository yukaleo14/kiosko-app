# Agent Instructions & Project Rules

## Tech Stack
- **Runtime**: Node.js 20+ / TypeScript
- **Backend**:
  - Framework: NestJS 10 (Express)
  - ORM & Database: TypeORM 0.3+ / PostgreSQL (`pg`)
  - Validation & Serialization: `class-validator`, `class-transformer`
  - Authentication: Passport JWT (`@nestjs/jwt`, `passport-jwt`, `bcryptjs`)
- **Frontend**:
  - Framework: Angular 17
  - Reactive Programming: RxJS 7
- **Testing**: Jest (Backend), Jasmine / Karma (Frontend)

## Core Principles
1. **Verify Before Complete**: Run `npm run build` in the affected workspace (`backend/` or `frontend/`) before finishing. Never complete a task with build errors.
2. **Zero Regressions**: Check adjacent services, controllers, or components when altering shared models, entities, guards, or utility methods.
3. **Strict Typings**: No `any` or `@ts-ignore`.
   - Backend: Define explicit DTOs with `class-validator` inside `src/<module>/dto/` and TypeORM entities inside `src/<module>/entities/`.
   - Frontend: Define strong interfaces and models inside `src/app/models/`.
4. **Minimal Blast Radius**: Do not refactor unrelated code. Limit changes strictly to the scope of the prompt.

## Testing & Validation
- Always run `npm test` (or the equivalent project test suite) after applying changes.
- Never mark a task as complete if tests or build steps fail.
- When fixing an issue, write or update a test that reproduces the bug before writing the fix.

## Architecture & Code Organization
- Follow feature-based modular architecture (Backend: `backend/src/<feature>/[controllers, services, dto, entities]`; Frontend: `frontend/src/app/<feature>/`).
- Do not bypass service layers from controllers.
- Use explicit data transfer objects (DTOs) with class-validator for all external inputs.

## TypeScript / Code Quality
- Strict typing is mandatory: avoid `any` or `@ts-ignore` under any circumstances.
- Handle edge cases and nullish states explicitly; do not rely on optional chaining fallback if error throwing is expected.
- Keep functions small and focused on a single responsibility.

## Dependency Management
- Do not install new npm/pip packages without explicitly explaining why the existing libraries cannot solve the issue.
- Do not modify `.env.example`, Dockerfiles, or CI/CD pipelines unless the task specifically requests it.

## File Edits & Git Hygiene
- Make minimal, targeted diffs. Do not reformat entire files or reorder existing imports unless explicitly requested.
- Preserve existing comments, docstrings, and licensing headers.
- Write concise, conventional commit messages (`feat:`, `fix:`, `refactor:`, etc.).