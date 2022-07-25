// #region Imports

/********************** Angular Refrences *********************/
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SubscriptionLike } from 'rxjs';


/********************* Material:Refference ********************/
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

/********************** Configuration *********************/
import { EarnedRuleItemType, RewardProgramPurchasesType } from 'src/app/helper/config/app.enums';
import { RewardProgramApi } from 'src/app/helper/config/app.webapi';

/********************** Services & Models *********************/
import { BranchListRewardProgram } from 'src/app/branch/models/branch.models';
import { Messages } from 'src/app/helper/config/app.messages';
import { ApiResponse, DD_Branch } from 'src/app/models/common.model';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { ExceptionItemType, RewardProgramEarningRuleExceptionResultViewModel, RewardProgramExceptionRuleModel } from '../../models/reward-program.model';
// #endregion

@Component({
    selector: 'app-add-exception',
    templateUrl: './add.exception.component.html',
})
export class SaveAddExceptionComponent implements OnInit {
    /*********** region Local Members ****/
    @Output() exceptionList = new EventEmitter<any>();
    @ViewChild('allSelectedItemTypeList') allSelectedItemTypeList: MatOption;
    @ViewChild('allSelectedBranchTypeList') allSelectedBranchTypeList: MatOption;
    @ViewChild('allSelectedSearchBranchList') allSelectedSearchBranchList: MatOption;
    @ViewChild('selectItem') selectItem: MatSelect;
    @ViewChild('selectedBranch') selectedBranch: MatSelect;

    /*********** Forms ****/
    searchItem: FormControl = new FormControl();

    /***********Messages*********/
    messages = Messages;

    /*********** Configuration *******************/
    enum_PurchasesType = RewardProgramPurchasesType;

    /***********Model Reference*********/
    /*********** Collections ********/
    selectedItemTypeList: RewardProgramExceptionRuleModel[] = new Array<RewardProgramExceptionRuleModel>();
    selectedSearchBranchList: BranchListRewardProgram[] = new Array<BranchListRewardProgram>();
    selectedBranchTypeList: BranchListRewardProgram[] = new Array<BranchListRewardProgram>();
    allExceptionItemTypeList: RewardProgramExceptionRuleModel[] = [];
    allSearchBranchList: BranchListRewardProgram[] = [];
    itemTypeList: ExceptionItemType[] = [];
    searchItemTypeList: RewardProgramExceptionRuleModel[] = [];
    copySearchItemTypeList: RewardProgramExceptionRuleModel[] = [];
    gridTableList: RewardProgramEarningRuleExceptionResultViewModel[] = new Array<RewardProgramEarningRuleExceptionResultViewModel>();
    branchList: BranchListRewardProgram[] = [];

