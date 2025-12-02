import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { PersonalInfoFormData } from "@/_validations/curriculo";
import { createListCollection, Field, Flex, Portal, Select, Text } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

export const Diversity = ()=>{
    const { enums } = useEnumsContext();
    const { control, watch, formState:{ errors } } = useFormContext<PersonalInfoFormData>();
    const { serverErrors } = useServerErrors(watch);
    
    const genders = createListCollection({
        items: enums ? enums.Gender: [ { label: '', value: ''}]
    });
    const ethnicities = createListCollection({
        items: enums ? enums.Ethnicity: [ { label: '', value: ''}]
    });

    return(
        <Flex w="full" direction="column">
            <Text w="full" fontSize="14px" borderBottomWidth="1px" borderBottomColor="gray.700">Diversidade</Text>
            <Flex mt="4" gap="2">
                <Field.Root invalid={!!errors.gender || !!serverErrors.gender}>
                <Field.Label>Gênero</Field.Label>
                <Controller 
                    control={control}
                    name="gender"
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                collection={genders}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder="Selecione seu gênero" />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {genders.items && genders.items.map((gender) => (
                                    <Select.Item item={gender} key={gender.value}>
                                        {gender.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    ))}
                                </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}
                />
                <Field.ErrorText>{errors.gender?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="gender"/>
                </Field.Root>

                <Field.Root invalid={!!errors.ethnicity || !!serverErrors.ethnicity}>
                <Field.Label>Raça/cor</Field.Label>
                <Controller 
                    control={control}
                    name="ethnicity"
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => field.onChange(value)}
                                onInteractOutside={() => field.onBlur()}
                                collection={ethnicities}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder="Como você se autoidentifica? raça/cor" />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {ethnicities.items && ethnicities.items.map((ethnicity) => (
                                    <Select.Item item={ethnicity} key={ethnicity.value}>
                                        {ethnicity.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    ))}
                                </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )}
                />
                <Field.ErrorText>{errors.ethnicity?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="ethnicity"/>
                </Field.Root>
            </Flex>
        </Flex>
    )
}