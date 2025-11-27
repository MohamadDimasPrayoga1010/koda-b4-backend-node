import prisma from "../libs/prisma.js";
import argon2 from "argon2";

export async function createUser(
  fullname,
  email,
  password,
  role = "user",
  created_at
) {
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

export async function getAllUser() {
  return await prisma.user.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
      profile: {
        select: {
          image: true,
          phone: true,
          address: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
      profile: {
        select: {
          image: true,
          phone: true,
          address: true,
        },
      },
    },
  });
}

export async function createUserAdmin(data) {
  const hashedPassword = await argon2.hash(data.password);

  return await prisma.user.create({
    data: {
      fullname: data.fullname,
      email: data.email,
      password: hashedPassword,
      role: data.role || "user",
      profile: {
        create: {
          image: data.image || null,
          phone: data.phone || null,
          address: data.address || null,
        },
      },
    },
    include: {
      profile: true,
    },
  });
}

