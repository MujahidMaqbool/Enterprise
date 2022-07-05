export const AccountApi = {
  staffCompany: "EnterpriseStaffAuthentication/Company",
  staffAuthenticate: "EnterpriseStaff/Authenticate",
  staffLogin: "EnterpriseStaffAuthentication/Login",
  savePassword: "StaffAuthentication/SavePassword",
  validateToken: "StaffAuthentication/ValidateUrl",
  forgotPassword: "StaffAuthentication/Forgot",
  changePassword: "Staff/ChangePassword",
  StaffLogout: 'Staff/Logout',
};
export const CustomerApi = {
  getCustomerFundamentals: "EnterpriseCustomer/GetCustomerFundamentals",
  getAllCustomer: "EnterpriseCustomer/GetAllCustomer",
  getFavouriteView: "EnterpriseCustomer/GetFavouriteView",
  saveFavouriteView: "EnterpriseCustomer/SaveFavouriteView",
  resetFavouriteView: "EnterpriseCustomer/ResetFavouriteView",
  getMemberDetail: "EnterpriseMember/View/",
  getClientDetail: "EnterpriseClient/View/",
  getLeadDetail: "EnterpriseLead/View/",
  getMembershipListByBranch: "EnterpriseCustomer/GetMembershipListByBranch"
};
export const BranchStaffPermissionApi = {
  getBranchPermission: "EnterpriseBranch/ViewAll",
};
export const BranchApi = {
  BranchSearchList: 'EnterpriseBranch/Fundamental',
  BranchList: 'EnterpriseBranch/ViewAll',
  BranchDetail: 'EnterpriseBranch/Detail/{branchID}'
};


export const StaffApi = {
  staffFundamental: "EnterpriseStaff/ViewAll/Fundamental",
  getAll: "EnterpriseStaff/ViewAll",
  staffViewByID: "EnterpriseStaff/View/",
  detail: "Role/View/{roleID}",
  getStaffRole: "EnterpriseRole/ViewAll",
  StaffInfo: 'EnterpriseStaff/StaffProfile',
  enterPriseAssigneRole: "EnterpriseRole/EnterpriseAssignRole",
  enterPriseStaffRoleByID: "EnterpriseRole/View/",
  getEnterpriseStaffPermissions: "EnterpriseStaff/Permission",
  GetRoleListByBranch: "EnterpriseStaff/GetRoleListByBranch"
}

export const RoleApi = {
  getFundamentals: "EnterpriseRole/Detail/Fundamental",
  getAll: "EnterpriseRole/ViewAll",
  getByID: "EnterpriseRole/Detail/{roleID}",
  add: "EnterpriseRole/Save",
  update: "EnterpriseRole/Save",
  delete: "EnterpriseRole/Delete",
  detail: "EnterpriseRole/View/{roleID}",
  assignRole: "EnterpriseRole/EnterpriseAssignRole"
};

export const RewardProgramApi = {
  getRewardProgramExceptions: "EnterpriseRewardProgram/GetAllItemTypeExceptions/",
  getRewardProgramExceptionForms: "EnterpriseRewardProgram/GetAllFormExceptions",
  saveRewardProgram: "EnterpriseRewardProgram/SaveRewardProgram",
  searchRewardProgram: "EnterpriseRewardProgram/ViewAll",
  getRewardProgramByID: "EnterpriseRewardProgram/GetRewardProgram/",
  deleteRewardProgram: "EnterpriseRewardProgram/Delete",
  viewRewardProgram: "EnterpriseRewardProgram/View/",
  revertRewardProgram: "EnterpriseRewardProgram/RevertTerminationRewardProgram",
  defaultRewardProgram: "EnterpriseRewardProgram/UpdateDefaultRewardProgram",
  getAllExceptionList: "EnterpriseRewardProgram/GetAllItemTypeExceptions/",
  getRewardProgramDescription: "RewardProgram/GetRewardProgramDefaultTemplateByBranchID/"
}

export const SupplierApi = {
  getSupplierFundamentals: "EnterpriseSupplier/Fundamental",
  saveSupplier: "EnterpriseSupplier/Save",
  getfundamentals: "EnterpriseSupplier/SaveFundamental",
  getSuppliers: "EnterpriseSupplier/ViewAll",
  getSupplierByID: "EnterpriseSupplier/View/",
  deleteSupplier: "EnterpriseSupplier/Delete/",
}

export const ProductsApi = {


}
export const ProductCategoryApi = {
  getFundamental: "EnterpriseProductCategory/Fundamentals",
  getSearchFundamental: "EnterpriseProductCategory/SearchFundamentals",
  saveCategory: "EnterpriseProductCategory/Save",
  GetAll: "EnterpriseProductCategory/ViewAll",
  delete: "EnterpriseProductCategory/Delete/",
  viewByID: "EnterpriseProductCategory/View/",
  getDetailByID: "EnterpriseProductCategory/Detail/",
  deleteImage: "EnterpriseImage/Delete",
}

