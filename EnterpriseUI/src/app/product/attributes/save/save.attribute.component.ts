// #region Angular References
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

/*****Material/ Third party imports  ******/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

/****Model/enums *******/
import { WizardforProductAttribute } from '@app/helper/config/app.enums';
import { Attribute, AttributeValue, AttributeBranches } from '@app/product/models/attributes.model';
import { AttributeApi } from '@app/helper/config/app.webapi';

/**** * Services/ components ******/
import { HttpService } from '@app/services/app.http.service';
import { MessageService } from '@app/services/app.message.service';
import { Messages } from '@app/helper/config/app.messages';
import { BranchSelectionComponent } from '@app/shared-components/branch-selection/branch.selection.component';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';


@Component({
  selector: 'attribute-save',
  templateUrl: './save.attribute.component.html',  
  providers: [{
    provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
}]
})
export class SaveAttributeComponent implements OnInit {

  /*********** region Local Members ****/
  @ViewChild("BranchesDataForm") branchesDataForm: NgForm;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('scrollContainer') private myScrollContainer: ElementRef;
  
  @ViewChild('branchSelectionRef') branchSelectionRef: BranchSelectionComponent;
  @Output() isSaved = new EventEmitter<boolean>();

  /* Model References */
  attribute: Attribute = new Attribute();
  attributeValues: AttributeValue;
  attributeBranches: AttributeBranches;


  //Local variables
  messages = Messages;
  submitted: boolean = false;
  isShowRequired: boolean = false;
  showContinue: boolean = true;
  showPrevious: boolean = false;
  showSave: boolean = false;
  disableSaveBtn: boolean = false;
  inValidProductAttributeName: boolean = false;
  showDuplicateValueError: boolean = false;
  itemDeleteMode = 'toggle';

  constructor(
    private _dialog: MatDialogRef<SaveAttributeComponent>,
    private _httpService: HttpService,
    private _messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public attributeID: any
  ) { }

  ngOnInit(): void {

    if (this.attributeID > 0 && this.attributeID != null && this.attributeID != undefined) {
      this.attribute.AttributeID = this.attributeID;
      this.getAttributeDetailByID(this.attributeID);
    } else {
      this.attribute.AttributeID = 0;
      this.getFundamental();
    }

  }

  getFundamental() {
    this._httpService.get(AttributeApi.getFundamental).subscribe((response) => {
      if (response && response.MessageCode > 0) {
        this.attribute.AttributeBranchVM = response.Result;
        this.attribute.AttributeBranchVM.forEach((item) => {
          item.IsActive = true;
          item.IsIncluded = true;
        })

      } else {
        this._messageService.showErrorMessage(response.MessageText);
      }
    },
      error => {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "branches"));
      });

  }

  getAttributeDetailByID(productAttributeID: number) {
    let param = AttributeApi.getAttributeDetailByID + productAttributeID;
    this._httpService.get(param).subscribe((respose) => {
      if (respose.MessageCode > 0) {
        this.attribute = respose.Result;        
         /**********Sort variants according to sort number in array******** */
         if(this.attribute.AttributeValueVM){
          this.attribute.AttributeValueVM.sort(function(a, b) {
            return Number(a.SortOrder) - Number(b.SortOrder);
          });
         }      

      } else {
        this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "attribute detail"));
      }
    },
      error => {
        this._messageService.showErrorMessage(error);
      });
  }

  // on previous button checks the stepper and show you buttons accordingly
  onPrevious() {
    this.stepper.previous();
    this.showContinue = true;
    this.showSave = false;
    this.showPrevious = false;
  }

  // on next button checks the stepper and show you buttons accordingly
  onNext() {
    this.submitted = true;
    if (this.stepper.selectedIndex === WizardforProductAttribute.AttributeInformation) {
      this.attribute.AttributeName = this.attribute.AttributeName.trim();

      if (this.isValidVarientValues() && this.attribute.AttributeName != "" && this.attribute.AttributeName != null) {
        /**Check unique attributes variant values */
        if (this.checkIfDuplicateExists(this.attribute.AttributeValueVM)) {
          this.showDuplicateValueError = true;

        } else {
          this.stepper.next();
          this.showPrevious = true;
          this.showSave = true;
          this.showContinue = false;

        }

      } else {
        this.inValidProductAttributeName = true;
      }
    }
  }

  isValidVarientValues(){
    var result: boolean = true;

    this.attribute.AttributeValueVM.forEach((element) => {
      if(element.AttributeValue.trim() == "" || element.AttributeValue == null || element.AttributeValue == undefined) {
        result = false;
      }
    });

    this.isShowRequired = !result ? true : false;
    return result
  }

  onBlur(index){
    this.attribute.AttributeValueVM[index].AttributeValue = this.attribute.AttributeValueVM[index].AttributeValue.trim();
    this.isValidVarientValues();
  }

  delete(index: any) {
    this.attribute.AttributeValueVM.splice(index, 1);
  }

  addNew() {
    this.submitted = true;
    if (this.isValidVarientValues()) {
      var newVariantValue = new AttributeValue();
      this.attribute.AttributeValueVM.push(newVariantValue); 
    }
    setTimeout(()=> {this.scrollToBottom()}, 25);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  /***********Check duplicates **************/
  checkIfDuplicateExists(array): boolean {
    let valueArr = array.map(function (item) { return item.AttributeValue.trim().toLowerCase() });
    var isDuplicate = valueArr.some(function (item, idx) {

      return valueArr.indexOf(item) != idx
    });
    return isDuplicate;
  }

  // befor save set sort order of Variant Values
  setVariantValueSortOrder(): Attribute {

    let result = JSON.parse(JSON.stringify(this.attribute))
    result.AttributeValueVM.forEach((element, index) => {
      element.SortOrder = index + 1;
    });

    return result;
  }

  onSave() {
    if (this.branchSelectionRef.checkIsAnyBranchSelected()) {
      this.disableSaveBtn = true;
      this.attribute.AttributeBranchVM = this.branchSelectionRef.branchList;
      this.attribute.HasBranchPermission = this.branchSelectionRef.HasBranchPermission;      

      this._httpService.save(AttributeApi.saveAttribute, this.setVariantValueSortOrder()).subscribe((response) => {
        if (response.MessageCode > 0) {
          this.isSaved.emit(true);
          this._messageService.showSuccessMessage(this.messages.Success.Save_Success.replace("{0}", "Attribute"));
          this.onCloseDialog();
          this.disableSaveBtn = false;
        } else if(response.MessageCode < 0) {
          this.disableSaveBtn = false;
          this._messageService.showErrorMessage(response.MessageText);
        } else {
          this.disableSaveBtn = false;
          this._messageService.showErrorMessage(this.messages.Error.Save_Error.replace("{0}", "attribute"));
        }

      },
        error => {
          this.disableSaveBtn = false;
          this._messageService.showErrorMessage(error);
        });
    }
  }


  onCloseDialog() {
    this._dialog.close();
  }


}