import { CandidateProfile } from "@/_types/CandidateProfile"
import { dateFormat } from "@/_utils/dateFormat";
import { Flex, List, Text } from "@chakra-ui/react";
import Link from "next/link";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";

interface VerCurriculoProps{
    candidate: CandidateProfile;
}

export const VerCurriculo = ({ candidate }: VerCurriculoProps)=>{
    const candidateInterests = candidate.candidateInterests.map( item => item.interest.name).join(", ")

    return(
        <>
        <Flex alignItems="center" gap="1" w="max-content" mb="12px"  borderWidth={1} px={3} py={2}>
            <IoDocumentAttachOutline /><Link href={"/curriculo"}>Editar currículo </Link>
        </Flex>
        <Flex direction="column" w="full">
            <Flex direction="column" w="full" justifyContent="center" alignItems="center">
                <Text fontSize="4xl" >{candidate.user.name}</Text>
                <Text>{candidate.user.email}</Text>
                <Text>{candidate.whatsapp} | {candidate.phone}</Text>
                <Text>{candidate.city.name}, {candidate.state.acronym}</Text>
            </Flex>

            <Flex w="full" gap="2" direction="column">

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Objetivos</Text>
                 <Text>{candidateInterests}</Text>
            </Flex>

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Resumo</Text>
                 <Text>{candidate.summary}</Text>
            </Flex>

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Formação acadêmica</Text>
                 <List.Root gap="2" variant="plain" align="center">
                 {candidate.education && candidate.education.map( item => (
                    <List.Item key={item.id}>
                        <List.Indicator asChild color="green.500">
                        {item.currentlyStudying && <LuCircleDashed title="Ainda cursando" />}
                        {!item.currentlyStudying && item.endDate && <LuCircleCheck title="Concluído" />}
                        </List.Indicator>
                        <Flex direction="column">
                            {item.fieldOfStudy} - {item.institution}
                            <Text>Período: {dateFormat(item.startDate)} - {item.endDate && dateFormat(item.endDate)} {item.currentlyStudying && " Em conclusão"}</Text>
                        </Flex>
                    </List.Item>
                 ))}
                 </List.Root>
            </Flex>

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Cursos extracurriculares</Text>
                 <List.Root gap="2" variant="plain" align="center">
                 {candidate.courses && candidate.courses.map( item => (
                    <List.Item key={item.id}>
                        <List.Indicator asChild color="green.500">
                        <LuCircleCheck title="Concluído" />
                        </List.Indicator>
                        <Flex direction="column">
                            {item.institution} - {item.title} 
                            <Text>Carga horária: {item.hours}h - Concluído em: {item.completionDate && dateFormat(item.completionDate)} </Text>
                        </Flex>
                    </List.Item>
                 ))}
                 </List.Root>
            </Flex>

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Experiência</Text>
                 {candidate.experiences &&
                 <List.Root gap="2" variant="plain" align="center">
                    {candidate.experiences.map( item => (
                        <List.Item key={item.id}>
                            <List.Indicator asChild color="green.500">
                                <LuCircleDashed />
                            </List.Indicator>
                            <Flex direction="column">
                                {item.position} - {item.company}
                                <Text>Período: {dateFormat(item.startDate)} - 
                                    {item.endDate && dateFormat(item.endDate)}
                                    {item.currentlyWorking && " Atualmente"}    
                                </Text>
                            </Flex>
                        </List.Item>
                    ))}
                </List.Root>
                }
                {!candidate.experiences && <Text>Sem experiência</Text>}
            </Flex>
            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Idiomas</Text>
                 {candidate.languages &&
                 <List.Root gap="2" variant="plain" align="center">
                    {candidate.languages.map( item => (
                        <List.Item key={item.id}>
                            <List.Indicator asChild color="green.500">
                                <LuCircleDashed />
                            </List.Indicator>
                            <Flex direction="column">
                                <Text>
                                    {item.name} - {item.proficiency}
                                </Text>
                            </Flex>
                        </List.Item>
                    ))}
                </List.Root>
                }
            </Flex>

            </Flex>

        </Flex>
        </>
    )
}