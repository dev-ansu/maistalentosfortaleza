import { ConfirmationScreen } from "@/_components/ui/ConfirmationScreen";
import { useConfirm } from "@/_hooks/useConfirm";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";

export const RemoveApplication = ({ jobId, load }: { jobId: string, load: () => Promise<void>})=>{
    const [loading, setIsLoading] = useState(false);
    const { handleServerError } = useServerErrors();
    const {ConfirmationDialog, confirm} = useConfirm();

    const handle = async(jobIdValue: string)=>{
        const accepted = await confirm({
            title: "Remover candidatura",
            message: "Tem certeza que deseja remover sua candidatura desta vaga?",
            confirmText: "Remover",
            cancelText: "Cancelar",
        });

        if (!accepted) return;

        setIsLoading(true);
        
        try{
            
            const response = await getAPIClient().delete(`/application/${jobIdValue}`);

            toast.success(response.data.message);
            await load();

        }catch(error){
            handleServerError(error);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <>
            {ConfirmationDialog}
            <Button loading={loading} color="red.500" onClick={() => handle(jobId)} outline="none" bg="transparent" size="xs">Remover candidatura</Button>
        </>

    )
}