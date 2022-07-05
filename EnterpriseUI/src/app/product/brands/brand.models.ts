export class BrandSearchParameter {
  public BrandName : string = '';
  public BrandTypeID: number = null;
  public BranchID: number = null;
  public BrandCategoryID: number = null;
  public BrandStatusID: number = null;
  public PageNumber: number;
  public PageSize: number;
  public SortIndex: number = 1;
  public SortOrder: string = "DESC";
}


export class BrandViewModel {
  public BrandID : number = 0;
  public BrandName?: string = "";
  public ProductCategoryID	: number;
  public ProductCategoryName? :string = "";
  public Description?:	string = "";
  public BrandTypeName?: string = "";
  public HasBranchPermission: boolean = false;
  public AppSourceTypeID: number = 0;
  public BranchList :BranchList[] = [];
}
export class BranchList{
  public BranchID : number = 0;
  public BranchName: string = "";
  public IsActive: boolean = false;
  public IsIncluded : boolean = false;
}

export class SaveBrand {
  public BrandID : number = 0;
  public BrandName? :string = "";
  // public ProductCategoryID	: number;
  // public ProductCategoryName? :string = "";
  public Description? :string = "";
  public HasBranchPermission: boolean = false;
  public AppSourceTypeID: number = 0;
  public BranchList :BranchList[] = [];
  public ProductCategoryList :ProductCategoryList[] = [];
}
export class ProductCategoryList {
  public ProductCategoryID : number = 0;
  public CategoryTypeName: string = "";
}