    /*********** Local *******************/
    isSelectAllItemTypes: Boolean = false;
    isDeleteExemptedbtnDisabled: boolean = false;
    currentBranchSubscription: SubscriptionLike;
    itemTypeName: string = "";
    itemName: string;
    enumEarnedRuleItemType = EarnedRuleItemType;
    selectedSearchItem: any;
    showErrorAmountSpent: boolean = false;
    showErrorBenefittedEarnedPoints: boolean = false;
    showErrorLeadEarnedPoints: boolean = false;
    showErrorClientEarnedPoints: boolean = false;
    showErrorMemberEarnedPoints: boolean = false;
    isShowErrorMessage: boolean = false;
    currencyFormat: string;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _httpService: HttpService,
        private _messageService: MessageService,
        private dialogRef: MatDialogRef<SaveAddExceptionComponent>,
        private _dataSharingService: DataSharingService,
    ) {
        this.getAllexceptionList(this.data.itemTypeID);
    }

    ngOnInit(): void {
        this.branchList = JSON.parse(JSON.stringify(this.data.branchList));
        this.setItemTypeName();
        this.searchItem.valueChanges
            .pipe(debounceTime(200))
            .subscribe(searchText => {
                if (searchText != null) {
                    if (searchText == "") {
                        this.addExceptionListSearchByName();
                    }
                    if (typeof (searchText) === "string" && searchText.length > 2) {
                        let trimedValue = searchText.trim();
                        this.copySearchItemTypeList = this.filterItem(trimedValue);
                    }
                }
                else {
                    this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.searchItemTypeList));
                }
            });
        this.currentBranchSubscription = this._dataSharingService.currentBranch.subscribe(
            (branch: DD_Branch) => {
                if (branch) {
                    this.currencyFormat = branch.CurrencySymbol;
                }
            }
        )
    }

    /* Filter item for autocomplete search */
    filterItem(value: string): any {
        const filterValue = value.toLowerCase();
        return this.searchItemTypeList.filter(item => {
            return item.ItemName.toLowerCase().search(filterValue) !== -1;
        });
    }

    /* call when click on search button */
    onSearchClick(searchValue) {
        let trimedValue ;
        if (typeof (searchValue) === "string" && searchValue.length >= 1) {
            trimedValue = searchValue.trim();
        }
        else if(typeof (searchValue) === "object"){
            trimedValue = searchValue.ItemName.trim();
        }
            trimedValue = trimedValue.toLowerCase()
            var filteredItemObj = this.filterItem(trimedValue);
            if (filteredItemObj.length == 0) {
                this.gridTableList = [];
            }
            this.gridTableList = [];
            filteredItemObj.forEach(element => {
                this.getSearchedItem(element);
            });
        }


    //ReEdit From Core
    isEditExceptionList() {
        if (this.data.exceptionList.length > 0) {
            this.gridTableList = JSON.parse(JSON.stringify(this.data.exceptionList));
            // this.allExceptionItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));
            this.selectedItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));
            this.searchItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));
            this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));

            this.branchList.forEach((i) => {
                this.itemTypeList.forEach((j: any) => {
                    if (i.BranchID == j.ItemBranchID) {
                        this.allExceptionItemTypeList.push(j);
                    }
                })
            });

            this.branchList.forEach((data) => {
                var result = this.data.exceptionList.find((i => i.BranchID == data.BranchID));
                if (result) {
                    this.selectedBranchTypeList.push(data);
                }
            })

            // main branch multiselect selection in case of edit
            if (this.selectedBranch) {
                setTimeout(() => {
                    this.selectedBranch.options.forEach((item: MatOption) => {
                        var result = this.selectedBranchTypeList.find(i => i.BranchID == item?.value.BranchID);
                        // var result = this.branchList.find(i => i.BranchID == item?.value.BranchID);

                        if (result) {
                            // if (item.value.BranchID == result.BranchID)
                            //     item.select()
                        }
                    });
                }, 400);
            }


            if (this.selectedBranchTypeList.length == this.branchList.length) {
                setTimeout(() => {
                    if (this.selectedBranch) {
                        this.selectedBranch.options.forEach((item: MatOption) => {
                            // if (item.viewValue == "All")
                            //     item.select()
                        });
                    }
                }, 400);
            }

            this.allSearchBranchList = this.selectedBranchTypeList;

            setTimeout(() => {
                if (this.selectItem) {
                    this.selectItem.options.forEach((item: MatOption) => {
                        var result = this.gridTableList.find(i => i.ItemID == item?.value.ItemID);
                        if (result) {
                            // if (item.value.ItemID == result.ItemID)
                            //     item.select()
                        }
                    });
                }

            }, 400);

            if (this.gridTableList.length > 0) {
                this.gridTableList.forEach((i) => {
                    if (i.IsSelected == true) {
                        i.IsSelected = false;
                    }
                })
            };


            if (this.selectedItemTypeList.length == this.allExceptionItemTypeList.length) {
                setTimeout(() => {
                    if (this.selectItem) {
                        this.selectItem.options.forEach((item: MatOption) => {
                            // if (item.viewValue == "All")
                            //     item.select()
                        });
                    }
                }, 400);
            }

            this.selectedItemTypeList = [];
            this.selectedBranchTypeList = [];
            this.allExceptionItemTypeList =[];
        }
    }

    /* display the name of item according to item type ID */
    setItemTypeName() {
        if (this.data.itemTypeID == this.enum_PurchasesType.Class) {
            this.itemTypeName = "Class"
        } else if (this.data.itemTypeID == this.enum_PurchasesType.Service) {
            this.itemTypeName = "Service"
        } else if (this.data.itemTypeID == this.enum_PurchasesType.Product) {
            this.itemTypeName = "Product"
        } else if (this.data.itemTypeID == this.enum_PurchasesType.Forms) {
            this.itemTypeName = "Form"
        } else {
            this.itemTypeName = "Membership"
        }
    }

    //get all exception list
    getAllexceptionList(itemTypeID) {
        this._httpService.get(RewardProgramApi.getAllExceptionList + itemTypeID)
            .subscribe(
                (response: ApiResponse) => {
                    if (response && response.MessageCode > 0) {
                        if (response.Result && response.Result.length > 0) {
                            this.itemTypeList = response.Result;
                            this.isEditExceptionList();
                        }
                    }
                    else {
                        this._messageService.showErrorMessage(response.MessageText);
                    }
                },
                error => {
                    this._messageService.showErrorMessage(this.messages.Error.Get_Error.replace("{0}", "Exception List"))
                }
            );
    }

    //  region main branch selection
    //main branch multiSelect region
    onSelectAllBranchType() {
        if (this.allSelectedBranchTypeList.selected) {
            this.selectedBranchTypeList = [];
            this.branchList.forEach(branch => {
                this.selectedBranchTypeList.push(branch);
            });
            setTimeout(() => {
                this.allSelectedBranchTypeList.select();
            }, 100);
            this.allExceptionItemTypeList = JSON.parse(JSON.stringify(this.itemTypeList));

        } else {
            this.selectedBranchTypeList = [];
            this.allExceptionItemTypeList = [];

            this.allSelectedBranchTypeList.deselect();
        }
    }

    //for branch selection and deselection
    onToggleBranchTypeSelect() {
        this.allExceptionItemTypeList = [];

        //we are filtering all exception list according to branch
        this.selectedBranchTypeList.forEach((i) => {
            this.itemTypeList.forEach((j: any) => {
                if (i.BranchID == j.ItemBranchID) {
                    this.allExceptionItemTypeList.push(j);
                }
            })
        });

        // select the class are already in exception list
        var removedItem = [];
        this.selectedItemTypeList.forEach((selectedItem, index) => {
            var result = this.selectedBranchTypeList.find((i => i.BranchID == selectedItem.ItemBranchID));
            if (!result) {
                removedItem.push(selectedItem.ItemID);
            }
        });
        removedItem.forEach((itemID) => {
            this.selectedItemTypeList = this.selectedItemTypeList.filter((i => i.ItemID != itemID));
        });


        if (this.allSelectedBranchTypeList && this.allSelectedBranchTypeList.selected) {
            this.allSelectedBranchTypeList.deselect();
            return;
        }
        if (this.branchList.length == this.selectedBranchTypeList.length) {
            this.allSelectedBranchTypeList.select();
            return;
        }

    }
    // end main branch multiselect region

    //main item multiselect region
    onSelectAllItemType() {
        if (this.allSelectedItemTypeList.selected) {
            this.selectedItemTypeList = [];
            this.allExceptionItemTypeList.forEach(branch => {
                this.selectedItemTypeList.push(branch);
            });
            setTimeout(() => {
                this.allSelectedItemTypeList.select();
            }, 100);


        } else {
            this.selectedItemTypeList = [];
            this.allSelectedItemTypeList.deselect();
        }
        this.sortExceptionList();
    }

    //for single selections
    onToggleItemTypeSelect() {

        if (this.allSelectedItemTypeList && this.allSelectedItemTypeList.selected) {
            this.allSelectedItemTypeList.deselect();
            this.sortExceptionList();
            return;
        }
        if (this.allExceptionItemTypeList.length == this.selectedItemTypeList.length) {
            this.allSelectedItemTypeList.select();
            this.sortExceptionList();
            return;
        }
    }
    //end main class multiselect region


    //second Multi select for branch (All branch select)
    onSelectSearchBranch() {
        if (this.allSelectedSearchBranchList.selected) {
            this.selectedSearchBranchList = [];
            this.allSearchBranchList.forEach(branch => {
                this.selectedSearchBranchList.push(branch);
            });
            setTimeout(() => {
                this.allSelectedSearchBranchList.select();
            }, 100);

            this.gridTableList = JSON.parse(JSON.stringify(this.searchItemTypeList));

            this.selectedSearchBranchList.forEach((gridListData) => {
                var result = this.gridTableList.find(i => i.BranchID == gridListData.BranchID);
                if (!result) {
                    this.searchItemTypeList.forEach((itemData) => {
                        if (itemData.ItemBranchID == gridListData.BranchID) {
                            let gridTableobj: any = {};
                            gridTableobj.ItemName = itemData.ItemName;
                            gridTableobj.BranchName = itemData.BranchName;
                            gridTableobj.ItemID = itemData.ItemID;
                            gridTableobj.AmountSpent = 0;
                            gridTableobj.BenefittedEarnedPoints = 0;
                            gridTableobj.ClientEarnedPoints = 0;
                            gridTableobj.LeadEarnedPoints = 0;
                            gridTableobj.MemberEarnedPoints = 0
                            gridTableobj.IsSelected = false;
                            gridTableobj.BranchID = itemData.ItemBranchID;
                            gridTableobj.ItemTypeID = this.data.itemTypeID;
                            this.gridTableList.push(JSON.parse(JSON.stringify(gridTableobj)));
                        }
                    })
                }
            });
            var removedItemIndex = [];
            //remove unselected item
            this.gridTableList.forEach((item, index) => {
                var result = this.selectedSearchBranchList.find(i => i.BranchID == item.BranchID);
                if (!result) {
                    removedItemIndex.push(item.BranchID);
                }
            })

            removedItemIndex.forEach((id) => {
                this.gridTableList = this.gridTableList.filter(i => i.ItemID != id);
            })
            this.sortExceptionList();
            this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));

        } else {
            this.selectedSearchBranchList = [];
            this.allSelectedSearchBranchList.deselect();
            this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));
            this.sortExceptionList();

        }
    }

    //second Multi select for branch (Single branch selection)
    onToggleSearchBranch() {
        if (this.allSelectedSearchBranchList && this.allSelectedSearchBranchList.selected) {
            this.allSelectedSearchBranchList.deselect();
            return;
        };
        if (this.allSearchBranchList.length == this.selectedSearchBranchList.length) {
            this.allSelectedSearchBranchList.select();
            return;
        };
        this.copySearchItemTypeList = [];
        if (this.selectedSearchBranchList.length > 0) {
            this.selectedItemTypeList.forEach((selectedBranch) => {
                var result = this.selectedSearchBranchList.find(i => i.BranchID == selectedBranch.ItemBranchID);
                if (result) {
                    this.copySearchItemTypeList.push(JSON.parse(JSON.stringify(selectedBranch)));
                }
            });
        } else {
            this.selectedItemTypeList.forEach((item: any) => {
                if (item != 0) {
                    this.copySearchItemTypeList.push(item);
                }
            });
        }
        this.sortExceptionList();

    }
    // end region second multi select

    /* get the search item*/
    getSearchedItem(event: RewardProgramEarningRuleExceptionResultViewModel) {
        var result = this.gridTableList.find(i => i.ItemID == event.ItemID);
        if (!result) {
            let gridTableobj: any = {};
            gridTableobj.AmountSpent = event.AmountSpent;
            gridTableobj.ItemName = event.ItemName;
            gridTableobj.BranchName = event.BranchName;

            gridTableobj.ItemID = event.ItemID;
            gridTableobj.BenefittedEarnedPoints = event.BenefittedEarnedPoints;
            gridTableobj.ClientEarnedPoints = event.ClientEarnedPoints;
            gridTableobj.LeadEarnedPoints = event.LeadEarnedPoints;
            gridTableobj.MemberEarnedPoints = event.MemberEarnedPoints;
            gridTableobj.IsSelected = event.IsSelected;
            gridTableobj.BranchID = event.BranchID;
            gridTableobj.ItemTypeID = this.data.itemTypeID;
            this.gridTableList.push(gridTableobj);
        };
        if (result != undefined) {
            this.gridTableList = this.gridTableList.filter(i => i.ItemID == result.ItemID);
        }
    }

    // display the item name in autocomplete search
    displayItemName(item?: RewardProgramExceptionRuleModel): string | undefined {
        return item ? typeof (item) === "object" ? item.ItemName : item : undefined;
    }

    // select all item in list
    onAllItemTypeSelectionChange(event: any) {
        //here we check if any branch is selected in filter than only
        if (this.selectedSearchBranchList.length > 0) {
            this.selectedSearchBranchList.forEach((selectedBranch:any) => {
                if(selectedBranch != 0){
                 this.gridTableList.forEach((item)=>{
                  if(selectedBranch.BranchID == item.BranchID){
                    item.IsSelected = event;
                  }
                });
            }
            })
        } else {
            this.gridTableList.forEach(element => {
                element.IsSelected = event;
            });
        }

        if (this.gridTableList.length > 0) {
            this.isDeleteExemptedbtnDisabled = event;
        }
    }

    // select single item in list
    onItemTypeSelectionChange() {
        var isSelected = this.gridTableList.filter(mc => mc.IsSelected);
        this.isDeleteExemptedbtnDisabled = isSelected && isSelected.length > 0 ? true : false;
        this.isSelectAllItemTypes = isSelected && isSelected.length == this.gridTableList.length ? true : false;
    }

    /* on click except button and assign them 0 value*/
    onExcemptClick() {
        if (this.gridTableList.length > 0) {
            this.gridTableList.forEach((data) => {
                if (data.IsSelected == true) {
                    data.AmountSpent = 0;
                    data.ClientEarnedPoints = 0;
                    data.MemberEarnedPoints = 0;
                    data.LeadEarnedPoints = 0;
                    data.BenefittedEarnedPoints = 0;
                }
            })
        }
    }


    //delete all selected items
    onDeleteAllClick() {
        // this.gridTableList = this.gridTableList.filter(c => c.IsSelected != true);
        // this.isDeleteExemptedbtnDisabled = false;
        // this.isSelectAllItemTypes = false;
        let selectedItemList = this.gridTableList.filter(c => c.IsSelected == true);
        this.gridTableList = this.gridTableList.filter(c => c.IsSelected != true);
        if(selectedItemList.length > 0){
           selectedItemList.forEach((selectedItem)=>{
           this.searchItemTypeList = this.searchItemTypeList.filter(i => i.ItemID != selectedItem.ItemID)
        });
        }
        this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.searchItemTypeList));
        this.isDeleteExemptedbtnDisabled = false;
        this.isSelectAllItemTypes = false;
    }


    //call this function when search by name string is empty
    addExceptionListSearchByName() {

        this.searchItemTypeList.forEach((gridListData: any) => {
            var result = this.gridTableList.find(i => i.ItemID == gridListData.ItemID)
            if (!result) {
                let gridTableobj: any = {};
                gridTableobj.AmountSpent = gridListData.AmountSpent;
                gridTableobj.ItemName = gridListData.ItemName;
                gridTableobj.BranchName = gridListData.BranchName;

                gridTableobj.ItemID = gridListData.ItemID;
                gridTableobj.BenefittedEarnedPoints = gridListData.BenefittedEarnedPoints;
                gridTableobj.ClientEarnedPoints = gridListData.ClientEarnedPoints;
                gridTableobj.LeadEarnedPoints = gridListData.LeadEarnedPoints;
                gridTableobj.MemberEarnedPoints = gridListData.MemberEarnedPoints;
                gridTableobj.IsSelected = false;
                gridTableobj.BranchID = gridListData.BranchID;
                gridTableobj.ItemTypeID = this.data.itemTypeID;
                this.gridTableList.push(JSON.parse(JSON.stringify(gridTableobj)));
            }
        });
        this.searchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));

        //here we are assiging the class to autocomplete search according to branch selection
        if (this.selectedSearchBranchList.length > 0) {
            this.copySearchItemTypeList = [];
            this.selectedSearchBranchList.forEach((branch: any) => {
                if (branch != 0) {
                    var result = this.selectedItemTypeList.filter((i => i.ItemBranchID == branch.BranchID));
                    if (result && result.length > 0) {
                        result.forEach((gridData) => {
                            this.copySearchItemTypeList.push(gridData);
                        });
                    }
                }
            })
        } else {
            this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));
        }
         this.sortExceptionList();

    }

    /** Add exception list in grid  **/
    onAddExceptionListInGrid() {
        //add new item
        if (this.selectedItemTypeList.length == 0) {
            this.isDeleteExemptedbtnDisabled = false;
        }
        this.selectedItemTypeList.forEach((gridListData) => {
            var result = this.gridTableList.find(i => i.ItemID == gridListData.ItemID && i.BranchID ==  gridListData.ItemBranchID)
            if (!result) {
                let gridTableobj: any = {};
                gridTableobj.AmountSpent = 0;
                gridTableobj.ItemName = gridListData.ItemName;
                gridTableobj.BranchName = gridListData.BranchName;

                gridTableobj.ItemID = gridListData.ItemID;
                gridTableobj.BenefittedEarnedPoints = 0;
                gridTableobj.ClientEarnedPoints = 0;
                gridTableobj.LeadEarnedPoints = 0;
                gridTableobj.MemberEarnedPoints = 0
                gridTableobj.IsSelected = false;
                gridTableobj.BranchID = gridListData.ItemBranchID;
                gridTableobj.ItemTypeID = this.data.itemTypeID;
                this.gridTableList.push(JSON.parse(JSON.stringify(gridTableobj)));
            }
        });
        this.allSearchBranchList = [];
        this.selectedBranchTypeList.forEach((data: any) => {
            if (data != 0) {
                this.allSearchBranchList.push(data)
            }
        });

        // var removedItemIndex = [];
        // //remove unselected item
        // this.gridTableList.forEach((item, index) => {
        //     var result = this.selectedItemTypeList.find(i => i.ItemID == item.ItemID);
        //     if (!result) {
        //         removedItemIndex.push(item.ItemID);
        //     }
        // })

        // removedItemIndex.forEach((id) => {
        //     this.gridTableList = this.gridTableList.filter(i => i.ItemID != id);
        // })

        this.sortExceptionList();

        var isAnyItemNotSelected: boolean = this.gridTableList.some(i => i.IsSelected == false);
        if (isAnyItemNotSelected) {
            this.isSelectAllItemTypes = false;
        }

        this.searchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));
        this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));

        this.selectedItemTypeList = [];
        this.selectedBranchTypeList = [];
        this.allExceptionItemTypeList =[];
    }

    /** Sort exception list in grid  **/
    sortExceptionList() {
        this.gridTableList.sort((a, b) => a.ItemName.localeCompare(b.ItemName, 'es', { sensitivity: 'base' }));
    }

    /** Delete single item **/
    onDeleteItem(index: any ,data:any) {
        this.gridTableList.splice(index, 1);
        var result = this.searchItemTypeList.findIndex(c => c.ItemID == data.ItemID);

        if(result > -1){
            this.searchItemTypeList.splice(result ,1);
            this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.searchItemTypeList));
        }

        if (this.gridTableList.length == 0) {
            this.isDeleteExemptedbtnDisabled = false;
            this.isSelectAllItemTypes = false;
        }


        var isAllListSelected = this.gridTableList.find(i => i.IsSelected == false);
        if (typeof isAllListSelected !== 'undefined') {
            this.isSelectAllItemTypes = false;
        } else {
            this.isSelectAllItemTypes = false;

        }
        var isDisableDelelteAllExemptbtn: boolean = this.gridTableList.some(i => i.IsSelected == true);
        if (isDisableDelelteAllExemptbtn) {
            this.isDeleteExemptedbtnDisabled = true;
        } else {
            this.isDeleteExemptedbtnDisabled = false;
        }
    }

    /** close exception list dialog **/
    closeDialog() {
        this.dialogRef.close();
    }

    /** Emit the final list to save reward program on save click **/
    onSave() {
        this.onValidationCheck();
        if (!this.isShowErrorMessage) {
            this.exceptionList.emit(this.gridTableList);
            this.closeDialog();
        }
    }

    /** Emit the final list to save reward program on save click **/
    onValidationCheck() {
        this.gridTableList.forEach((gridTable) => {
            var result = this.searchItemTypeList.find((i => i.ItemID == gridTable.ItemID));
            if (result) {
                result.AmountSpent = gridTable.AmountSpent;
                result.BenefittedEarnedPoints = gridTable.BenefittedEarnedPoints;
                result.ClientEarnedPoints = gridTable.ClientEarnedPoints;
                result.MemberEarnedPoints = gridTable.MemberEarnedPoints;
                result.LeadEarnedPoints = gridTable.LeadEarnedPoints;
            }
        });

        setTimeout(() => {
            var isAnyAmountSpentIsNUll: boolean = this.gridTableList.some(i => i.AmountSpent.toString() == "");
            var isAnyMemberEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.MemberEarnedPoints.toString() == "");
            if (this.data.itemTypeID != this.enum_PurchasesType.Membership) {
                var isAnyClientEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.ClientEarnedPoints.toString() == "");
                var isAnyLeadEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.LeadEarnedPoints.toString() == "");
                var isAnyBenefittedEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.BenefittedEarnedPoints.toString() == "");
            }
            if (isAnyAmountSpentIsNUll || isAnyMemberEarnedPointsIsNUll || isAnyClientEarnedPointsIsNUll || isAnyLeadEarnedPointsIsNUll || isAnyBenefittedEarnedPointsIsNUll) {
                this.isShowErrorMessage = true;
            }
            if (!isAnyAmountSpentIsNUll && !isAnyMemberEarnedPointsIsNUll && !isAnyClientEarnedPointsIsNUll && !isAnyLeadEarnedPointsIsNUll && !isAnyBenefittedEarnedPointsIsNUll) {
                this.isShowErrorMessage = false;
            }
        }, 500);
    }
}
