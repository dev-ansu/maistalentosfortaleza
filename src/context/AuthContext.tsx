import { getAPIClient } from "@/services/apiClient";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useState, useContext, useEffect } from "react"
import { toast } from "react-toastify";
import { COOKIE_NAME, DEFAULT_REDIRECT, TOKEN_MAX_AGE } from "@/constants";
import { refreshAPIClient } from "@/services/apiClient";


interface AuthContenxtData{
    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (data: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
    haveResume: boolean;
    handleHaveResume: ()=> void;
}

interface UserProps{
    id: string;
    name: string;
    email: string;
    token: string;
    isSuperAdmin: boolean;
    candidate?: CandidateProps;
}

interface CandidateProps{
    id: string;
    userId: string;
    birthDate: Date | string;
    summary: string;
    resumeUrl?: string;
    phone: string;
    whatsapp: string;  
    stateId: string;
    cityId: string;
    // education: Education[];
    // courses: Course[]
    // languages: Language[]
    // experiences: Experience[]
    // applications: Application[]
}

export const AuthContext = createContext({} as AuthContenxtData) 

interface AuthProviderProps{
    children: ReactNode;
}

interface SignInProps{
    email: string;
    password: string;
}

interface SignUpProps extends SignInProps{
    name: string;
}

export const signOut = ()=>{
    try{
        destroyCookie(null, COOKIE_NAME, { path: "/" })
        refreshAPIClient();
        Router.push("/login");
    }catch(err){
        
        console.log("Erro ao sair.")
    }
}

export const AuthProvider = ({ children }: AuthProviderProps)=>{
    const [user, setUser] = useState<UserProps | null>(null);
    const [haveResume, setHaveResume] = useState(!!user?.candidate)
    const isAuthenticated = !!user;
    
    useEffect(() => {
        if (user?.candidate) {
            setHaveResume(!!user?.candidate);
        } else {
            setHaveResume(false);
        }
    }, [user?.candidate]); // <-- Atualiza sempre que o candidate mudar

    const handleHaveResume = () => {
        setHaveResume(prev => !prev);
    };

    useEffect(() => {
        const { [COOKIE_NAME]: token} = parseCookies();
        if(token){
            getAPIClient().get("/me").then( (response) => {
                const { data } = response.data;
       
                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    isSuperAdmin: data.isSuperAdmin,
                    candidate: data.candidate,
                    token,
                });
    
            }).catch(()=>{
                signOut();
            });
        }
    }, []);

    const signIn = async({ email, password }: SignInProps)=>{
        try{
            const response = await getAPIClient().post("/session", {
                email, password
            });
     
            const {id, name, isSuperAdmin, token, candidate} = response.data.data;
            
            setCookie(undefined, COOKIE_NAME, token, {
                maxAge: TOKEN_MAX_AGE, // expira em 1 mês
                path: "/"            
            });

            

            setUser({
                id, name, email, isSuperAdmin, token, candidate
            });

            getAPIClient().defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            refreshAPIClient();

            Router.push(DEFAULT_REDIRECT);

        }catch(error: any){
            if (error.response && error.response.data.errors) {
                // express-validator retorna normalmente um array de erros
                throw error.response.data.errors;
            } else if (error.response?.data?.message) {
                throw [{ path: "global", msg: error.response.data.message }];
            } else {
                throw [{ path: "global", msg: "Erro inesperado. Tente novamente." }];
            }
        }
    }

    const signUp = async( {name, email, password}: SignUpProps)=>{
        try{
            
            const response = await getAPIClient().post("/users", {
                name, email, password
            });

            toast.success("Cadastro feito com sucesso!");
            Router.push("/login");

        }catch(error: any){
            if (error.response && error.response.data.errors) {
                // express-validator retorna normalmente um array de erros
                throw error.response.data.errors;
            } else if (error.response?.data?.message) {
                throw [{ path: "global", msg: error.response.data.message }];
            } else {
                throw [{ path: "global", msg: "Erro inesperado. Tente novamente." }];
            }
        }
    }

    const logoutUser = async()=>{
        try{
            destroyCookie(null, COOKIE_NAME, {path: "/"})
            Router.push("/login")
            refreshAPIClient();
            setUser(null);
        }catch(err){
            console.log('ERRO AO SAIR.', err);
        }
    }

    return (
        <AuthContext.Provider value={{ user, haveResume, handleHaveResume, isAuthenticated, signIn, signUp, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuthContext = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }

  return ctx;
};