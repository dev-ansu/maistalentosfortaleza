import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { InterestAreas } from "@/_types/InterestArea";
import { CompanyProfileFormData } from "@/_validations/company_profile";
import { createListCollection, Field, Flex, Portal, Select, Stack } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

export const AreasAtuacao = ({ interestAreas }: { interestAreas: InterestAreas[]})=>{
    const { control, formState: { errors } } = useFormContext<CompanyProfileFormData>();
    const { serverErrors } = useServerErrorsContext();
    
    const interestAreasList = createListCollection({
        items: interestAreas && interestAreas.length > 0 ? interestAreas.map((c) => ({
            label: c.name,
            value: c.id
        })): [ { label: '', value: ''}]
    });

    return(
        <Stack mt="4" gap="4">
            <Field.Root w="full" invalid={!!errors.companyInterest || !!serverErrors.companyInterest}>
            <Field.Label>Áreas de atuação da empresa</Field.Label>
            <Controller
                control={control}
                name="companyInterest"
                render={({ field }) => (
                <Select.Root
                    w="full"
                    multiple
                    name={field.name}
                    value={field.value}
                    onValueChange={({ value }) => field.onChange(value)}
                    onInteractOutside={() => field.onBlur()}
                    collection={interestAreasList}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Selecione as áreas de atuação da empresa" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                    <Select.Positioner>
                        <Select.Content>
                        {interestAreasList.items.map((interestArea) => (
                            <Select.Item item={interestArea} key={interestArea.value}>
                                {interestArea.label}
                            <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                        </Select.Content>
                    </Select.Positioner>
                    </Portal>
                </Select.Root>
                )}
            />
            <Field.ErrorText>{errors.companyInterest?.message}</Field.ErrorText>
            <ServerErrors serverErrors={serverErrors} field="companyInterest" />
            </Field.Root>
        </Stack>
    )

}