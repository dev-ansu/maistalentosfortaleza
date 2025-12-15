import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { VagaFormData } from "@/_validations/vagas";
import { Flex, Field, TagsInput } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const BenefitsAndRequirements = ()=>{
    const { serverErrors } = useServerErrors();
    const {control, formState:{ errors }} = useFormContext<VagaFormData>();

    return(
        <Flex direction={{ base: "column", md: "row" }} w="full" gap="2">
            <Controller
                control={control}
                name="requirements"
                render={( {field, fieldState} ) => {                
                return(
                    <Field.Root invalid={!!errors.requirements || !!serverErrors.requirements}>
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
                            <ServerErrors serverErrors={serverErrors} field="requirements" />
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
                    <Field.Root invalid={!!errors.benefits || !!serverErrors.benefits}>
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
                            <ServerErrors serverErrors={serverErrors} field="benefits" />
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
                    <Field.Root invalid={!!errors.tags || !!serverErrors.tags}>
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
                            <ServerErrors serverErrors={serverErrors} field="tags" />
                        </TagsInput.Root>
                    </Field.Root>)
                }
                }
            />
        </Flex>
    )
}