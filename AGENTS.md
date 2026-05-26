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

## Repository

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
