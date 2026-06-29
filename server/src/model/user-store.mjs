import { prisma } from "./prisma.mjs";
import {hash, compare} from "bcrypt"


export default class UserStore {
  async create(userName, provider, googleId, password, email, isVerified, firstName, lastName, avatarUrl) {
    if (password) {
      password = await hash(password, 10)
    }
    const user = await prisma.user.create({
      data: {
        userName,
        provider,
        googleId,
        password,
        email,
        isVerified,
        firstName,
        lastName,
        avatarUrl
      },
      omit : {password: true}
    })
    return user
  }
  async updatePassword(id, password) {
    if (password) password = await hash(password, 10)
    return prisma.user.update({
      where: {id}, 
      data: {password},
      omit: {password: true}
    })
  }
  async updateUserName (id, userName) {
    return prisma.user.update({
      where: {id}, 
      data: {userName},
      omit: {password: true}
    })
  }
  async updateProfile (id, firstName, lastName, avatarUrl) {
    return prisma.user.update({
      where: {id}, 
      data: {firstName, lastName, avatarUrl},
      omit: {password: true}
    })
  }
  async setVerified(id) {
    return prisma.user.update({
      where: {id}, 
      data: {isVerified:  true},
      omit: {password: true}
    })
  }
  async updateEmail (id, email) {
    return prisma.user.update({
      where: {id}, 
      data: {email},
      omit: {password: true}
    })
  }
  async linkGoogleAccount(id,  provider, googleId,  avatarUrl) {
    return prisma.user.update({
      where: {id},
      data : {
        provider,
        googleId,
        isVerified : true,
        avatarUrl
      },
      omit: {password: true}
    })
  }
  async findGoogleUser(googleId) {
    return prisma.user.findUnique({
      where: { googleId },
      omit: { password: true}
    })
  }

  async findEmail (email) {
    return prisma.user.findUnique({
      where: { email },
      omit: { password: true}
    })
  }

  async verifyPassword (email, password) {
    const user = await prisma.user.findUnique({
      where: {email}
    })
    return compare(password, user.password)
  }

  async read(id, userName) {
    if (id) {
      return prisma.user.findUnique({
        where: { id },
        omit: { password: true}
      })
    }
    return prisma.user.findUnique({
      where : { userName },
      omit: { password: true}
    })
  }

  async delete(id) {
    await prisma.user.delete({
      where: {
        id
      }
    })
    return null
  }
  async deleteAll(confirm) {
    if (confirm === "deleteAll") {
      const toDelete =  await prisma.user.deleteMany()
    }
  }
}