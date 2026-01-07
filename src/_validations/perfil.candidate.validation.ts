import { z } from "zod";
import { passwordSchema } from "./authentication";


export const perfilCandidateValidation = z.object({
    name: z.string().trim().nonempty({message:"Campo obrigatório."}),
    isActive: z.boolean(),
})

// Schema para alteração de senha
export const passwordChangeValidation = z.object({
  current_password: z.string().min(1, 'Senha atual é obrigatória'),
  password: passwordSchema,
  password_confirmation: z.string().min(1, 'Confirmação de senha é obrigatória')
})
.superRefine((data, ctx) => {
  // Verifica se a nova senha é diferente da atual
  if (data.current_password === data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A nova senha deve ser diferente da senha atual',
      path: ['password']
    });
  }

  // Verifica se as senhas coincidem
  if (data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'As senhas não coincidem',
      path: ['password_confirmation']
    });
  }
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeValidation>;

export type PerfilFormData = z.infer<typeof perfilCandidateValidation>;