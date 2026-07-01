import { prisma } from "./prisma.js";
import { hash, compare } from "bcrypt";

export default class UserStore {
  async create(
    userName,
    provider,
    googleId,
    password,
    email,
    unverified_email,
    verified,
    firstName,
    lastName,
    avatarUrl,
  ) {
    if (password) {
      password = await hash(password, 10);
    }
    const user = await prisma.user.create({
      data: {
        userName,
        provider,
        googleId,
        password,
        email,
        unverified_email,
        verified,
        firstName,
        lastName,
        avatarUrl,
      },
    });
    return user;
  }
  async updatePassword(id, password) {
    if (password) password = await hash(password, 10);
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  }
  async updateUserName(id, userName) {
    return prisma.user.update({
      where: { id },
      data: { userName },
    });
  }
  async updateProfile(id, firstName, lastName, avatarUrl) {
    return prisma.user.update({
      where: { id },
      data: { firstName, lastName, avatarUrl },
    });
  }
  async setVerified(id, unverified_email) {
    return prisma.user.update({
      where: { id },
      data: {
        verified: true,
        email: unverified_email,
        unverified_email: null,
        verification_code: null,
      },
    });
  }
  async setCode(id, verification_code) {
    return prisma.user.update({
      where: { id },
      data: {
        verification_code,
      },
    });
  }
  async getCode(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { verification_code: true },
    });
  }
  async updateEmail(id, email) {
    return prisma.user.update({
      where: { id },
      data: { unverified_email: email },
    });
  }
  async linkGoogleAccount(id, provider, googleId, avatarUrl) {
    return prisma.user.update({
      where: { id },
      data: {
        provider,
        googleId,
        verified: true,
        unverified_email: null,
        avatarUrl,
      },
    });
  }
  async findGoogleUser(googleId) {
    return prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async verifyPassword(email, userName, password) {
    if (userName) {
      const user = await prisma.user.findUnique({
        where: { userName },
        select: { password: true },
      });
      return compare(password, user.password);
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });
    return compare(password, user.password);
  }

  async read(id, userName) {
    if (id) {
      return prisma.user.findUnique({
        where: { id },
      });
    }
    return prisma.user.findUnique({
      where: { userName },
    });
  }

  async delete(id) {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return null;
  }
  async deleteAll(confirm) {
    if (confirm === "deleteAll") {
      const toDelete = await prisma.user.deleteMany();
    }
  }
}
