import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { VagaFormData } from "@/_validations/vagas";
import { Flex, Field, Input, Checkbox } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const SalaryWorkloadAndLocation = ()=>{
    const { control, register, formState:{ errors }} = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();
    
    return(
        <Flex direction="column" w="full" gap="2">

            <Flex gap="2" w="full">
                <Field.Root invalid={!!errors.salary || !!serverErrors.salary}>
                    <Field.Label>Salário</Field.Label>
                    <Input {...register("salary")} placeholder='Digite o salário. Use 0(zero) para "a combinar"'/>
                    <Field.ErrorText>{errors.salary?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="salary"/>
                    <Field.HelperText>Digite 0(zero) para "a combinar".</Field.HelperText>
                </Field.Root>
                <Field.Root invalid={!!errors.workload || !!serverErrors.workload}>
                    <Field.Label>Carga horária (diária)</Field.Label>
                    <Input {...register("workload")} placeholder='Digite a carga horária (diária). Use 0(zero) para "a combinar"'/>
                    <Field.ErrorText>{errors.workload?.message}</Field.ErrorText>
                    <ServerErrors serverErrors={serverErrors} field="workload"/>
                    <Field.HelperText>Digite 0(zero) para "a combinar".</Field.HelperText>
                </Field.Root>
            </Flex>
            <Field.Root invalid={!!errors.location || !!serverErrors.location}>
                <Field.Label>Endereço da vaga</Field.Label>
                <Input {...register("location")} placeholder="Digite o endereço da vaga"/>
                <Field.ErrorText>{errors.location?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="location"/>
                <Field.HelperText>Opcional</Field.HelperText>
            </Field.Root>

            <Field.Root mt="4">
                <Controller
                    control={control}
                    name="isRemoteFriendly"
                    render={({ field }) => (
                        <Field.Root  invalid={!!errors.isRemoteFriendly || !!serverErrors.isRemoteFriendly} disabled={field.disabled}>
                        <Checkbox.Root
                            checked={field.value}
                            onCheckedChange={({ checked }) => field.onChange(checked)}
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control cursor="pointer" />
                            <Checkbox.Label cursor="pointer">Aceita trabalho remoto?</Checkbox.Label>
                        </Checkbox.Root>
                        <Field.ErrorText>
                            {errors.isRemoteFriendly?.message}
                        </Field.ErrorText>
                        <ServerErrors serverErrors={serverErrors} field="isRemoteFriendly"/>
                        </Field.Root>
                    )}
                />
            </Field.Root>
            
        </Flex>
    )
}