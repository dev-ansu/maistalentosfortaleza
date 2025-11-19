import { Sidebar } from "@/components/ui/sidebar/Index";
import { useAuthContext } from "@/context/AuthContext";
import { getAPIClient } from "@/services/apiClient";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Flex, Tabs, Text } from "@chakra-ui/react";
import Head from "next/head";
import { PersonalInformation } from "../../components/Curriculo/PersonalInformation";
import { FormProvider, useForm } from "react-hook-form";
import { personalInfoSchema, PersonalInfoFormData } from "@/validations/curriculo";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfile, StateProps } from "@/types/CandidateProfile";

import { EducationFormData, educationValidationSchema } from "@/validations/education";
import { Education } from "../../components/Curriculo/Education";
import { LuUser } from "react-icons/lu";
import { FaSchool } from "react-icons/fa";

export interface PersonalInformationProps{
    states: StateProps[];
    candidate: CandidateProfile;
}


export default function Curriculo({ states, candidate }: PersonalInformationProps){
    const { user } = useAuthContext();
    const methodsEducation = useForm<EducationFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(educationValidationSchema)
    });
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
                <Flex direction="column" w="full" gap="4" alignItems="center" justifyContent="center">
                    <Tabs.Root w="full" defaultValue="Informações pessoais">
                    <Tabs.List>
                        <Tabs.Trigger value="Informações pessoais">
                        <LuUser />
                            Informações pessoais
                        </Tabs.Trigger>
                        <Tabs.Trigger value="Escolaridade">
                        <FaSchool />
                            Escolaridade
                        </Tabs.Trigger>
                    </Tabs.List>
                        <Tabs.Content value="Informações pessoais">
                            <FormProvider {...methods}>
                                <Text fontSize="2xl">
                                    {user?.name}
                                </Text>
                                <PersonalInformation candidate={candidate} states={states}/>
                            </FormProvider>
                        </Tabs.Content>
                        <Tabs.Content value="Escolaridade">
                            <FormProvider {...methodsEducation}>
                                <Education candidate={candidate} />
                            </FormProvider>
                        </Tabs.Content>
                    </Tabs.Root>
              
                 
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