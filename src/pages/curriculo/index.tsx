import { Sidebar } from "@/components/ui/sidebar/Index";
import { useAuthContext } from "@/context/AuthContext";
import { getAPIClient } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { PersonalInformation, StateProps } from "./components/PersonalInformation";

interface CurriculoProps{
    states: StateProps[],
}

export default function Curriculo({ states }: CurriculoProps){
    const { user } = useAuthContext();
    
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Curríulo</title>
            </Head>
            <Sidebar>
                <Flex direction="column" w="full" alignItems="center" justifyContent="center">
                    <Text fontSize="2xl">
                        {user?.name}
                    </Text>
                    <PersonalInformation states={states}/>
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);
    const response = await api.get("/me");

    const user = response.data.data;

    // Se o usuário NÃO tem currículo → redireciona
    if (!user.candidate) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
    
    const statesResponse = await api.get("/state");
    const states = statesResponse.data.data;
    
    return{
        props:{
            states,
        }
    }
});