import { z } from "zod";

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

  const ExpiresAtSchema = z
  .preprocess((value) => {
    if (!value) return undefined;
    if (typeof value === "string" || value instanceof Date) {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date({ message: "Data de expiração obrigatória." }))
  .refine(
    (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
    { message: "A data de expiração não pode ser no passado." }
  );



export const createVagaValidation = z.object({
    title: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    
    description: z.string().trim().nonempty({ message: "Campo obrigatório."}),
    
    requirements: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um requisito."}).min(1, {message:"Digite pelo menos um requisito."}),
    
    benefits: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos um benefício."}).min(1, {message:"Digite pelo menos um benefício."}),
    
    tags: z.array(z.string().trim().nonempty({ message:"Campo obrigatório"}), { message: "Digite pelo menos uma tag."}).min(1, {message:"Digite pelo menos uma tag."}),
    
    salary: SalarySchema,
    
    workload: WorkloadSchema,

    expiresAt: ExpiresAtSchema,

    isRemoteFriendly: z.boolean(),
    
    location: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    
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
