import { CourseFormData } from "@/_validations/course";
import { EducationFormData } from "@/_validations/education";
import { ExperienceFormData } from "@/_validations/experience";
import { LanguageFormData } from "@/_validations/language";
import { InterestAreas } from "./InterestArea";
import { CompanyProfile } from "./CompanyProfile";

export interface CandidateProfile{
    id: string;
    user: UserProps;
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
    experiences: ExperienceListProps[];
    languages: LanguageListProps[];
    candidateInterests: CandidateInterestList[];
    company: CompanyProfile;
    gender: string;
    ethnicity: string;
    isAvailable: boolean;
    salaryExpectation: string;
    workModel: string[];
    email: string;
    portfolioUrl: string;
    willingnessToTravel: boolean;
    willingnessToRelocate: boolean;
}

export enum UserType{'candidate', 'company'}

export interface CandidateInterestList{
    id: string;
    interest: InterestAreas;
}

export interface CompanyInterestList{
    id: string;
    interest: InterestAreas;
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

export interface ExperienceListProps extends ExperienceFormData{
    id: string;
    candidateId: string;
}

export interface LanguageListProps extends Omit<LanguageFormData, "proficiency">{
    id: string;
    candidateId: string;
    proficiency: string;
}

export interface StateProps{
    id: string;
    name: string;
    acronym: string;
}

export interface CityProps{
    id: string;
    name: string;
    stateId: string;
}

export interface UserProps{
    id: string;
    name: string;
    email: string;
}