import { CompanyProfileFormData } from "@/_validations/company_profile";
import { CityProps, CompanyInterestList, StateProps } from "./CandidateProfile";

export interface CompanyProfile extends Omit<CompanyProfileFormData,"stateId" | "cityId" | "companyInterest">{
    id: string;
    name: string;
    jobs: any;
    state: StateProps;
    city: CityProps;
    stateId: string;
    cityId: string;
    companyInterest: CompanyInterestList[];
}