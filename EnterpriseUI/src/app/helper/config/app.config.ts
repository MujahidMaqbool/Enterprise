
class ProductViewTabs {
  public ProductDetails: string = "Product Details";
  public PricingDetails: string = "Pricing Details";
  public InventoryDetails: string = "Inventory Details";

}

export class Configurations {
    public static readonly SuccessMessageTimeout: number = 8000;
    public static readonly CustomerTypeList: any[] = [{ CustomerTypeID: 0, CustomerTypeName: "All" },{ CustomerTypeID: 1, CustomerTypeName: "Client" }, { CustomerTypeID: 2, CustomerTypeName: "Lead" }, { CustomerTypeID: 3, CustomerTypeName: "Member" }];
    public static readonly SortOrder_ASC = "ASC";
    public static readonly SortOrder_DESC = "DESC";
    public static readonly DefaultPageSize: number = 10;
    public static readonly PageSize1: number = 10;
    public static readonly PageSize2: number = 25;
    public static readonly PageSize3: number = 50;
    public static readonly PageSizeOptions: number[] = [5, 10, 15, 20,];
    public static readonly WaitlistPageSizeOptions: number[] = [5, 10];
    public static readonly DateFormatForSave: string = "MMMM d, y";
    public static readonly TimeFormat: string = "HH:mm";
    public static readonly TimeFormatView: string = "HH:mm";
    public static readonly DateFormat: string = "yyyy-MM-dd";
    public static readonly DateTimeFormat: string = "MMM d, y - HH:mm";
    public static readonly ProductViewTabs: ProductViewTabs = new ProductViewTabs();
    public static readonly EmailMaxLength: number = 1500; ///For purchaseOrder (send Email to supplier).

/* Keys Allowed in Discount filed */

