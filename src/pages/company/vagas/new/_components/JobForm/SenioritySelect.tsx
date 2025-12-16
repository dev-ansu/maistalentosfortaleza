import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { VagaFormData } from "@/_validations/vagas";
import { createListCollection, Flex, Field, Select, Portal } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const SenioritySelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors} } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();

    const seniority = createListCollection({
        items: enums ? enums.Seniority:[],
    });

    return(
        <Flex w="full">
            <Field.Root  invalid={!!errors.seniority || !!serverErrors.seniority}>
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