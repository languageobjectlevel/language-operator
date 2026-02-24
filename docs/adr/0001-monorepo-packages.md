# ADR-0001: Monorepo with Isolated Packages

## Status
Accepted

## Context
The operator service needs strict modularity while maintaining shared contracts and local development speed.

## Decision
Use a TypeScript workspace monorepo with isolated packages for domain, policy, events, contracts, and observability.

## Consequences
- Shared contracts remain versioned and testable in one repository.
- Build orchestration complexity increases but remains manageable through project references.
