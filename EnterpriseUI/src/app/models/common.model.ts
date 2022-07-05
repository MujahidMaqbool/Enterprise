

export class ApiResponse {
    public MessageCode: number;
    public MessageText: string;
    public MessageData: any;
    public Result: any;
    public TotalRecord: number;
}

export class DateToFrom {
  public DateFrom: any = "";
  public DateTo: any = "";
}

export class DD_Branch {
    public BranchID: number;
    public BranchName: string;
    public Email: string;
    public Address1: string;
    public Phone1: string;
    public Currency: string;
    public CurrencySymbol: string;
    public TimeZone: string;
    public AllowPartPayment: boolean;
    public AllowStripeTerminal: boolean;
    public DateFormatID: number;
    public TimeFormatID: number;
    public WeekStartDayID: number = 4;
    public BranchTimeFormat12Hours: boolean = false;
    public ISOCode: string;

    public constructor(init?: Partial<DD_Branch>) {
        Object.assign(this, init);
    }
}
export class CompanyInfo{
   public CompanyID : number;
   public CompanyName: string;
   public ImagePath: string;
}
export class StaffInfo{
public Address1: string;
public Email: string;
public FirstName: string;
public ImagePath: string;
public IsSuperAdmin: boolean;
public LastName: string;
public Mobile: number
public RoleName: string;
public StaffID: number;
public TermsOfServiceURL:any;
public Title: string;
public FullName : string = "User"
}

export class ModulePermission {
    public ModuleID: number = 0;
    public ModulePageList: ModulePage[] = [];
}

export class ModulePage {
    public ModulePageID: number;
}
    export class CompanyInformation{
    public Address1: string;
    public Address2: string;
    public AppleStoreURL: string;
    public CityName: string;
    public CompanyID: number;
    public CompanyName: string;
    public CountryID: number;
    public Email: string;
    public Fax: string;
    public GooglePlayStoreURL: string;
    public ImageFile: any;
    public ImagePath: any;
    public IsActive: boolean;
    public NTN: string;
    public Phone1: string;
    public PostalCode: string;
    public RegNo: string;
    public StateCountyName: string;
    public Website: string;
    }















