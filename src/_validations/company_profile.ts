import { z } from "zod";

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
    isActive: z.boolean()
});


export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>