import { useEnumsContext } from "@/_context/EnumsContext";
import { createListCollection, Field, Portal, Select } from "@chakra-ui/react"

interface Props{
    handleStatusChange: (value: string) => void;
    defaultStatus: string;
}

export const ChangeVerificationStatus = ({ handleStatusChange, defaultStatus }: Props)=>{

    const { enums } = useEnumsContext();
    
    const verificationStatusList = createListCollection({
        items: enums ? enums.VerificationStatus: [ { label: '', value: ''}]
    });
    
    console.log(defaultStatus);
    return(
        <Field.Root>
            <Select.Root 
                value={[defaultStatus]}
                onValueChange={({value}) => handleStatusChange(value[0])}
                collection={verificationStatusList}  
                width="full"
            >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                <Select.ValueText placeholder="Selecione um status" />
                    </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                <Select.Content>
                    {verificationStatusList.items && verificationStatusList.items.map((status) => (
                    <Select.Item item={status} key={status.value}>
                        {status.label}
                        <Select.ItemIndicator />
                    </Select.Item>
                    ))}
                </Select.Content>
                </Select.Positioner>
            </Portal>
            </Select.Root>
            <Field.HelperText>Verifique o status de empresa para saber se ela pode ou não publicar vagas.</Field.HelperText>
        </Field.Root>
    )
}