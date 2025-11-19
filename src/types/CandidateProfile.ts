import { EducationFormData } from "@/validations/education";

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
    education: EducationListProps[];
}

export interface EducationListProps extends Omit<EducationFormData, "degree">{
    id: string;
    candidateId: string;
    degree: string;
};

export interface StateProps{
    id: string;
    name: string;
}

export interface CityProps{
    id: string;
    name: string;
    stateId: string;
}