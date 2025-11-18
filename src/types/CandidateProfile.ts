export interface CandidateProfile{
    id: string;
    userId: string;
    birthDate: string;
    summary: string;
    phone: string;
    whatsapp: string;  
    stateId: string;
    cityId: string;
    city: CityProps;
    state: StateProps;
}

export interface StateProps{
    id: string;
    name: string;
}

export interface CityProps{
    id: string;
    name: string;
    stateId: string;
}