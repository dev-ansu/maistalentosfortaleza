import { CandidateProfile } from "@/_types/CandidateProfile";
import { Flex, Text } from "@chakra-ui/react"
import { Diversity } from "./Form/Diversity";
import { Extra } from "./Form/Extra";

interface Props{
    candidate: CandidateProfile;
}

export const ExtraInformation = ({ candidate }: Props)=>{
    
    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Informações extras</Text>
                <Flex direction="column" gap="4">
                    <Diversity  />
                    <Extra />
                </Flex>
        </Flex>
    )
}