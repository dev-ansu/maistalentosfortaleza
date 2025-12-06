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
    companySize: CompanySize;
    isVerified: Boolean;
    companyInterest: CompanyInterestList[];
    foundedYear: string;
    createdAt: string;
    verificationStatus: VerificationStatus;
}

export type VerificationStatus = "pending" | "approved" | "rejected" | "under_review"
export type CompanySize = "micro" | "small" | "medium" | "large" | "enterprise";