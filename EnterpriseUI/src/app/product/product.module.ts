import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogService } from 'src/app/services/mat.dialog.service';
import { ProductRoutingModule } from './product-routing.module';
import { RouterModule } from '@angular/router';
import { NavigationProductComponent } from './navigation/product.navigation.component';
import { SearchCategoriesComponent } from './categories/search.categories.component';
// import { SaveCategoryComponent } from './categories/save/save.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchSuppliersComponent } from './suppliers/search/search.suppliers.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SaveSupplierComponent } from './suppliers/save/save.supplier.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { SharedPaginationModule } from 'src/app/shared-pagination-module/shared-pagination-module';
import { SortablejsModule } from 'ngx-sortablejs';

import { AttributesSearchComponent } from './attributes/search.attributes.component';
import { ViewAttributeComponent } from './attributes/view/view.component';
import { SaveAttributeComponent } from './attributes/save/save.attribute.component';
import { ViewSupplierComponent } from './suppliers/view/view.supplier.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SearchProductsComponent } from './products/search/search.products.component';
import { SaveProductComponent } from './products/save/save.products.component';
import { ViewProductComponent } from './products/view/view.products.component';
// import { DateToDateFromComponent } from 'src/app/shared-components/app-datePicker/dateto.datefrom.component';
import { SharedModule } from 'src/app/shared-components/shared-module';
import { ProductVariantComponent } from './product-variant/product.variant.component';
import { EditInventoryComponent } from './edit-inventory/edit.inventory.component';
import { BulkUpdateComponent } from './edit-inventory/bulk-update/bulk.update.component';
import { SearchBrandsComponent } from './brands/search/search.brands.component';
import { ViewBrandComponent } from './brands/view/view.brand.component';
import { SaveBrandComponent } from './brands/save/save.brand.component';
import { RestoreVariantComponent } from './product-variant/restore-variant/restore.variant.component';
// import { PurchaseOrderComponent } from './purchase-order/search.purchase.order.component';
import { ReceiveOrderComponent } from './purchase-order/receive-order/receive.order.component';
import { EmailOrderComponent } from './purchase-order/email-order/email.order.component';
import { ProductPriceComponent } from './products/product-price/product.price.component';
import { SavePackagingComponent } from './products/product-price/save/packaging/packaging.component';
import { BulkUpdatePriceComponent } from './products/product-price/save/bulk.update.price.component';
import { SaveCategoryComponent } from './categories/save/save.category.component';

import { ApplicationPipesModule } from 'src/app/application-pipes/application.pipes.module';
import { SavePurchaseOrderComponent } from './purchase-order/save/save.prchase.order.component';
import { ApplicationDialogSharedModule } from 'src/app/application-dialog-module/application-dialog-module';
import { SavePurchaseItemsComponent } from './purchase-order/save/add-product/save.add.po.product.component';
import { ViewCategoryComponent } from './categories/view/view.category.component';
import { SaveProductPriceComponent } from './products/product-price/save/save.product.price.component';
import { ViewPurchaseOrderComponent } from './purchase-order/view/view.purchase.order.component';
import { SearchPurchaseOrderComponent } from './purchase-order/search/search.purchase.order.component';



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    RouterModule,
    InternationalPhoneNumberModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatStepperModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    SharedPaginationModule,
    DragDropModule,
    SharedModule,
    MatSlideToggleModule,
    ApplicationPipesModule,
    ApplicationDialogSharedModule,
    SortablejsModule.forRoot({ animation: 150 })


  ],
  declarations: [
    NavigationProductComponent,
    SearchCategoriesComponent,
    ViewCategoryComponent,
    SaveCategoryComponent,
    SearchSuppliersComponent,
    SaveSupplierComponent,
    AttributesSearchComponent,
    ViewAttributeComponent,
    SaveSupplierComponent,
    SaveAttributeComponent,
    ViewSupplierComponent,
    SearchBrandsComponent,
    ViewBrandComponent,
    SaveBrandComponent,
    SearchProductsComponent,
    SaveProductComponent,
    ViewProductComponent,
    //DateToDateFromComponent,
    ProductVariantComponent,
    EditInventoryComponent,
    BulkUpdateComponent,
    ProductVariantComponent,
    RestoreVariantComponent,
    SearchPurchaseOrderComponent,
    ViewPurchaseOrderComponent,
    ReceiveOrderComponent,
    EmailOrderComponent,
    ProductPriceComponent,
    SaveProductPriceComponent,
    SavePackagingComponent,
    BulkUpdatePriceComponent,
    SavePurchaseOrderComponent,
    SavePurchaseOrderComponent,
    SavePurchaseItemsComponent
  ],
  entryComponents: [
    ViewCategoryComponent,
    ViewAttributeComponent,
    ViewSupplierComponent,
    ViewBrandComponent,
    SaveBrandComponent,
    ProductVariantComponent,
    EditInventoryComponent,
    BulkUpdatePriceComponent,
    SaveProductComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    MatDialogService
  ]
})
export class ProductModule { }
