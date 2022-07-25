// #region Imports

/********************** Angular Refrences *********************/
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { SubscriptionLike } from "rxjs";

/********************* Material:Refference ********************/
import { MatOption } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

/********************** Configuration *********************/
import { ExceptionItemType, RewardProgramActivitiesEarningRuleExceptionResultViewModel, RewardProgramActivityExceptionRuleModel } from '../../models/reward-program.model';

/********************** Services & Models *********************/
import { Messages } from 'src/app/helper/config/app.messages';
import { RewardProgramApi } from 'src/app/helper/config/app.webapi';
import { ApiResponse } from 'src/app/models/common.model';
import { HttpService } from 'src/app/services/app.http.service';
import { MessageService } from 'src/app/services/app.message.service';
import { DataSharingService } from 'src/app/services/data.sharing.service';
import { BranchListRewardProgram } from 'src/app/branch/models/branch.models';
// #endregion

@Component({
    selector: 'app-add-exception-form',
    templateUrl: './add.form-exception.save.component.html',
})
export class SaveAddExceptionFormComponent implements OnInit {
    /*********** region Local Members ****/

    @ViewChild('allSelectedItemTypeList') private allSelectedItemTypeList: MatOption;
    @ViewChild('allSelectedBranchTypeList')  allSelectedBranchTypeList: MatOption;
    @ViewChild('allSelectedSearchBranchList')  allSelectedSearchBranchList: MatOption;
    @ViewChild('selectItem') selectItem: MatSelect;
    @ViewChild('selectedBranch') selectedBranch: MatSelect;
    @Output() exceptionList = new EventEmitter<any>();

    /*********** Forms ****/
    searchItem: FormControl = new FormControl();

    /***********Messages*********/
    messages = Messages;

    /***********Model Reference*********/
    /*********** Collections ********/
    selectedItemTypeList: RewardProgramActivityExceptionRuleModel[] = [];
    gridTableList: RewardProgramActivitiesEarningRuleExceptionResultViewModel[] = new Array<RewardProgramActivitiesEarningRuleExceptionResultViewModel>();
    selectedBranchTypeList: BranchListRewardProgram[] = new Array<BranchListRewardProgram> ();
    selectedSearchBranchList: BranchListRewardProgram[] = new Array<BranchListRewardProgram> ();
    searchItemTypeList : RewardProgramActivityExceptionRuleModel[] = [];
    copySearchItemTypeList:RewardProgramActivityExceptionRuleModel[] = [];
    branchList: BranchListRewardProgram[] = [];
    itemTypeList:ExceptionItemType[] = [];
    allExceptionItemTypeList:any= [];
    allSearchBranchList: BranchListRewardProgram[] = [];

    /*********** Local *******************/
    isSelectAllItemTypes: Boolean = false;
    isDeleteExemptedbtnDisabled : boolean = false;
    isAllItemsSelected: Boolean = false;
    isShowErrorMessage: boolean = false;
    currentBranchSubscription: SubscriptionLike;
    branchId: number;
    currencyFormat:string;
    itemName: string;


    constructor(
        private dialogRef: MatDialogRef<SaveAddExceptionFormComponent>,
        private _httpService: HttpService,
        private _messageService: MessageService,
        private _dataSharingService: DataSharingService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.getRewardProgramFormExceptionList();
    }

