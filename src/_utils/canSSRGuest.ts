import { COOKIE_NAME, DEFAULT_REDIRECT } from "@/_constants";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"

export function canSSRGuest<P extends { [key: string]: any }>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        const cookies = parseCookies(ctx);

        if(cookies[COOKIE_NAME]){
            return {
                redirect:{
                    destination: DEFAULT_REDIRECT,
                    permanent:false,
                }
            }
        }

        return await fn(ctx);
    }
}