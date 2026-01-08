import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterFormCompany } from "./_components/RegisterFormCompany";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyProfileFormData, companyProfileSchema } from "@/_validations/company_profile";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import { StateProps } from "@/_types/CandidateProfile";
import { getAPIClient } from "@/_services/apiClient";
import { USER_TYPES } from "@/_constants";
import { InterestAreas } from "@/_types/InterestArea";
import { CompanyProfile } from "@/_types/CompanyProfile";
import { ServerErrorsProvider } from "@/_context/ServerErrors/ServerErrorsProvider";


interface PerfilProps{
    states: StateProps[];
    interestAreas: InterestAreas[];
    company: CompanyProfile;
}

export default function Perfil({ states, interestAreas, company }: PerfilProps){
    const methods = useForm<CompanyProfileFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(companyProfileSchema),
        defaultValues:{
            stateId: company?.stateId ? [company.stateId]:[],
            cityId: company?.cityId ? [company.cityId]:[],
            cnpj: company?.cnpj,
            contactEmail: company?.contactEmail,
            description: company?.description,
            facebook: company?.facebook,
            instagram: company?.instagram,
            companyInterest: company?.companyInterest ? [...company.companyInterest.map( c => c.interest.id)]:[],
            isActive: company?.isActive,
            linkedin: company?.linkedin,
            name: company?.name,
            phone: company?.phone,
            website: company?.website,
            address: company?.address,
            zipCode: company?.zipCode,
            companySize: company?.companySize ? [company.companySize]:[],
            foundedYear: String(company?.foundedYear),

        }
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
                        <ServerErrorsProvider<CompanyProfileFormData> watch={methods.watch}>
                            <RegisterFormCompany states={states} interestAreas={interestAreas}/>
                        </ServerErrorsProvider>
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

    if (user.userType != USER_TYPES.company) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }

    const statesResponse = await api.get("/state");
    const states = statesResponse.data.data;
    const interestAreasResponse = await api.get("/interestAreas")
    const interestAreas = interestAreasResponse.data.data
    
    return{
        props:{
            states: states,   
            interestAreas,
            company: user.company 
        }
    }
});