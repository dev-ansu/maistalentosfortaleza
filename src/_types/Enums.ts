export interface EnumsProps{
    WorkModel: EnumProps[];
    JobStatus: EnumProps[];
    ApplicationStatus: EnumProps[];
    DegreeLevel: EnumProps[];
    LanguageProficiency: EnumProps[];
    UserType: EnumProps[];
    Gender: EnumProps[];
    Ethnicity: EnumProps[];
    CompanySize: EnumProps[];
    VerificationStatus: EnumProps[];
    ContractType:EnumProps[];
    WorkloadType: EnumProps[];
    Seniority: EnumProps[];
    ReportStatus: EnumProps[];
    ReportReason: EnumProps[];
}

export interface EnumProps{
    value: string;
    label: string;
}