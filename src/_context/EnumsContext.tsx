import { getAPIClient } from "@/_services/apiClient";
import { EnumsProps } from "@/_types/Enums";
import { createContext, ReactNode, useState, useContext, useEffect } from "react"


interface EnumsContextProps{
    enums: EnumsProps | null | undefined;
}



export const EnumsContext = createContext({} as EnumsContextProps) 


export const EnumsProvider = ({children}: { children: ReactNode })=>{
    const [enums, setEnums] = useState<EnumsProps | null>();
    console.log(enums);
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