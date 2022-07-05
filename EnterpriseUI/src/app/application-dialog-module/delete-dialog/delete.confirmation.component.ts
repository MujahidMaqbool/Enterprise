﻿import { Component, Output, EventEmitter, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'delete-confirmation',
    templateUrl: './delete.confirmation.component.html'
})
export class DeleteConfirmationComponent {
    
    @Output()
    confirmDelete = new EventEmitter<boolean>();
    ConfirmButtonText: string = "Confirm";

    constructor(public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public receiveData: any) { }

    ngOnInit() {
        if(this.receiveData.ButtonText && this.receiveData.ButtonText != '') {
            this.ConfirmButtonText = this.receiveData.ButtonText;
        }
        this.receiveData.isCancelIcon = this.receiveData?.isCancelIcon ? this.receiveData.isCancelIcon : false;
    }    

    onYes() {
        this.confirmDelete.emit(true);
        this.closePopup();
    }

    onNo() {
        this.confirmDelete.emit(false);
        this.closePopup();
    }

    closePopup()
    {
        this.dialogRef.close();
    }

}