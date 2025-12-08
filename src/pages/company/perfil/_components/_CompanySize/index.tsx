import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { CompanyProfileFormData } from "@/_validations/company_profile";
import { createListCollection, Field, Flex, Portal, Select, Stack } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

export const CompanySizeSelect = ()=>{
    const { control, formState: { errors }, watch } = useFormContext<CompanyProfileFormData>();
    const { serverErrors } = useServerErrors(watch);
    const { enums } = useEnumsContext();
    
    const companySizes = createListCollection({
        items: enums && enums.CompanySize.length > 0 ? enums.CompanySize.map((c) => ({
            label: c.label,
            value: c.value
        })): [ { label: '', value: ''}]
    });

    return(
        <Stack w="full">
            <Field.Root w="full" invalid={!!errors.companySize}>
            <Field.Label>Tamanho da empresa</Field.Label>
            <Controller
                control={control}
                name="companySize"
                render={({ field }) => (
                <Select.Root
                    w="full"
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                    collection={companySizes}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Selecione o tamanho da sua empresa" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                    <Select.Positioner>
                        <Select.Content>
                        {companySizes.items.map((companySize) => (
                            <Select.Item item={companySize} key={companySize.value}>
                                {companySize.label}
                            <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                        </Select.Content>
                    </Select.Positioner>
                    </Portal>
                </Select.Root>
                )}
            />
            <Field.ErrorText>{errors.companySize?.message}</Field.ErrorText>
            <ServerErrors serverErrors={serverErrors} field="companySize" />
            </Field.Root>
        </Stack>
    )

}