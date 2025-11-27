import { z } from "zod"

const phoneRegex = /^\d{10,11}$/;

const birthdateSchema = z
  .string()
  .refine((value) => !isNaN(Date.parse(value)), {
    message: "Data inválida",
  })
  .refine((value) => {
    const date = new Date(value);
    const today = new Date();
    return date < today;
  }, { message: "A data deve estar no passado" })
  .refine((value) => {
    const date = new Date(value);
    const minAge = new Date();
    minAge.setFullYear(minAge.getFullYear() - 14);
    return date <= minAge;
  }, { message: "É necessário ter pelo menos 14 anos" });


export const phoneSchema = z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // remove máscara
    .refine((val) => phoneRegex.test(val), {
    message: "Telefone inválido",
});

const whatsappSchema = z
    .string()
    .transform((val) => val.replace(/\D/g, "")) // remove máscara
    .refine((val) => val.length === 11, {
    message: "WhatsApp deve conter 11 dígitos (com DDD)",
});

export const personalInfoSchema = z.object({
    birthdate: birthdateSchema,
    whatsapp: whatsappSchema,
    phone: phoneSchema,
    summary: z.string().optional(),
    stateId: z
    .array(z.uuid(), {message: "Id inválido."})
    .length(1, "Selecione um estado válido"),

    cityId: z
    .array(z.uuid(), {message: "Id inválido."})
    .length(1, "Selecione uma cidade válida"),
});


export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>