import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumPurchaseOrderStatus } from '@app/helper/config/app.enums';
import { Messages } from '@app/helper/config/app.messages';
import { PurchaseOrderApi } from '@app/helper/config/app.webapi';
import { ApiResponse, DD_Branch } from '@app/models/common.model';
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { DataSharingService } from '@app/services/data.sharing.service';
import { SubscriptionLike } from 'rxjs';
import { PurchaseOrderViewModel } from '../models/purchaseOrder.model';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view.purchase.order.component.html'
})
export class ViewPurchaseOrderComponent implements OnInit {

  /***Region local members */
  messages = Messages;
  isDataExists: boolean = false;
  isDataExistsGRN: boolean = false;
  currencyFormat: string;
  grnTotal: number = 0;
  grnTotalReceivedQuantity: number = 0;
  enumPOStatus = EnumPurchaseOrderStatus;

  purchaseOrderViewModel: PurchaseOrderViewModel = new PurchaseOrderViewModel();
  currentBranchSubscription: SubscriptionLike;




  constructor(
    private _dialog: MatDialogRef<ViewPurchaseOrderComponent>,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,

    @Inject(MAT_DIALOG_DATA) public purchaseOrderViewDetail: any,




  ) { }

  ngOnInit(): void {
    
    this.getBranchInfo();
    this.isDataExists = this.purchaseOrderViewDetail.PurchaseOrderDetails && this.purchaseOrderViewDetail.PurchaseOrderDetails.length > 0  ? true : false;
    this.isDataExistsGRN = this.purchaseOrderViewDetail.grnList && this.purchaseOrderViewDetail.grnList.length > 0  ? true : false;    
    this.purchaseOrderViewDetail?.grnList?.forEach(grn => {
        this.grnTotal = this.grnTotal + grn.GRNTotal;
        this.grnTotalReceivedQuantity = this.grnTotalReceivedQuantity + grn.ReceivedQuantity;
    });

  }

  
  /* get Branch Info*/
  getBranchInfo() {
    // get data according to selected branch
    this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
      (branch: DD_Branch) => {
        if (branch.BranchID) {
          this.currencyFormat = branch.CurrencySymbol;
        }
      }
    )
  }
  

  onCloseDialog() {
    this._dialog.close();
  }

}
