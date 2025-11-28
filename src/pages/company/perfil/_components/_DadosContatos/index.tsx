import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { CompanyProfileFormData } from "@/_validations/company_profile";
import { Field, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export const DadosContatos = ({ company }: { company: CompanyProfile | undefined})=>{
    const { register, formState:{ errors }} = useFormContext<CompanyProfileFormData>();
    const { serverErrors } = useServerErrors();

    return(
        <Flex w="full" direction="column" mt="4" gap="4">
            <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Dados de contato</Text>
            <Stack w="full" direction={{ base: "column", md: "row" }}>
                <Field.Root invalid={!!errors.phone || !!serverErrors.phone}>
                    <Field.Label>Telefone</Field.Label>
                    <Input {...register("phone")} placeholder="Digite o telefone da empresa"/>
                    <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="phone"/>
                </Field.Root>
                <Field.Root invalid={!!errors.contactEmail || !!serverErrors.contactEmail}>
                    <Field.Label>E-mail para contato</Field.Label>
                    <Input {...register("contactEmail")} placeholder="Digite um e-mail para contato"/>
                    <Field.HelperText>Apenas números, ex: 12345678910111</Field.HelperText>
                    <Field.ErrorText>{errors.contactEmail?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="contactEmail"/>
                </Field.Root>
            </Stack>
            <Stack w="full" direction={{ base: "column", md: "row" }}>
                <Field.Root invalid={!!errors.instagram || !!serverErrors.instagram}>
                    <Field.Label>Instagram</Field.Label>
                    <Input {...register("instagram")} placeholder="Digite o instagram da empresa"/>
                    <Field.HelperText>Opcional (https://instagram.com/nome_usuario)</Field.HelperText>
                    <Field.ErrorText>{errors.instagram?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="instagram"/>
                </Field.Root>
                <Field.Root invalid={!!errors.facebook || !!serverErrors.facebook}>
                    <Field.Label>Facebook</Field.Label>
                    <Input {...register("facebook")} placeholder="Digite o facebook da empresa"/>
                    <Field.HelperText>Opcional</Field.HelperText>
                    <Field.ErrorText>{errors.facebook?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="facebook"/>
                </Field.Root>
                <Field.Root invalid={!!errors.linkedin || !!serverErrors.linkedin}>
                    <Field.Label>Linkedin</Field.Label>
                    <Input {...register("linkedin")} placeholder="Digite o linkedin da empresa"/>
                    <Field.HelperText>Opcional</Field.HelperText>
                    <Field.ErrorText>{errors.linkedin?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="linkedin"/>
                </Field.Root>
            </Stack>
        </Flex>
    )

}