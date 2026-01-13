import { useServerErrors } from "@/_hooks/useServerErrors"
import { getAPIClient } from "@/_services/apiClient";
import { Button } from "@chakra-ui/react"
import { MouseEvent, useState } from "react"
import { toast } from "react-toastify";

export const ApplyJob = ({ jobId, load }: { jobId: string, load: () => Promise<void> })=>{
    const [loading, setIsLoading] = useState(false);
    const { handleServerError, serverErrors } = useServerErrors();
    
    const apply = async(jobId: string)=>{
     
        setIsLoading(true);

        try{
            
            const response = await getAPIClient().post("/application",{
                jobId,
            });

            toast.success(response.data.message);
            await load();
        }catch(error){
            handleServerError(error);
            if(serverErrors.jobId){
                serverErrors.jobId.forEach( message => {
                    toast.error(message);
                })
            }
        }finally{
            setIsLoading(false);
        }
    }

    return <Button loading={loading} onClick={ () => apply(jobId) } data-id={jobId} bg="button.cta">Candidatar-me</Button>

}