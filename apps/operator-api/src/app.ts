import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { ExecutionRecord, TaskSpec } from "@language-operator/domain";
import { startExecution, transitionTask } from "@language-operator/domain";
import { createLog } from "@language-operator/observability";
import type { BudgetWindow } from "@language-operator/policy";
import { evaluatePolicy } from "@language-operator/policy";

const createTaskInput = z.object({
  input: z.string().min(1).max(5000),
});

const evaluatePolicyInput = z.object({
  inputSource: z.enum(["system", "operator", "external"]),
  action: z.string().min(1).max(128),
  amountCents: z.number().int().nonnegative().optional(),
});

const budgetWindow: BudgetWindow = {
  hourlyLimitCents: 1_500,
  dailyLimitCents: 10_000,
};

export function createApp() {
  const app = Fastify({ logger: false });
  const tasks = new Map<string, TaskSpec>();
  const executions = new Map<string, ExecutionRecord>();

  app.addHook("onRequest", async (request, reply) => {
    const requestId = request.headers["x-request-id"] ?? randomUUID();
    reply.header("x-request-id", String(requestId));
  });

  app.setErrorHandler((error, _request, reply) => {
    reply.code(500).send({
      code: "UNHANDLED_ERROR",
      message: error.message,
    });
  });

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

  app.get("/v1/health/liveness", async () => ({ status: "ok", version: "1.0.0" }));
  app.get("/v1/health/readiness", async () => ({ status: "ready", version: "1.0.0" }));

  app.post("/v1/tasks", async (request, reply) => {
    const parsed = createTaskInput.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        code: "INVALID_INPUT",
        message: parsed.error.issues.map((issue) => issue.message).join("; "),
      });
    }

    const id = randomUUID();
    const task: TaskSpec = {
      id,
      input: parsed.data.input,
      createdAt: new Date().toISOString(),
      status: "created",
    };

    const runningTask = transitionTask(task, "running");
    const execution = startExecution(id);

    tasks.set(id, runningTask);
    executions.set(execution.id, execution);

    app.log.info(
      createLog({
        level: "info",
        component: "task.create",
        message: "Task created and execution started",
        context: { taskId: id, executionId: execution.id },
      }),
    );

    return reply.code(201).send({ ...runningTask, executionId: execution.id });
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
    if (task.status === "cancelled") {
      return { taskId: task.id, status: task.status };
    }
    if (task.status === "completed" || task.status === "failed") {
      return reply.code(409).send({
        code: "TASK_NOT_CANCELLABLE",
        message: "Task is already terminal and cannot be cancelled",
      });
    }

    const cancelledTask = transitionTask(task, "cancelled");
    tasks.set(task.id, cancelledTask);
    return { taskId: cancelledTask.id, status: cancelledTask.status };
  });

  app.post("/v1/policies/evaluate", async (request, reply) => {
    const parsed = evaluatePolicyInput.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        code: "INVALID_POLICY_INPUT",
        message: parsed.error.issues.map((issue) => issue.message).join("; "),
      });
    }

    const decision = evaluatePolicy(parsed.data, budgetWindow);
    return reply.code(200).send(decision);
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



