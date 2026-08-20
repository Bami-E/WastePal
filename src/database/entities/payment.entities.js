import { EntitySchema } from "typeorm";
import { PaymentType, PaymentStatus } from "../../types/paymentStatus.js"

export const Payment = new EntitySchema({
  name: "Payment",
  tableName: "payments",

  columns: {
    payment_id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },

    amount: {
      type: "numeric",
      precision: 10,
      scale: 2,
    },

    payment_type: {
      type: "enum",
      enum: Object.values(PaymentType),
    },

    payment_method: {
      type: "varchar",
      length: 50,
    },

    payment_status: {
      type: "enum",
      enum: Object.values(PaymentStatus),
      default: "pending",
    },

    transaction_reference: {
      type: "varchar",
      unique: true,
      nullable: true,
    },

    created_at: {
      type: "timestamptz",
      createDate: true,
    },

    updated_at: {
      type: "timestamptz",
      updateDate: true,
    },
  },

  relations: {
    payer: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "payer_id",
        referencedColumnName: "id",
      },
      onDelete: "RESTRICT",
    },

    booking: {
      type: "many-to-one",
      target: "Booking",
      joinColumn: {
        name: "booking_id",
        referencedColumnName: "booking_id",
      },
      nullable: true,
      onDelete: "SET NULL",
    },
  },
});