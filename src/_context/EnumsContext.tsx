import { getAPIClient } from "@/_services/apiClient";
import { createContext, ReactNode, useState, useContext, useEffect } from "react"


interface EnumsContextProps{
    enums: EnumsProps | null | undefined;
}

export interface EnumsProps{
    WorkModel: EnumProps[];
    JobStatus: EnumProps[];
    ApplicationStatus: EnumProps[];
    DegreeLevel: EnumProps[];
    LanguageProficiency: EnumProps[];
    UserType: EnumProps[];
    Gender: EnumProps[];
    Ethnicity: EnumProps[];
    CompanySize: EnumProps[];
    VerificationStatus: EnumProps[];
}

export interface EnumProps{
    value: string;
    label: string;
}

export const EnumsContext = createContext({} as EnumsContextProps) 


export const EnumsProvider = ({children}: { children: ReactNode })=>{
    const [enums, setEnums] = useState<EnumsProps | null>();

    useEffect(()=>{
        const api = getAPIClient();

        const loadEnums = async()=>{
            const response = await api.get("/enums");
            setEnums(response.data.data)
        }

        loadEnums();

    },[])

    return(
        <EnumsContext.Provider value={{ enums }}>
            { children }
        </EnumsContext.Provider>
    )

}

export const useEnumsContext = () => {
  const ctx = useContext(EnumsContext);

  if (!ctx) {
    throw new Error("useEnumsContext deve ser usado dentro de um EnumsProvider");
  }

  return ctx;
};