import { z } from "zod";

export const createLanguageSchema = z.object({
    name: z.string().nonempty({message:"O campo é obrigatório."}).max(50, "Limite de 50 caracteres."),
    proficiency: z
    .array(z.string().nonempty({ message: "O campo é obrigatório." }), {message:"Escolha uma proficiência válida."})
    .length(1, "Selecione uma proficiência válida.")
});

export type LanguageFormData = z.infer<typeof createLanguageSchema>;