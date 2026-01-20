import { useEnumsContext } from "@/_context/EnumsContext";
import { InterestAreas } from "@/_types/InterestArea";
import { createListCollection, Portal, Select } from "@chakra-ui/react"

interface Props{
    handleChangeApplicationStatus: (value: string) => void;  
}

export const ChangeApplicationStatusFilter = ({handleChangeApplicationStatus}: Props)=>{

    const { enums } = useEnumsContext();
    const applicationStatus = enums?.ApplicationStatus ?? [
        {
            label: "Aceita",
            value:"accepted",
        },
        {
            label: "Rejeitads",
            value:"rejected",
        },
        {
            label: "Pendente",
            value:"pending",
        }
    ]

    const applicationStatusList = createListCollection({
        items: applicationStatus
    });
    
    return(
        <Select.Root 
            collection={applicationStatusList}  
            onValueChange={( { value }) => handleChangeApplicationStatus(value[0])}
            width="full"
        >
        <Select.HiddenSelect />
        <Select.Control>
            <Select.Trigger>
            <Select.ValueText placeholder="Filtro por status" />
                </Select.Trigger>
            <Select.IndicatorGroup>
                <Select.Indicator />
            </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
            <Select.Positioner>
            <Select.Content>
                {applicationStatusList.items && applicationStatusList.items.map((appStatus) => (
                <Select.Item item={appStatus} key={appStatus.value}>
                    {appStatus.label}
                    <Select.ItemIndicator />
                </Select.Item>
                ))}
            </Select.Content>
            </Select.Positioner>
        </Portal>
    </Select.Root>
    )
}