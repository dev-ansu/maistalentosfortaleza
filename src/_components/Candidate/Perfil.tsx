import { ServerErrors } from "@/_components/ui/ServerErrors"
import { useServerErrors } from "@/_hooks/useServerErrors"
import { PasswordChangeFormData, passwordChangeValidation, perfilCandidateValidation, PerfilFormData } from "@/_validations/perfil.candidate.validation";
import { Button, Checkbox, Field, Flex, Input, Text } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { UserProfile } from "../../pages/candidate/perfil"
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";
import { useAuthContext } from "@/_context/AuthContext";

export const Perfil = ({ candidate }: { candidate: UserProfile })=>{
    
    const {handleSubmit, control, register, formState:{ errors, isSubmitting }} = useForm<PerfilFormData>({
        mode: "all",
        criteriaMode: "all",
        defaultValues: {
            name: candidate.name,
            isActive: candidate?.isActive,
        },
        resolver: zodResolver(perfilCandidateValidation),
    });
    const {serverErrors, handleServerError} = useServerErrors();
    const {reloadUserData} = useAuthContext();

    const onSubmit = async(data: PerfilFormData)=>{
        try{
            const api = getAPIClient();
            const response = await api.patch("/user/patch", data)
            toast.success(response.data.message);
            reloadUserData();
        }catch(error: any){
            handleServerError(error);
        }
    }

    return(
        <Flex w="full">
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <Flex mt="4" w="full">
                    <Field.Root invalid={!!errors.name || !!serverErrors.name}>
                        <Field.Label>Nome completo</Field.Label>
                        <Input w="full" {...register("name")} placeholder="Nome completo" type="text"/>
                        <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="name"/>
                    </Field.Root>
                </Flex>

                   <Field.Root mt="4">
                    <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                            <Field.Root  invalid={!!errors.isActive || !!serverErrors.isActive} disabled={field.disabled}>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                                <Checkbox.Label cursor="pointer">
                                    Quer dar uma 
                                    {candidate.isActive ? " pausa":" retornar"}? 
                                    {candidate.isActive ? " Desmarque ":" Marque "}
                                     para {candidate.isActive ? " desativar ":" ativar "} o perfil.</Checkbox.Label>
                            </Checkbox.Root>
                            <Field.ErrorText>
                                {errors.isActive?.message}
                            </Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="isActive"/>
                            </Field.Root>
                        )}
                        />
                    </Field.Root>
                    <Button disabled={isSubmitting} mt="4" type="submit" bg="button.cta">
                        Salvar                        
                    </Button>
            </form>
        </Flex>
    )
}


export const PasswordChange = ()=>{

    const {handleSubmit,reset,register, formState:{ errors, isSubmitting }} = useForm<PasswordChangeFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(passwordChangeValidation),
    });
    const {serverErrors, handleServerError} = useServerErrors();

    const onSubmit = async(data: PasswordChangeFormData)=>{

        try{
            const api = getAPIClient();
            const response = await api.patch("/user/change-password", data)
            toast.success(response.data.message);
            reset();
        }catch(error: any){
            handleServerError(error);
        }
    }

    return(
        <Flex w="full">
            <form onSubmit={handleSubmit(onSubmit)} style={{ width:"100vw" }}>
                <Flex w="full" gap="4" direction="column" mt="4">
                    <Flex w="full" gap="4" direction="column">
                        
                        <Field.Root invalid={!!errors.current_password || !!serverErrors.current_password}>
                            <Field.Label>Senha atual</Field.Label>
                            <Input w="full" {...register("current_password")} placeholder="Senha atual" type="password"/>
                            <Field.ErrorText>{errors.current_password?.message}</Field.ErrorText>
                            <ServerErrors serverErrors={serverErrors} field="current_password"/>
                        </Field.Root>

                        <Flex w="full" gap="4">
                            <Field.Root invalid={!!errors.password || !!serverErrors.password}>
                                <Field.Label>Nova senha</Field.Label>
                                <Input w="full" {...register("password")} placeholder="Nova senha" type="password"/>
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                                <ServerErrors serverErrors={serverErrors} field="password"/>
                            </Field.Root>
                            <Field.Root invalid={!!errors.password_confirmation || !!serverErrors.password_confirmation}>
                                <Field.Label>Confirmação de nova senha</Field.Label>
                                <Input w="full" {...register("password_confirmation")} placeholder="Confirmação de nova senha" type="password"/>
                                <Field.ErrorText>{errors.password_confirmation?.message}</Field.ErrorText>
                                <ServerErrors serverErrors={serverErrors} field="password_confirmation"/>
                            </Field.Root>
                        </Flex>
                    </Flex>
                    <Button disabled={isSubmitting} mt="4" type="submit" bg="button.cta">
                        Alterar senha                        
                    </Button>
                </Flex>
            </form>
        </Flex>
    )
}