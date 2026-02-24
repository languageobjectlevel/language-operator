# ADR-0002: Policy Engine Rule Composition

## Status
Accepted

## Context
A monolithic policy function is difficult to audit and extend as control requirements increase.

## Decision
Use explicit ordered rules with single-responsibility evaluation and first-match resolution.

## Consequences
- New policy behavior can be introduced by adding rules without rewriting core flow.
- Rule ordering becomes a controlled interface and must be tested.
