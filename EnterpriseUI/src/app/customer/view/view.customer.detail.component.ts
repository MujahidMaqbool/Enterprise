/*********************** Angular References *************************/
import { Component, Inject, OnInit } from '@angular/core';

/*********************** Material References *************************/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/*************************** Services & Models ***********************/
/*Models*/

/********************** START: Common *********************/
import { Messages } from '@helper/config/app.messages';
import { SubscriptionLike as ISubscription, SubscriptionLike } from 'rxjs';
import { CustomerType } from '@app/helper/config/app.enums';

@Component({
    selector: 'view-customer-detail',
    templateUrl: './view.customer.detail.component.html'
})

export class ViewCustomerDetail implements OnInit {

    /* Local Variables */
    isPartialPaymentAllow: boolean = false;
    gendername: string = "";
    titlename: string = "";
    isDataExists: boolean = false;
    totalRecords: number = 0;
    imagePath: string = "./assets/images/user.jpg";
    dateFormat: string = "";
    packageIdSubscription: SubscriptionLike;
    countryList: any[];
    CustomerType = CustomerType;

    /* Message */
    messages = Messages;
    /* Model Refences */

    /* Configurations */
    serverImageAddress: string
    allowedReferredBy: boolean;
    isSmsAllowed: boolean = true;
    isEmailAllowed: boolean = true;
    isPushNotificationAllowed: boolean = true;

    defaultCountry: string;
    constructor(
        private dialogRef: MatDialogRef<ViewCustomerDetail>,
        @Inject(MAT_DIALOG_DATA) public customerDetail: any
    ) { }

    ngOnInit() {
       this.isDataExists = this.customerDetail.EnterpriseCustomerListDetailVM && this.customerDetail.EnterpriseCustomerListDetailVM.length > 0  ? true : false;
    }

    // #region Event(s)

    onCloseDialog() {
        this.dialogRef.close();
    }

    // #endregion

}