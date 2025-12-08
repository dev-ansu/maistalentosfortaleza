import { z } from "zod";

export const createVagaValidation = z.object({
    title: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    description: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    requirements: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um requisito."}).min(1, {message:"Digite pelo menos um requisito."}),
    benefits: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um benefício."}).min(1, {message:"Digite pelo menos um benefício."}),
    stateId: z
        .array(z.uuid(), {message: "Id inválido."})
        .length(1, "Selecione um estado válido"),

    cityId: z
        .array(z.uuid(), {message: "Id inválido."})
        .length(1, "Selecione uma cidade válida"),
    
});


export type VagaFormData = z.infer<typeof createVagaValidation>;
