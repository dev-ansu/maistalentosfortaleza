import { SelectComponent } from "@/_components/ui/Select/SelectComponent";
import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useEnumsContext } from "@/_context/EnumsContext";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { VagaFormData } from "@/_validations/vagas";
import { createListCollection, Flex, Field, Select, Portal } from "@chakra-ui/react";
import { useFormContext, Controller } from "react-hook-form";

export const WorkModelSelect = ()=>{
    const { enums } = useEnumsContext();
    const {control, formState:{errors} } = useFormContext<VagaFormData>();
    const { serverErrors } = useServerErrorsContext();

    const workModels = createListCollection({
        items: enums ? enums.WorkModel:[],
    });

    return(
        <SelectComponent serverErrors={serverErrors} title="Modelo ode trabalho" control={control} name="type" error={errors.type?.message} items={enums?.WorkModel} />
    )
}