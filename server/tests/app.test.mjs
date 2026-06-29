
import { app } from '../src/app.mjs';

import { describe, it, expect } from 'vitest'
import {  default as  request } from 'supertest';

const agent = request.agent(app);

describe ("Testing Api", () => {
  it(" GET / should return 404", () => {
      agent.get('/hello')
        .expect(404)
  })
  it("GET /api/v1/auth/google", () => {
      agent.get('/api/v1/auth/google')
        .expect(200)
  })
})

