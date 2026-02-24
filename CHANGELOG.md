# Changelog

## 1.0.0 - 2026-02-24

### Added

- Monorepo baseline with strict TypeScript and modular package boundaries.
- Fastify HTTP API with core task, execution, policy, health, contracts, and metrics endpoints.
- Domain task state transition helpers and execution lifecycle utilities.
- Composable rule-based policy engine with budget-aware decisions.
- Security guard package for dangerous command patterns and input sanitization.
- Structured observability utilities and metrics collector.
- Versioned OpenAPI and AsyncAPI contract artifacts.
- Governance documentation, ADRs, and operational runbooks.
- Required CI workflows for lint, typecheck, tests, security, SBOM, license, and docs checks.

### Quality Gates

- Coverage threshold configured at 85% lines/statements/functions and 80% branches.
- Unit and integration suites implemented and passing locally.
