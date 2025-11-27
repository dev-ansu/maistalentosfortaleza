import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { StateProps } from "@/_types/CandidateProfile";
import { PersonalInfoFormData } from "@/_validations/curriculo";
import { Field, ListCollection, Select, Stack, Portal, createListCollection } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

interface StateItems{
    states: StateProps[];
}

export interface ListStatesProps{
    label: string;
    value: string;
}

export const StateItems = ({ states }: StateItems)=>{
    const {control, formState:{errors}, watch } = useFormContext<PersonalInfoFormData>();
    const { serverErrors } = useServerErrors(watch);

    const newStates2 = states.map( state => {
        return {
            label: state.name,
            value: state.id,
        } as ListStatesProps;
    })
    const newStates = createListCollection({
        items: newStates2
    });
        
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
                            collection={newStates}  
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
                                {newStates.items && newStates.items.map((state) => (
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