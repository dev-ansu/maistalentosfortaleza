import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { VagaFormData } from "@/_validations/vagas";
import { createListCollection, Flex, Field, Select, Portal } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const WorkloadTypeSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors} } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();

    const workloadTypes = createListCollection({
        items: enums ? enums.WorkloadType:[],
    });

    return(
        <Flex w="full">
            <Field.Root invalid={!!errors.workloadType || !!serverErrors.workloadType}>
                <Field.Label>Tipo de carga horária</Field.Label>
                <Controller 
                    control={control}
                    name="workloadType"
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                collection={workloadTypes}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder="Selecione um tipo de carga horária" />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {workloadTypes.items && workloadTypes.items.map((item) => (
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
            <Field.ErrorText>{errors.workloadType?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="workloadType"/>
            </Field.Root>
        </Flex>
    )
}