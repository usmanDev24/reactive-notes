import { describe, it, expect, afterAll, beforeAll } from "vitest";
import request from "supertest";

import { app } from "../src/app.mjs";
import UserStore from "../src/model/user-store.mjs";
const userStore = new UserStore();

afterAll(async () => {
  await userStore.deleteAll("deleteAll");
});

describe("Testing Auth Endpoint", () => {
  // Maintained the agent instance to track cookies across requests
  const agent = request.agent(app);

  it("should successfully create register new user", async () => {
    const res = await agent
      .post("/api/v1/auth/register")
      .send({
        userName: "test-user",
        password: "test",
        firstName: "test",
        lastName: "user",
        unverified_email: "test@example.com", 
      })
      .set("Content-Type", "application/json")
      .accept("application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should login test user", async () => {
    const res = await agent
      .post("/api/v1/auth/login")
      .send({
        userName: "test-user",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .accept("application/json")
      .redirects(1)
    
    expect(res.body.success).toBe(true);
  });

  it("should get test user", async () => {
    const res = await agent
      .get("/api/v1/users/me")
      .accept("application/json");

      console.log(res.body)
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
  it("should delete test user", async () => {
    const res = await agent
      .delete("/api/v1/users/me")
      .accept("application/json");

    expect(res.status).toBe(200); 
    expect(res.body.success).toBe(true); 
  });
});