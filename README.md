# language-operator

`language-operator` is the autonomous execution core for Language Object Level. It accepts task requests, evaluates policy, runs controlled execution flows, and emits auditable outcomes.

## Platform Role

`language-operator` is one of three platform repositories:

- `language-commerce` creates monetizable work and emits `commerce.task.requested.v1`
- `language-operator` executes work under policy and security controls
- `language-fleet` governs placement, health, and orchestration at the node level

## What This Repository Provides

- Task lifecycle API (`create`, `inspect`, `cancel`)
- Policy evaluation with deny-by-default behavior
- Execution state tracking and audit trail primitives
- Versioned OpenAPI and AsyncAPI contracts
- Structured observability surfaces for logs, metrics, and health

## API Surface (v1)

- `POST /v1/tasks`
- `GET /v1/tasks/{taskId}`
- `POST /v1/tasks/{taskId}/cancel`
- `POST /v1/policies/evaluate`
- `GET /v1/executions/{executionId}`
- `GET /v1/health/liveness`
- `GET /v1/health/readiness`

Contract source of truth:

- `contracts/openapi/operator.v1.yaml`

## Event Contracts (v1)

- `operator.task.created.v1`
- `operator.execution.started.v1`
- `operator.execution.completed.v1`
- `operator.execution.failed.v1`
- `operator.policy.denied.v1`

Contract source of truth:

- `contracts/asyncapi/operator.events.v1.yaml`

## Core Domain Types

Exported from workspace packages:

- `TaskSpec`
- `ExecutionRecord`
- `PolicyDecision`
- `ToolInvocation`
- `AuditEvent`
- `BudgetWindow`

## Repository Layout

```text
apps/
  operator-api/
packages/
  contracts/
  domain/
  events/
  observability/
  policy/
  security/
contracts/
  openapi/
  asyncapi/
docs/
  adr/
  runbooks/
```

## Quick Start

### Prerequisites

- Node.js 22+
- npm 10+

### Install and Run Checks

```bash
npm ci
npm run lint
npm run typecheck
npm run test
```

### Run API in Development

```bash
npm run dev:api
```

## Required Engineering Gates

Run before proposing changes:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run contract:validate
npm run security:scan
npm run sbom
npm run license:check
npm run docs:link-check
```

Coverage target policy:

- Lines: >= 85%
- Branches: >= 80%

## Security and Governance Baseline

- Apache-2.0 licensing
- Signed commit requirement on protected branches
- Security disclosure process in `SECURITY.md`
- Threat model and runbooks in `docs/`

## Documentation Path (Recommended Order)

1. `docs/architecture.md`
2. `docs/testing-strategy.md`
3. `docs/threat-model.md`
4. `docs/security-controls.md`
5. `docs/adr/`
6. `docs/runbooks/`
7. `docs/release-notes-1.0.0.md`

## Release and Branch Model

- Long-lived branches: `main`, `develop`
- Working branches: `feature/*`, `security/*`, `test/*`, `docs/*`, `release/*`, `hotfix/*`
- Releases are produced from `release/x.y.z`, then merged to `main` and back-merged to `develop`

## Contributing and Support

- Contribution process: `CONTRIBUTING.md`
- Code ownership: `CODEOWNERS`
- Security reporting: `SECURITY.md`
- Operational support: `SUPPORT.md`
