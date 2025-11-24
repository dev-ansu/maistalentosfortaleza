import { z } from "zod"
import { endDateSchema, startDateSchema } from "./education";


export const createExperienceSchema = z.object({
    company: z.string().nonempty({message:"O campo é obrigatório"}).max(50, 'Limite de 50 caracteres'),
    position: z.string().nonempty({message:"O campo é obrigatório."}).max(50, 'Limite de 50 caracteres'),
    description: z.string().nonempty({message:"O campo é obrigatório."}).max(250, 'Limite de 250 caracteres'),
    startDate: startDateSchema,
    endDate: endDateSchema,
    currentlyWorking: z.boolean().optional(),
})
.refine((data) => {
  // Se o aluno NÃO estiver trabalhando atualmente, endDate é obrigatória
  if (!data.currentlyWorking && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: "A data de término é obrigatória quando não está trabalhando atualmente.",
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
;


export type ExperienceFormData = z.infer<typeof createExperienceSchema>