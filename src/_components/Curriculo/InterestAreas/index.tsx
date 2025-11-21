import { CandidateProfile } from "@/_types/CandidateProfile"
import { Flex, Text } from "@chakra-ui/react";

interface InterestAreaProps{
    candidate: CandidateProfile;
}

export const InterestArea = ( { candidate }: InterestAreaProps )=>{
    return(
        <Flex direction="column" w="full">
            <Text mb="16px" borderBottomWidth="1px" borderBottomColor="gray.700">Áreas de interesse</Text>

        </Flex>
    )
}