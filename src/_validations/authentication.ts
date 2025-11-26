import { UserType } from "../_types/CandidateProfile"
import { z } from "zod"

export const LoginSchema = z.object({
    email: z.email("Digite um e-mail válido."),
    password: z.string().nonempty("A senha é obrigatória.")
});


export const RegisterSchema = z.object({
    name: z.string().trim().nonempty('O nome é obrigatório.').min(2, "O nome deve ter no mínimo dois caracteres.")
    .min(2, "O nome deve ter no mínimo dois caracteres.")
    .refine((val) => val.replace(/\s/g, "").length > 0, {
      message: "O nome não pode conter apenas espaços.",
    }),
    userType: z.array(z.enum(['candidate', 'company'], { message: "Escolha uma opção válida."})),
    email: z.email("Digite um e-mail válido.").trim().toLowerCase(),
    password: z.string("A senha é obrigatória.").trim().nonempty("A senha não pode estar vazia.")
    .min(6, "Míninmo 6 caracteres.")
    .regex(/[A-Za-z]/, "A senha deve conter pelo menos 1 letra.")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos 1 caractere especial.")
});

export type LoginFormType = z.infer<typeof LoginSchema>
export type RegisterFormType = z.infer<typeof RegisterSchema>;