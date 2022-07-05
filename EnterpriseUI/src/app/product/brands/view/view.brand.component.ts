/*********************** Angular References *************************/
import { Component, Inject, OnInit } from '@angular/core';

/*********************** Material References *************************/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/*************************** Services & Models ***********************/

/********************** START: Common *********************/
import { Messages } from '@helper/config/app.messages';
import { EnumSaleSourceType } from '@app/helper/config/app.enums';

@Component({
    selector: 'view-brand-detail',
    templateUrl: './view.brand.component.html'
})

export class ViewBrandComponent implements OnInit {

    /* Local Variables */
    isDataExists: boolean = false;
    hasBranchSourceType: boolean = false;

    /* Message */
    messages = Messages;

    /* Model Refences */
    enum_AppSourceType = EnumSaleSourceType;

    constructor(
        private dialogRef: MatDialogRef<ViewBrandComponent>,
        @Inject(MAT_DIALOG_DATA) public brandViewDetail: any
    ) { }

    ngOnInit() {
      this.isDataExists = this.brandViewDetail.BranchList && this.brandViewDetail.BranchList.length > 0  ? true : false;
      this.hasBranchSourceType = this.brandViewDetail.AppSourceTypeID == this.enum_AppSourceType.EnterPrise? true: false;
    }

    // #region Event(s)

    onCloseDialog() {
        this.dialogRef.close();
    }

    // #endregion

}
