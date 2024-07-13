import { z } from "zod";

export const DairySchema = z.object({
  title: z.string().trim().refine((value) => value.length > 0, {
    message: "Title cannot be empty"
  }),
  body: z.string().trim().refine((value) => value.length > 0, {
    message: "Body cannot be empty"
  }),
});