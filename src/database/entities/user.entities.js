import { EntitySchema } from "typeorm";
import { UserRole } from "../../types/user.js";



export const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },

    firstName: {
      type: "varchar",
      length: 100,
    },

    lastName: {
      type: "varchar",
      length: 100,
    },

    email: {
      type: "varchar",
      unique: true,
      length: 255,
    },

    phoneNumber: {
      type: "varchar",
      unique: true,
      length: 20,
      nullable: true,
    },

    password: {
      type: "varchar",
    },

    role: {
      type: "enum",
      enum: Object.values(UserRole),
    },


    businessName: {
      type: "varchar",
      nullable: true,
    },

    businessType: {
      type: "varchar",
      nullable: true,
    },

    address: {
      type: "varchar",
      nullable: true,
    },

    city: {
      type: "varchar",
      nullable: true,
    },

    state: {
      type: "varchar",
      nullable: true,
    },

    country: {
      type: "varchar",
      nullable: true,
    },

    isVerified: {
      type: "boolean",
      default: false,
    },

    verificationToken: {
      type: "varchar",
      nullable: true,
    },


    otp: {
      type: "varchar",
      nullable: true,
    },

    otpExpiry: {
      type: "timestamptz",
      nullable: true,
    },
    
    createdAt: {
      type: "timestamptz",
      createDate: true,
    },

    updatedAt: {
      type: "timestamptz",
      updateDate: true,
    },

    deletedAt: {
      type: "timestamptz",
      deleteDate: true,
      nullable: true,
    },
  }
});