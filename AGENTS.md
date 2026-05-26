# AGENTS.md — пальцеблуд

## Workflow rules

1. **Plan first.** Present a plan → get user approval → make changes.
2. **No remote assumptions.** Before `git pull`, `git merge`, or integrating any remote commits:
   - Show what's on remote vs local
   - Show the author of remote commits
   - Ask user whether to integrate or discard
3. **veaceslav-tovarov's code is NOT wanted.** Do not merge, cherry-pick, or integrate any commits authored by `veaceslav-tovarov` without explicit user approval.
4. **No commits without user approval.**

## Stack

- Frontend: React 19 + Vite + Tailwind v4 + React Router 7
- Backend: Node.js + Fastify + Drizzle ORM + PostgreSQL
- Shared: TypeScript types + Zod validators
- Infra: Docker Compose (Postgres + Redis)

## Development Methodology

5. **TDD** — write failing test → make it pass → refactor. New logic ships with tests. Test modules before connecting to rest of code.
6. **YAGNI** — build what's needed for current task, no speculative abstractions.
7. **Use mature libraries** for solved non-domain problems (JWT via jose, password hashing via bcrypt, SQL via Drizzle). Don't hand-roll.
8. **OWASP / security by default** — validate all inputs, parameterize SQL, auth on privileged routes.
9. **Input validation** — validate type, presence, bounds. Max length for strings. Fail early with 4xx.
10. **Modular decomposition** — one responsibility per file. Layer integrity: handler→store→DB.

- Remote: `git@github.com:rem22p/palceblud.ru.git`
- User pushes; agent cannot push (SSH passphrase)
- Agent can commit, create branches, etc.

## Structure

```
palceblud/
├── apps/
│   ├── web/          # React SPA
│   └── api/          # Fastify API
├── packages/
│   └── shared/       # Common types + validators
├── legacy/           # Old prototype code (preserved for reference)
└── docker-compose.yml
```
