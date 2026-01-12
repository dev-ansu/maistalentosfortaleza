import { Flex, Stack, Text } from "@chakra-ui/react"
import { VagasProps } from "./VagasTableCompany"
import { MdLocationPin, MdMoney, MdCheck } from "react-icons/md"
import { useEnumsContext } from "@/_context/EnumsContext"
import { FaBuilding } from "react-icons/fa"
import { dateFormat } from "@/_utils/dateFormat"
import { useAuthContext } from "@/_context/AuthContext"
import { ApplyJob } from "./Apply/ApplyJob"

export const VisualizacaoVaga = ({ vaga }: { vaga: VagasProps})=>{
    const { enums } = useEnumsContext();
    const workModel = enums ? enums?.WorkModel.filter( item => item.value == vaga.type)[0].label:vaga.type;
    const companySize = enums ? enums?.CompanySize.filter(item => item.value === vaga.company.companySize)[0].label:vaga.company.companySize;
    const areasAtuacao = vaga.company.companyInterest.map( item => item.interest.name).join(", ");
    const { user } = useAuthContext();
    return(
        <>
        <Flex w="full" gap="10" mt="4" direction="column">
            <Flex w="full" alignItems="center" direction="column" justifyContent="center">
                <Text fontSize="4xl">{vaga.title}</Text>
                <Text color="darkgray">{vaga.company.name}</Text>
                <Text color="darkgray" fontSize="12px">
                    Data de publicação: {dateFormat(vaga.createdAt)}
                </Text>
            </Flex>

            <Flex fontSize="xl" justifyContent="center" alignItems="center"  gap="5">
                <Flex direction="column" alignItems="center">
                    <MdLocationPin />
                    {vaga.city.name}, {vaga.state.acronym}
                </Flex>
                <Flex direction="column" alignItems="center">
                <MdMoney />{Number(vaga.salary).toLocaleString("pt-br", {
                    currency:"BRL",
                    style:"currency"
                }) ?? "a combinar"}
                </Flex>
                <Flex direction="column" alignItems="center">
                    <FaBuilding /> {workModel}
                </Flex>
            </Flex>
            <Flex direction="column" alignSelf="center" maxWidth="540px">
                <Text>{vaga.description}</Text>

                <Flex gap="1" direction="column">
                    <Text mt="4">Requisitos</Text>
                    {vaga.requirements.map( item => (
                        <Flex alignItems="center" gap="1">
                            <MdCheck />{ item }
                        </Flex>
                    ) )}
                </Flex>

                <Flex gap="1" direction="column">
                    <Text mt="4">Benefícios</Text>
                    {vaga.benefits.map( item => (
                        <Flex alignItems="center" gap="1">
                            <MdCheck />{ item }
                        </Flex>
                    ) )}
                </Flex>

                <Flex gap="1" direction="column">
                    <Text mt="4">Senioridade</Text>
                    {vaga.seniority ?? "Sem senioridade"}
                </Flex>

                <Flex gap="1" direction="column">
                    <Text mt="4">Tipo de contrato e jornada</Text>
                    {vaga.contractType} | {vaga.workloadType}
                </Flex>

                <Flex mt="4" direction="column" gap="2">
                    <Text>Sobre a empresa</Text>
                    <Text>{vaga.company.description}</Text>
                    <Text><b>Localização:</b> {vaga.company.city.name}, {vaga.company.state.acronym}</Text>
                    <Text><b>Porte:</b> {companySize}</Text>
                    <Flex direction="column" gap="0.5" mt="1">
                        <Text><b>Áreas de atuação</b></Text>
                        <Text>{areasAtuacao}</Text>
                    </Flex>
                </Flex>
                {user?.candidate && user.userType == "candidate" && 
                <Stack my="4" display="flex" justifyContent="flex-start" alignItems="flex-start">
                    <ApplyJob jobId={vaga.id} />
                </Stack>
                }

            </Flex>
        </Flex>
        </>
    )
}