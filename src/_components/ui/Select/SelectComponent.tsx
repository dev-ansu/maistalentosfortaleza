import { ServerErrors } from "@/_components/ui/ServerErrors";
import { Flex, Field, Select, Portal, ListCollection, createListCollection } from "@chakra-ui/react";
import { Controller, Control, FieldErrors, FieldValues, Path } from "react-hook-form";

interface SelectProps<T extends FieldValues>{
    control: Control<T>;
    error?: string;
    serverErrors: any;
    items: any; 
    name: Path<T>;
    title: string;
}

export function SelectComponent<T extends FieldValues>({name, control, error, serverErrors, items, title = "Selecione uma opção"}: SelectProps<T>){

    const list = createListCollection({
        items: [
            { label: "Nenhum", value: "" },
            ...(items ? items : []),
        ],
    });

    return(
        <Flex w="full">
            <Field.Root  invalid={!!error || !!serverErrors[name]}>
                <Field.Label>{title}</Field.Label>
                <Controller 
                    control={control}
                    name={name}
                    render={({field}) => (
                            <Select.Root 
                                name={field.name}
                                value={field.value ?? []}
                                onValueChange={({ value }) => {
                                    if (value[0] === "") {
                                    field.onChange([]); // 🔥 LIMPA
                                    } else {
                                    field.onChange(value);
                                    }
                                }}
                                onInteractOutside={field.onBlur}
                                collection={list}  
                                width="full"
                            >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                <Select.ValueText placeholder={title} />
                                    </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                <Select.Content>
                                    {list.items && list.items.map((item) => (
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
                <Field.ErrorText>{error}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field={name}/>
                <Field.HelperText>Opcional</Field.HelperText>
            </Field.Root>
        </Flex>
    )
}
