/*********************** Angular References *************************/
import { Component, Inject, OnInit } from '@angular/core';

/*********************** Material References *************************/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumSaleSourceType } from '@app/helper/config/app.enums';

/*************************** Services & Models ***********************/

/********************** START: Common *********************/
import { Messages } from '@helper/config/app.messages';

@Component({
    selector: 'view-supplier-detail',
    templateUrl: './view.supplier.component.html'
})

export class ViewSupplierComponent implements OnInit {

    /* Local Variables */
    isDataExists: boolean = false;
    appSourceTypeID = EnumSaleSourceType ;

    /* Message */
    messages = Messages;
    /* Model Refences */

    constructor(
        private dialogRef: MatDialogRef<ViewSupplierComponent>,
        @Inject(MAT_DIALOG_DATA) public supplierViewDetail: any
    ) { }

    ngOnInit() {
       this.isDataExists = this.supplierViewDetail.SupplierBranchVM && this.supplierViewDetail.SupplierBranchVM.length > 0  ? true : false;
    }

    // #region Event(s)

    onCloseDialog() {
        this.dialogRef.close();
    }

    // #endregion

}
