export type ApprovalState = 'Pending' | 'Approved' | 'Not Approved';

export interface TeamMember {
  name: string;
  gender: string;
  dateOfBirth: string; // ISO string from API
  contact: string;
}

export interface TeamDto {
  _id: string;
  name: string;
  description: string;
  managerApproval: ApprovalState;
  directorApproval: ApprovalState;
  members: TeamMember[];
}





