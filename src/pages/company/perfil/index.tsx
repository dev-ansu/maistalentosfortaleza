import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterFormCompany } from "./_components";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyProfileFormData, companyProfileSchema } from "@/_validations/company_profile";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { StateProps } from "@/_types/CandidateProfile";
import { getAPIClient } from "@/_services/apiClient";
import { USER_TYPES } from "@/_constants";

interface PerfilProps{
    states: StateProps[];
}

export default function Perfil({ states }: PerfilProps){
    
    const methods = useForm<CompanyProfileFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(companyProfileSchema)
    });
    
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Perfil</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Dados da empresa</Text>
                    <FormProvider {...methods}>
                        <RegisterFormCompany states={states} />
                    </FormProvider>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx)=>{

    const api = getAPIClient(ctx);

    const allowed = await api.get("/check-user-type", {
        params: {
            path: "perfil"
        }
    });

    if(!allowed.data.allowed){
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        };
    }


    const statesResponse = await api.get("/state");
    const states = statesResponse.data.data;

    return{
        props:{
            states: states,        
        }
    }
});