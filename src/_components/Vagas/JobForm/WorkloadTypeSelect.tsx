import { SelectComponent } from "@/_components/ui/Select/SelectComponent";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { VagaFormData } from "@/_validations/vagas";
import { useFormContext } from "react-hook-form";

export const WorkloadTypeSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors} } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();

    return(
        <SelectComponent serverErrors={serverErrors} title="Selecione um tipo de carga horária" control={control} name="workloadType" error={errors.workloadType?.message} items={enums?.WorkloadType} />
    )
}