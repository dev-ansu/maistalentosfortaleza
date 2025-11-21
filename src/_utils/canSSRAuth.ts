import { COOKIE_NAME } from "@/_constants";
import { AuthTokenError } from "@/_services/errors/AuthTokenError";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies} from "nookies"




export function canSSRAuth<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>){

    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>>=>{
        const cookies = parseCookies(ctx);
        const token = cookies[COOKIE_NAME]

        if(!token){
            return{
                redirect:{
                    destination: '/login',
                    permanent: false,
                }
            }    
        }

        try{
            return await fn(ctx);
        }catch(error){
            if(error instanceof AuthTokenError){
                destroyCookie(ctx, COOKIE_NAME, {path: "/"});
                return{
                    redirect:{
                        destination: "/",
                        permanent: false
                    }
                }
            }
        }

        return{
            redirect:{
                destination: "/",
                permanent: false
            }
        }

    }
}