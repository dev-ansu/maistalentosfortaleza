import { useFormContext } from "react-hook-form";
import { DadosBasicos } from "./_DadosBasicos"
import { Button } from "@chakra-ui/react";
import { CompanyProfileFormData } from "@/_validations/company_profile";
import { useAuthContext } from "@/_context/AuthContext";
import { DadosContatos } from "./_DadosContatos";
import { StateProps } from "@/_types/CandidateProfile";

interface RegisterFormCompanyProps{
    states: StateProps[];
}

export const RegisterFormCompany = ({ states }: RegisterFormCompanyProps)=>{
    const { user } = useAuthContext();
    const { handleSubmit, formState:{ isSubmitting } } = useFormContext<CompanyProfileFormData>();
    

    const onSubmit = (data: CompanyProfileFormData)=>{
        console.log(data)
    }

    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DadosBasicos company={user?.company} states={states}/>
                <DadosContatos company={user?.company}/>
                <Button loading={isSubmitting} type="submit" _hover={ {bg:"orange.500"} } bg="orange.400" justifySelf="flex-start" mt="4">
                    Cadastrar                    
                </Button>
            </form>
        </>
    )
}