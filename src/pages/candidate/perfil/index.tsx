import { Sidebar } from "@/_components/ui/sidebar/Index";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import Head from "next/head";
import { PasswordChange, Perfil } from "./_components";
import { CityProps, StateProps, UserProps } from "@/_types/CandidateProfile";
import { CandidateProps } from "@/pages/admin/usuarios/list/_components/UsersTable";
import { Flex, Text } from "@chakra-ui/react";

export interface UserProfile extends UserProps{
    candidate: Omit<CandidateProps, 'user'>;
    state: StateProps;
    city: CityProps;
}


export default function({ candidate }: { candidate: UserProfile}){

    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Ver Curríulo</title>
            </Head>
            <Sidebar>
                <Text fontSize="2xl" fontWeight="semibold">Meu perfil</Text>
                <Flex w="full" direction="column" gap="4" >
                    <Perfil candidate={candidate} />
                    <PasswordChange />
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx)=>{
    const api = getAPIClient(ctx);
    const response = await api.get(`/me`);

    const candidate = response.data.data;
    
    return{
        props:{
            candidate: candidate,
        }
    }
});