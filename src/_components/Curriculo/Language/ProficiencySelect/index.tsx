import { ServerErrors } from "@/_components/ui/ServerErrors";
import { LANGUAGE_PROFICIENCY } from "@/_constants";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { LanguageFormData } from "@/_validations/language";
import { createListCollection, Field, Portal, Select } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";


export const ProficiencySelect = ()=>{
    const { enums } = useEnumsContext();
    const { control, watch, formState:{ errors } } = useFormContext<LanguageFormData>();
    const { serverErrors } = useServerErrors(watch);
    
    const languageProficiencies = createListCollection({
        items: enums ? enums.LanguageProficiency: [ { label: '', value: ''}]
    });

    return (
        <Field.Root invalid={!!errors.proficiency || !!serverErrors.proficiency}>
            <Field.Label>Proficiência</Field.Label>
            <Controller 
                control={control}
                name="proficiency"
                render={({field}) => (
                        <Select.Root 
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={languageProficiencies}  
                            width="full"
                        >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                            <Select.ValueText placeholder="Selecione a proficiência" />
                                </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                            <Select.Content>
                                {languageProficiencies.items && languageProficiencies.items.map((degree) => (
                                <Select.Item item={degree} key={degree.value}>
                                    {degree.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                                ))}
                            </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )}
            />
            <Field.ErrorText>{errors.proficiency?.message}</Field.ErrorText>
            <ServerErrors serverErrors={serverErrors} field="proficiency"/>
            </Field.Root>
    )
}