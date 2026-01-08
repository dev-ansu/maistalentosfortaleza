import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { JobStatus } from "@/_types/Job";
import { Button, createListCollection, Field, Flex, Portal, Select } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEventHandler } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdChangeCircle } from "react-icons/md";
import { toast } from "react-toastify";

import { z, ZodError } from "zod";

const jobStatusChangeValidate = z
  .object({
    status: z.array(z.string()).max(1),
  })
  .superRefine((data, ctx) => {
    if (!['open', 'paused', 'closed'].includes(data.status[0])) {
      ctx.addIssue({
        path: ['status'],
        message: 'Escolha uma opção válida.',
        code: z.ZodIssueCode.custom
      });
    }
});

type JobStatusChangeFormData = z.infer<typeof jobStatusChangeValidate>;

export const JobStatusChangeForm = ({ actualStatus, id }: { actualStatus: JobStatus, id: string })=>{
    const { handleSubmit, setError ,control, formState: { errors, isSubmitting}, register } = useForm<JobStatusChangeFormData>({
        mode: "all",
        criteriaMode:"all",
        resolver: zodResolver(jobStatusChangeValidate),
        defaultValues: {
            status: [actualStatus],
        }
    });
    const { enums } = useEnumsContext();
    const { serverErrors, handleServerError } = useServerErrors();

    const jobStatus = createListCollection({
        items: enums ? enums.JobStatus:[]
    });
    
    const onSubmit = async (data: JobStatusChangeFormData) => {
        try{
            const response = await getAPIClient().patch(`/vagas/${id}/change-status`, data)
            toast.success(response.data.message);
        }catch(error){
            handleServerError(error);
        }
    };

    return(
        <Flex w="full" alignItems="center" gap="1">
            <Field.Root  invalid={!!errors.status || !!serverErrors.status}>
            {/* <Field.Label>Estado</Field.Label> */}
            <Controller 
                control={control}
                name="status"
                render={({field}) => (
                        <Select.Root 
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => {
                                field.onChange(value)
                                handleSubmit(onSubmit)();
                            }}
                            onInteractOutside={() => field.onBlur()}
                            collection={jobStatus}  
                            width="full"
                        >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                            <Select.ValueText placeholder="Selecione um status" />
                                </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                            <Select.Content>
                                {jobStatus.items && jobStatus.items.map((item) => (
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
            <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="status"/>
            </Field.Root>
        </Flex>
    )
}