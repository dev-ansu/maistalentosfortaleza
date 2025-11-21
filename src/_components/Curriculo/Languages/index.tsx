import { CandidateProfile } from "@/_types/CandidateProfile"
import { Flex, Text } from "@chakra-ui/react";

interface LanguageProps{
    candidate: CandidateProfile;
}

export const Language = ( { candidate }: LanguageProps )=>{
    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Idiomas</Text>

        </Flex>
    )
}