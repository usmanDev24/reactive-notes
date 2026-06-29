import { describe, test, expect, beforeAll, afterAll } from "vitest";
import UserStore from "../../src/model/user-store.mjs";
const userStore = new UserStore();

beforeAll(async () => {
  await userStore.deleteAll("deleteAll");
});

describe("Fuctional Testing Prisma UserStore", () => {
  test("should fail to create new user", async () => {
    try {
      const user = await userStore.create();
    } catch (error) {
      console.error(error.message)
      expect(error)
    }
  });
});

afterAll(async () => {
  await userStore.deleteAll("deleteAll");
});
