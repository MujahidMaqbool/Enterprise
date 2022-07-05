import { Component, Input, OnInit } from '@angular/core';
import { Messages } from '@app/helper/config/app.messages';
import { Branches } from '@app/product/models/supplier.models';



@Component({
  selector: "branch-selection",
  templateUrl: "./branch.selection.component.html",
})
export class BranchSelectionComponent implements OnInit {

  @Input() branchList: Branches[];
  @Input() HasBranchPermission: boolean ;
  @Input() typeName: string ;

  showBranchValidation: boolean = false;

 /***********Messages*********/
 messages = Messages;

  constructor() {}

  ngOnInit() {}


  // change the supplier toggle in branch list
  toggleChange(event, branchData: Branches) {
    if (event.checked) {
      this.showBranchValidation = false;
    }
    this.branchList.forEach((item) => {
      if (item.BranchID == branchData.BranchID) {
        item.IsActive = event.checked;
      }
    });
  }

  // here we check that nobranch is selected then show the validation
  checkIsAnyBranchSelected() {
  let isBranchSelected = this.branchList.find((i) => i.IsIncluded == true);
  if (isBranchSelected) {
    return true;
  } else {
    this.showBranchValidation = true;
    return false;
  }
}


}
