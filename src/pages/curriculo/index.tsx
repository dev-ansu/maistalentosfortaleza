import { Sidebar } from "@/components/ui/sidebar/Index";
import { useAuthContext } from "@/context/AuthContext";
import { getAPIClient } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { PersonalInformation } from "./components/PersonalInformation";
import { FormProvider, useForm } from "react-hook-form";
import { personalInfoSchema, PersonalInfoFormData } from "@/validations/curriculo";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfile, StateProps } from "@/types/CandidateProfile";

export interface PersonalInformationProps{
    states: StateProps[];
    candidate: CandidateProfile;
}


export default function Curriculo({ states, candidate }: PersonalInformationProps){
    const { user } = useAuthContext();
    const methods = useForm<PersonalInfoFormData>({
        mode: "all",
        criteriaMode:"all",
        defaultValues: {
            birthdate: candidate.birthDate
                ? candidate.birthDate.split("T")[0]
                : "",

            stateId: candidate.stateId
                ? [candidate.stateId]
                : [],

            cityId: candidate.cityId
                ? [candidate.cityId]
                : [],

            phone: candidate.phone ?? "",
            whatsapp: candidate.whatsapp ?? "",
            summary: candidate.summary,
        },
        resolver: zodResolver(personalInfoSchema)
    });
    
    return(
        <>
            <Head>
                <title> Mais Talentos Fortaleza - Curríulo</title>
            </Head>
            <Sidebar>
                <Flex direction="column" w="full" alignItems="center" justifyContent="center">
                    <FormProvider {...methods}>
                        <Text fontSize="2xl">
                            {user?.name}
                        </Text>
                        <PersonalInformation candidate={candidate} states={states}/>
                    </FormProvider>
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
            userServer: user,
            candidate: user.candidate,
        }
    }
});