    ngOnInit(): void {
        this.branchList = JSON.parse(JSON.stringify(this.data.branchList));
        this.searchItem.valueChanges
            .pipe(debounceTime(200))
            .subscribe(searchText => {
                if (searchText != null) {
                    if (searchText == "") {
                        this.addExceptionListSearchByName();
                    }
                    if (typeof (searchText) === "string" && searchText.length >= 1) {
                        let trimedValue = searchText.trim();
                        this.copySearchItemTypeList = this.filterItem(trimedValue);
                    }
                }
                else {
                    this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.searchItemTypeList));
                }
            });
    }

    /* Filter item for autocomplete search */
    filterItem(value: string): any {
        const filterValue = value.toLowerCase();
        return this.searchItemTypeList.filter(item => {
            return item.FormName.toLowerCase().search(filterValue) !== -1;
        });
    }

    /* call when click on search button */
    onSearchClick(searchValue) {
        let trimedValue ;
        if (typeof (searchValue) === "string" && searchValue.length > 2) {
            trimedValue = searchValue.trim();
        }
        else if(typeof (searchValue) === "object"){
            trimedValue = searchValue.FormName.trim();
        }
            var filteredItemObj = this.filterItem(trimedValue);
            if (filteredItemObj.length == 0) {
                this.gridTableList = [];
            }
            this.gridTableList = [];
            filteredItemObj.forEach(element => {
                this.getSearchedItem(element);
            });

    }

    /* get the list of forms */
    getRewardProgramFormExceptionList() {
        this._httpService.get(RewardProgramApi.getRewardProgramExceptionForms)
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

    /* ReEdit From Core */
    isEditExceptionList() {
        if (this.data.exceptionList.length > 0) {
            this.gridTableList = JSON.parse(JSON.stringify(this.data.exceptionList));
            this.selectedItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));
            this.searchItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));
            this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.data.exceptionList));

            this.branchList.forEach((i) => {
                this.itemTypeList.forEach((j: any) => {
                    if (i.BranchID == j.FormBranchID) {
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
                        var result = this.gridTableList.find(i => i.FormID == item?.value.FormID);
                        if (result) {
                            // if (item.value.FormID == result.FormID)
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
    //main branch multiselect(All branch)
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

    //for main branch single selections(single)
    onToggleBranchTypeSelect() {

        this.allExceptionItemTypeList = [];

        //we are filtering all exception list according to branch
        this.selectedBranchTypeList.forEach((i) => {
            this.itemTypeList.forEach((j: any) => {
                if (i.BranchID == j.FormBranchID) {
                    this.allExceptionItemTypeList.push(j);
                }
            })
        });

        // select the class are already in exception list
        var removedItem = [];
        this.selectedItemTypeList.forEach((selectedItem, index) => {
            var result = this.selectedBranchTypeList.find((i => i.BranchID == selectedItem.FormBranchID));
            if (!result) {
                removedItem.push(selectedItem.FormBranchID);
            }
        });
        removedItem.forEach((itemID) => {
            this.selectedItemTypeList = this.selectedItemTypeList.filter((i => i.FormBranchID != itemID));
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

    //second Multi select for branch (All branch)
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
                var result = this.gridTableList.find(i => i.BranchID == gridListData.BranchID)
                if (!result) {
                    this.searchItemTypeList.forEach((itemData) => {
                        if (itemData.FormBranchID == gridListData.BranchID) {
                            let gridTableobj: any = {};
                            gridTableobj.FormName = itemData.FormName;
                            gridTableobj.BranchName = itemData.BranchName;


                            gridTableobj.FormID = itemData.FormID;
                            gridTableobj.ClientEarnedPoints = 0;
                            gridTableobj.LeadEarnedPoints = 0;
                            gridTableobj.MemberEarnedPoints = 0
                            gridTableobj.IsSelected = false;
                            gridTableobj.BranchID = itemData.FormBranchID;
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
                this.gridTableList = this.gridTableList.filter(i => i.BranchID != id);
            })
            this.sortExceptionList();

        } else {
            this.selectedSearchBranchList = [];
            this.allSelectedSearchBranchList.deselect();
            this.sortExceptionList();
        }

    }

    // single seletion and deselect of branch(single)
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
                var result = this.selectedSearchBranchList.find(i => i.BranchID == selectedBranch.FormBranchID);
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
    // end second branch multiselect region


    // items multiselect region

    // All Item selection
    onSelectAllItemType() {

        if (this.allSelectedItemTypeList.selected) {
            this.selectedItemTypeList = [];
            this.allExceptionItemTypeList.forEach(branch => {
                this.selectedItemTypeList.push(branch);
            });
            setTimeout(() => {
                this.allSelectedItemTypeList.select();
            }, 100);
            this.isAllItemsSelected = true;

        } else {
            this.isAllItemsSelected = false;
            this.selectedItemTypeList = [];
            this.allSelectedItemTypeList.deselect();
        }
        this.sortExceptionList()
    }

    //for single selections
    onToggleItemTypeSelect() {

        if (this.allSelectedItemTypeList && this.allSelectedItemTypeList.selected) {
            this.allSelectedItemTypeList.deselect();
            this.isAllItemsSelected = false;
            this.sortExceptionList()
            return;
        }
        if (this.allExceptionItemTypeList.length == this.selectedItemTypeList.length) {
            this.allSelectedItemTypeList.select();
            this.isAllItemsSelected = true;
            this.sortExceptionList()
            return;
        }
    }

    // end item multiselect region

    /** Add exception list in grid  **/
    onAddExceptionListInGrid() {
        //add new item
        if (this.selectedItemTypeList.length == 0) {
            this.isDeleteExemptedbtnDisabled = false;
        }

        this.selectedItemTypeList.forEach((gridListData) => {
            var result = this.gridTableList.find(i => i.FormID == gridListData.FormID)
            if (!result) {
                let gridTableobj: any = {};
                gridTableobj.FormName = gridListData.FormName;
                gridTableobj.BranchName = gridListData.BranchName;

                gridTableobj.FormID = gridListData.FormID;
                gridTableobj.ClientEarnedPoints = 0;
                gridTableobj.LeadEarnedPoints = 0;
                gridTableobj.MemberEarnedPoints = 0;
                // gridTableobj.IsSelected = false;
                gridTableobj.BranchID = gridListData.FormBranchID;
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
        //     var result = this.selectedItemTypeList.find(i => i.FormID == item.FormID);
        //     if (!result) {
        //         removedItemIndex.push(item.FormID);
        //     }
        // });

        // removedItemIndex.forEach((id) => {
        //     this.gridTableList = this.gridTableList.filter(i => i.FormID != id);
        // });

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
        this.gridTableList.sort((a, b) => a.FormName.localeCompare(b.FormName, 'es', { sensitivity: 'base' }));
    }

    /* on click except button and assign them 0 value*/
    onExcemptClick() {
        if (this.gridTableList.length > 0) {
            this.gridTableList.forEach((data) => {
                if (data.IsSelected == true) {
                    data.ClientEarnedPoints = 0;
                    data.MemberEarnedPoints = 0;
                    data.LeadEarnedPoints = 0;
                }
            })
        }
    }

    /* call when click on search button */
    getSearchedItem(event: RewardProgramActivitiesEarningRuleExceptionResultViewModel) {

        var result = this.gridTableList.find(i => i.FormID == event.FormID)
        if (!result) {
            let gridTableobj: any = {};
            gridTableobj.FormName = event.FormName;

            gridTableobj.BranchName = event.BranchName;

            gridTableobj.FormID = event.FormID;
            gridTableobj.ClientEarnedPoints = event.ClientEarnedPoints;
            gridTableobj.LeadEarnedPoints = event.LeadEarnedPoints;
            gridTableobj.MemberEarnedPoints = event.MemberEarnedPoints;
            gridTableobj.IsSelected = event.IsSelected;
            gridTableobj.BranchID = event.BranchID;
            this.gridTableList.push(gridTableobj);
        }
        if (result != undefined) {
            this.gridTableList = this.gridTableList.filter(i => i.FormID == result.FormID);
        }
    }

    /* delete all selected items */
    onDeleteAllClick() {
        // this.gridTableList = this.gridTableList.filter(c => c.IsSelected != true)
        // this.isDeleteExemptedbtnDisabled = false;
        // this.isSelectAllItemTypes = false;
        let selectedItemList = this.gridTableList.filter(c => c.IsSelected == true);
        this.gridTableList = this.gridTableList.filter(c => c.IsSelected != true);

        if(selectedItemList.length > 0){
            selectedItemList.forEach((selectedItem)=>{
            this.searchItemTypeList = this.searchItemTypeList.filter(i => i.FormID != selectedItem.FormID)
            });
         }

        this.copySearchItemTypeList = JSON.parse(JSON.stringify(this.searchItemTypeList));
        this.isDeleteExemptedbtnDisabled = false;
        this.isSelectAllItemTypes = false;
    }

    /** close exception list dialog **/
    closeDialog() {
        this.dialogRef.close();
    }

    /** check empty field validation **/
    onValidationCheck() {
        this.gridTableList.forEach((gridTable) => {
            var result = this.searchItemTypeList.find((i => i.FormID == gridTable.FormID));
            if (result) {
                result.ClientEarnedPoints = gridTable.ClientEarnedPoints;
                result.MemberEarnedPoints = gridTable.MemberEarnedPoints;
                result.LeadEarnedPoints = gridTable.LeadEarnedPoints;
            }
        });
        setTimeout(() => {
            var isAnyMemberEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.MemberEarnedPoints.toString() == "");
            var isAnyClientEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.ClientEarnedPoints.toString() == "");
            var isAnyLeadEarnedPointsIsNUll: boolean = this.gridTableList.some(i => i.LeadEarnedPoints.toString() == "");

            if (isAnyMemberEarnedPointsIsNUll || isAnyClientEarnedPointsIsNUll || isAnyLeadEarnedPointsIsNUll) {
                this.isShowErrorMessage = true;
            }
            if (!isAnyMemberEarnedPointsIsNUll && !isAnyClientEarnedPointsIsNUll && !isAnyLeadEarnedPointsIsNUll) {
                this.isShowErrorMessage = false;
            }
        }, 500);
    }

    onItemTypeSelectionChange() {
        var isSelected = this.gridTableList.filter(mc => mc.IsSelected);
        this.isDeleteExemptedbtnDisabled = isSelected && isSelected.length > 0 ? true : false;
        this.isSelectAllItemTypes = isSelected && isSelected.length == this.gridTableList.length ? true : false;
    }

    onAllItemTypeSelectionChange(event: any) {

          //here we check if any branch is selected in filter than only
          if (this.selectedSearchBranchList.length > 0) {
            this.selectedSearchBranchList.forEach((selectedBranch) => {
                 this.gridTableList.forEach((item)=>{
                  if(selectedBranch.BranchID == item.BranchID){
                    item.IsSelected = event;
                  }
                });
            })
        } else {
            this.gridTableList.forEach(element => {
                element.IsSelected = event;
            });
        }

        if (this.gridTableList.length > 0) {
            this.isDeleteExemptedbtnDisabled = event;
        }
        // this.gridTableList.forEach(element => {
        //     element.IsSelected = event;
        // });
        // if (this.gridTableList.length > 0) {
        //     this.isDeleteExemptedbtnDisabled = event;
        // }
    }

    // display the item name in autocomplete search
    displayItemName(item?: RewardProgramActivityExceptionRuleModel): string | undefined {
        return item ? typeof (item) === "object" ? item.FormName : item : undefined;
    }

    /** Delete single item **/
    onDeleteItem(index: any , data:any) {
        this.gridTableList.splice(index, 1);

        var result = this.searchItemTypeList.findIndex(c => c.FormID == data.FormID);
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

    /** Emit the final list to save reward program on save click **/
    onSave() {
        this.onValidationCheck();
        if (!this.isShowErrorMessage) {
            this.exceptionList.emit(this.gridTableList);
            this.closeDialog();
        }
    }

    //call this function when search by name string is empty
    addExceptionListSearchByName() {
        this.searchItemTypeList.forEach((gridListData: any) => {
            var result = this.gridTableList.find(i => i.FormID == gridListData.FormID)
            if (!result) {
                let gridTableobj: any = {};
                gridTableobj.FormName = gridListData.FormName;
                gridTableobj.BranchName = gridListData.BranchName;
                gridTableobj.FormID = gridListData.FormID;
                gridTableobj.ClientEarnedPoints = gridListData.ClientEarnedPoints;
                gridTableobj.LeadEarnedPoints = gridListData.LeadEarnedPoints;
                gridTableobj.MemberEarnedPoints = gridListData.MemberEarnedPoints;
                gridTableobj.IsSelected = false;
                gridTableobj.BranchID = gridListData.BranchID;
                this.gridTableList.push(JSON.parse(JSON.stringify(gridTableobj)));
            }
        });
        this.searchItemTypeList = JSON.parse(JSON.stringify(this.gridTableList));

        //here we are assiging the class to autocomplete search according to branch selection
        if (this.selectedSearchBranchList.length > 0) {
            this.copySearchItemTypeList = [];
            this.selectedSearchBranchList.forEach((branch: any) => {
                if (branch != 0) {
                    var result = this.selectedItemTypeList.filter((i => i.FormBranchID == branch.BranchID));
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
}
