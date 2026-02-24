# Testing Strategy

## Test Categories

- Unit tests for domain and policy modules.
- Integration tests for API contract and route behavior.
- Contract validation checks for OpenAPI and AsyncAPI files.
- Security checks for obvious credential and key leaks.

## Coverage Gates

- Minimum 85% lines and statements.
- Minimum 80% branches.

## CI Requirements

All pull requests must pass lint, typecheck, unit, integration, contract, coverage, security, SBOM, license, and docs checks.
