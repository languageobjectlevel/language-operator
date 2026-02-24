# ADR-0003: Security Guards in API Input Path

## Status
Accepted

## Context
Unsafe action strings and unsanitized payloads can bypass intent-level controls and become exploit vectors.

## Decision
Introduce a dedicated security package and enforce action guard checks before policy evaluation execution.

## Consequences
- Security controls become reusable across routes and services.
- Additional validation path must remain covered by integration tests.
