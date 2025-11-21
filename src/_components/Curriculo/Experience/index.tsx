import { CandidateProfile } from "@/_types/CandidateProfile"
import { Flex, Text } from "@chakra-ui/react";

interface ExperienceProps{
    candidate: CandidateProfile;
}

export const Experience = ( { candidate }: ExperienceProps )=>{
    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Experiência</Text>

        </Flex>
    )
}