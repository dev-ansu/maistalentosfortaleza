import { CityProps, StateProps } from "./CandidateProfile";

export interface JobProps{
  id: string;
  companyId: string;
  title: string;
  description?: string;
  requirements?: string;
  benefits: string[]
  tags: string[]
  salary?: number;
  contractType?: ContractType;
  seniority?: Seniority
  workload?: number;
  workloadType?: WorkloadType;
  location?: string;
  type: string[];
  isRemoteFriendly: Boolean;
  status: JobStatus;
  isDraft: Boolean;
  expiresAt: Date;
  views?: number;
  applications: any;
  state: StateProps;
  city: CityProps;
  createdAt: Date;
  updatedAt: Date;
}

export type ContractType = "clt" | "pj" | "estagio" | "aprendiz" | "freelancer" | "temporario";

export type Seniority = "estagio" | "junior" | "pleno" | "senior" | "especialista" | "lider";

export type WorkloadType = "parcial" | "integral" | "turno" | "flexivel";

export type JobStatus =  "open" | "paused" | "closed"; 

export type ApplicationStatus = "pending" | "accepted" | "rejected"


export interface ApplicationsProps{
  id: string;
  jobId: string;
  candidateId: string;
  appliedAt: Date;
  status: ApplicationStatus;
  rejectionReason: string;
}