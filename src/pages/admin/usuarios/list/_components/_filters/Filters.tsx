import { InterestAreas } from "@/_types/InterestArea";
import { createListCollection, Portal, Select } from "@chakra-ui/react"

interface Props{
    handleChangeInterest: (value: string) => void;
    interestAreas: InterestAreas[];   
}

export const ChangeInterestFilter = ({interestAreas, handleChangeInterest}: Props)=>{

    const interestAreasList = createListCollection({
        items: interestAreas && interestAreas.length > 0 ? interestAreas.map((c) => ({
            label: c.name,
            value: c.id
        })): [ { label: '', value: ''}]
    });
    
    return(
        <Select.Root 
            collection={interestAreasList}  
            onValueChange={( { value }) => handleChangeInterest(value[0])}
            width="full"
        >
        <Select.HiddenSelect />
        <Select.Control>
            <Select.Trigger>
            <Select.ValueText placeholder="Selecione uma área de interesse" />
                </Select.Trigger>
            <Select.IndicatorGroup>
                <Select.Indicator />
            </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
            <Select.Positioner>
            <Select.Content>
                {interestAreasList.items && interestAreasList.items.map((interestArea) => (
                <Select.Item item={interestArea} key={interestArea.value}>
                    {interestArea.label}
                    <Select.ItemIndicator />
                </Select.Item>
                ))}
            </Select.Content>
            </Select.Positioner>
        </Portal>
    </Select.Root>
    )
}