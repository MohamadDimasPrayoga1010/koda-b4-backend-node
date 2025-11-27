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


export async function getAllUser({ page = 1, limit = 10, search = "" }) {

  const skip = (page - 1) * limit;

  const whereClause = search
    ? {
        OR: [
          { fullname: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : {};

  const totalItems = await prisma.user.count({ where: whereClause });
  const totalPages = Math.ceil(totalItems / limit);

  const links = {
    next: page < totalPages ? `/users?limit=${limit}&page=${page + 1}` : null,
    back: page > 1 ? `/users?limit=${limit}&page=${page - 1}` : null,
  };

  const users = await prisma.user.findMany({
    where: whereClause,
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
    orderBy: { id: "asc" },
    skip,
    take: limit,
  });

  return {
    data: users,
    pagination: { page, limit, totalItems, totalPages },
    links,
  };
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

export async function createUserAdmin({ fullname, email, password, phone, address, role, image }) {
  if (!password) throw new Error("Password harus diisi"); 

  const hashedPassword = await argon2.hash(password);

  return await prisma.user.create({
    data: {
      fullname,
      email,
      password: hashedPassword,
      role: role || "user",
      profile: {
        create: {
          image: image || null,
          phone: phone || null,
          address: address || null,
        },
      },
    },
    include: {
      profile: true,
    },
  });
}


export async function editUserModel({ userId, fullname, email, password, phone, address, file }) {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) throw new Error("User tidak ditemukan");

  let hashedPassword = user.password;
  if (password) {
    hashedPassword = await argon2.hash(password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      fullname: fullname || user.fullname,
      email: email || user.email,
      password: hashedPassword,
      profile: {
        update: {
          image: file ? file.filename : (user.profile ? user.profile.image : null),
          phone: phone || (user.profile ? user.profile.phone : null),
          address: address || (user.profile ? user.profile.address : null),
        },
      },
    },
    include: { profile: true },
  });

  return updatedUser;
}


export async function deleteUserModel(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User tidak ditemukan");

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: { id: true },
  });

  for (const t of transactions) {
    await prisma.transactionItem.deleteMany({
      where: { transactionId: t.id },
    });
  }

  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.cart.deleteMany({ where: { userId } });
  await prisma.forgotPassword.deleteMany({ where: { userId } });
  await prisma.profile.deleteMany({ where: { userId } });
  const deletedUser = await prisma.user.delete({ where: { id: userId } });

  return deletedUser;
}