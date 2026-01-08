import { CitiesItems } from "@/_components/CitySelect";
import { StateItems } from "@/_components/StateSelect";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { VagaFormData } from "@/_validations/vagas";
import { Flex, Field, Input, Textarea } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { BenefitsAndRequirements } from "./BenefitsAndRequirements";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";

interface Props{
    states: StateProps[];
    city: CityProps;
}

export const BasicData = ({states, city}: Props)=>{
    const { register, formState:{ errors }} = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();
    
    return(
        <Flex direction="column" gap="2" w="full">
            <Flex gap="2" w="full">
                <Field.Root invalid={!!errors.title || !!serverErrors.title}>
                    <Field.Label>Título da vaga</Field.Label>
                    <Input {...register("title")} placeholder="Digite o título da vaga"/>
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="title"/>
                </Field.Root>
                <Field.Root invalid={!!errors.expiresAt || !!serverErrors.expiresAt}>
                    <Field.Label>Data de expiração</Field.Label>
                    <Input {...register("expiresAt")} type="date" placeholder="Digite a data de expiração da vaga"/>
                    <Field.ErrorText>{errors.expiresAt?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="expiresAt"/>
                </Field.Root>
            </Flex>
            <Field.Root w="full" invalid={!!errors.description || !!serverErrors.description}>
                <Field.Label>Sobre a vaga</Field.Label>
                <Textarea
                    maxLength={500}
                    placeholder="Somos uma empresa há 10 anos no mercado..."
                    {...register("description")}
                />
                <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="description"/>
            </Field.Root>
            <Flex w="full" gap="2">
                <StateItems states={states}  />
                <CitiesItems city={city}/>
            </Flex>
            <BenefitsAndRequirements />
        </Flex>
    )
}