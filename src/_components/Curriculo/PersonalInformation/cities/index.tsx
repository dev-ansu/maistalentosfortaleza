import { ServerErrors } from "@/_components/ui/ServerErrors";
import { useServerErrors } from "@/_hooks/useServerErrors";
import { getAPIClient } from "@/_services/apiClient";
import { CandidateProfile, CityProps } from "@/_types/CandidateProfile";
import { PersonalInfoFormData } from "@/_validations/curriculo";
import { createListCollection, Field, Portal, Select } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const CitiesItems = ({ candidate }: {candidate: CandidateProfile})=>{
    const {watch, setValue, control, formState:{errors}} = useFormContext<PersonalInfoFormData>();
    const stateId = watch("stateId"); // <- observa o estado selecionado
    const [cities, setCities] = useState<CityProps[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const { serverErrors, handleServerError } = useServerErrors(watch);

    const cityCollection = createListCollection({
        items: cities.length > 0 ? cities.map((c) => ({
            label: c.name,
            value: c.id
        })): [ { label: '', value: ''}]
    });
    
    useEffect(() => {

        const selectedState = Array.isArray(stateId) ? stateId[0] : stateId;

        if (!selectedState) return;

        const loadCities = async () => {
            try {
                setLoadingCities(true);
                const response = await getAPIClient().get(`/city/state/${stateId}`);
                setCities(response.data.data);
                setValue("cityId", []); // reseta cidade ao trocar o estado
            } catch (error) {
                console.error("Erro ao carregar cidades:", error);
            } finally {
                setLoadingCities(false);
            }
        };

    loadCities();
}, [stateId, setValue]);
    return (
        <Field.Root invalid={!!errors.cityId}>
            <Field.Label>Cidade{`${candidate.city?.name ? ": " + candidate.city.name:''}`}</Field.Label>
            <Controller 
                control={control}
                name="cityId"
                render={({field}) => (
                        <Select.Root 
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => field.onChange(value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={cityCollection} 
                            disabled={!stateId || loadingCities} 
                            width="full"
                        >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                            <Select.ValueText placeholder={
                                loadingCities ? "Carregando..." : stateId ? "Selecione uma cidade" : "Selecione um estado antes"
                            } />
                                </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                            <Select.Content>
                                {cityCollection.items && cityCollection.items.map((city) => (
                                <Select.Item item={city} key={city.value}>
                                    {city.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                                ))}
                            </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )}
            />
            <Field.ErrorText>{errors.cityId?.message}</Field.ErrorText>
                <ServerErrors serverErrors={serverErrors} field="city"/>
            </Field.Root>
    )
}