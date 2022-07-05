import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumSaleSourceType } from '@app/helper/config/app.enums';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html'
})
export class ViewAttributeComponent implements OnInit {

  /* Local Variables */
  isDataExists: boolean = false;
  appSourceType  = EnumSaleSourceType;

  constructor(
    private _dialog: MatDialogRef<ViewAttributeComponent>,
    @Inject(MAT_DIALOG_DATA) public attributeViewDetail: any


  ) { }

  ngOnInit(): void {
    this.isDataExists = this.attributeViewDetail.ProductAttributeBranchVM && this.attributeViewDetail.ProductAttributeBranchVM.length > 0 ? true : false;

  }

  onCloseDialog() {
    this._dialog.close();
  }

}
