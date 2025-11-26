import { ServerErrors } from "@/_components/ui/ServerErrors"
import { useServerErrors } from "@/_hooks/useServerErrors"
import { CandidateProfile } from "@/_types/CandidateProfile"
import { CompanyProfile } from "@/_types/CompanyProfile"
import { CompanyProfileFormData } from "@/_validations/company_profile"
import { Checkbox, Field, Flex, Input, Stack, Textarea } from "@chakra-ui/react"
import { Controller, useController, useFormContext } from "react-hook-form"

export const DadosBasicos = ({ company }: { company: CompanyProfile | undefined})=>{
    
    const { register, control, formState:{ errors }} = useFormContext<CompanyProfileFormData>();
    const { serverErrors } = useServerErrors();

    const enabled = useController({
        control: control,
        name: "isActive",
    });
    
    return(
        <Flex w="full" direction="column">
            <Stack w="full" direction={{ base: "column", md: "row" }}>
                <Field.Root invalid={!!errors.name || !!serverErrors.name}>
                    <Field.Label>Nome da empresa</Field.Label>
                    <Input value={company?.name} {...register("name")} placeholder="Nome da empresa"/>
                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="name"/>
                </Field.Root>
                <Field.Root invalid={!!errors.cnpj || !!serverErrors.cnpj}>
                    <Field.Label>CNPJ</Field.Label>
                    <Input value={company?.cnpj} {...register("cnpj")} placeholder="Digite o nome do cargo"/>
                    <Field.HelperText>Apenas números, ex: 12345678910111</Field.HelperText>
                    <Field.ErrorText>{errors.cnpj?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="cnpj"/>
                </Field.Root>
                <Field.Root invalid={!!errors.website || !!serverErrors.website}>
                    <Field.Label>Website</Field.Label>
                    <Input value={company?.website} {...register("website")} placeholder="Digite o nome do cargo"/>
                    <Field.HelperText>Opcional</Field.HelperText>
                    <Field.ErrorText>{errors.website?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="website"/>
                </Field.Root>
            </Stack>
            <Stack>
                <Field.Root invalid={!!errors.description || !!serverErrors.description}>
                    <Field.Label>Sobre a empresa</Field.Label>
                    <Textarea
                        value={company?.description}
                        maxLength={500}
                        placeholder="Somos uma empresa há 10 anos no mercado..."
                        {...register("description")}
                    />
                    <Field.HelperText>Limite de 500 caracteres.</Field.HelperText>
                    <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="description"/>
                </Field.Root>
            </Stack>
            <Field.Root mt="4">
                <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                        <Field.Root  invalid={!!errors.isActive} disabled={field.disabled}>
                        <Checkbox.Root
                            defaultChecked={company?.isActive}
                            checked={field.value}
                            onCheckedChange={({ checked }) => field.onChange(checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control cursor="pointer" />
                            <Checkbox.Label cursor="pointer">Ativo</Checkbox.Label>
                        </Checkbox.Root>
                        <Field.HelperText w="xs">
                            Gostaria de desativar o perfil por um tempo? Desmarcando esta opção nenhuma vaga da sua empresa será mostrada para os candidatos.
                        </Field.HelperText>
                        <Field.ErrorText>
                            {errors.isActive?.message}
                        </Field.ErrorText>
                        </Field.Root>
                    )}
                    />
                </Field.Root>
        </Flex>
    )
}
