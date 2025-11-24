import { ServerErrors } from "@/_components/ui/ServerErrors";
import { LANGUAGE_PROFICIENCY } from "@/_constants";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { InterestAreas } from "@/_types/InterestArea";
import { LanguageFormData } from "@/_validations/language";
import { createListCollection, Field, Portal, Select } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";

export const interestAreaSchema = z.object({
    id: z.array(z.uuid({message: "Id inválido"}).nonempty({message:"Campo obrigatório"}), {message:"Campo obrigatório."}).length(1, {message: "Campo obrigatório."}),
});

export type InterestAreaFormData = z.infer<typeof interestAreaSchema> 

export const InterestAreasSelect = ({ interestAreas }: { interestAreas: InterestAreas[]})=>{
    const { control, watch, formState:{ errors } } = useFormContext<InterestAreaFormData>();
    const { serverErrors } = useServerErrors(watch);
    
    const interestAreasList = createListCollection({
        items: interestAreas && interestAreas.length > 0 ? interestAreas.map((c) => ({
            label: c.name,
            value: c.id
        })): [ { label: '', value: ''}]
    });

    return (
        <Field.Root invalid={!!errors.id || !!serverErrors.id}>
            <Field.Label>Áreas de interesse</Field.Label>
            <Controller 
                control={control}
                name="id"
                render={({field}) => (
                        <Select.Root 
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={interestAreasList}  
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
                                {interestAreasList.items && interestAreasList.items.map((interestArea) => (
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
            <Field.ErrorText>{errors.id?.message}</Field.ErrorText>
            <ServerErrors serverErrors={serverErrors} field="id"/>
            </Field.Root>
    )
}