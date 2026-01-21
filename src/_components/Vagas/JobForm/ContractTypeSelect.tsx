import { SelectComponent } from "@/_components/ui/Select/SelectComponent";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { VagaFormData } from "@/_validations/vagas";
import { createListCollection, Flex, Field, Select, Portal } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const ContractTypeSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors}} = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();
    

    return(
        <SelectComponent serverErrors={serverErrors} title="Selecione o tipo de contrato" control={control} name="contractType" error={errors.contractType?.message} items={enums?.ContractType} />
    )
}