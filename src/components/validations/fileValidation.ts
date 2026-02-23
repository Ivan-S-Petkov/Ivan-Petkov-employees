import { z } from "zod";

const FILE_TYPE_ERROR = "File must be a CSV.";

export const fileSchema = z.object({
  name: z.string().endsWith(".csv", { message: FILE_TYPE_ERROR }),
  type: z
    .string()
    .refine((val) => val === "text/csv" || val === "application/vnd.ms-excel", {
      message: FILE_TYPE_ERROR,
    }),
});
