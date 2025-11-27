import prisma from "../libs/prisma.js";
import argon2 from "argon2";

export async function createUser(fullname, email, password, role = "user") {
  const hashedPassword = await argon2.hash(password);
  return await prisma.user.create({
    data: { fullname, email, password: hashedPassword, role },
  });
}


export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}
