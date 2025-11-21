import { Sidebar } from "@/_components/ui/sidebar/Index";
import { useAuthContext } from "@/_context/AuthContext";
import { getAPIClient } from "@/_services/apiClient";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { Flex, Tabs, Text, useBreakpointValue } from "@chakra-ui/react";
import Head from "next/head";
import { PersonalInformation } from "../../_components/Curriculo/PersonalInformation";
import { FormProvider, useForm } from "react-hook-form";
import { personalInfoSchema, PersonalInfoFormData } from "@/_validations/curriculo";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateProfile, StateProps } from "@/_types/CandidateProfile";
import { EducationFormData, educationValidationSchema } from "@/_validations/education";
import { Education } from "../../_components/Curriculo/Education";
import { Experience } from "@/_components/Curriculo/Experience";
import { Course } from "@/_components/Curriculo/Course";
import { Language } from "@/_components/Curriculo/Languages";
import { InterestArea } from "@/_components/Curriculo/InterestAreas";
import { TabList } from "./_components/TabList";
import { CourseFormData, createCourseSchema } from "@/_validations/course";

export interface PersonalInformationProps{
    states: StateProps[];
    candidate: CandidateProfile;
    userName: string | undefined;
}


export default function Curriculo({ states, candidate }: PersonalInformationProps){
    const orientation = useBreakpointValue<"horizontal" | "vertical">({
        base: "vertical",
        md: "horizontal",
    })
    const { user } = useAuthContext();
    const methodsEducation = useForm<EducationFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(educationValidationSchema)
    });
    const methodsCurso = useForm<CourseFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(createCourseSchema)
    });
    const methodsExperience = useForm({
        mode:"all",
        criteriaMode:"all",
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
                    <Tabs.Root 
                    variant="subtle"
                    orientation={orientation}
                    w="full" 
                    defaultValue="Informações pessoais">
                    <TabList />
                    <Tabs.Content w="full" value="Informações pessoais">
                        <FormProvider {...methods}>
                            <PersonalInformation userName={user?.name} candidate={candidate} states={states}/>
                        </FormProvider>
                    </Tabs.Content>
                    <Tabs.Content overflow="hidden" value="Escolaridade">
                        <FormProvider {...methodsEducation}>
                            <Education candidate={candidate} />
                        </FormProvider>
                    </Tabs.Content>
                    <Tabs.Content w="full" value="Cursos">
                        <FormProvider {...methodsCurso}>
                            <Course candidate={candidate} />
                        </FormProvider>
                    </Tabs.Content>
                    <Tabs.Content value="Experiência">
                        <FormProvider {...methodsExperience}>
                            <Experience candidate={candidate} />
                        </FormProvider>
                    </Tabs.Content>
                    <Tabs.Content value="Idiomas">
                        <FormProvider {...methodsExperience}>
                            <Language candidate={candidate} />
                        </FormProvider>
                    </Tabs.Content>
                    <Tabs.Content value="Áreas de interesse">
                        <FormProvider {...methodsExperience}>
                            <InterestArea candidate={candidate} />
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