    public static readonly AllowedNumberKeysOnly: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "ArrowRight", "ArrowLeft", "Backspace", "Delete"];
    public static readonly PurchaseRestrictList: any[] = [{ value: 1, text: "Client" }, { value: 2, text: "Lead" }, { value: 3, text: "Member With Active Memberships" }, { value: 4, text: "Member With Inactive Memberships" }, { value: 5, text: "New Customer - From Widget & App" }];

    public static readonly ClassificationList: any[] = [{ value: 1, text: "Standard Product" }, { value: 2, text: "Variant Product" }];


    public static readonly FavouriteViewColumnNameList: Array<any> = [
        { FavouriteViewColumnIndex: 1, FavouriteViewColumnName: "Name", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 2, FavouriteViewColumnName: "Branch", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 3, FavouriteViewColumnName: "Type", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 4, FavouriteViewColumnName: "Email", selected: true, isCustomerInfoColumn: true, isDefault: false },
        { FavouriteViewColumnIndex: 5, FavouriteViewColumnName: "Mobile", selected: true, isCustomerInfoColumn: true, isDefault: false },
        { FavouriteViewColumnIndex: 6, FavouriteViewColumnName: "Date Created", selected: false, isCustomerInfoColumn: true, isDefault: false },
        { FavouriteViewColumnIndex: 7, FavouriteViewColumnName: "Membership Name", selected: false, isCustomerInfoColumn: false, isDefault: false },
        { FavouriteViewColumnIndex: 8, FavouriteViewColumnName: "Membership Status", selected: false, isCustomerInfoColumn: false, isDefault: false },
        { FavouriteViewColumnIndex: 9, FavouriteViewColumnName: "Membership Start Date", selected: false, isCustomerInfoColumn: false, isDefault: false },
        { FavouriteViewColumnIndex: 10, FavouriteViewColumnName: "Membership End Date", selected: false, isCustomerInfoColumn: false, isDefault: false },
        { FavouriteViewColumnIndex: 11, FavouriteViewColumnName: "Enquiry Status", selected: false, isCustomerInfoColumn: false, isDefault: false, isCustomerEniquryColumn: true },
        { FavouriteViewColumnIndex: 12, FavouriteViewColumnName: "Enquired Membership", selected: false, isCustomerInfoColumn: false, isDefault: false, isCustomerEniquryColumn: true },
    ];

    public static readonly DefaultViewColumnNameList: any[] = [
        { FavouriteViewColumnIndex: 1, FavouriteViewColumnName: "Name", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 2, FavouriteViewColumnName: "Branch", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 3, FavouriteViewColumnName: "Type", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 4, FavouriteViewColumnName: "Email", selected: true, isCustomerInfoColumn: true, isDefault: true },
        { FavouriteViewColumnIndex: 5, FavouriteViewColumnName: "Mobile", selected: true, isCustomerInfoColumn: true, isDefault: true },

    ];
    public static readonly Status: any[] = [{ StatusID: 1, StatusName: "Active" }, { StatusID: 0, StatusName: "In Active" }];
    public static readonly TimePlaceholder: string = "HH:mm";
    public static readonly TimePlaceholderWithFormat: string = "hh:mm a";

    public static readonly ProductFavouriteViewColumnNameList: Array<any> = [
      { FavouriteViewColumnIndex: 1, FavouriteViewColumnName: "Product", selected: true, isProductInfoColumn: true, isDefault: true ,ColumnName:"product"},
      { FavouriteViewColumnIndex: 2, FavouriteViewColumnName: "Classification", selected: true, isProductInfoColumn: true, isDefault: true ,ColumnName:"product"},
      { FavouriteViewColumnIndex: 3, FavouriteViewColumnName: "Type", selected: true, isProductInfoColumn: true, isDefault: true ,ColumnName:"product" },
      { FavouriteViewColumnIndex: 27, FavouriteViewColumnName: "Branch", selected: true, isProductInfoColumn: true, isDefault: true ,ColumnName:"product" },
      { FavouriteViewColumnIndex: 4, FavouriteViewColumnName: "Category", selected: true, isProductInfoColumn: true, isDefault: false,ColumnName:"product" },
      { FavouriteViewColumnIndex: 5, FavouriteViewColumnName: "Brand", selected: true, isProductInfoColumn: true, isDefault: false ,ColumnName:"product"},
      { FavouriteViewColumnIndex: 21, FavouriteViewColumnName: "Retail Price", selected: true, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 22, FavouriteViewColumnName: "Current Stock", selected: true, isProductInfoColumn: false, isDefault: false ,ColumnName:"inventory"},

      // Start Dynamic Loop Handling
      { FavouriteViewColumnIndex: 6, FavouriteViewColumnName: "Purchase Restriction", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"product"},
      { FavouriteViewColumnIndex: 8, FavouriteViewColumnName: "Show Online", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      { FavouriteViewColumnIndex: 9, FavouriteViewColumnName: "Hide Price Online", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      { FavouriteViewColumnIndex: 10, FavouriteViewColumnName: "Is Featured", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      // { FavouriteViewColumnIndex: 11, FavouriteViewColumnName: "Business Use Only", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      { FavouriteViewColumnIndex: 12, FavouriteViewColumnName: "Track Inventory", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      { FavouriteViewColumnIndex: 13, FavouriteViewColumnName: "Shipping", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      { FavouriteViewColumnIndex: 14, FavouriteViewColumnName: "Barcode", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 15, FavouriteViewColumnName: "SKU", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 16, FavouriteViewColumnName: "Supplier", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 17, FavouriteViewColumnName: "Supplier Code", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 18, FavouriteViewColumnName: "Supplier Price", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 19, FavouriteViewColumnName: "Price", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 20, FavouriteViewColumnName: "Tax", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"pricing"},
      { FavouriteViewColumnIndex: 23, FavouriteViewColumnName: "Reorder Quantity", selected: false, isProductInfoColumn: false, isDefault: false, ColumnName:"inventory"},
      { FavouriteViewColumnIndex: 24, FavouriteViewColumnName: "Threshold Point", selected: false, isProductInfoColumn: false, isDefault: false, ColumnName:"inventory"},
      { FavouriteViewColumnIndex: 25, FavouriteViewColumnName: "Stock Value", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"inventory"},
      { FavouriteViewColumnIndex: 26, FavouriteViewColumnName: "Retail", selected: false, isProductInfoColumn: false, isDefault: false ,ColumnName:"inventory"},
      // End Dynamic Loop Handling

      { FavouriteViewColumnIndex: 7, FavouriteViewColumnName: "Variant Status", selected: true, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},
      { FavouriteViewColumnIndex: 28, FavouriteViewColumnName: "Product Status", selected: true, isProductInfoColumn: false, isDefault: false ,ColumnName:"branches"},


    ];

  public static readonly ProductDefaultViewColumnNameList: any[] = [
      { FavouriteViewColumnIndex: 1, FavouriteViewColumnName: "Product", selected: true, isDefault: true },
      { FavouriteViewColumnIndex: 2, FavouriteViewColumnName: "Classification", selected: true, isDefault: true },
      { FavouriteViewColumnIndex: 3, FavouriteViewColumnName: "Type", selected: true,isDefault: true },
      { FavouriteViewColumnIndex: 27, FavouriteViewColumnName: "Branch", selected: true, isDefault: true },
      { FavouriteViewColumnIndex: 4, FavouriteViewColumnName: "Category", selected: true, isDefault: false },
      { FavouriteViewColumnIndex: 5, FavouriteViewColumnName: "Brand", selected: true, isDefault: false },
      { FavouriteViewColumnIndex: 21, FavouriteViewColumnName: "Retail Price", selected: true, isDefault: false },
      { FavouriteViewColumnIndex: 22, FavouriteViewColumnName: "Current Stock", selected: true, isDefault: false },
      { FavouriteViewColumnIndex: 7, FavouriteViewColumnName: "Variant Status", selected: true, isDefault: false },
      { FavouriteViewColumnIndex: 28, FavouriteViewColumnName: "Product Status", selected: true, isDefault: false },
  ];

  public static readonly StockAdjustment: any[] = [
    { value: 1, text: "Add" },
    { value: 2, text: "Decrease" }
  ];


}


