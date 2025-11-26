import { CompanyProfileFormData } from "@/_validations/company_profile";
import { CityProps, StateProps } from "./CandidateProfile";

export interface CompanyProfile extends CompanyProfileFormData{
    id: string;
    name: string;
    jobs: any;
    state: StateProps;
    city: CityProps;
}