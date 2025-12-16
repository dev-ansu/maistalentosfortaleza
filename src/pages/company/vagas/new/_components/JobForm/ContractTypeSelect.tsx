import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { VagaFormData } from "@/_validations/vagas";
import { createListCollection, Flex, Field, Select, Portal } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const ContractTypeSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors}} = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();


    const contractTypes = createListCollection({
        items: enums ? enums.ContractType:[],
    });

    return(
        <Flex w="full">
            <Field.Root invalid={!!errors.contractType || !!serverErrors.contractType}>
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