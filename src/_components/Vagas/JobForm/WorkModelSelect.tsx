import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { VagaFormData } from "@/_validations/vagas";
import { createListCollection, Flex, Field, Select, Portal } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const WorkModelSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors} } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();

    const workModels = createListCollection({
        items: enums ? enums.WorkModel:[],
    });

    return(
        <Flex w="full">
            <Field.Root invalid={!!errors.type || !!serverErrors.type}>
                <Field.Label>Modelo de trabalho</Field.Label>
                <Controller 
                    control={control}
                    name="type"
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                collection={workModels}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder="Selecione um modelo de trabalho" />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {workModels.items && workModels.items.map((item) => (
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
            <Field.ErrorText>{errors.type?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="type"/>
            </Field.Root>
        </Flex>
    )
}