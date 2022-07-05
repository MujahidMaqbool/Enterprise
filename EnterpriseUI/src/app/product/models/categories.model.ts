export class ProductCategory {
    public ProductCategoryID: number;
    public ProductCategoryName: string;
    public Description: string;
    public HasBranchPermission: boolean = false;
    public ImageFile: string;
    public ImagePath: string;
    public BranchList: Branch[] = [];
}

export class Branch {
    public BranchID: number;
    public BranchName: string;
    public IsActive: boolean;
    public IsIncluded: boolean;
    // public IsInActiveDisabled: boolean = false;
}

export class SearchCategory {
    public categoryTypeID: number = null;
    public categoryName: string;
    public branchID: number = null;
    public categoryStatusID: number = null;
    public appSourceTypeID: number;
    public pageNumber: number = 1;
    public pageSize: number = 10;
    public SortIndex: number;
    public SortOrder: string;
}