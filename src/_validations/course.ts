import { z } from "zod";

export const createCourseSchema = z.object({
    institution: z.string().trim().nonempty({message: "Campo obrigatório."}),
    title: z.string().trim().nonempty({message: "Campo obrigatório."}),
    hours: z.string().refine(( value )=>{
        return /[0-9]/.test(value);
    }, {message: "Digite um número inteiro válido, ex: 50, 64, 110..."}),
    completionDate: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
        message: "Data inválida",
    })
    .refine((value) => {
        const date = new Date(value);
        const today = new Date();
        return date <= today;
    }, { message: "A data de conclusão deve estar no passado." }),
});

export type CourseFormData = z.infer<typeof createCourseSchema>;