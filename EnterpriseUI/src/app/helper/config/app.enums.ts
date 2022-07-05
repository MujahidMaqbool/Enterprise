
export enum ENU_LoginState {
    StaffLogin = 1,
    ChooseAccount = 2,
    WelcomeStaff = 3
}

export enum ENU_FormType {
    Signup = 1,
    CustomerPurchase = 2,
    RequestForm = 3,
}

export enum RewardProgramActivityType{
    CustomerBirthday = 1,
    RewardProgramOptIn = 2,
    WidgetAndAppBookings = 3,
    Referrals = 4,
    NewCustomer = 5,
    MemberCheckIn = 6,
    ClassPresent = 7,
    ServiceCompleted = 8,
    Forms = 9,
}
export enum ENU_DatePickerFormat {
    Default = "DD/MM/yyyy",
    UK = "DD/MM/yyyy",
    US = "MM/DD/yyyy",
    CH = "yyyy/MM/DD",
}
export enum RewardProgramPurchasesType{
    Class = 7 ,
    Service = 8,
    Product = 3,
    Membership = 4,
    Forms = 9,
}
export enum EnumSaleSourceType {
    OnSite = 1,
    Shop = 2,
    App = 3,
    WellyxShop = 4,
    EnterPrise = 7
}

export enum ENU_Reward_Action_Progress{
    Delete = 1,
    Revert = 2,
    Terminated = 3,
}

export enum ENU_Package {
    WellnessBasic = 1,
    WellnessMedium = 2,
    WellnessTop = 3,
    FitnessBasic = 4,
    FitnessMedium = 5,
    Full = 6
}
export enum Customer_SearchFundamental_DropDowns {
  Branch = 1,
  CustomerType = 2,
  MembershipStatus = 3,
  Membership = 4,
  EnquiredMembership = 5,
  EnquiryStatus = 6,
  EnquirySource = 7
}

export enum Product_SearchFundamental_DropDowns {
  ProductCategory = 1,
  ProductBrand = 2,
  ProductSupplier = 3,
  ProductBranches = 4,
}

export enum ENU_StaffSearchDropDown {
    staffPosition = 1,
    StaffRole = 2,
    StaffBranch = 3
}

export enum ENU_MobileOperatingSystem {
    WindowsPhone = 1,
    Android = 2,
    iOS = 3,
    unknown = 4,
    DesktopSafari = 5
}

export enum ENU_DateFormatName {
    DateFormat = "DateFormat",
    LongDateFormat = "LongDateFormat",
    SchedulerTooltipDateFormat = "SchedulerTooltipDateFormat",
    ExceptionDateFormat = "ExceptionDateFormat",
    SchedulerDateFormatDayView = "SchedulerDateFormatDayView",
    SchedulerDateFormatWeekViewTo = "SchedulerDateFormatWeekViewTo",
    SchedulerRRuleUntilDateFormat = "SchedulerRRuleUntilDateFormat",
    DateFormatForSave = "DateFormatForSave",
    DateTimeFormat = "DateTimeFormat",
    NotficationDateTimeFormat = "NotficationDateTimeFormat",
    ReceiptDateFormat = "ReceiptDateFormat",
    RecurrenceExceptionDateFormat = "RecurrenceExceptionDateFormat",
    DashboardDateFormat = "DashboardDateFormat",
    SchedulerStaffShiftToolTipDateFormat = "SchedulerStaffShiftToolTipDateFormat",
    DateFormatforBooked = 'DateFormatforBooked',
    Attendnaceformat = 'Attendnaceformat',
    DashBoardLastVisitDateFormat = 'DashBoardLastVisitDateFormat',
    ClockTimeDateFormat = 'ClockTimeDateFormat',
    ShiftForeCastDateFormat = 'ShiftForeCastDateFormat',
    DateFormatforReturingClient = 'DateFormatforReturingClient',
}

