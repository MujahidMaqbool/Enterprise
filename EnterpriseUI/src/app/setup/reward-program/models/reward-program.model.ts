

export class RewardProgramModel {
    public RewardProgramID	:number;
    public RewardProgramName?:string;
    public IsActive:boolean = false;
    public AppSourceTypeID:number = 1;
    public RewardProgramEnrollmentTypeID:number;
    public RewardProgramEnrollmentTypeName?:string;
    public MinimumPointsRequiredtoRedeem:any;
    public MemberRedeemLimit:number = 100;
    public ClientRedeemLimit:number = 100;
    public LeadRedeemLimit:number = 100;
    public PointsExpiryDurationValue?:string;
    public IsPointsExpiry:boolean = false;
    public PointsExpiryDuration:number;
    public DurationTypeID:number = 39;
    public RedemptionValue	:number = 1;
    public RedemptionPoints:number = 1;
    public IsDiscountedMembershipBenefits:boolean;
    public IsArchived:boolean;
    public ArchivePlanDate?:string;
    public IsAdvanceSetting:boolean = false;
    public IsAhdhocMembershipPayment:boolean = true;
    public RewardProgramDetailVM: RewardProgramDetailViewModel = new RewardProgramDetailViewModel();
    public RewardProgramBranchVM?:RewardProgramBranchViewModel[] = [];
    public RewardProgramEarningRuleVM?:RewardProgramEarningRuleViewModel[] = [];
    public RewardProgramEarningRuleExceptionVM?:RewardProgramEarningRuleExceptionViewModel[] = [];
    public RewardProgramActivitiesEarningRuleVM?:RewardProgramActivitiesEarningRuleViewModel[] = [];
    public RewardProgramActivitiesEarningRuleExceptionVM?:RewardProgramActivitiesEarningRuleExceptionViewModel[] = [];

}

export class RewardProgramDetailViewModel {
    public RewardProgramDetailID: number;
    public RewardProgramID: number;
    public Description?: string ;
}

export class RewardProgramBranchViewModel {
    public BranchID: number;
    public IsDefault: boolean;
    public BranchName:string;
    public BranchCityName:string;
}

export class RewardProgramEarningRuleViewModel {
    public ItemTypeID: number;
    public AmountSpent: number ;
    public BenefittedEarnedPoints: number ;
    public MemberEarnedPoints: number ;
    public ClientEarnedPoints: number ;
    public LeadEarnedPoints: number ;
}
export class RewardProgramEarningRuleFrontEnd {
    public ItemTypeID: number;
    public AmountSpent: number = 1;
    public BenefittedEarnedPoints: number = 1;
    public MemberEarnedPoints: number = 1;
    public ClientEarnedPoints: number = 1;
    public LeadEarnedPoints: number = 1;
}

export class RewardProgramEarningRuleExceptionViewModel {
    BranchID: number;
    ItemTypeID: number;
    ItemID: number;
    AmountSpent: number;
    BenefittedEarnedPoints: number = 1;
    MemberEarnedPoints: number = 1;
    ClientEarnedPoints: number = 1 ;
    LeadEarnedPoints: number = 1;
}
export class RewardProgramExceptionRuleModel {
    ItemBranchID: number;
    ItemName: string;
    ItemID: number;
    AmountSpent: number = 1;
    BenefittedEarnedPoints: number = 1;
    MemberEarnedPoints: number = 1;
    ClientEarnedPoints: number = 1 ;
    LeadEarnedPoints: number = 1;
    IsSelected:boolean = false;
    BranchName:string;
}
export class ExceptionItemType{
    ItemBranchID:number;
    ItemID: number;
    ItemName: string;
}
export class RewardProgramActivityExceptionRuleModel {
    FormBranchID: number;
    FormName: string;
    FormID: number;
    MemberEarnedPoints: number = 1;
    ClientEarnedPoints: number = 1 ;
    LeadEarnedPoints: number = 1;
    IsSelected:boolean = false;
    gridListData:string;
    BranchName:string;
}
export class RewardProgramActivitiesEarningRuleViewModel {
    RewardProgramActivityTypeID: number;
    MemberEarnedPoints: number;
    ClientEarnedPoints: number;
    LeadEarnedPoints: number;
}

export class RewardProgramActivitiesEarningRuleExceptionViewModel {
    BranchID: number;
    FormID: number;
    RewardProgramActivityTypeID: number;
    MemberEarnedPoints: number;
    ClientEarnedPoints: number;
    LeadEarnedPoints: number;
}

export class RewardProgramBranchResultViewModel {
    BranchName?: string;
    BranchCityName?: string;
}

export class RewardProgramEarningRuleExceptionResultViewModel {
    BranchID: number;
    BranchName?: string;
    ItemTypeID: number;
    ItemID: number;
    ItemName?: string;
    AmountSpent: number;
    BenefittedEarnedPoints: number;
    MemberEarnedPoints: number;
    ClientEarnedPoints: number;
    LeadEarnedPoints: number;
    IsSelected: boolean = false;
    ItemBranchName:string;
}

export class RewardProgramActivitiesEarningRuleExceptionResultViewModel {
    BranchID: number;
    BranchName?: string;
    FormID: number;
    FormName?: string;
    RewardProgramActivityTypeID: string;
    MemberEarnedPoints: number;
    ClientEarnedPoints: number;
    LeadEarnedPoints: number;
    IsSelected:boolean;
    FormBranchName:string;
}
export class RewardProgramSearchParameter {
    public Name: string;
    public StatusIDs: String;
    public BranchID: any;
    public PageNumber: number;
    public PageSize: number;
}
export class RewardProgramList{
    public AppSourceTypeID : number;
    public Branches : number;
    public IsActive: boolean;
    public Name: string;
    public RewardProgramID: number;
    public Type : string;
    public ActionStatus:number;
}
