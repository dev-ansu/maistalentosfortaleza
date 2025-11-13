import { api } from "@/services/apiClient";
import Router from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { createContext, ReactNode, useState, useContext } from "react"
import { toast } from "react-toastify";
import { COOKIE_NAME, DEFAULT_REDIRECT, TOKEN_MAX_AGE } from "@/constants";

interface AuthContenxtData{
    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (data: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
}

interface UserProps{
    id: string;
    name: string;
    email: string;
    token: string;
    isSuperAdmin: boolean;
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
        Router.push("/login")
    }catch(err){
        
        console.log("Erro ao sair.")
    }
}

export const AuthProvider = ({ children }: AuthProviderProps)=>{
    const [user, setUser] = useState<UserProps | null>(null);
    const isAuthenticated = !!user;
    
    const signIn = async({ email, password }: SignInProps)=>{
        try{
            const response = await api.post("/session", {
                email, password
            });
            console.log(response.data.data)
            const {id, name, isSuperAdmin, token} = response.data.data;
            setCookie(undefined, COOKIE_NAME, token, {
                maxAge: TOKEN_MAX_AGE, // expira em 1 mês
                path: "/"            
            });
            
            setUser({
                id, name, email, isSuperAdmin, token
            });
            
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
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
            
            const response = await api.post("/users", {
                name, email, password
            });

            console.log(response);

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
            setUser(null);
        }catch(err){
            console.log('ERRO AO SAIR.', err);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logoutUser}}>
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