export enum ENU_CountryBaseDateFormatName {
    //format for day, month and year
    UKDateFormat = "UKDateFormat",
    UKSchedulerTooltipDateFormat = "UKSchedulerTooltipDateFormat",
    UKExceptionDateFormat = "UKExceptionDateFormat",
    UKSchedulerDateFormatDayView = "UKSchedulerDateFormatDayView",
    UKSchedulerDateFormatWeekViewTo = "UKSchedulerDateFormatWeekViewTo",
    UKSchedulerRRuleUntilDateFormat = "UKSchedulerRRuleUntilDateFormat",
    UKDateFormatForSave = "UKDateFormatForSave",
    UKDateTimeFormat = "UKDateTimeFormat",
    UKNotficationDateTimeFormat = "UKNotficationDateTimeFormat",
    UKReceiptDateFormat = "UKReceiptDateFormat",
    UKRecurrenceExceptionDateFormat = "UKRecurrenceExceptionDateFormat",
    UKDashboardDateFormat = "UKDashboardDateFormat",
    UKSchedulerStaffShiftToolTipDateFormat = "UKSchedulerStaffShiftToolTipDateFormat",
    UKDateFormatforBooked = 'UKDateFormatforBooked',
    UKAttendnaceformat = 'UKAttendnaceformat',
    UKDashBoardLastVisitDateFormat = 'UKDashBoardLastVisitDateFormat',
    UKClockTimeDateFormat = 'UKClockTimeDateFormat',
    UKShiftForeCastDateFormat = 'UKShiftForeCastDateFormat',
    UKDateFormatforReturingClient = 'UKDateFormatforReturingClient',

    //format for month, day and year
    USDateFormat = "USDateFormat",
    USSchedulerTooltipDateFormat = "USSchedulerTooltipDateFormat",
    USExceptionDateFormat = "USExceptionDateFormat",
    USSchedulerDateFormatDayView = "USSchedulerDateFormatDayView",
    USSchedulerDateFormatWeekViewTo = "USSchedulerDateFormatWeekViewTo",
    USSchedulerRRuleUntilDateFormat = "USSchedulerRRuleUntilDateFormat",
    USDateFormatForSave = "USDateFormatForSave",
    USDateTimeFormat = "USDateTimeFormat",
    USNotficationDateTimeFormat = "USNotficationDateTimeFormat",
    USReceiptDateFormat = "USReceiptDateFormat",
    USRecurrenceExceptionDateFormat = "USRecurrenceExceptionDateFormat",
    USDashboardDateFormat = "USDashboardDateFormat",
    USSchedulerStaffShiftToolTipDateFormat = "USSchedulerStaffShiftToolTipDateFormat",
    USDateFormatforBooked = 'USDateFormatforBooked',
    USAttendnaceformat = 'USAttendnaceformat',
    USDashBoardLastVisitDateFormat = 'USDashBoardLastVisitDateFormat',
    USClockTimeDateFormat = 'USClockTimeDateFormat',
    USShiftForeCastDateFormat = 'USShiftForeCastDateFormat',
    USDateFormatforReturingClient = 'USDateFormatforReturingClient',

    //format for year, day and month
    CHDateFormat = "CHDateFormat",
    CHSchedulerTooltipDateFormat = "CHSchedulerTooltipDateFormat",
    CHExceptionDateFormat = "CHExceptionDateFormat",
    CHSchedulerDateFormatDayView = "CHSchedulerDateFormatDayView",
    CHSchedulerDateFormatWeekViewTo = "CHSchedulerDateFormatWeekViewTo",
    CHSchedulerRRuleUntilDateFormat = "CHSchedulerRRuleUntilDateFormat",
    CHDateFormatForSave = "CHDateFormatForSave",
    CHDateTimeFormat = "CHDateTimeFormat",
    CHNotficationDateTimeFormat = "CHNotficationDateTimeFormat",
    CHReceiptDateFormat = "CHReceiptDateFormat",
    CHRecurrenceExceptionDateFormat = "CHRecurrenceExceptionDateFormat",
    CHDashboardDateFormat = "CHDashboardDateFormat",
    CHSchedulerStaffShiftToolTipDateFormat = "CHSchedulerStaffShiftToolTipDateFormat",
    CHDateFormatforBooked = 'CHDateFormatforBooked',
    CHAttendnaceformat = 'CHAttendnaceformat',
    CHDashBoardLastVisitDateFormat = 'CHDashBoardLastVisitDateFormat',
    CHClockTimeDateFormat = 'CHClockTimeDateFormat',
    CHShiftForeCastDateFormat = 'CHShiftForeCastDateFormat',
    CHDateFormatforReturingClient = 'CHDateFormatforReturingClient',

    //format for long date
    UKLongDateFormat = "UKLongDateFormat",
    USLongDateFormat = "USLongDateFormat",
    CHLongDateFormat = "CHLongDateFormat",
}
export enum CustomerType {
  Client = 1,
  Lead = 2,
  Member = 3,
}

