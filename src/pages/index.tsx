import { Flex, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function Home(){
  return(
    <>
      <Head>
        <title>Mais Talentos Fortaleza</title>
      </Head>
      <Flex background="talento.900" height="100vh" alignItems="center" justifyContent="center">
        <Text>
          Página home
        </Text>
      </Flex>
    </>
  )
}