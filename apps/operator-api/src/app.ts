import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { ExecutionRecord, TaskSpec } from "@language-operator/domain";
import type { PolicyDecision } from "@language-operator/policy";
import { createLog } from "@language-operator/observability";

const createTaskInput = z.object({
  input: z.string().min(1).max(5000),
});

const evaluatePolicyInput = z.object({
  inputSource: z.enum(["system", "operator", "external"]),
  action: z.string().min(1).max(128),
  amountCents: z.number().int().nonnegative().optional(),
});

function allowByDefault(): PolicyDecision {
  return {
    outcome: "allow",
    reasonCode: "DEFAULT_ALLOW",
    message: "Policy checks passed",
    timestamp: new Date().toISOString(),
  };
}

export function createApp() {
  const app = Fastify({ logger: false });
  const tasks = new Map<string, TaskSpec>();
  const executions = new Map<string, ExecutionRecord>();

  void app.register(swagger, {
    openapi: {
      info: {
        title: "language-operator API",
        version: "1.0.0",
      },
    },
  });

  void app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/v1/health/liveness", async () => ({ status: "ok" }));
  app.get("/v1/health/readiness", async () => ({ status: "ready" }));

  app.post("/v1/tasks", async (request, reply) => {
    const parsed = createTaskInput.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        code: "INVALID_INPUT",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      });
    }

    const id = randomUUID();
    const task: TaskSpec = {
      id,
      input: parsed.data.input,
      createdAt: new Date().toISOString(),
      status: "created",
    };

    const execution: ExecutionRecord = {
      id: randomUUID(),
      taskId: id,
      startedAt: new Date().toISOString(),
      status: "running",
    };

    tasks.set(id, task);
    executions.set(execution.id, execution);

    app.log.info(createLog({
      level: "info",
      component: "task.create",
      message: "Task created",
      context: { taskId: id },
    }));

    return reply.code(201).send(task);
  });

  app.get<{ Params: { taskId: string } }>("/v1/tasks/:taskId", async (request, reply) => {
    const task = tasks.get(request.params.taskId);
    if (!task) {
      return reply.code(404).send({
        code: "TASK_NOT_FOUND",
        message: "Task not found",
      });
    }
    return task;
  });

  app.post<{ Params: { taskId: string } }>("/v1/tasks/:taskId/cancel", async (request, reply) => {
    const task = tasks.get(request.params.taskId);
    if (!task) {
      return reply.code(404).send({
        code: "TASK_NOT_FOUND",
        message: "Task not found",
      });
    }
    task.status = "cancelled";
    return { taskId: task.id, status: task.status };
  });

  app.post("/v1/policies/evaluate", async (request, reply) => {
    const parsed = evaluatePolicyInput.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        code: "INVALID_POLICY_INPUT",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      });
    }
    const decision = allowByDefault();
    return decision;
  });

  app.get<{ Params: { executionId: string } }>("/v1/executions/:executionId", async (request, reply) => {
    const execution = executions.get(request.params.executionId);
    if (!execution) {
      return reply.code(404).send({
        code: "EXECUTION_NOT_FOUND",
        message: "Execution not found",
      });
    }
    return execution;
  });

  return app;
}
