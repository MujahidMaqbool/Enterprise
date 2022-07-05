import { Component, OnInit, Inject, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { HttpService } from '@app/services/app.http.service';
import { PurchaseOrderApi } from '@app/helper/config/app.webapi';
import { Messages } from '@app/helper/config/app.messages';
import { MessageService } from '@app/services/app.message.service';
import { DateTimeService } from '@app/services/date.time.service';
import { SaveGRNViewModel, ReceivePurchaseOrder } from '@app/product/models/save.gr.model';
import { SubscriptionLike } from 'rxjs';
import { DataSharingService } from '@app/services/data.sharing.service';
import { EnumPurchaseOrderStatus, ProductClassification } from '@app/helper/config/app.enums';
import { Configurations } from '@app/helper/config/app.config';

@Component({
  selector: 'app-receive-order',
  templateUrl: './receive.order.component.html'
})
export class ReceiveOrderComponent implements OnInit, OnDestroy {
  /** Angular Core */
  @Output()
  onReceived = new EventEmitter<boolean>();
  /*** Local Variables */
  receiveDate: any;
  minDate: any;
  totalReceivedTody: number = 0;
  totalOrderedQuantity: number = 0;
  totalPreviouslyReceivedQuantity: number = 0;
  totalOrdered: number = 0;
  todayTotal: number = 0;
  totalQuantityReceived:number = 0;
  currencyFormat: string;
  purchaseOrderStatusID:number;
  isReceiveOrderQuantityZero:boolean = false;
  /** Model and Collectons */
  messages = Messages;
  enumPOStatus = EnumPurchaseOrderStatus;
  saveGRNViewModel: SaveGRNViewModel = new SaveGRNViewModel();
  receivePurchaseOrders: Array<ReceivePurchaseOrder> = [];
  AllowedNumberKeysOnly = Configurations.AllowedNumberKeysOnly;
  currentBranchSubscription: SubscriptionLike;

  enumProductClassification = ProductClassification;

  constructor(
    private _dialog: MatDialogRef<ReceiveOrderComponent>,
    private _httpService: HttpService,
    private _dateTimeService: DateTimeService,
    private _messageService: MessageService,
    private _dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public purchaseOrder: any
  ) { }

  ngOnInit(): void {
    this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
      (branch: any) => {
        if (branch.BranchID) {
          this.currencyFormat = branch.CurrencySymbol;
        }
      }
    )
    this.receiveDate = new Date();
    this.minDate = this.purchaseOrder.PurchaseOrderDate;
    this.purchaseOrderStatusID = this.purchaseOrder.poStatusID;
    if (this.purchaseOrder.PurchaseOrderID) {
      this.getReceivedOrder();
    }
  }
  ngOnDestroy() {
    this.currentBranchSubscription.unsubscribe();
  }
  onCloseDialog() {
    this._dialog.close();
  }
  onOpenCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  onReceiveDateChange(date: Date) {
    this.receiveDate = date;
  //  this.getReceivedOrder();
  }
  preventCharactersForNumber(event: any) {
    let index = this.AllowedNumberKeysOnly.findIndex(k => k == event.key);
    if (index < 0) {
      event.preventDefault()
    }
  }
  getReceivedOrder() {
   // let receiveDate = this._dateTimeService.convertDateObjToString(this.receiveDate, "YYYY-MM-dd")
    this._httpService.get(PurchaseOrderApi.GetRecivePurchaseOrder + this.purchaseOrder.PurchaseOrderID)
      .subscribe((res: any) => {
        if (res && res.MessageCode > 0) {
          if (res && res.Result) {
            this.receivePurchaseOrders = res.Result;
            this.calculateTotals();
          }else{
            this.receivePurchaseOrders = [];
          }
        }
        else {
          this._messageService.showErrorMessage(res.MessageText);
        }
      },
        err => {
          this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "purchase order"));
        });
  }
  mapSaveGRNViewModel() {
    this.saveGRNViewModel.purchaseOrderID = this.purchaseOrder.PurchaseOrderID;
    let receiveDate = this._dateTimeService.convertDateObjToString(this.receiveDate, "YYYY-MM-dd");
    this.saveGRNViewModel.deliveryDate = receiveDate;
    this.saveGRNViewModel.receivePurchaseOrderViewModels = this.receivePurchaseOrders;
  }

  validateQuantity(event, index) {
    this.isReceiveOrderQuantityZero = false;
     this.totalQuantityReceived = (this.receivePurchaseOrders[index].ReceivedToday + this.receivePurchaseOrders[index]?.PreviouslyReceiveQuantity);
    if ((this.purchaseOrderStatusID === this.enumPOStatus.Ordered || this.purchaseOrderStatusID === this.enumPOStatus.PartiallyReceived) && this.receivePurchaseOrders[index].ReceivedToday > this.receivePurchaseOrders[index].OrderedQuantity || (this.totalQuantityReceived > this.receivePurchaseOrders[index].OrderedQuantity)) {
      setTimeout(() => { this.receivePurchaseOrders[index].ReceivedToday = 0;
        this.calculateTotals();
       }, 100);
      
    } else {
      this.calculateTotals()
    }

  }

  onSaveReceiveOrder() {

    if(!this.receivePurchaseOrders.some(item => item.ReceivedToday > 0)) {
      this.isReceiveOrderQuantityZero = true;
      this._messageService.showErrorMessage(this.messages.Validation.Quantity_validation_Msg);
      return;
    }

    this.mapSaveGRNViewModel();
    let param = JSON.parse(JSON.stringify(this.saveGRNViewModel))
    this._httpService.save(PurchaseOrderApi.SaveRecivePurchaseOrder, param).subscribe((respose) => {
      if (respose.MessageCode > 0) {
        this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Purchase Order"));
        this.onReceived.emit(true);
        this._dialog.close();
      } else {
        this._messageService.showErrorMessage(respose.MessageText);
      }
    }, error => {
      this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "Purchase Order"));
    });
  }

  calculateTotals() {
    this.todayTotal = 0;
    this.totalOrdered = 0;
    this.totalOrderedQuantity = 0;
    this.totalReceivedTody = 0;
    this.totalPreviouslyReceivedQuantity = 0;
    if (this.receivePurchaseOrders && this.receivePurchaseOrders.length > 0) {
      this.receivePurchaseOrders.forEach((order: any) => {
        order.TodayTotal = order.SuplierPrice*order.ReceivedToday;
        this.totalOrderedQuantity += order.OrderedQuantity;
        this.totalOrdered += order.OrderedTotal;
        this.todayTotal += order.TodayTotal;
        this.totalReceivedTody +=order.ReceivedToday;
        this.totalPreviouslyReceivedQuantity +=order.PreviouslyReceiveQuantity;
      })
    }
  }
}
