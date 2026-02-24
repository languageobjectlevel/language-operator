# Security Controls

## Pipeline Controls

- Static lint and type validation.
- Secret pattern scanning on tracked source.
- Dependency and license checks in CI.
- CodeQL analysis workflow.

## Runtime Controls

- schema validation for request payloads
- policy guardrails for external and financial actions
- structured logs without embedded credentials

## Governance Controls

- branch protection on `main` and `develop`
- required approvals and required checks
- signed commits and signed tags on protected branches
