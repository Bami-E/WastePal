import { AppDataSource } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";

const userRepository = AppDataSource.getRepository("User");

export const getProfile = async (userId) => {
  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      businessName: true,
      businessType: true,
      address: true,
      city: true,
      state: true,
      country: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  return user;
};

export const updateProfile = async (userId, payload) => {
  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  const {
    firstName,
    lastName,
    phoneNumber,
    businessName,
    businessType,
    address,
    city,
    state,
    country,
  } = payload;

  if (phoneNumber && phoneNumber !== user.phoneNumber) {
    const existingPhone = await userRepository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (existingPhone) {
      throw new AppError(
        "Phone number already exists",
        409,
        "PHONE_NUMBER_ALREADY_EXISTS"
      );
    }
  }

  if (firstName !== undefined) {
    user.firstName = firstName;
  }

  if (lastName !== undefined) {
    user.lastName = lastName;
  }

  if (phoneNumber !== undefined) {
    user.phoneNumber = phoneNumber;
  }

  if (businessName !== undefined) {
    user.businessName = businessName;
  }

  if (businessType !== undefined) {
    user.businessType = businessType;
  }

  if (address !== undefined) {
    user.address = address;
  }

  if (city !== undefined) {
    user.city = city;
  }

  if (state !== undefined) {
    user.state = state;
  }

  if (country !== undefined) {
    user.country = country;
  }

  await userRepository.save(user);

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    businessName: user.businessName,
    businessType: user.businessType,
    address: user.address,
    city: user.city,
    state: user.state,
    country: user.country,
    role: user.role,
    updatedAt: user.updatedAt,
  };
};