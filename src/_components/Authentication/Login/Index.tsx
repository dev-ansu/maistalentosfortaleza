"use client";
import React from "react"
import { LoginSchema, LoginFormType } from "@/_validations/authentication";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Field, Stack, Button, Center, Text } from "@chakra-ui/react"
import Link from "next/link";
import { useAuthContext } from "@/_context/AuthContext";
import { toast } from "react-toastify";
import { PasswordInput } from "@/_components/ui/password-input";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";

export const LoginForm = ()=>{
    const { signIn } = useAuthContext();
    const { register, handleSubmit,watch, formState: { errors, isSubmitting }} = useForm<LoginFormType>({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(LoginSchema)
    });
    const { serverErrors, handleServerError } = useServerErrors(watch);
    
    const onSubmit = async (data: LoginFormType) => {
        try {
            await signIn(data);
        } catch (errors: any) {
            handleServerError(errors)
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>

                <Field.Root invalid={!!errors.email || !!serverErrors.email}>
                    <Field.Label>E-mail</Field.Label>
                    <Input {...register("email")} placeholder="Digite seu e-mail"/>
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="email"/>
                </Field.Root>
                
                <Field.Root invalid={!!errors.password || !!!!serverErrors.password}>
                    <Field.Label>Senha</Field.Label>
                    <PasswordInput {...register("password")} placeholder="********" />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="password"/>
                </Field.Root>

                <Button background="button.cta"
                    mb={6}
                    color="gray.900"
                    size="lg"
                    _hover={{ bg: "#ffb13e"}}
                    loading={isSubmitting}
                    loadingText="Carregando..."
                    type="submit"
                >Acessar</Button>
                <Center>
                    <Link href="/register">
                        <Text cursor="pointer">Ainda não possui conta? <strong>Cadastre-se!</strong></Text>
                    </Link>
                </Center>
            </Stack>
        </form>
    )
}