export class EnterpriseCustomerList {
    public CustomerID: number;
    public CustomerName: string;
    public Email: string;
    public Mobile: string;
    public EnterpriseCustomerListDetailVM: Array<EnterpriseCustomerListDetailViewModel> =[];
}
export class EnterpriseCustomerListDetailViewModel {
    public CustomerID:number;
    public BranchID:number;
    public BranchName:string;
    public CustomerTypeID:number;
    //public string CustomerTypeName { get; set; }
    public MembershipID:number;
    public MembershipName:string;
    public MembershipStatusTypeID:number;
    public MembershipStatusTypeName:string;
    public MembershipStartDate:any;
    public MembershipEndDate:any;
    public IsLead:boolean;
    public IsClient:boolean;
    public IsMember:boolean;
}
export class MemberDetail {
    public CustomerID: number;
    public EnquirySourceTypeName: string;
    public ReferenceCustomerName: string;
    public CardNumber: string;
    public Title: string;
    public FirstName: string;
    public LastName: string;
    public Email: string;
    public Gender: string;
    public BirthDate: string;
    public Phone: string;
    public Mobile: string;
    public Address1: string;
    public Address2: string;
    public CountryName: string;
    public StateCountyName: string;
    public CityName: string;
    public PostCode: string;
    public ImagePath: string;
    public CompanyName: string;
    public Description: string;
    public FreeClassSuspended: boolean;
    public ContractSigned: boolean;
    public FirstAidAllowed: boolean;
    public OnlineAccessAllowed: boolean;
    public EmailAllowed: boolean;
    public SMSAllowed: boolean;
    public PhoneCallAllowed: boolean;
    public PostalMailAllowed: boolean;
    public MemberMessageAllowed: boolean;
    public AllowPartPaymentOnCore: boolean = true;
    public AllowPartPaymentOnWidget: boolean = true;
    public Occupation: string;
    // IsActive: boolean = true;
    // public MemberMembershipList: MemberMembershipList[];
    public PushNotificationAllowed : boolean = true;
    public IsWalkedIn:boolean;
 }