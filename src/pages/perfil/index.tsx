import { Sidebar } from "@/_components/ui/sidebar/Index";
import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";
import { FormProvider, useForm } from "react-hook-form";
import { RegisterFormCompany } from "./_components";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyProfileFormData, companyProfileSchema } from "@/_validations/company_profile";

export default function Perfil(){
    
    const methods = useForm<CompanyProfileFormData>({
        mode:"all",
        criteriaMode:"all",
        resolver: zodResolver(companyProfileSchema)
    });
    return(
        <>
          <Head>
                <title> Mais Talentos Fortaleza - Dashboard</title>
            </Head>
            <Sidebar>
                <Flex w="full" direction="column">
                    <Text w="full" mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Dados da empresa</Text>
                    <FormProvider {...methods}>
                        <RegisterFormCompany />
                    </FormProvider>
                </Flex>
            </Sidebar>
        </>
    )
}

