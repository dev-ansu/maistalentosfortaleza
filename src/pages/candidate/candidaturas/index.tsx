import { Sidebar } from "@/_components/ui/sidebar/Index";
import { canSSRAuth } from "@/_utils/canSSRAuth";
import Head from "next/head";
import { Text } from "@chakra-ui/react";
import { CandidaturasTable } from "@/_components/Candidate/CandidaturasTable";
import { getAPIClient } from "@/_services/apiClient";

export default function Candidaturas() {
  return (
    <>
      <Head>
        <title>Mais Talentos Fortaleza - Candidaturas</title>
      </Head>

      <Sidebar>
        <Text
          w="full"
          mb="16px"
          borderBottomWidth="1px"
          borderBottomColor="gray.700"
        >
          Minhas candidaturas
        </Text>

        <CandidaturasTable />
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = getAPIClient(ctx);
  const meRequest = await api.get("/me");
  const candidate = meRequest.data.data;

  if(candidate.userType !== "candidate"){
    return {
        redirect:{
            destination: "/dashboard",
            permanent: false,
        }
    }
  }


  return { props: {} };
});
