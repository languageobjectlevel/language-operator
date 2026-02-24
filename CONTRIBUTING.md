# Contributing

## Branching

- `main`: production-ready branch.
- `develop`: integration branch.
- `feature/*`, `security/*`, `test/*`, `docs/*`, `release/*`, `hotfix/*`.

## Commit Messages

Use conventional style: `type(scope): summary`.

## Pull Requests

1. Rebase from latest `develop`.
2. Add tests for any behavioral change.
3. Update contracts and docs when interfaces change.
4. Ensure all required checks pass before requesting review.

## Quality Gates

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run contract:validate`
- `npm run security:scan`
