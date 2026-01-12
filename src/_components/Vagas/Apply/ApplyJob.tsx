import { useServerErrors } from "@/_hooks/useServerErrors"
import { getAPIClient } from "@/_services/apiClient";
import { Button } from "@chakra-ui/react"
import { useState } from "react"
import { toast } from "react-toastify";

export const ApplyJob = ({ jobId }: { jobId: string })=>{
    const [loading, setIsLoading] = useState(false);
    const { handleServerError } = useServerErrors();

    const apply = async()=>{
        setIsLoading(true);
        try{
            
            const response = await getAPIClient().post("/application",{
                jobId,
            });

            toast.success(response.data.message);
        }catch(error){
            handleServerError(error);
        }finally{
            setIsLoading(false);
        }
    }

    return <Button loading={loading} onClick={apply} bg="button.cta">Candidatar-me</Button>

}