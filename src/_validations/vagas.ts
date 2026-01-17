import { maxLetters } from "@/_hooks/useCountLetters";
import { z } from "zod";

export const validateVagaId = z.object({
  id: z.uuid(),
})

export const SalarySchema = z
  .string()
  .trim()
  .nonempty("Salário é obrigatório.")
  .transform((value) => {
    if (value === "0") return "A combinar";
    return value;
});
export const WorkloadSchema = z
  .string()
  .trim()
  .nonempty("Carga horária obrigatória.")
  .transform((value) => {
    if (value === "0") return "A combinar";
    return value;
  });


export const ExpiresAtSchema = z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Data inválida",
    })
    .refine((value) => {
      const date = new Date(value);
      const today = new Date();
      return date >= today;
    }, { message: "A data de início não pode estar no passado" });



export const createVagaValidation = z.object({
    title: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    
    description: z.string().trim().nonempty({ message: "Campo obrigatório."}).max(maxLetters, {message:`Máximo de ${maxLetters} caracteres.`}),
    
    requirements: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um requisito."}).min(1, {message:"Digite pelo menos um requisito."}).max(100, { message: "Máximo de 100."}),
    
    benefits: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um benefício."}).min(1, {message:"Digite pelo menos um benefício."}).max(100, { message: "Máximo de 100."}),
    
    tags: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos uma tag."}).min(1, {message:"Digite pelo menos uma tag."}).max(100, { message: "Máximo de 100."}),
    
    salary: SalarySchema,
    
    workload: WorkloadSchema,

    expiresAt: ExpiresAtSchema,

    isRemoteFriendly: z.boolean(),
    
    location: z
      .string()
      .trim().max(100, { message: "Apenas 100 caracteres"}).optional(),
    
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
