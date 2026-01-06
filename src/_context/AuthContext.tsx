import { getAPIClient } from "@/_services/apiClient";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useState, useContext, useEffect } from "react"
import { toast } from "react-toastify";
import { COOKIE_NAME, DEFAULT_REDIRECT, TOKEN_MAX_AGE } from "@/_constants";
import { refreshAPIClient } from "@/_services/apiClient";
import { UserType } from "@/_types/CandidateProfile";
import { CompanyProfile } from "@/_types/CompanyProfile";


interface AuthContenxtData{
    user: UserProps | null;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (data: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
    haveResume: boolean;
    handleHaveResume: ()=> void;
    reloadUserData: ()=> Promise<void>;
    showResendButton: boolean;
    resendVerification: (userId?: string) => Promise<void>;
    pendingVerificationUser: PendingVerificationUser | null;
}

interface PendingVerificationUser {
    id: string;
    email: string;
    name: string;
    canResend: boolean;
    hasValidToken: boolean;
}

interface UserProps{
    id: string;
    name: string;
    email: string;
    token: string;
    isSuperAdmin: boolean;
    candidate?: CandidateProps;
    company: CompanyProfile;
    userType: 'candidate' | 'company' | undefined;
    role: string;
    permissions: { permission: PermissionProps}[] ;
};

export interface PermissionProps{
    id: string;
    name: string;
    module: string;
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
    userType: ('candidate' | 'company')[];
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
    const [haveResume, setHaveResume] = useState(!!user?.candidate);
    const [showResendButton, setShowResendButton] = useState(false);
    const [pendingVerificationUser, setPendingVerificationUser] = useState<PendingVerificationUser | null>(null);
    
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

        // Função para reenviar verificação
    const resendVerification = async (userId?: string) => {
        const targetUserId = userId || pendingVerificationUser?.id;
        
        if (!targetUserId) {
            toast.error("ID do usuário não encontrado");
            return;
        }

        try {
            const response = await getAPIClient().post("/resend-verification", {
                userId: targetUserId
            });

            toast.success(response.data.message || "Novo link de verificação enviado!");
            
            // Resetar estado
            setShowResendButton(false);
            setPendingVerificationUser(null);

            
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Erro ao reenviar verificação");
            }
        }
    };

    const reloadUserData = async()=>{
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
                    company: data.company,
                    token,
                    userType: data.userType,
                    role: data.role,
                    permissions: data.permissions
                });
    
            }).catch(()=>{
                signOut();
            });
        }
    }

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
                    company: data.company,
                    token,
                    userType: data.userType,
                    role: data.role,
                    permissions: data.permissions
                });
    
            }).catch(()=>{
                signOut();
            });
        }
    }, []);

    const signIn = async ({ email, password }: SignInProps) => {
        try {
            const response = await getAPIClient().post("/session", {
                email, password
            });
     
            const { id, name, isSuperAdmin, token, candidate, userType, company, role, permissions } = response.data.data;
            
            setCookie(undefined, COOKIE_NAME, token, {
                maxAge: TOKEN_MAX_AGE,
                path: "/"            
            });

            setUser({
                id, name, email, isSuperAdmin, token, candidate, userType, company, role, permissions
            });

            getAPIClient().defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            refreshAPIClient();

            // Resetar estados de verificação pendente
            setShowResendButton(false);
            setPendingVerificationUser(null);

            Router.push(DEFAULT_REDIRECT);

        } catch (error: any) {
            // Verificar se é erro de e-mail não verificado
      
            if (error.response?.status === 403 && error.response?.data?.errors) {
                const verificationData = error.response.data.errors;
                
                if (verificationData.canResend || verificationData.hasValidToken === false) {
                    // Armazenar informações do usuário para reenvio
                    setPendingVerificationUser({
                        id: verificationData.userId,
                        email: verificationData.email || email,
                        name: verificationData.name || "",
                        canResend: verificationData.canResend || false,
                        hasValidToken: verificationData.hasValidToken || false
                    });
                    
                    setShowResendButton(true);
                    
                    // Lançar erro específico para o formulário
                    if (verificationData.hasValidToken) {
                        throw [{ 
                            path: "global", 
                            msg: "E-mail não verificado. Verifique sua caixa de entrada (incluindo spam)." 
                        }];
                    } else {
                        throw [{ 
                            path: "global", 
                            msg: "Link de verificação expirado. Clique em 'Reenviar verificação' abaixo." 
                        }];
                    }
                }
            }
            
            // Erros normais
            if (error.response && error.response.data.data) {
                throw error;
            } else if (error.response?.data?.message) {
                throw [{ path: "global", msg: error.response.data.message }];
            } else {
                throw [{ path: "global", msg: "Erro inesperado. Tente novamente." }];
            }
        }
    };

    const signUp = async( {name, email, password, userType}: SignUpProps)=>{
        try{
            
            const response = await getAPIClient().post("/users", {
                name, email, password, userType: userType[0]
            });

            toast.success(response.data.message);
            Router.push("/login");

        }catch(error: any){
            if (error.response && error.response.data.errors) {
                // express-validator retorna normalmente um array de erros
                throw error;
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
        <AuthContext.Provider value={{ user,reloadUserData,pendingVerificationUser,resendVerification,showResendButton, haveResume, handleHaveResume, isAuthenticated, signIn, signUp, logoutUser}}>
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