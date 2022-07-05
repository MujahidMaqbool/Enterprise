export enum ENU_Permission_Module {
    Setup = 12,
    Branches = 13,
    Customer = 14,
    Staff = 15,
    Product = 16
}

export enum ENU_Permission_Setup {
    Role_View = 1201,
    Role_Save = 1202,
    RewardProgram_View = 1203,
    RewardProgram_Save = 1204,
    RewardProgram_Delete = 1205,
    Tax_View = 1206,
    Tax_Save = 1207,
    Tax_Delete = 1208
}

export enum ENU_Permission_Branch {
    Branch_View = 1301,
    Branch_Save = 1302,
}

export enum ENU_Permission_Staff {
    Staff_View = 1501,
    Staff_Save = 1502
}

export enum ENU_Permission_Customer {
    Customer_View = 1401,
    Customer_Save = 1402,
}

export enum ENU_Permission_Product {
    Category_View = 1601,
    Category_Save = 1602,
    Category_Delete = 1603,

    Brand_View = 1604,
    Brand_Save = 1605,
    Brand_Delete = 1606,

    Product_View = 1607,
    Product_Save = 1608,
    Product_Delete = 1609,

    Inventory_View = 1610,
    Inventory_Save = 1611,

    Pricing_View = 1612,

    Pricing_Save = 1613,

    Supplier_View = 1614,
    Supplier_Save = 1615,
    Supplier_Delete = 1616,

    Carrier_View = 1617,
    Carrier_Save = 1618,
    Carrier_Delete = 1629,

    PO_View = 1620,
    PO_Save = 1621,
    PO_Delete = 1626,
    PO_EmailToSupplier = 1627,

    Attribute_View = 1622,
    Attribute_Save = 1623,
    Attribute_Delete = 1624,

    Save_Package = 1625,
    // Tax_Save = 1626,
    // Tax_Delete = 1627,
}


