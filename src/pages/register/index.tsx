import { RegisterForm } from "@/components/Authentication/Register/Index";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { Flex} from "@chakra-ui/react"
import Head from "next/head";

export default function Register(){
  
    return(
        <>
            <Head>
                <title>Mais Talentos Fortaleza - Login</title>
            </Head>
            <Flex background="talento.900" height="100vh" alignItems="center" justifyContent="center">
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <RegisterForm />
                </Flex>
            </Flex>
        </>
    )

}

export const getServerSideProps = canSSRGuest(async (ctx)=>{
    return{
        props: {}
    }
})