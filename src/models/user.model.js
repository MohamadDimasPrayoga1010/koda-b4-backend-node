import prisma from "../libs/prisma.js";
import argon2 from "argon2";

export async function createUser(fullname, email, password, role = "user", created_at) {
  const hashedPassword = await argon2.hash(password);
  return await prisma.user.create({
    data: { fullname, email, password: hashedPassword, role, created_at },
  });
}


export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}
