import { EntitySchema } from "typeorm";

export const Event = new EntitySchema({
  name: "Event",
  tableName: "events",
  columns: {
    id: {
      type: "uuid",
      primary: true,
    },
    eventType: {
      type: "varchar",
    },
    timestamp: {
      type: "timestamptz",
    },
    bookingId: {
      type: "uuid",
      nullable: true,
    },
    payload: {
      type: "jsonb",
    },
    createdAt: {
      type: "timestamptz",
      createDate: true,
    },
  },
  indices: [{ columns: ["eventType"] }, { columns: ["bookingId"] }],
});