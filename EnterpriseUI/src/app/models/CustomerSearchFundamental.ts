export class EnterpriseCustomerListSearchViewModel {
    public CustomerName: string;
    public BranchIDs: any =null;
    public CustomerTypeID: number = 0;
    public Email: string;
    public IsAdvanceSearch: boolean;
    public MembershipIDs: string = null;
    public MembershipStatusTypeIDs:string= null;
    public MembershipStartDate: any;
    public MembershipEndDate: any;
    public MembershipEnquiryStatusTypeIDs: string = null;
    public EnquiredMembershipIDs: string =null;
    public SourceTypeIDs: string = null;
    public DateFrom: any;
    public DateTo: any;
    public PageNumber: number
    public PageSize: number;
    public SortIndex: number;
    public SortOrder: string;
}