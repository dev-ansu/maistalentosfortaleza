import { CitiesItems } from "@/_components/CitySelect"
import { StateItems } from "@/_components/StateSelect"
import { ServerErrors } from "@/_components/ui/ServerErrors"
import { StateProps } from "@/_types/CandidateProfile"
import { CompanyProfile } from "@/_types/CompanyProfile"
import { CompanyProfileFormData } from "@/_validations/company_profile"
import { Checkbox, Field, Flex, Input, Stack, Textarea } from "@chakra-ui/react"
import { Controller, useController, useFormContext } from "react-hook-form"
import { CompanySizeSelect } from "../_CompanySize"
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext"

export const DadosBasicos = ({ company, states }: { company: CompanyProfile | undefined, states: StateProps[]})=>{
    const { serverErrors } = useServerErrorsContext();
    const { register, control, formState:{ errors }, watch} = useFormContext<CompanyProfileFormData>();
   
    const enabled = useController({
        control: control,
        name: "isActive",
        defaultValue: true,
    });
    
    return(
        <Flex w="full" direction="column" gap="4">
            <Stack w="full" direction={{ base: "column", md: "row" }}>
                <Field.Root invalid={!!errors.name || !!serverErrors.name}>
                    <Field.Label>Nome da empresa</Field.Label>
                    <Input {...register("name")} placeholder="Nome da empresa"/>
                    <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="name"/>
                </Field.Root>
                <Field.Root invalid={!!errors.cnpj || !!serverErrors.cnpj}>
                    <Field.Label>CNPJ</Field.Label>
                    <Input {...register("cnpj")} placeholder="Digite o CNPJ da empresa"/>
                    <Field.HelperText>Apenas números, ex: 12345678910111</Field.HelperText>
                    <Field.ErrorText>{errors.cnpj?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="cnpj"/>
                </Field.Root>
                <Field.Root invalid={!!errors.website || !!serverErrors.website}>
                    <Field.Label>Website</Field.Label>
                    <Input  {...register("website")} placeholder="Digite o website da empresa (opcional)"/>
                    <Field.HelperText>Opcional</Field.HelperText>
                    <Field.ErrorText>{errors.website?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="website"/>
                </Field.Root>
            </Stack>
            <Stack w="full" direction={{ base: "column", md: "row" }}>
                <Field.Root w="full" invalid={!!errors.foundedYear || !!serverErrors.foundedYear}>
                    <Field.Label>Ano de fundação</Field.Label>
                    <Input {...register("foundedYear")} placeholder="Ano de fundação"/>
                    <Field.ErrorText>{errors.foundedYear?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="foundedYear"/>
                </Field.Root>
                <CompanySizeSelect />
            </Stack>
            <Stack>
                <Field.Root invalid={!!errors.description || !!serverErrors.description}>
                    <Field.Label>Sobre a empresa</Field.Label>
                    <Textarea
                        maxLength={500}
                        placeholder="Somos uma empresa há 10 anos no mercado..."
                        {...register("description")}
                    />
                    <Field.HelperText>Limite de 500 caracteres.</Field.HelperText>
                    <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="description"/>
                </Field.Root>
            </Stack>
            <Field.Root flexDir="column" w="full">
                <Flex w="full">
                    <StateItems states={states}  />
                    <CitiesItems city={company?.city} />
                </Flex>
                <Flex w="full">
                <Field.Root invalid={!!errors.address || !!serverErrors.address}>
                    <Field.Label>Endereço completo</Field.Label>
                    <Input {...register("address")} placeholder="Endereço completo"/>
                    <Field.ErrorText>{errors.address?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="address"/>
                </Field.Root>
                <Field.Root invalid={!!errors.zipCode || !!serverErrors.zipCode}>
                    <Field.Label>CEP</Field.Label>
                    <Input {...register("zipCode")} placeholder="CEP"/>
                    <Field.ErrorText>{errors.zipCode?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="zipCode"/>
                </Field.Root>
                </Flex>

            </Field.Root>
            <Field.Root>
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
