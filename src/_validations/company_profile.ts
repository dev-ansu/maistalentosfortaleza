import { z } from "zod";
import { phoneSchema } from "./curriculo";

export const companyProfileSchema = z.object({
    name: z.string().trim().nonempty({message:"Campo obrigatório."}).max(100, {message: "Limite de 100 caracteres."}),
    cnpj: z.string().regex(/^\d{14}$/, {message:"O CNPJ deve ter exatamente 14 dígitos."} ),
    website: z.string()
    .transform(val => val.trim())
    .refine(
        val => val === "" || /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}$/i.test(val),
        { message: "Informe um endereço válido (ex: https://www.site.com)" }
    )
    .optional(),
    description: z.string().trim().nonempty({message:"Campo obrigatório."}).max(500, {message: "Limite de 500 caracteres."}),
    isActive: z.boolean(),
    phone: phoneSchema,
    contactEmail: z.email({message:"Digite um e-mail válido."}).trim().toLowerCase(),
    instagram: z.string()
        .trim()
        .url("Insira um link válido.")
        .regex(/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/, "Informe um link válido do Instagram.")
        .optional()
        .or(z.literal("")),

    facebook: z.string()
        .trim()
        .url("Insira um link válido.")
        .regex(/^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._-]+\/?$/, "Informe um link válido do Facebook.")
        .optional()
        .or(z.literal("")),

    linkedin: z.string()
        .trim()
        .url("Insira um link válido.")
        .regex(/^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9._-]+\/?$/, "Informe um link válido do LinkedIn.")
        .optional()
        .or(z.literal("")),
    stateId: z
        .array(z.uuid(), {message: "Id inválido."})
        .length(1, "Selecione um estado válido"),

    cityId: z
        .array(z.uuid(), {message: "Id inválido."})
        .length(1, "Selecione uma cidade válida"),
    companyInterest: z.array(z.uuid({message: "Id inválido."}).nonempty({message:"O campo é obrigatório."}), {message:"Deve ser um conjunto de valores."}).nonempty({message: "O campo é obrigatório."})
});


export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>