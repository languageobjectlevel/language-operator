# Monitoring Runbook

## Metrics Endpoint

The API exposes an internal metrics snapshot endpoint at `/v1/metrics`.

## Expected Core Counters

- `tasks.created`
- `tasks.cancelled`
- `policy.evaluations`

## Triage Flow

1. Verify liveness and readiness probes.
2. Check metrics counters for abnormal growth patterns.
3. Compare policy evaluation volume against task creation volume.
4. Investigate route-level errors via structured logs.
