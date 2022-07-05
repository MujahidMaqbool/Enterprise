import { Component, Output, EventEmitter, Input, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'change-confirmation',
    templateUrl: 'alert.confirmation.component.html'
})
export class AlertConfirmationComponent {

    @Input() Title: string;
    @Input() Message: string;
    @Input() Heading: string;
    @Input() showButton: boolean = false;
    @Input() isChangeIcon: boolean = false;
    @Input() showConfirmCancelButton: boolean = false; 


    // @Input()
    // onConfirm = new EventEmitter<boolean>();

    @Output()
    confirmChange = new EventEmitter<boolean>();

    constructor(public dialogRef: MatDialogRef<AlertConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public receiveData: any) { 
           if(this.receiveData.showConfirmCancelButton){
               this.showConfirmCancelButton =  true;
           }
        }

    ngOnInit(): void {
  
    }

    onYes() {
        this.confirmChange.emit(true);
        this.closePopup();
    }

    onNo() {
        this.confirmChange.emit(false);
        this.closePopup();
    }

    closePopup() {
        this.dialogRef.close();
    }

}