export enum ENU_DateFormat {
    UKDateFormat = "d MMM, yyyy", // for day first
    USDateFormat = "MMM d, yyyy", // for month first
    CHDateFormat = "yyyy MMM d", // for year first
    UKLongDateFormat = "EEE, d MMM, yyyy",
    USLongDateFormat = "EEE, MMM d, yyyy",
    CHLongDateFormat = "EEE, yyyy MMM d",
    UKSchedulerTooltipDateFormat = "dd/MM/yy",
    USSchedulerTooltipDateFormat = "MM/dd/yy",
    CHSchedulerTooltipDateFormat = "yy/MM/dd",
    UKExceptionDateFormat = "dd-MM-y",
    USExceptionDateFormat = "MM-dd-y",
    CHExceptionDateFormat = "y-MM-dd",
    UKSchedulerDateFormatDayView = "EEEE, d MMMM y",
    USSchedulerDateFormatDayView = "EEEE, MMMM d y",
    CHSchedulerDateFormatDayView = "EEEE, y MMMM d",
    UKSchedulerDateFormatWeekViewTo = "EEEE d MMMM y",
    USSchedulerDateFormatWeekViewTo = "EEEE MMMM d y",
    CHSchedulerDateFormatWeekViewTo = "EEEE y MMMM d",
    UKSchedulerRRuleUntilDateFormat = "dd/MM/yyyy",
    USSchedulerRRuleUntilDateFormat = "MM/dd/yyyy",
    CHSchedulerRRuleUntilDateFormat = "yyyy/MM/dd",
    UKDateFormatForSave = "d MMMM, y",
    USDateFormatForSave = "MMMM d, y",
    CHDateFormatForSave = "y MMMM d",
    UKDateTimeFormat = "EEEE, d MMMM, y HH:mm",
    USDateTimeFormat = "EEEE, MMMM d, y HH:mm",
    CHDateTimeFormat = "EEEE, y MMMM d HH:mm",
    UKNotficationDateTimeFormat = "dd/MM/yyyy  HH:mm",
    USNotficationDateTimeFormat = "MM/dd/yyyy  HH:mm",
    CHNotficationDateTimeFormat = "yyyy/MM/dd  HH:mm",
    UKReceiptDateFormat = "dd/MM/yy",
    USReceiptDateFormat = "MM/dd/yy",
    CHReceiptDateFormat = "yy/MM/dd",
    UKRecurrenceExceptionDateFormat = "yyyyMMdd",
    USRecurrenceExceptionDateFormat = "yyyyMMdd",
    CHRecurrenceExceptionDateFormat = "yyyyMMdd",
    UKDashboardDateFormat = "yyyy-MM-dd",
    USDashboardDateFormat = "yyyy-dd-MM",
    CHDashboardDateFormat = "yyyy-dd-MM",
    UKSchedulerStaffShiftToolTipDateFormat = "d MMM",
    USSchedulerStaffShiftToolTipDateFormat = "MMM d",
    CHSchedulerStaffShiftToolTipDateFormat = "MMM d",
    UKDateFormatforBooked = 'EEE d MMM y',
    USDateFormatforBooked = 'EEE MMM d y',
    CHDateFormatforBooked = 'EEE y MMM d',
    UKAttendnaceformat = 'YYYY-MM-DD HH:mm',
    USAttendnaceformat = 'YYYY-DD-MM HH:mm',
    CHAttendnaceformat = 'YYYY-MM-DD HH:mm',
    UKDashBoardLastVisitDateFormat = 'dd/MM/yyyy HH:mm',
    USDashBoardLastVisitDateFormat = 'MM/dd/yyyy HH:mm',
    CHDashBoardLastVisitDateFormat = 'yyyy/MM/dd HH:mm',
    UKClockTimeDateFormat = 'EEEE dd MMMM',
    USClockTimeDateFormat = 'EEEE MMMM dd',
    CHClockTimeDateFormat = 'EEEE MMMM dd',
    UKShiftForeCastDateFormat = 'dd-MMMM',
    USShiftForeCastDateFormat = 'MMMM-dd',
    CHShiftForeCastDateFormat = 'MMMM-dd',
    UKDateFormatforReturingClient = 'd MMM y',
    USDateFormatforReturingClient = 'MMM d y',
    CHDateFormatforReturingClient = 'y MMM d',

}
export enum ENU_FavouriteViewColumnName {
  Name = 1,
  Branch = 2,
  Type = 3,
  Email = 4,
  Mobile = 5,
  DateCreated =6,
  MembershipName = 7,
  MembershipStatus = 8,
  MembershipStartDate = 9,
  MembershipEndDate = 10,
  EnquiryStatus = 11,
  EnquiredMembership = 12
}

