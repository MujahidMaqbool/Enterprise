import { Component, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ENU_LoginState, EnumSaleSourceType } from '@helper/config/app.enums';
import { HttpService } from '@app/services/app.http.service';
import { AccountApi } from '@helper/config/app.webapi';
import { AuthService } from '@helper/app.auth.service';
import { Messages } from '@helper/config/app.messages';
import { Login } from '../model/login.model';
import { MessageService } from '@app/services/app.message.service';
import { ApiResponse } from '@app/models/common.model';
import { DataSharingService } from '@app/services/data.sharing.service';
import { StaffAuthentication } from './model/login.model';
import { variables } from '@app/helper/config/app.variable';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  /* Model References */
  loginModel: Login;

  /* Local Members */
  returnUrl: string;
  companyName: string;
  companyLogo: string;
  loginTitle: string;
  isWelcomeStaff: boolean;
  isChooseAccount: boolean;
  isStaffLogin: boolean;
  showBackBtn: boolean;
  loginStateId: number;
  invalidEmail: boolean;
  invalidPassword: boolean;
  isShowLoginPage:boolean = false;
  loginInProcess: boolean = false;
  imagePath: string = 'assets/images/company_placeholder.jpg';
  coreAuthenticationToken:any;
  loginStates = ENU_LoginState;
  enum_AppSourceType = EnumSaleSourceType;
  logInStatus: boolean = false;
  copyEnterPriseToken :string = "";
  env : any;

  /* Error Messages */
  hasError: boolean;
  errorMessage: string;
  messages = Messages;
  /* Collection Types */
  staffCompanyList: any[];
  staffAuthentication:StaffAuthentication = new StaffAuthentication ;
  constructor(private _route: ActivatedRoute,
    private _httpService: HttpService,
    private _messageService: MessageService,
    private _router: Router,
    private _renderer: Renderer2,
    private _dataSharingService: DataSharingService) {
    this.loginModel = new Login();
    this.loginTitle = "STAFF LOGIN";
    this.loginStateId = this.loginStates.StaffLogin;
    this.isStaffLogin = true;
    this.isChooseAccount = false;
    this.isWelcomeStaff = false;
    this.invalidEmail = false;
    this.invalidPassword = false;
    this.env = environment.environment;
  }


  ngOnInit() {

    this.coreAuthenticationToken =  this._route.snapshot.queryParams.ID;
    if(this.coreAuthenticationToken != null){
      const enterPriseToken: string = AuthService.getAccessToken();

      if (enterPriseToken !=  null && enterPriseToken != "") {
        this.copyEnterPriseToken =  JSON.parse(JSON.stringify(enterPriseToken));
      }
      this.coreTokenAuthentication(this.coreAuthenticationToken);
    }
    else{
      this.isTokenValid();
    }
  }

  isTokenValid(){
    const token: string = AuthService.getAccessToken();

    if (token) {
      this._router.navigateByUrl(this.returnUrl);
    }
    else {
      this.isShowLoginPage = true ;

      this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    }
  }

  coreTokenAuthentication(coreAuthenticationToken) {
        AuthService.setAccessToken(this.coreAuthenticationToken);
        this.staffAuthentication.CoreAuthToken = coreAuthenticationToken;
        this.staffAuthentication.EnterpriseAuthToken = this.copyEnterPriseToken == null || this.copyEnterPriseToken == "" ? null : this.copyEnterPriseToken;
        this.staffAuthentication.BranchID = 0; //in enterprise case branch ID should always be 0
        this._httpService.save(AccountApi.staffAuthenticate,this.staffAuthentication).subscribe
        ((response: ApiResponse) => {
            if (response && response.MessageCode > 0) {
              AuthService.setAccessToken(response.Result.access_token);

              this.sharedCompanyID(response.Result.companyID);
              localStorage.setItem(variables.companyID, response.Result.companyID);

              this._router.navigateByUrl(this.returnUrl);
            }
            else {
              localStorage.removeItem(variables.Access_Token);
              localStorage.removeItem(variables.staffID);
              localStorage.removeItem(variables.companyID);

              this.isShowLoginPage = true;
              this._messageService.showErrorMessage(response.MessageText);
            }
          },
          error => {
            localStorage.removeItem(variables.Access_Token);
            this.isShowLoginPage = true;
            this._messageService.showErrorMessage(this.messages.Error.Login_Error);
          }
        )
      }


  //here staff can chose the company
  onChooseAccount(company: any) {
    this.loginModel.CompanyID = company.CompanyID;
    this.companyName = company.CompanyName;
    this.companyLogo = company.LogoPath;
    this.onNext();
  }

  onNext() {
    switch (this.loginStateId) {
      case (this.loginStates.StaffLogin): {
        this.getStaffCompanies();
        break;
      }

      case (this.loginStates.ChooseAccount): {
        this.showStaffWelcome();
        break;
      }

      case (this.loginStates.WelcomeStaff): {
        this.loginStaff();
        break;
      }
    }
  }

  onBack() {
    switch (this.loginStateId) {
      case (this.loginStates.ChooseAccount): {
        this.showStaffLogin();
        break;
      }

      case (this.loginStates.WelcomeStaff): {
        this.showChooseAccount();
        break;
      }
    }
  }

  onForgotPassword() {
    this.sendResetPasswordLink();
  }

  sendResetPasswordLink() {
    this._httpService.save(AccountApi.forgotPassword, { CompanyID: this.loginModel.CompanyID, Email: this.loginModel.Email }).subscribe(
      (response: ApiResponse) => {
        if (response && response.MessageCode > 0) {
          this._messageService.showSuccessMessage(this.messages.Success.Reset_Password_Email_Sent);
          this.showStaffLogin();
        }
        else {
          this._messageService.showErrorMessage(response.MessageText);
        }
      },
      error => {
        this._messageService.showErrorMessage(this.messages.Error.Reset_Password);
      }
    )
  }

   onEmailTrim(){
     this.loginModel.Email =  this.loginModel.Email.trim();
   }

  getStaffCompanies() {
    this.invalidEmail = false;
    this.loginModel.AppSourceTypeID = this.enum_AppSourceType.EnterPrise;

    if (this.loginModel.Email && this.loginModel.Email.length > 0) {
      this._httpService.save(AccountApi.staffCompany, "'" + this.loginModel.Email + "'").subscribe(
        (response: ApiResponse) => {
          if (response && response.MessageCode > 0) {
            if (response.Result) {
              this.staffCompanyList = response.Result;
              this.staffCompanyList.forEach(company => {
                if (company.CompanyLogo && company.CompanyLogo.length > 0) {
                  company.LogoPath = this.env.imageUrl.replace("{ImagePath}", company.CompanyID) + company.CompanyLogo;
                }
                else {
                  company.LogoPath = this.env.imageUrl.replace("{ImagePath}", company.CompanyID) + company.CompanyLogo;
                }
              })

              if (this.staffCompanyList.length > 1) {
                this.showChooseAccount();
                this.showBackBtn = true;
              }
              else if (this.staffCompanyList.length === 1) {
                this.companyName = this.staffCompanyList[0].CompanyName;
                this.companyLogo = this.staffCompanyList[0].LogoPath;
                this.loginModel.CompanyID = this.staffCompanyList[0].CompanyID;

                this.showStaffWelcome();
              }
            }
            else {
              this.showErrorMessage(this.messages.Validation.Email_Not_Exist);
            }
          }
          else {
            this._messageService.showErrorMessage(response.MessageText);
          }
        },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Login_Error);
        }
      )

    }
    else {
      this.invalidEmail = true;
    }

  }

  showStaffLogin() {
    this.isStaffLogin = true;
    this.isChooseAccount = false;
    this.isWelcomeStaff = false;
    this.logInStatus = false;

    this.loginStateId = this.loginStates.StaffLogin;
  }

  showChooseAccount() {
    this.loginTitle = "Select a company";
    this.isStaffLogin = false;
    this.isChooseAccount = true;
    this.isWelcomeStaff = false;
    this.logInStatus = false;
    this.loginStateId = this.loginStates.ChooseAccount;
  }

  showStaffWelcome() {
    this.loginTitle = "WELCOME";
    this.isStaffLogin = false;
    this.isChooseAccount = false;
    this.isWelcomeStaff = true;
    this.logInStatus = true;
    this.loginStateId = this.loginStates.WelcomeStaff;

    setTimeout(() => {
      this._renderer.selectRootElement("#txtPassword").focus();
    })
  }

  //staff login
  loginStaff() {
    this.invalidPassword = false;
    this.loginInProcess = true;
    if (this.loginModel.Password && this.loginModel.Password.length > 2) {
      this.login().subscribe(
        (res: ApiResponse) => {
          this.loginInProcess = false;
          if (res && res.MessageCode > 0) {
            if (res.Result) {
              localStorage.setItem(variables.companyID, this.loginModel.CompanyID.toString());
              AuthService.setAccessToken(res.Result.access_token);
              this._router.navigateByUrl(this.returnUrl);
            }
          }
          else if (res.MessageCode === -33) {
            this.showErrorMessage(this.messages.Validation.Password_Invalid);
          }
          else {
            this.showErrorMessage(res.MessageText);
          }
        },
        error => {
          this._messageService.showErrorMessage(this.messages.Error.Login_Error);
          this.loginInProcess = false;
        }
      );
    }
    else {
      this.invalidPassword = true;
    }
  }

  sharedCompanyID(companyID){
    this._dataSharingService.shareCompanyID(companyID);
  }

  login() {
    this.hasError = false;
    return this._httpService.save(AccountApi.staffLogin, this.loginModel);
  }

  showErrorMessage(message: string) {
    this.hasError = true;
    this.errorMessage = message;
  }

  // #endregion
}
