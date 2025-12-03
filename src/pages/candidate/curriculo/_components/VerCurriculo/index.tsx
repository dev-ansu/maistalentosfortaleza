import { useAuthContext } from "@/_context/AuthContext";
import { EnumProps, EnumsProps, useEnumsContext } from "@/_context/EnumsContext";
import { CandidateProfile } from "@/_types/CandidateProfile"
import { dateFormat } from "@/_utils/dateFormat";
import { Button, Flex, List, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FiPrinter } from "react-icons/fi";
import { IoDocumentAttachOutline, IoPrintOutline } from "react-icons/io5";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";

interface VerCurriculoProps{
    candidate: CandidateProfile;
}

export const VerCurriculo = ({ candidate }: VerCurriculoProps)=>{
    const { user } = useAuthContext();
    const { enums } = useEnumsContext();

    const candidateInterests = candidate.candidateInterests.map( item => item.interest.name).join(", ")
    const candidateLanguages = candidate.languages.map( (language) => {
        const proficiency = enums?.LanguageProficiency.filter( (prof: EnumProps) => prof.value == language.proficiency)
        return {
            language: language.name, proficiency: proficiency && proficiency.length > 0 ? proficiency[0].label:'Sem proficiência',
        }
    },[]);
   
    
    const handlePrint = () => {
        window.print();
    }

    // Função para baixar como PDF (simples)
    const handleDownloadPDF = () => {
        // Implementação mais avançada viria aqui
        // Por enquanto, apenas chama a impressão
        window.print();
    }

    return(
        <>
        {user?.candidate?.id === candidate.id &&
            <Flex id="editar_curriculo" alignItems="center" gap="1" w="max-content" mb="12px"  borderWidth={1} px={3} py={2}>
                <IoDocumentAttachOutline /><Link href={"/candidate/curriculo"}>Editar currículo </Link>
            </Flex>
        }
        {/* Botões de Ação */}
        <Flex gap="2">
            <Button 
                colorScheme="blue" 
                variant="outline"
                onClick={handlePrint}
            >
                <FiPrinter />
                Imprimir
            </Button>
            
            <Button 
                colorScheme="green"
                onClick={handleDownloadPDF}
            >
                <IoPrintOutline />
                Salvar como PDF
            </Button>
        </Flex>
        <style jsx global>{`
            @media print {
                /* Esconde elementos que não devem aparecer na impressão */
                #editar_curriculo{
                    display:none !important;
                }
                nav, header, footer, button, a {
                    display: none !important;
                }
                #sidebar #sibebar_drawer, #sidebar .mobile_nav{
                    display:none !important;
                }
                
                /* Estilos específicos para impressão */
                body {
                    font-size: 12pt;
                    line-height: 1.5;
                    color: #000;
                    background: #fff;
                }
                
                /* Melhora a aparência impressa */
                .curriculo-print {
                    width: 100%;
                    max-width: 210mm; /* A4 */
                    margin: 0 auto;
                    padding: 5mm;
                    box-shadow: none;
                }
                
                /* Remove bordas e cores desnecessárias */
                * {
                    box-shadow: none !important;
                    text-shadow: none !important;
                }
                
                /* Mantém links como texto normal */
                a {
                    text-decoration: none;
                    color: #000;
                }
                
                /* Quebra de página */
                .page-break {
                    page-break-before: always;
                }
                
                /* Evita que seções sejam cortadas */
                h1, h2, h3, p {
                    page-break-inside: avoid;
                }
            }
        `}</style>
        <div className="curriculo-print">
        <Flex direction="column" w="full">
            <Flex direction="column" w="full" justifyContent="center" alignItems="center">
                <Text fontSize="4xl" >{candidate.user?.name}</Text>
                <Text fontSize="16px" fontWeight="semibold">Contato</Text>
                <Text>E-mail: {candidate?.email || candidate.user?.email}</Text>
                <Text>WhatsApp: {candidate?.whatsapp} | Telefone: {candidate?.phone}</Text>
                <Text>Localização: {candidate.city?.name}, {`${candidate.state?.acronym} `} {candidate.portfolioUrl && (
                        <>
                            | Portfolio: {candidate.portfolioUrl}
                        </>
                    )}
                </Text>
            </Flex>

            <Flex w="full" gap="2" direction="column">

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Objetivo profissional</Text>
                 <Text>{candidateInterests}</Text>
            </Flex>

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Resumo</Text>
                 <Text>{candidate?.summary}</Text>
            </Flex>

            <Flex w="full" direction="column">
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Informações</Text>
                 <Text><strong>Pretensão salarial:</strong> {Number(candidate?.salaryExpectation).toLocaleString('pt-BR', {
                    currency:"BRL",
                    style: "currency"
                 })}</Text>
                 <Text><strong>Disponibilidade imediata:</strong> {candidate?.isAvailable ? 'sim':'não'}</Text>
                 <Text><strong>Modelo de trabalho:</strong> {candidate?.workModel.join(", ")}</Text>
                 <Text><strong>Disponível para viagens:</strong> {candidate?.willingnessToTravel ? 'sim':'não'}</Text>
                 <Text><strong>Disponível para mudanças:</strong> {candidate?.willingnessToRelocate ? 'sim':'não'}</Text>
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
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Cursos & Certificações</Text>
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
                 <Text w="full" mb="16px" borderBottomWidth="1px" fontWeight="bold" borderBottomColor="gray.700" fontSize="2xl">Experiência profissional</Text>
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
                    {candidateLanguages.map( item => (
                        <List.Item key={item.language}>
                            <List.Indicator asChild color="green.500">
                                <LuCircleDashed />
                            </List.Indicator>
                            <Flex direction="column">
                                <Text>
                                    {item.language}: {item.proficiency}
                                </Text>
                            </Flex>
                        </List.Item>
                    ))}
                </List.Root>
                }
            </Flex>

            </Flex>

        </Flex>
        </div>
        </>
    )
}