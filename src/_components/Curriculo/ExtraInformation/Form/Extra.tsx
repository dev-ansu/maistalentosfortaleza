import { ServerErrors } from "@/_components/ui/ServerErrors"
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { PersonalInfoFormData } from "@/_validations/curriculo";
import { Checkbox, createListCollection, Field, Flex, Input, Portal, Select, Stack, Text } from "@chakra-ui/react"
import { Controller, useController, useFormContext } from "react-hook-form"


export const Extra = ()=>{
    const { register, control, formState: { errors }, watch } = useFormContext<PersonalInfoFormData>();
    const { serverErrors } = useServerErrors(watch);
    const { enums } = useEnumsContext();
     const workModels = createListCollection({
        items: enums ? enums.WorkModel: [ { label: '', value: ''}]
    });

    const isAvailable = useController({
        control: control,
        name: "isAvailable",
        defaultValue: true,
    });

    const willingnessToTravel = useController({
        control: control,
        name: "willingnessToTravel",
        defaultValue: false,
    });
    const willingnessToRelocate = useController({
        control: control,
        name: "willingnessToRelocate",
        defaultValue: false,
    });

    return(
        <Flex w="full" direction="column">
            <Text w="full" fontSize="14px" borderBottomWidth="1px" borderBottomColor="gray.700">Preferências de trabalho, viagem e etc.</Text>
            <Flex direction="column" mt="4" w="full" gap="2">
                <Stack w="full" direction="column">
                    <Stack direction={{ base:"column", md: "row" }}>
                    <Field.Root invalid={!!errors.email}>
                        <Field.Label>E-mail alternativo</Field.Label>
                        <Input {...register("email")} placeholder="Digite um e-mail alternativo"/>
                        <Field.ErrorText><Field.ErrorIcon size="xs"></Field.ErrorIcon> {errors.email?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="email"/>
                    </Field.Root>

                    <Field.Root invalid={!!errors.salaryExpectation}>
                        <Field.Label>Pretensão salarial</Field.Label>
                        <Input {...register("salaryExpectation")} placeholder="Digite sua pretensão salarial, ex.: 1000,50; 1518.00; 5000"/>
                        <Field.ErrorText><Field.ErrorIcon size="xs"></Field.ErrorIcon> {errors.salaryExpectation?.message}</Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="salaryExpectation"/>
                    </Field.Root>
                    </Stack>
                    <Stack w="full">
                        <Field.Root w="full" invalid={!!errors.workModel}>
                            <Field.Label>Modelos de trabalho</Field.Label>
                            <Controller
                                control={control}
                                name="workModel"
                                render={({ field }) => (
                                <Select.Root
                                    w="full"
                                    multiple
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={({ value }) => field.onChange(value)}
                                    onInteractOutside={() => field.onBlur()}
                                    collection={workModels}
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Selecione os modelos de trabalho pelo quais se interessa" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                        {workModels.items.map((workModel) => (
                                            <Select.Item item={workModel} key={workModel.value}>
                                                {workModel.label}
                                            <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                                )}
                            />
                            <Field.ErrorText>{errors.workModel?.message}</Field.ErrorText>
                            </Field.Root>
                    </Stack>
                </Stack>
                <Field.Root invalid={!!errors.salaryExpectation}>
                    <Field.Label>URL do portfólio</Field.Label>
                    <Input {...register("portfolioUrl")} placeholder="Você tem um portfólio? Deixe a URL aqui."/>
                    <Field.ErrorText> {errors.portfolioUrl?.message}</Field.ErrorText>
                    <Field.HelperText>Opcional</Field.HelperText>
                    <ServerErrors serverErrors={serverErrors} field="portfolioUrl"/>
                </Field.Root>
                <Field.Root mt="4">
                    <Controller
                        control={control}
                        name="isAvailable"
                        render={({ field }) => (
                            <Field.Root  invalid={!!errors.isAvailable} disabled={field.disabled}>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                                <Checkbox.Label cursor="pointer">Disponível para trabalhar no momento?</Checkbox.Label>
                            </Checkbox.Root>
                                <Field.HelperText>Desmarcando esta opção o seu perfil fica 'invisível' para novas oportunidades.</Field.HelperText>
                            <Field.ErrorText>
                                <Field.ErrorIcon size="xs"></Field.ErrorIcon> 
                                {errors.isAvailable?.message}
                            </Field.ErrorText>
                            </Field.Root>
                        )}
                        />
                    </Field.Root>
                    <Stack>
                        <Field.Root mt="4">
                        <Controller
                            control={control}
                            name="willingnessToTravel"
                            render={({ field }) => (
                                <Field.Root  invalid={!!errors.willingnessToTravel} disabled={field.disabled}>
                                <Checkbox.Root
                                    checked={field.value}
                                    onCheckedChange={({ checked }) => field.onChange(checked)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control cursor="pointer" />
                                    <Checkbox.Label cursor="pointer">Disponível para viajar?</Checkbox.Label>
                                </Checkbox.Root>
                                <Field.ErrorText>
                                    <Field.ErrorIcon size="xs"></Field.ErrorIcon> 
                                    {errors.willingnessToTravel?.message}
                                </Field.ErrorText>
                                </Field.Root>
                            )}
                            />
                        </Field.Root>
                        <Field.Root mt="4">
                        <Controller
                            control={control}
                            name="willingnessToRelocate"
                            render={({ field }) => (
                                <Field.Root  invalid={!!errors.willingnessToRelocate} disabled={field.disabled}>
                                <Checkbox.Root
                                    checked={field.value}
                                    onCheckedChange={({ checked }) => field.onChange(checked)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control cursor="pointer" />
                                    <Checkbox.Label cursor="pointer">Disponível para mudar de estado/cidade/país?</Checkbox.Label>
                                </Checkbox.Root>
                                <Field.ErrorText>
                                    {errors.willingnessToRelocate?.message}
                                </Field.ErrorText>
                                </Field.Root>
                            )}
                            />
                        </Field.Root>
                    </Stack>
            </Flex>
        </Flex>
    )
}