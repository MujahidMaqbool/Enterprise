import { Injectable } from '@angular/core';
import { Messages } from '@app/helper/config/app.messages';
import { CompanyInformation, DD_Branch } from '@app/models/common.model';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './app.message.service';


@Injectable({ providedIn: 'root' })
export class DataSharingService {

    messages = Messages;
    // #region Private Members
    private _companyIDSource = new BehaviorSubject<number>(0);
    private _currentBranchSource = new BehaviorSubject<DD_Branch>(new DD_Branch());
    private _companyInfoSource = new BehaviorSubject<CompanyInformation>(new CompanyInformation());

    private _packageId = new BehaviorSubject<number>(0);
    private _updateRolePermission = new BehaviorSubject<boolean>(false);
    private _isBranchLoaded = new BehaviorSubject<boolean>(false);

    _branchPermission = new BehaviorSubject<any>([]);

    // #endregion Private Members

    companyID = this._companyIDSource.asObservable();
    companyInfo = this._companyInfoSource.asObservable();

    currentBranch = this._currentBranchSource.asObservable();
    isBranchLoaded = this._isBranchLoaded.asObservable();

    // #endregion Public Members

    updateRolePermission = this._updateRolePermission.asObservable();
    branchPermission = this._branchPermission.asObservable();

    constructor(
        private _messageService: MessageService,
    ) { }

    // #region Methods

    shareUpdateRolePermission(updateRolePermission: boolean) {
        this._updateRolePermission.next(updateRolePermission)
    }

    shareCompanyID(companyID: number) {
        this._companyIDSource.next(companyID);
    }
    shareCompanyInfo(companyInfo: CompanyInformation) {
      this._companyInfoSource.next(companyInfo);
  }
    sharePackageId(packageId: number) {
        this._packageId.next(packageId);
    }

    shareBranchPermission(branchPermission: any) {
        this._branchPermission.next(branchPermission)
    }
    shareCurrentBranch(branch: DD_Branch) {
        this._currentBranchSource.next(branch);
    }
    shareBranchLoaded(isLoaded: boolean) {
        this._isBranchLoaded.next(isLoaded);
    }

    

    createPDF(reportData: any, reportName: any) {
        if (reportData.Result && reportData.Result != undefined) {
            var link = document.createElement("a");
            link.setAttribute("href", "data:application/pdf;base64," + reportData.Result);
            link.setAttribute("download", reportName + ".pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        else {
            this._messageService.showErrorMessage(this.messages.Generic_Messages.No_Record_Found);
        }
    }


}
