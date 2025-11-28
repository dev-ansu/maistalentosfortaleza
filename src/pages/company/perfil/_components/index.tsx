import { useFormContext } from "react-hook-form";
import { DadosBasicos } from "./_DadosBasicos"
import { Button } from "@chakra-ui/react";
import { CompanyProfileFormData } from "@/_validations/company_profile";
import { useAuthContext } from "@/_context/AuthContext";
import { DadosContatos } from "./_DadosContatos";
import { StateProps } from "@/_types/CandidateProfile";
import { InterestAreas } from "@/_types/InterestArea";
import { AreasAtuacao } from "./_AreasAtuacao";
import { getAPIClient } from "@/_services/apiClient";
import { toast } from "react-toastify";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { CompanyProfile } from "@/_types/CompanyProfile";

interface RegisterFormCompanyProps{
    states: StateProps[];
    interestAreas: InterestAreas[];
}

export const RegisterFormCompany = ({ states, interestAreas }: RegisterFormCompanyProps)=>{
    const { user } = useAuthContext();
    const { handleSubmit, formState:{ isSubmitting } } = useFormContext<CompanyProfileFormData>();
    const { handleServerError } = useServerErrors();


    const onSubmit = async (data: CompanyProfileFormData)=>{
        const { cityId,cnpj,contactEmail,description, companyInterest,isActive,name,phone,stateId,facebook,instagram,linkedin,website } = data;
        try{

            const response = await getAPIClient().post("/company", {
               cityId,cnpj,contactEmail,description,companyInterest,isActive,name,phone,stateId,facebook,instagram,linkedin,website
            });

            toast.success(response.data.message);
        }catch(error: any){
            handleServerError(error)
        }

    }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DadosBasicos company={user?.company} states={states}/>
                <DadosContatos company={user?.company}/>
                <AreasAtuacao interestAreas={interestAreas}/>
                <Button loading={isSubmitting} type="submit" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" mt="4">
                    Cadastrar                    
                </Button>
            </form>
        </>
    )
}