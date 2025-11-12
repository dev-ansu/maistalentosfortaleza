"use client";
import { RegisterFormType, RegisterSchema } from "@/validations/authentication";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Field, Stack, Button, Center, Text  } from "@chakra-ui/react"
import {
  PasswordInput,
} from "@/components/ui/password-input"

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useServerErrors } from "@/hooks/useServerErrors";
import { ServerErrors } from "@/components/ui/ServerErrors";

export const RegisterForm = ()=>{
    const {signUp} = useAuthContext();
    const { register,handleSubmit, watch, formState: { errors, isSubmitting }} = useForm<RegisterFormType>({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(RegisterSchema)
    });
    const { serverErrors, handleServerError } = useServerErrors(watch);
    const passwordValue = watch("password") || "";

    const rules = [
        { label: "Pelo menos 6 caracteres", test: passwordValue.length >= 6 },
        { label: "Pelo menos 1 letra", test: /[A-Za-z]/.test(passwordValue) },
        { label: "Pelo menos 1 caractere especial", test: /[^A-Za-z0-9]/.test(passwordValue) },
    ];

    const onSubmit = async (data: RegisterFormType) => {
        try {
            await signUp(data);
        } catch (errors: any) {
            handleServerError(errors)
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>

                <Field.Root invalid={!!errors.name || !!serverErrors.name}>
                    <Field.Label>Nome</Field.Label>
                    <Input {...register("name")} placeholder="Digite seu nome" />
                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="name"/>
                </Field.Root>

                <Field.Root invalid={!!errors.email || !!serverErrors.email}>
                    <Field.Label>E-mail</Field.Label>
                    <Input {...register("email")} placeholder="Digite seu e-mail" />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="name"/>
                </Field.Root>
                
                <Field.Root invalid={!!errors.password || !!serverErrors.password}>
                    <Field.Label>Senha</Field.Label>
                    <PasswordInput {...register("password")} placeholder="********" />
                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="name"/>
                     <Stack mt={1}>
                        {rules.map((rule) => (
                        <Text
                            key={rule.label}
                            fontSize="sm"
                            color={rule.test ? "green.400" : "red.400"}
                        >
                            {rule.test ? "✅" : "❌"} {rule.label}
                        </Text>
                        ))}
                    </Stack>
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
                    <Link href="/login">
                        <Text cursor="pointer">Já possui conta? <strong>Faça login!</strong></Text>
                    </Link>
                </Center>
            </Stack>
        </form>
    )
}