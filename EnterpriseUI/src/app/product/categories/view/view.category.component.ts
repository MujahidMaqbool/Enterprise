import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCategoryApi } from '@app/helper/config/app.webapi';
import { HttpService } from '@app/services/app.http.service';
import { Messages } from '@app/helper/config/app.messages';
import { MessageService } from '@app/services/app.message.service';
import { EnumSaleSourceType } from '@app/helper/config/app.enums';

@Component({
  selector: 'app-view-category',
  templateUrl: './view.category.component.html'
})
export class ViewCategoryComponent implements OnInit {
  messages = Messages;
  catrgoryObj: any = {};
  /* Model Refences */
  enum_AppSourceType = EnumSaleSourceType;
  constructor(
    private _dialog: MatDialogRef<ViewCategoryComponent>,
    private _httpService: HttpService,
    private _messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public ProductCategory: any
  ) { }

  ngOnInit(): void {
    this.catrgoryObj = this.ProductCategory;
  }

  onCloseDialog() {
    this._dialog.close();
  }


}
