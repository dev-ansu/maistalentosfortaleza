"use client";
import { RegisterFormType, RegisterSchema } from "@/_validations/authentication";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Field, Stack, Button, Center, Text, Select, createListCollection, Portal  } from "@chakra-ui/react"
import {
  PasswordInput,
} from "@/_components/ui/password-input"

import Link from "next/link";
import { useAuthContext } from "@/_context/AuthContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { USER_TYPES } from "@/_constants";
import { useEnumsContext } from "@/_context/EnumsContext";

export const RegisterForm = ()=>{
    const { enums } = useEnumsContext();
    const {signUp} = useAuthContext();
    const { register, control, handleSubmit, watch, formState: { errors, isSubmitting }} = useForm<RegisterFormType>({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            userType: [USER_TYPES.candidate as 'candidate']
        }
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

    const userTypes = createListCollection({
        items: enums ? enums.UserType:[]
    });

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

                <Field.Root invalid={!!errors.userType || !!serverErrors.userType}>
                    <Field.Label>Você quer trabalhar ou contratar?</Field.Label>
                    <Controller 
                        control={control}
                        name="userType"
                        render={({field}) => (
                                <Select.Root
                                    defaultValue={[USER_TYPES.candidate]} 
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={({ value }) => field.onChange(value)}
                                    onInteractOutside={() => field.onBlur()}
                                    collection={userTypes}  
                                    width="full"
                                >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                    <Select.ValueText placeholder="Selecione uma opção" />
                                        </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                    <Select.Content>
                                        {userTypes.items && userTypes.items.map((userType) => (
                                        <Select.Item item={userType} key={userType.value}>
                                            {userType.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                        ))}
                                    </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        )}
                    />
                    <Field.ErrorText>{errors.userType?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="userType"/>
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