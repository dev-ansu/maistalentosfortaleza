import { CourseFormData } from "@/_validations/course";
import { EducationFormData } from "@/_validations/education";

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
    courses: CourseListProps[];
    education: EducationListProps[];
}

export interface EducationListProps extends Omit<EducationFormData, "degree">{
    id: string;
    candidateId: string;
    degree: string;
};

export interface CourseListProps extends CourseFormData{
    id: string;
    candidateId: string;
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