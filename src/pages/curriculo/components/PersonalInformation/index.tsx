import { createListCollection, Field, Flex, Input, ListCollection, Portal, Select, Stack, Text } from "@chakra-ui/react"
import { useForm } from "react-hook-form";

interface PersonalInformationProps{
    states: StateProps[];
}

interface ListStatesProps{
    label: string;
    value: string;
}

export const PersonalInformation = ({states}: PersonalInformationProps)=>{
    const newStates2 = states.map( state => {
        return {
            label: state.name,
            value: state.id,
        } as ListStatesProps;
    })
    const newStates = createListCollection({
        items: newStates2
    });
    const {register, handleSubmit, formState:{ errors, isSubmitting}} = useForm();

    return(
        <Flex direction="column"  w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Informações pessoais</Text>
            <form>
                <Flex gap="16px" direction="column">
                    <Stack>
                        <Field.Root invalid={!!errors.birthdate}>
                            <Field.Label>Data de nascimento</Field.Label>
                            <Input {...register("birthdate")} placeholder="Data de nascimento" type="date"/>
                            {/* <Field.ErrorText>{errors.email?.message}</Field.ErrorText> */}
                            {/* <ServerErrors serverErrors={serverErrors} field="email"/> */}
                        </Field.Root>
                    </Stack>
                    <Stack direction="row">
                        <Field.Root invalid={!!errors.whatsapp}>
                            <Field.Label>WhatsApp</Field.Label>
                            <Input {...register("whatsapp")} placeholder="Digite seu WhatsApp"/>
                            {/* <Field.ErrorText>{errors.email?.message}</Field.ErrorText> */}
                            {/* <ServerErrors serverErrors={serverErrors} field="email"/> */}
                        </Field.Root>
                        <Field.Root invalid={!!errors.phone}>
                            <Field.Label>Telefone</Field.Label>
                            <Input {...register("phone")} placeholder="Digite seu telefone" />
                            {/* <Field.ErrorText>{errors.email?.message}</Field.ErrorText> */}
                            {/* <ServerErrors serverErrors={serverErrors} field="email"/> */}
                        </Field.Root>
                    </Stack>
                    <Stack direction="row">
                        <Field.Root invalid={!!errors.whatsapp}>
                            <StateItems states={newStates} />
                        </Field.Root>
                        <Field.Root invalid={!!errors.phone}>
                            <Field.Label>Cidade</Field.Label>
                            <Input {...register("cityId")} placeholder="Digite seu telefone" />
                            {/* <Field.ErrorText>{errors.email?.message}</Field.ErrorText> */}
                            {/* <ServerErrors serverErrors={serverErrors} field="email"/> */}
                        </Field.Root>
                    </Stack>
                </Flex>
            </form>
        </Flex>
    )
}

export interface StateProps{
    id: string;
    name: string;
}

const StateItems = ({ states }: {states: ListCollection<ListStatesProps>})=>{
    
    return(
        <>
            <Select.Root collection={states} size="sm" width="full">
                <Select.HiddenSelect />
                <Select.Label>Selecione um estado</Select.Label>
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
        </>    
    )
}