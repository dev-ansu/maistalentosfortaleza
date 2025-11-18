import { ServerErrors } from "@/components/ui/ServerErrors";
import { useServerErrors } from "@/hooks/useServerErrors";
import { CandidateProfile, CityProps } from "@/types/CandidateProfile";
import { PersonalInfoFormData } from "@/validations/curriculo";
import { Field, ListCollection, Select, Stack, Portal } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface StateItems{
    states: ListCollection<ListStatesProps>;
    candidate: CandidateProfile;
}

export interface ListStatesProps{
    label: string;
    value: string;
}

export const StateItems = ({ states, candidate }: StateItems)=>{
    const {control, formState:{errors}, watch } = useFormContext<PersonalInfoFormData>();
    const { serverErrors, handleServerError } = useServerErrors(watch);
        
    return(
        <Field.Root  invalid={!!errors.stateId}>
            <Field.Label>Estado</Field.Label>
            <Controller 
                control={control}
                name="stateId"
                render={({field}) => (
                        <Select.Root 
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={states}  
                            width="full"
                        >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                            <Select.ValueText placeholder="Selecione um estado" />
                                </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                            <Select.Content>
                                {states.items && states.items.map((state) => (
                                <Select.Item item={state} key={state.value}>
                                    {state.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                                ))}
                            </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )}
            />
            <Field.ErrorText>{errors.stateId?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="state"/>
            </Field.Root>
    )
}