# Threat Model

## Assets

- Task payload data
- Policy decisions
- Execution records
- Event stream integrity

## Primary Threats

1. Input injection into task and policy routes.
2. Unauthorized invocation of execution operations.
3. Event tampering and replay.
4. Secrets exposure in logs or workflow outputs.

## Initial Mitigations

- Strict schema validation on all external inputs.
- Deny-by-default policy posture for unsafe actions.
- Request idempotency controls and replay-resistant event metadata.
- Secret scanning and least-privilege CI tokens.
