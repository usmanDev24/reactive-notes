import {
  describe,
  it,
  expect,
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import request from "supertest";
import { app } from "../src/app.mjs";
import UserStore from "../src/model/user-store.mjs";
import { googleVerifyCallback } from "../src/routes/auth.mjs";

const userStore = new UserStore();

afterAll(async () => {
  await userStore.deleteAll("deleteAll");
});


describe("Google Strategy Verify Callback (Isolated Spies)", () => {
  let mockReq;
  let mockDone;
  let mockProfile;
  const mockUserStore = {
    findGoogleUser: vi.fn(),
    findEmail: vi.fn(),
    linkGoogleAccount: vi.fn(),
    create: vi.fn(),
  };

  beforeEach(() => {
    mockReq = { user: null };
    mockDone = vi.fn();
    mockProfile = {
      _json: {
        sub: "google-12345",
        email: "clarkkent@gmail.com",
        picture: "photo.jpg",
        given_name: "Clark",
        family_name: "Kent",
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should return existing user if Google ID matches", async () => {
    const existingUser = {
      id: 1,
      email: "clarkkent@gmail.com",
      googleId: "google-12345",
    };

    mockUserStore.findGoogleUser.mockResolvedValue(existingUser);

    await googleVerifyCallback(
      mockReq,
      "access_tok",
      "refresh_tok",
      mockProfile,
      mockDone,
      mockUserStore,
    );

    expect(mockUserStore.findGoogleUser).toHaveBeenCalledWith("google-12345");
    expect(mockDone).toHaveBeenCalledWith(null, existingUser);
  });
  it("Should link Google account to existing session", async () => {
    mockReq = {
      user: { id: 9283, unverified_email: "test@test.com" },
    };
    vi.spyOn(userStore, "findEmail").mockResolvedValue(null);
    vi.spyOn(userStore, "findGoogleUser").mockResolvedValue(null);
    const linkedUser = {
      id: 9283,
      email: "clarkkent@gmail.com",
      googleId: "google-12345",
      picture: "photo.jpg",
    };

    const linkSpy = vi
      .spyOn(userStore, "linkGoogleAccount")
      .mockResolvedValue(linkedUser);
    await googleVerifyCallback(
      mockReq,
      "access-token",
      "refresh-token",
      mockProfile,
      mockDone,
      userStore,
    );
    expect(linkSpy).toHaveBeenCalledWith(
      9283,
      "Google",
      "google-12345",
      "clarkkent@gmail.com",
      "test@test.com",
      "photo.jpg",
    );
    expect(mockDone).toHaveBeenCalledWith(null, linkedUser);
  });
  it("Should link Google to account if email already exists", async () => {
    // Mock multiple methods for this test only
    vi.spyOn(userStore, "findGoogleUser").mockResolvedValue(null);
    vi.spyOn(userStore, "findEmail").mockResolvedValue({
      id: 42,
      email: "clarkkent@gmail.com",
    });

    const linkedUser = {
      id: 42,
      email: "clarkkent@gmail.com",
      googleId: "google-12345",
    };
    const linkSpy = vi
      .spyOn(userStore, "linkGoogleAccount")
      .mockResolvedValue(linkedUser);

    await googleVerifyCallback(
      mockReq,
      "access_tok",
      "refresh_tok",
      mockProfile,
      mockDone,
      userStore,
    );

    expect(linkSpy).toHaveBeenCalledWith(
      42,
      "Google",
      "google-12345",
      "clarkkent@gmail.com",
      undefined,
      "photo.jpg",
    );
    expect(mockDone).toHaveBeenCalledWith(null, linkedUser);
  });

  it("Should create a new user if no match found", async () => {
    vi.spyOn(userStore, "findGoogleUser").mockResolvedValue(null);
    vi.spyOn(userStore, "findEmail").mockResolvedValue(null);

    const createSpy = vi
      .spyOn(userStore, "create")
      .mockResolvedValue({ id: 100 });

    await googleVerifyCallback(
      mockReq,
      "access_tok",
      "refresh_tok",
      mockProfile,
      mockDone,
      userStore,
    );

    expect(createSpy).toHaveBeenCalled();
    expect(mockDone).toHaveBeenCalled();
  });
});

describe("Testing Auth Endpoint", () => {
  // Maintained the agent instance to track cookies across requests
  const agent = request.agent(app);

  it("should successfully register test-user", async () => {
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

  it("should fail to create test-user again", async () => {
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
    expect(res.body.success).toBe(false);
  });

  it("should fail to get test-user without login", async () => {
    const res = await agent.get("/api/v1/users/me").accept("application/json");

    expect(res.status).toBe(401);
    console.log(res.body);
    expect(res.body.success).toBe(false);
  });

  it("should fail to login random user", async () => {
    const res = await agent
      .post("/api/v1/auth/login")
      .send({
        userName: "random",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .accept("application/json")
      .redirects(1);

    expect(res.body.success).toBe(false);
  });

  it("should fail to login with random password", async () => {
    const res = await agent
      .post("/api/v1/auth/login")
      .send({
        userName: "test-user",
        password: "random",
      })
      .set("Content-Type", "application/json")
      .accept("application/json")
      .redirects(1);

    expect(res.body.success).toBe(false);
  });

  it("should login test-user", async () => {
    const res = await agent
      .post("/api/v1/auth/login")
      .send({
        userName: "test-user",
        password: "test",
      })
      .set("Content-Type", "application/json")
      .accept("application/json")
      .redirects(1);

    expect(res.body.success).toBe(true);
  });

  it("should get test-user", async () => {
    const res = await agent.get("/api/v1/users/me").accept("application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should delete test-user", async () => {
    const res = await agent
      .delete("/api/v1/users/me")
      .accept("application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
