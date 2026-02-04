
import { useConfirm } from "@/_hooks/useConfirm";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";


export const RemoveReport = ({ reportId, load }: { reportId: string, load?: () => Promise<void>})=>{
    const [loading, setIsLoading] = useState(false);
    const { handleServerError } = useServerErrors();
    const {ConfirmationDialog, confirm} = useConfirm();

    const handle = async(reportIdValue: string)=>{
        const accepted = await confirm({
            title: "Remover denúncia",
            message: "Tem certeza que deseja remover sua denúncia desta vaga?",
            confirmText: "Remover",
            cancelText: "Cancelar",
        });

        if (!accepted) return;

        setIsLoading(true);
        
        try{
            
            const response = await getAPIClient().delete(`/candidate/reports/${reportIdValue}`);

            toast.success(response.data.message);
            
            if(load){
                await load();
            }

        }catch(error){
            handleServerError(error);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <>
            {ConfirmationDialog}
            <Button loading={loading} color="red.500" onClick={() => handle(reportId)} outline="none" bg="transparent" size="xs">Remover candidatura</Button>
        </>

    )
}