import { useEnumsContext } from "@/_context/EnumsContext";
import { CompanyProfile } from "@/_types/CompanyProfile"
import { dateFormat } from "@/_utils/dateFormat";
import { bgStatus, StatusKey } from "@/pages/admin/empresas-pendentes/_components/PendingCompaniesTable";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

interface Props{
    company: CompanyProfile;
}

export const Company = ({ company }: Props)=>{
    const { enums } = useEnumsContext();

    return(
        <Flex p="1.5">
            <Flex w="full" direction="column">
                <Flex w="full" direction="column" gap="2">
                    <Flex direction="column" textAlign="center">
                        <Text fontSize="3xl">{company.name}</Text>
                        <Text fontSize="sm">{company.contactEmail} - {company.phone}</Text>
                        <Text fontSize="sm">CNPJ: {company.cnpj}</Text>
                        <Text fontSize="sm">Fundação: {company.foundedYear ?? "N/A"}</Text>
                    </Flex>
                    <Flex alignSelf="center" gap="1" wrap="wrap">
                        {company.companyInterest && company.companyInterest.map( item => (
                            <Flex gap="1" alignItems="center" borderWidth={1} px={3} py={2} key={item.id}>                        
                                {item.interest.name}
                            </Flex>  
                        ))}
                    </Flex>
                    <Flex gap="4" mt="4" mb="4" justifyContent="center" alignItems="center">
                        {company.facebook && 
                            <a href={`${company.facebook}`} target="_blank">
                                <FaFacebook size="28" />
                            </a>
                        }
                        {company.instagram && 
                            <a href={`${company.instagram}`} target="_blank">
                                <FaInstagram size="28" />
                            </a>
                        }
                        {company.linkedin && 
                            <a href={`${company.linkedin}`} target="_blank">
                                <FaLinkedin size="28" />
                            </a>
                        }
                    </Flex>
                    <Flex wrap="wrap" maxW="max-content" alignSelf="center" justifyContent="space-between" borderTopWidth="1px">
                        <Flex p="4" w="full" textAlign="center" direction="column" gap="2" borderRightWidth="1px">
                            <Text fontWeight="semibold">Status</Text>
                            <Stack fontSize="12px" px="0.5" textAlign="center" rounded="sm" bg={`${bgStatus[company.verificationStatus] as StatusKey}`}>
                                {enums && enums.VerificationStatus.filter( item => item.value == company.verificationStatus)[0].label}
                            </Stack>
                        </Flex>                        
                        <Flex p="4" w="full" textAlign="center" direction="column" gap="2" borderRightWidth="1px">
                            <Text fontWeight="semibold">Verificada</Text>
                            <Stack fontSize="12px" px="0.5" textAlign="center" rounded="sm" bg={`${company.isVerified ? "blue.500":"red.500"}`}>
                                {company.isVerified ? "Sim":"Não"}
                            </Stack>
                        </Flex>                        
                        <Flex p="4" w="full" textAlign="center" direction="column" gap="2" borderRightWidth="1px">
                            <Text fontWeight="semibold">Tamanho</Text>
                            <Stack fontSize="12px" px="0.5" textAlign="center" rounded="sm">
                                {company.companySize ?? "N/A"}
                            </Stack>
                        </Flex>                        
                        <Flex p="4" w="full" textAlign="center" direction="column" gap="2" borderRightWidth="1px">
                            <Text fontWeight="semibold">Localização</Text>
                            <Stack fontSize="12px" px="0.5" textAlign="center" rounded="sm">
                                <Text>{company.city.name}, {company.state.acronym}</Text>
                            </Stack>
                        </Flex>                        
                    </Flex>
                    <Flex direction="column" alignItems="center" textAlign="center" w="full" justifyContent="center">
                        <a href={`${company.website}`} style={{ textAlign:"center"}} target="_blank">
                            {company.website}
                        </a>
                        <Text fontSize="sm" color="darkgray">Conosco desde: {dateFormat(company.createdAt)}</Text>
                    </Flex>
                </Flex>
                <Flex w="full" wrap="wrap" mt="4" direction="column">
                    <Text fontSize="2xl" fontWeight="semibold" mb="2">Descrição da empresa</Text>
                    <Text lineBreak="auto">{company.description}</Text>
                </Flex>
            
            </Flex>
            
        </Flex>
    )
}