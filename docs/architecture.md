# Architecture

## Layers

1. API layer (`apps/operator-api`)
2. Domain layer (`packages/domain`)
3. Policy layer (`packages/policy`)
4. Contracts layer (`packages/contracts`, `packages/events`)
5. Observability layer (`packages/observability`)

## Data and Messaging Baseline

- Postgres for durable records
- Redis for low-latency coordination and caching
- NATS for event transport contracts

## Reliability Model

- idempotent command handling by request key
- explicit terminal task states
- contract-first API and event versioning
- health/readiness probes for orchestration
