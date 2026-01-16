import { useAuthContext } from "@/_context/AuthContext";
import { useMenuContext } from "@/_context/MenuContext";
import { getAPIClient } from "@/_services/apiClient";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const SemCurriculo = ()=>{
    const { handleHaveResume, haveResume, user } = useAuthContext();
    const { handleSubmit, formState:{isSubmitting} } = useForm();
    const { reloadMenu } = useMenuContext();
    const onSubmit = async()=>{
        try{
            const response = await getAPIClient().post(`/candidate/create`,{
                id: user?.id
            });
            handleHaveResume();
            toast.success(response.data.message);
            reloadMenu();
        }catch(error: any){
            if (error.response && error.response.data.errors) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Erro inesperado. Tente novamente.");
            }
        }
    }

    return(
        <>
        {!haveResume && 
            <Flex>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Text>Você ainda não possui um currículo. 
                        <Button type="submit" loading={isSubmitting} bg="transparent" color="white" size="xs" p="1" border="0" fontSize="16px">
                            <strong>Crie um aqui</strong>
                        </Button>
                    </Text>
                </form>
            </Flex>
        }
        </>
    )
}
