import { z } from "zod";

export const RegisterFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    //.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    //.regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Contain at least one special character.',
    // })
    .trim(),
  password: z
    .string()
    .min(5, { message: "Be at least 5 characters long" })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export const ResetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export const EditPasswordFormSchema = z.object({
  password: z
    .string()
    .min(5, { message: "Be at least 5 characters long" })
    .trim(),
});

export const InfoFlowSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name cannot be empty" })
      .nullable()
      .refine((val) => val !== null, { message: "Name cannot be null" }),
    subject: z.string().min(1, { message: "Subject cannot be empty" }),
    domain: z.string().nullable().optional(),
    path: z.string().min(1, { message: "Path cannot be empty" }),
    instanceApigee: z.string().nullable(),
    backendId: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.instanceApigee !== "NONE" && data.instanceApigee !== null) {
        return data.domain && data.domain.length > 0;
      }
      return true;
    },
    {
      message: "Domain cannot be empty",
      path: ["domain"],
    }
  )
  .refine(
    (data) => {
      if (data.instanceApigee === "NONE" || data.instanceApigee === null) {
        return data.backendId !== null && typeof data.backendId === "number";
      }
      return true;
    },
    {
      message: "Backend cannot be empty",
      path: ["backendId"],
    }
  );
  
const BodySchema = z.array(
  z.object({
    name: z.string().min(1, { message: "Input cannot be empty" }).trim(),
    type: z.string().min(1, { message: "Please select a type" }).trim(),
  })
);

const HeaderSchema = z.array(
  z.object({
    name: z.string().min(1, { message: "Input cannot be empty" }).trim(),

    type: z.string().min(1, { message: "Please select a type" }).trim(),
  })
);

const QuerySchema = z.array(
  z.object({
    name: z.string().min(1, { message: "Input cannot be empty" }).trim(),

    type: z.string().min(1, { message: "Please select a type" }).trim(),
  })
);

export const InputSchema = z.object({
  BODY: BodySchema,
  HEADER: HeaderSchema,
  QUERY: QuerySchema,
});
export const subOutputsSchema = z.object({
  BODY: BodySchema,
  HEADER: HeaderSchema,
});

const OutputsItemSchema = z.array(
  z.object({
    name: z.string().min(1, { message: "Field cannot be empty" }),

    mapping: z
      .string()
      .regex(/^[a-zA-Z]*$/, {
        message: "no special characters",
      })
      .trim(),
  })
);

export const OutputsSchema = z.object({
  BODY: OutputsItemSchema,
  HEADER: OutputsItemSchema,
});
