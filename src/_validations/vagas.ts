import { z } from "zod";

export const SalarySchema = z.string().nonempty("Salário é obrigatório.").transform( value => {
    const parsed = Number(value.replace(/\./g, "").replace(",","."))
    if(parsed === 0) return "a combinar";
    if(isNaN(parsed) || parsed < 0) return undefined;
    return parsed;
}).pipe(
    z.union([
        z.number().positive(), 
    ])
);

export const WorkloadSchema = z.string()
.nonempty("Carga horária obrigatória.")
.transform( value => {
    const parsed = Number(value);
    if(parsed === 0) return "a combinar";
    if(isNaN(parsed) || parsed < 0) return undefined;
    return parsed;
}).pipe(
    z.union([
    z.number().positive(),
    ])
)

export const createVagaValidation = z.object({
    title: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    
    description: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    
    requirements: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um requisito."}).min(1, {message:"Digite pelo menos um requisito."}),
    
    benefits: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um benefício."}).min(1, {message:"Digite pelo menos um benefício."}),
    
    tags: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos uma tag."}).min(1, {message:"Digite pelo menos uma tag."}),
    
    salary: SalarySchema,
    
    workload: WorkloadSchema,
    
    isRemoteFriendly: z.boolean().default(false),
    
    location: z.string().transform( value => value.trim())
    .transform( value => value === "" ? undefined: value).optional(),
    
    contractType: z
        .array(z.string().nonempty("Campo obrigatório."), {message:"Selecione um tipo de contrato."})
        .length(1, "Selecione um tipo de contrato."),
    
    seniority: z
        .array(z.string().nonempty("Campo obrigatório."), {message:"Selecione uma senhoridade."}).optional(),
    workloadType: z
        .array(z.string().nonempty("Campo obrigatório."), {message:"Selecione um tipo de carga horária."})
        .length(1, "Selecione um tipo de carga horária."),
    type: z
        .array(z.string().nonempty("Campo obrigatório."), {message:"Selecione um tipo de trabalho."})
        .length(1, "Selecione um tipo de trabalho."),

    stateId: z
        .array(z.uuid(), {message: "Id inválido."})
        .length(1, "Selecione um estado válido"),

    cityId: z
        .array(z.uuid(), {message: "Id inválido."})
        .length(1, "Selecione uma cidade válida"),
    
});


export type VagaFormData = z.infer<typeof createVagaValidation>;
