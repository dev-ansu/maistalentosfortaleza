import { z } from "zod";

export const startDateSchema = z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Data inválida",
    })
    .refine((value) => {
      const date = new Date(value);
      const today = new Date();
      return date <= today;
    }, { message: "A data de início deve estar no passado" });

export const endDateSchema = z
  .string()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: "Data inválida",
  })

export const educationValidationSchema = z.object({
  degree: z
    .array(z.string().nonempty({ message: "O campo é obrigatório." }), {message:"Escolha um nível de escolaridade válido."})
    .length(1, "Selecione um nível de escolaridade válido."),

  fieldOfStudy: z.string().nonempty({ message: "O campo é obrigatório." }).max(50, 'Limite de 50 caracteres'),

  institution: z.string().nonempty({ message: "O campo é obrigatório." }).max(50, 'Limite de 50 caracteres'),

  startDate: startDateSchema,

  endDate: endDateSchema,

  currentlyStudying: z.boolean().optional(),
})
.refine((data) => {
  // Se o aluno NÃO estiver estudando atualmente, endDate é obrigatória
  if (!data.currentlyStudying && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: "A data de término é obrigatória quando não está estudando atualmente.",
  path: ["endDate"],
})
.refine((data) => {
  // Se existe endDate, precisa ser >= startDate
  if (data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true;
}, {
  message: "A data de término deve ser depois da data de início.",
  path: ["endDate"],
});

export type EducationFormData = z.infer<typeof educationValidationSchema>