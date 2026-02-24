export const operatorTopics = {
  taskCreated: "operator.task.created.v1",
  executionStarted: "operator.execution.started.v1",
  executionCompleted: "operator.execution.completed.v1",
  executionFailed: "operator.execution.failed.v1",
  policyDenied: "operator.policy.denied.v1",
} as const;

export type OperatorTopic = (typeof operatorTopics)[keyof typeof operatorTopics];
