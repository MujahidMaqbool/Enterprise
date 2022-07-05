export class Login {
    Email: string;
    CompanyID?: number;    
    Password?: string;
}
export class StaffAuthentication{
    BranchID : number;
    CoreAuthToken? : string;
    EnterpriseAuthToken? : string;
}