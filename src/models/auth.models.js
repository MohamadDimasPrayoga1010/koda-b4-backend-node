import prisma from "../libs/prisma.js";

export async function forgotPasswordModel(userId, otp, expiresAt) {
  return prisma.forgotPassword.upsert({
    where: { userId },
    update: {
      token: otp,
      expires_at: expiresAt,
    },
    create: {
      userId,
      token: otp,
      expires_at: expiresAt,
    },
  });
}

export const setUserOtp = async (email, otp, expiresAt) => {
  return prisma.user.update({
    where: { email },
    data: {
      reset_otp: otp,
      reset_expires: expiresAt,
    },
  });
};

export const findUserByOtp = async (email, otp) => {
  return prisma.user.findFirst({
    where: {
      email,
      reset_otp: otp,
      reset_expires: {
        gt: new Date(), 
      },
    },
  });
};

export const clearUserOtp = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      reset_otp: null,
      reset_expires: null,
    },
  });
};

export const setUserPassword = async (userId, hashedPassword) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};