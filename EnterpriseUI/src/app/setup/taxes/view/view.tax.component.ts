/*********************** Angular References *************************/
import { Component, Inject, OnInit } from '@angular/core';

/*********************** Material References *************************/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/*************************** Services & Models ***********************/

/********************** START: Common *********************/
import { Messages } from '@helper/config/app.messages';
import { EnumSaleSourceType } from '@app/helper/config/app.enums';

@Component({
    selector: 'view-tax-detail',
    templateUrl: './view.tax.component.html'
})

export class ViewTaxComponent implements OnInit {

    /* Local Variables */
    isDataExists: boolean = false;
    hasBranchSourceType: boolean = false;

    /* Message */
    messages = Messages;

    /* Model Refences */
    enum_AppSourceType = EnumSaleSourceType;
 
    constructor(
        private dialogRef: MatDialogRef<ViewTaxComponent>,
        @Inject(MAT_DIALOG_DATA) public tax: any
    ) { }

    ngOnInit() {
      this.isDataExists = this.tax.BranchList && this.tax.BranchList.length > 0  ? true : false;
      this.tax.BranchList = this.tax.BranchList.filter(branch =>branch.IsIncluded);
    }

    // #region Event(s)

    onCloseDialog() {
        this.dialogRef.close();
    }

    // #endregion

}
