"use client";
import React from "react"
import { LoginSchema, LoginFormType } from "@/validations/authentication";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Field, Stack, Button, Center, Text } from "@chakra-ui/react"
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

export const LoginForm = ()=>{
    const { signIn } = useAuthContext();
    const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginFormType>({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit = async (data: LoginFormType) => {
        await signIn(data);
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>

                <Field.Root invalid={!!errors.email}>
                    <Field.Label>E-mail</Field.Label>
                    <Input {...register("email")} placeholder="Digite seu e-mail"/>
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>
                
                <Field.Root invalid={!!errors.password}>
                    <Field.Label>Senha</Field.Label>
                    <Input {...register("password")} type="password" placeholder="********" />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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