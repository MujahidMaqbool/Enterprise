export class Tax {
    public TaxID: any;
    public TaxName: string;
    public TaxTypeName: string
    public TaxPercentage: number;
    public IsActive: boolean;
    public HasBranchPermission: boolean;
    BranchList: Array<Branch> = []
}
export class Branch {
    BranchID: number;
    BranchName: string;
    IsActive: boolean;
    IsIncluded: boolean;
}
export class SearchTax {
    public TaxTypeID: number = null;
    public TaxName: string;
    public BranchID: number = null;
    public TaxStatusID: number = null;
    public appSourceTypeID: number;
    public PageNumber: number = 1;
    public PageSize: number = 10;
    public SortIndex: number;
    public SortOrder: string;
}