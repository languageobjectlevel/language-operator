# Recovery Runbook

## Data and Service Recovery

1. Verify database integrity and last known good snapshot.
2. Restore service components in dependency order.
3. Reconcile pending events through idempotent replay.
4. Validate readiness and smoke-test critical endpoints.
5. Resume traffic progressively.