export enum FavouriteViewColumnNameString {
    Name = "Name",
    Branch = "Branch",
    Type = "Type",
    Email = "Email",
    Mobile = "Mobile",
    DateCreated = "Date Created",
    MembershipName = "Membership Name",
    MembershipStatus = "Membership Status",
    MembershipStartDate = "Membership Start Date",
    MembershipEndDate = "Membership End Date",
    EnquiredMembership = "Enquired Membership",
    EnquiryStatus = "Enquiry Status",
}

export enum ProductFavouriteViewColumnNameString {
    Product = "Product",
    Classification = "Classification",
    Type = "Type",
    Category = "Category",
    Brand = "Brand",
    Branch = "Branch",

    PurchaseRestriction = "Purchase Restriction",
    VariantStatus = "Variant Status",
    ProductStatus = "Product Status",

    ShowOnline = "Show Online",
    HidePriceOnline = "Hide Price Online",
    Featured = "Is Featured",
    // BusinessUseOnly = "Business Use Only",
    TrackInventory = "Track Inventory",
    Shipping = "Shipping",
    BarCode = 'Barcode',
    SKU = "SKU",
    Supplier = "Supplier",
    SupplerCode = "Supplier Code",
    SupplierPrice = "Supplier Price",
    Price = "Price",
    Tax = "Tax",
    RetailPrice = "Retail Price",
    CurrentStock = "Current Stock",
    ReorderQuantity =  "Reorder Quantity",
    ThresholdPointColumn = "Threshold Point",
    StockValue = "Stock Value",
    RetailValue = "Retail"
}

export enum ProductClassification {
  Standard = 1,
  Variant = 2
}

export enum PricingCheckBoxValues {
    BarCode = 'Barcode',
    SKU = "SKU",
    Supplier = "Supplier",
    SupplerCode = "SupplierCode",
    SupplierPrice = "SupplierPrice",
    Price = "Price",
    Tax = "Tax",
    ReOrderThreshold = "ReorderThreshold",
    ReOrderQty = "ReorderQuantity",
}

export enum WeekDays {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}
export enum ENU_CoreUrlType{
    Branch = 1,
    Setup = 2,
    Staff = 3,
    Customer = 4,
    Product = 5,
    Setup_Tax =6,
};
export enum customerEnrollmentTypeID{
    Customer_Opt_In = 2 ,
    Automatic_Enrollment = 1,
    Manual_Enrollment  = 3,
};
export enum customerEnrollmentTypeName{
    Customer_Opt_In = 'Customer Opt In',
    Automatic_Enrollment = 'Automatic Enrollment',
    Manual_Enrollment  = 'Manual Enrollment',
};
export enum WizardforRewardProgram {
    RewardProgram = 0,
    RewardpProgramBranches = 1,
    RewardPurchases = 2,
    RewardActvities = 3,
};
export enum EarnedRuleItemType{
    BenefittedEarnedPoints = 1,
    LeadEarnedPoints = 2,
    ClientEarnedPoints = 3,
    MemberEarnedPoints = 4,
    AmountSpent = 5,
}
export enum WizardforProductCategory{
    CategoryInformation = 0,
    Branches = 1,
}
export enum WizardforSupplier {
    SupplierInformation = 0,
    SupplierBranch = 1,

  }
export enum WizardforProductAttribute{
    AttributeInformation = 0,
    Branches = 1,
}

export enum MeasurementUnitType{
    Weight = 1,
    Dimension = 2,
    SizeOrVolume = 3
}
export enum WizardforSaveBrand{
  BrandInformation = 0,
  Branches = 1,
}
export enum SupplierValidation{
  SupplierName = 1,
  Email = 2,
  Mobile = 3,
  Phone = 4
}
export enum ProductModulePagesEnum{
    Supplier = 1,
    Attribute = 2,
    Brand = 3,
    Products = 4,
    Category = 5,
    PurchaseOrder = 6
}

export enum ProductAreaEnum{
    SaveProduct = 1,
    EditPricing = 2
}

export enum WizardforProduct {
    ProductInformation = 0,
    BranchesAndPermissions = 1,
    Pricing = 3
}

export enum EnumPurchaseOrderStatus {
    Ordered = 1,
    Received= 2,
    PartiallyReceived= 3,
    Cancelled = 4
}

export enum EnumPurchaseOrderStatusName {
    Ordered = "Ordered",
    Received= "Received",
    PartiallyReceived = "Partially Received",
    Cancelled = "Cancelled"
}
export enum ProductViewTabs {
  ProductInformation = 0,
  PricingDetails = 1,
  InventoryDetails = 2
}

export enum FileType {
    PDF = 1,
    Excel = 2,
    CSV = 3,
    View = 4
}
