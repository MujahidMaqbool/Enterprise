export class EnterpriseStaffSearchViewModel {
    public StaffName: string;
    public Branches: any;
    public Positions: string;
    public Email: string;
    public Roles: string;
    public allowLogin: number;
    public DateFrom: string;
    public DateTo: string;
    public PageNumber: number;
    public PageSize: number;
    public SortIndex: number;
    public SortOrder: string;
}

export class EnterpriseStaffListViewModel {
    public StaffID : number;
    public StaffName  : string;
    public Mobile : boolean;
    public Email : string;
    public IsSuperAdmin  : boolean;
    public EnterpriseStaffViewModelDetail:  EnterpriseStaffViewModel = new EnterpriseStaffViewModel();
}

export class EnterpriseStaffViewModel {
    public StaffID : number;
    public BranchID : number;
    public BranchName : string;
    public StaffPositionName : string;
    public RoleID : number;
    public EnterpriseRoleID  : number;
    public StaffRoleName : Date;
    public AllowLogin : boolean;
    public CreatedOn  : string;
}

export class StaffView {
    public StaffPositionName: string;
    public Title: string;
    public FirstName: string;
    public LastName: string;
    public CardNumber: string;
    public Email: string;
    public Gender: string;
    public BirthDate: Date;
    public Phone: string;
    public Mobile: string;
    public Address1: string;
    public Address2: string;
    public CountryName: string;
    public StateCountyName: string;
    public CityName: string;
    public PostCode: string;
    public ImagePath: string;
    public Notes: string;
    public StaffBranchRoleName: string;
    public AllowLogin: boolean = true
     public Permission: Permission = new Permission();
     public StaffBranchList: StaffBranchList[];
}

export class Permission {
    public RoleID: number;
    public ShowOnScheduler: boolean = false;
    public CanDoClass: boolean = false;
    public CanDoService: boolean = false;
    public CanDoServiceOnline: boolean = false;
    public OnlineDisplayName: string;
    public FirstAidAllowed: boolean = false;
    public AllowTip: boolean = false;
}

export class StaffBranchList {
    BranchName: string;
    PositionName: string;
    IsActive: boolean;
    IsDefault: boolean;
    RoleName: string;
}

export class StaffAssignEnterPriseRole {
    AllowLogin : boolean;
    RoleID : number;
    StaffID : number;
    EnterpriseRoleID: number;
}

export class StaffAllSelectToggleModel{
    public isAllSelectedBranch: boolean = false;
    public isAllSelectedPosition: boolean = false;
    public isAllSelectedRoll: boolean = false;

}