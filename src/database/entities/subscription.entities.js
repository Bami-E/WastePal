import { EntitySchema } from "typeorm";
import { SubscriptionStatus } from "../../types/subscriptionStatus.js";

export const Subscription = new EntitySchema({
  name: "Subscription",
  tableName: "subscriptions",

  columns: {
    subscription_id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },

    status: {
      type: "enum",
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },

    start_date: {
      type: "timestamptz",
    },

    end_date: {
      type: "timestamptz",
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
    },
  },
});