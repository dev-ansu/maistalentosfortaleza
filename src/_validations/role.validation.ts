import { z } from "zod";


export const createRoleValidation = z.object({
    name: z.string().trim().nonempty({ message: "Campo obrigatório."}).max(50, { message: "Limite de 50 caracteres."}),
    description: z.string().trim().nonempty({ message: "Campo obrigatório."}).max(250, { message: "Limite de 250 caracteres."})
})


export type RoleFormData = z.infer<typeof createRoleValidation>;