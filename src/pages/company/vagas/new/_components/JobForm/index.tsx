import { CitiesItems } from "@/_components/CitySelect";
import { StateItems } from "@/_components/StateSelect";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { VagaFormData } from "@/_validations/vagas"
import { Button, Field, Flex, Input, Span, Stack, TagsInput, Textarea } from "@chakra-ui/react"
import { Controller,  useFormContext } from "react-hook-form"

interface Props{
    states: StateProps[];
    city: CityProps;
}

export const JobForm = ({ states, city }: Props)=>{
    const { handleSubmit } = useFormContext<VagaFormData>();
    
    const onSubmit = (data: VagaFormData)=>{
        console.log(data);
    }
    
    return(
        <Flex w="full">
            <form  onSubmit={handleSubmit(onSubmit)} style={{ width:"100%"}}>
                <BasicData states={states} city={city}  />
                <Button type="submit">Salvar</Button>
            </form>
        </Flex>
    )
}


const BasicData = ({states, city}: Props)=>{
    const {serverErrors} = useServerErrors();
    const {control, register, formState:{ errors }} = useFormContext<VagaFormData>();

    return(
        <Flex direction="column" gap="2" w="full">
            <Flex gap="2" w="full">
                <Field.Root invalid={!!errors.title || !!serverErrors.title}>
                    <Field.Label>Título da vaga</Field.Label>
                    <Input {...register("title")} placeholder="Digite o telefone da empresa"/>
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="title"/>
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


const BenefitsAndRequirements = ()=>{
    const {serverErrors} = useServerErrors();
    const {control, formState:{ errors }} = useFormContext<VagaFormData>();
    return(
        <Flex w="full" gap="2">
        <Controller
            control={control}
            name="requirements"
            render={( {field, fieldState} ) => {                
               return(
                <Field.Root invalid={!!errors.requirements}>
                    <TagsInput.Root
                            maxW="full"
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            invalid={!!errors.requirements}
                        >
                        <TagsInput.Label>Requisitos</TagsInput.Label>
                        <TagsInput.Control>
                            <TagsInput.Items  />
                            <TagsInput.Input placeholder="Pressione enter para adicionar um requisito" />
                        </TagsInput.Control>
                        <Field.ErrorText>{errors.requirements?.message}</Field.ErrorText>
                    </TagsInput.Root>
                </Field.Root>)
            }
            }
        />

        <Controller
            control={control}
            name="benefits"
            render={( {field, fieldState} ) => {                
               return(
                <Field.Root invalid={!!errors.benefits}>
                    <TagsInput.Root
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            invalid={!!errors.benefits}
                        >
                        <TagsInput.Label>Benefícios</TagsInput.Label>
                        <TagsInput.Control>
                            <TagsInput.Items  />
                            <TagsInput.Input placeholder="Pressione enter para adicionar um novo benefício" />
                        </TagsInput.Control>
                        <Field.ErrorText>{errors.benefits?.message}</Field.ErrorText>
                   
                    </TagsInput.Root>
                </Field.Root>)
            }
            }
        />
        </Flex>
    )
}
