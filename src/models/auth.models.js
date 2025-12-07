import prisma from "../libs/prisma.js";

export async function createOrUpdateForgotPassword(userId, hashedToken, expiresAt) {
  return await prisma.forgotPassword.upsert({
    where: { 
      userId: userId 
    },
    update: {
      token: hashedToken,
      expires_at: expiresAt
    },
    create: {
      userId: userId,
      token: hashedToken,
      expires_at: expiresAt
    }
  });
}

export async function getForgotPasswordByUserId(userId) {
  return await prisma.forgotPassword.findUnique({
    where: { 
      userId: userId 
    }
  });
}


export async function getAllActiveForgotPasswords() {
  return await prisma.forgotPassword.findMany({
    where: {
      expires_at: {
        gt: new Date()
      }
    }
  });
}

export async function updateUserPassword(userId, hashedPassword) {
  return await prisma.user.update({
    where: { 
      id: userId 
    },
    data: {
      password: hashedPassword,
      updated_at: new Date()
    }
  });
}

export async function deleteForgotPasswordByUserId(userId) {
  return await prisma.forgotPassword.delete({
    where: { userId: userId }
  });
}