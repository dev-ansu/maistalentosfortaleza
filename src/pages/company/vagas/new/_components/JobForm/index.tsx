import { CitiesItems } from "@/_components/CitySelect";
import { StateItems } from "@/_components/StateSelect";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { CityProps, StateProps } from "@/_types/CandidateProfile";
import { VagaFormData } from "@/_validations/vagas"
import { Button, Checkbox, createListCollection, Field, Flex, Input, Portal, Select, Span, Stack, TagsInput, Textarea } from "@chakra-ui/react"
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

                <Flex gap="4" direction="column" w="full">

                    <BasicData states={states} city={city}  />
                    
                    <SalaryWorkloadAndLocation />
                    
                    <Flex gap="2" w="full">

                        <ContractTypeSelect />
                        
                        <SenioritySelect />

                    </Flex>

                </Flex>

                <Flex gap="2">
                    <Button mt="4" type="submit">Salvar</Button>
                    <Button mt="4" type="submit" bg="button.cta">Publicar vaga</Button>
                </Flex>
            </form>
        </Flex>
    )
}


const BasicData = ({states, city}: Props)=>{
    const {serverErrors} = useServerErrors();
    const { register, formState:{ errors }} = useFormContext<VagaFormData>();

    return(
        <Flex direction="column" gap="2" w="full">
            <Flex gap="2" w="full">
                <Field.Root invalid={!!errors.title || !!serverErrors.title}>
                    <Field.Label>Título da vaga</Field.Label>
                    <Input {...register("title")} placeholder="Digite o título da vaga"/>
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
        <Flex direction={{ base: "column", md: "row" }} w="full" gap="2">
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

            <Controller
                control={control}
                name="tags"
                render={( {field, fieldState} ) => {                
                return(
                    <Field.Root invalid={!!errors.tags}>
                        <TagsInput.Root
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                invalid={!!errors.tags}
                            >
                            <TagsInput.Label>Tags</TagsInput.Label>
                            <TagsInput.Control>
                                <TagsInput.Items  />
                                <TagsInput.Input placeholder="Pressione enter para adicionar um novo benefício" />
                            </TagsInput.Control>
                            <Field.ErrorText>{errors.tags?.message}</Field.ErrorText>
                            <Field.HelperText>Ex.: desenvolvedor, backend, fullstack e etc.</Field.HelperText>
                        </TagsInput.Root>
                    </Field.Root>)
                }
                }
            />
        </Flex>
    )
}

const SalaryWorkloadAndLocation = ()=>{
    const {serverErrors} = useServerErrors();
    const { control, register, formState:{ errors }} = useFormContext<VagaFormData>();
    
    return(
        <Flex direction="column" w="full" gap="2">

            <Flex gap="2" w="full">
                <Field.Root invalid={!!errors.salary || !!serverErrors.salary}>
                    <Field.Label>Salário</Field.Label>
                    <Input {...register("salary")} placeholder='Digite o salário. Use 0(zero) para "a combinar"'/>
                    <Field.ErrorText>{errors.salary?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="salary"/>
                    <Field.HelperText>Digite 0(zero) para "a combinar".</Field.HelperText>
                </Field.Root>
                <Field.Root invalid={!!errors.workload || !!serverErrors.workload}>
                    <Field.Label>Carga horária (diária)</Field.Label>
                    <Input {...register("workload")} placeholder='Digite a carga horária (diária). Use 0(zero) para "a combinar"'/>
                    <Field.ErrorText>{errors.workload?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="workload"/>
                    <Field.HelperText>Digite 0(zero) para "a combinar".</Field.HelperText>
                </Field.Root>
            </Flex>
            <Field.Root invalid={!!errors.location || !!serverErrors.location}>
                <Field.Label>Endereço da vaga</Field.Label>
                <Input {...register("location")} placeholder="Digite o endereço da vaga"/>
                <Field.ErrorText>{errors.location?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="location"/>
                <Field.HelperText>Opcional</Field.HelperText>
            </Field.Root>

            <Field.Root mt="4">
                <Controller
                    control={control}
                    name="isRemoteFriendly"
                    render={({ field }) => (
                        <Field.Root  invalid={!!errors.isRemoteFriendly} disabled={field.disabled}>
                        <Checkbox.Root
                            checked={field.value}
                            onCheckedChange={({ checked }) => field.onChange(checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control cursor="pointer" />
                            <Checkbox.Label cursor="pointer">Aceita trabalho remoto?</Checkbox.Label>
                        </Checkbox.Root>
                        <Field.ErrorText>
                            {errors.isRemoteFriendly?.message}
                        </Field.ErrorText>
                        </Field.Root>
                    )}
                />
            </Field.Root>
            
        </Flex>
    )
}

const ContractTypeSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors}, watch } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrors(watch);

    const contractTypes = createListCollection({
        items: enums ? enums.ContractType:[],
    });

    return(
        <Flex w="full">
            <Field.Root invalid={!!errors.stateId}>
                <Field.Label>Tipo de contrato</Field.Label>
                <Controller 
                    control={control}
                    name="contractType"
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                collection={contractTypes}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder="Selecione um tipo de contrato" />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {contractTypes.items && contractTypes.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    ))}
                                </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}
                />
            <Field.ErrorText>{errors.contractType?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="contractType"/>
            </Field.Root>
        </Flex>
    )
}

const SenioritySelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors}, watch } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrors(watch);

    const seniority = createListCollection({
        items: enums ? enums.Seniority:[],
    });

    return(
        <Flex w="full">
            <Field.Root  invalid={!!errors.stateId}>
                <Field.Label>Senhoridade da vaga</Field.Label>
                <Controller 
                    control={control}
                    name="seniority"
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                collection={seniority}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder="Selecione a senhoridade da vaga" />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {seniority.items && seniority.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    ))}
                                </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}
                />
                <Field.ErrorText>{errors.seniority?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="seniority"/>
                <Field.HelperText>Opcional</Field.HelperText>
            </Field.Root>
        </Flex>
    )
}