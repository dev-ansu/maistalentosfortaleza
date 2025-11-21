import { ServerErrors } from "@/_components/ui/ServerErrors";
import { DEGREE_LEVEL } from "@/_constants";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { EducationFormData } from "@/_validations/education";
import { createListCollection, Field, Portal, Select } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";


export const EducationDegree = ()=>{
    const { control, watch, formState:{ errors } } = useFormContext<EducationFormData>();
    const { serverErrors } = useServerErrors(watch);
    
    const degreeLevels = createListCollection({
        items: DEGREE_LEVEL.length > 0 ? DEGREE_LEVEL.map((c) => ({
            label: c.name,
            value: c.id
        })): [ { label: '', value: ''}]
    });

    return (
        <Field.Root invalid={!!errors.degree}>
            <Field.Label>Nível de escolaridade</Field.Label>
            <Controller 
                control={control}
                name="degree"
                render={({field}) => (
                        <Select.Root 
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={degreeLevels}  
                            width="full"
                        >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                            <Select.ValueText placeholder="Selecione uma escolaridade" />
                                </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                            <Select.Content>
                                {degreeLevels.items && degreeLevels.items.map((degree) => (
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
            <Field.ErrorText>{errors.degree?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="degree"/>
            </Field.Root>
    )
}