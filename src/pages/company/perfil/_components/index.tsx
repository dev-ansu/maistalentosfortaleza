import { useFormContext } from "react-hook-form";
import { DadosBasicos } from "./_DadosBasicos"
import { Button, Flex } from "@chakra-ui/react";
import { CompanyProfileFormData } from "@/_validations/company_profile";
import { useAuthContext } from "@/_context/AuthContext";
import { DadosContatos } from "./_DadosContatos";
import { StateProps } from "@/_types/CandidateProfile";
import { InterestAreas } from "@/_types/InterestArea";
import { AreasAtuacao } from "./_AreasAtuacao";
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";
import { useServerErrors } from "@/_hooks/useServerErrors";
import Link from "next/link";
import { ServerErrorsProvider } from "@/_context/ServerErrors/ServerErrorsProvider";
import { useServerErrorsContext } from "@/_context/ServerErrors/ServerErrorsContext";
import { useMenuContext } from "@/_context/MenuContext";

interface RegisterFormCompanyProps{
    states: StateProps[];
    interestAreas: InterestAreas[];
}

export const RegisterFormCompany = ({ states, interestAreas }: RegisterFormCompanyProps)=>{
    const { user, reloadUserData } = useAuthContext();
    const { reloadMenu } = useMenuContext();
    const { handleSubmit, formState:{ isSubmitting }, watch } = useFormContext<CompanyProfileFormData>();
    const { handleServerError } = useServerErrorsContext();


    const onSubmit = async (data: CompanyProfileFormData)=>{
        const { cityId,address,cnpj,companySize,
            foundedYear,zipCode,contactEmail,
            description, companyInterest,isActive,
            name,phone,stateId,facebook,instagram,linkedin,website } = data;
        try{

            const response = await getAPIClient().post("/company", {
                cityId,address,cnpj,companySize,
                foundedYear,zipCode,contactEmail,
                description, companyInterest,isActive,
                name,phone,stateId,facebook,instagram,linkedin,website
            });

            toast.success(response.data.message);
            await reloadUserData();
            await reloadMenu();
        }catch(error: any){
            handleServerError(error)
        }

    }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DadosBasicos company={user?.company} states={states} />
                <DadosContatos company={user?.company}/>
                <AreasAtuacao interestAreas={interestAreas}/>
                <Flex gap="4" alignItems="center" mt="4">
                    <Button loading={isSubmitting} type="submit" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" >
                        Salvar                    
                    </Button>
                    {user?.company && 
                        <Button colorScheme="blue" 
                        variant="outline" borderWidth="1" w="max-content" size="xs">
                            <Link href={`/company/${user?.company.id}`} >
                                Ver como candidato
                            </Link>
                        </Button>
                    }
                </Flex>
            </form>
        </>
    )
}