export const ProductApi = {
  getFundamental: "EnterpriseProductAttribute/Fundamental",
  getGeneratedFundamental: "EnterpriseProductAttribute/Fundamental/",
  getAttributeValue: "EnterpriseProductAttribute/GetAttributeValues/",
  generateVariant: "EnterpriseProductAttribute/GenerateVariant",
  deleteProductVariant: "EnterpriseProductAttribute/DeleteProductVariant/",
  productVariantBranchUpdate: "EnterpriseProductAttribute/ProductVariantBranchUpdate",
  productVariantDetail: "EnterpriseProductAttribute/ProductVariantDetail",
  deleteProduct:"EnterpriseProduct/DeleteProduct/",
  getArchivedProductVariant:"EnterpriseProductAttribute/GetArchivedProductVariant/",
  restoreArchivedProductVariant: "EnterpriseProductAttribute/RestoreProductVariant/",

  //// inventory

  getInventoryDetail: "EnterpriseProduct/GetCurrentStockForInventory/",
  //////////////////////////////////////
  getSaveFundamentals: "EnterpriseProduct/SaveFundamentals",
  saveProduct: "EnterpriseProduct/SaveProduct",
  /////////////////////////////////////////
  getProductFundamentals: "EnterpriseProduct/Fundamentals",
  productSearch : "EnterpriseProduct/Search",
  getDetail : "EnterpriseProduct/Detail/",
  getProductPricingDetails: "EnterpriseProduct/Detail/Pricing",
  getProductInventoryDetails :"EnterpriseProduct/Detail/Inventory",
  bulkUpdate :"EnterpriseProduct/SaveInventory",
  getProductInventoryDetail: "EnterpriseProduct/GetInventoryDetail",
  GetByID: "EnterpriseProduct/GetByID/",
  getProductPricingDetail: "EnterpriseProduct/GetPricingDetail",
  updatePricingAndPackaging: "EnterpriseProduct/UpdatePricingAndPackaging",
  getProductPackagingDetail: "EnterpriseProduct/GetProductPackagingDetail/",
  validateBarcodeAndSKU:"EnterpriseProduct/ValidateBarcodeAndSKU",

}

export const AttributeApi = {
  getFundamental: "EnterpriseAttribute/Fundamental",
  getAttributes: "EnterpriseAttribute/ViewAll",
  getAttributeByID: "EnterpriseAttribute/View/",
  saveAttribute: "EnterpriseAttribute/Save",
  deleteAttribute: "EnterpriseAttribute/Delete/",
  getAttributeDetailByID: "EnterpriseAttribute/Get/"
}

export const BrandApi = {
  getBrandSearchFundamentals: "EnterpriseBrand/SearchFundamentals",
  saveBrand: "EnterpriseBrand/Save",
  getBrands: "EnterpriseBrand/ViewAll",
  viewBrandByID: "EnterpriseBrand/View/",
  getBrandByID: "EnterpriseBrand/Detail/",
  deleteBrand: "EnterpriseBrand/Delete/",
}

export const TaxApi = {
  getFundamental: "EnterpriseTax/Fundamentals",
  getSearchFundamental: "EnterpriseTax/SearchFundamentals",
  saveTax: "EnterpriseTax/Save",
  GetAll: "EnterpriseTax/ViewAll",
  delete: "EnterpriseTax/Delete/",
  getDetailByID: "EnterpriseTax/Detail/",
}

export const PurchaseOrderApi = {
  getFundamentals: "EnterprisePurchaseOrder/Fundamental",
  getPurchaseOrdersList: "EnterprisePurchaseOrder/GetPurchaseOrderList",
  getProductVariants:"EnterprisePurchaseOrder/GetProductVariants",
  savePurchaseOrder:"EnterprisePurchaseOrder/Save",
  getPurchaseOrderDetailByID:"EnterprisePurchaseOrder/Detail?PurchaseOrderID=",
  getGRNDetailByID:"EnterprisePurchaseOrder/DetailGRN?grnID=", 
  getPurchaseOrderByID:"EnterprisePurchaseOrder/GetPurchaseOrderByID?PurchaseOrderID=",
  cancelPurchaseOrder:"EnterprisePurchaseOrder/Cancel?PurchaseOrderID=",
  deletePurchaseOrder:"EnterprisePurchaseOrder/Delete?PurchaseOrderID=",
  deletePurchaseOrderDetailID:"EnterprisePurchaseOrder/Delete/PurchaseOrderDetailID?PurchaseOrderDetailID=",
  GetRecivePurchaseOrder:"EnterprisePurchaseOrder/GetRecivePurchaseOrder?PurchaseOrderID=",
  MarkAsReceive:"EnterprisePurchaseOrder/MarkAsReceive/",
  SaveRecivePurchaseOrder:"EnterprisePurchaseOrder/SaveRecivePurchaseOrder",
  getPurchaseOrderReport: "EnterpriseInventoryReport/GetPurchaseOrder?purchaseOrderID={0}&branchID={1}&isGrn=",
  sendEmail:"EnterprisePurchaseOrder/Email"
  
}

