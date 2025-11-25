import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateInterestList } from "@/_types/CandidateProfile";
import { InterestAreas } from "@/_types/InterestArea"
import { Button, Flex } from "@chakra-ui/react"
import { useState } from "react";
import { IoClose } from "react-icons/io5"
import { toast } from "react-toastify";
import { z } from "zod";

interface CandidateInterestsListProps{
    interestAreasList: CandidateInterestList[];
    setInterestAreasList: React.Dispatch<React.SetStateAction<CandidateInterestList[]>>;
}

const deleteInterestSchema = z.object({
    id: z.uuid("Id inválido.")
});

export const CandidateInterestsList = ({ interestAreasList, setInterestAreasList }: CandidateInterestsListProps)=>{

    const [isLoading, setIsLoading] = useState(false);
    const { handleServerError, serverErrors } = useServerErrors();
    
    const onDelete = async(id: string)=>{
        setIsLoading(true);
    
         try {
            const data = deleteInterestSchema.parse({ id });
            try{
                const response = await getAPIClient().delete(`/candidate/interest/${data.id}`);
                setInterestAreasList((prev) => prev.filter(item => item.id !== data.id));
                toast.success(response.data.message)
            }catch(err){
                handleServerError(err);
            }finally{
                setIsLoading(false);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
            const message = JSON.parse(error.message);
            toast.error(message[0].message);
        }
      }finally{
        setIsLoading(false);
      }
    }

    return(
        <Flex mt={4} wrap="wrap" gap={4}>
            {interestAreasList && interestAreasList.map( item => (
                <Flex gap="1" alignItems="center" borderWidth={1} px={3} py={2} key={item.id}>
                <Button onClick={() => onDelete(item.id)} size="xs" bg="red.500">
                    <IoClose  />
                </Button>
                
                    {item.interest.name}
                
                </Flex>  
            ))}
        </Flex>
    )
}