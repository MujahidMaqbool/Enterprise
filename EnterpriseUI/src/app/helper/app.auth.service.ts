import { Injectable } from "@angular/core";
import { variables } from "./config/app.variable";
import { HttpService } from "@app/services/app.http.service";
import { ActivatedRoute } from "@angular/router";
import { ModulePermission } from "@app/models/common.model";
import { StaffApi } from "./config/app.webapi";

@Injectable({ providedIn: 'root' })

export class AuthService {

    constructor(private _httpService: HttpService,public _route: ActivatedRoute) { }

    public rolePermission: ModulePermission[] = [];

    public static setFavViewProduct(favViewIndexes: []) {
        localStorage.setItem('ProductFavViewIndexes', JSON.stringify(favViewIndexes) );
    }
    public static deleteFavViewProduct() {
      localStorage.removeItem('ProductFavViewIndexes');

    }
    public static getFavViewProduct() {
      return localStorage.getItem("ProductFavViewIndexes");
    }

    public static setAccessToken(accessToken: string) {
        localStorage.setItem(variables.Access_Token, accessToken);
    }

    public static getAccessToken() {
        return localStorage.getItem(variables.Access_Token);
    }

    public static setStaffID(staffID: any) {
        localStorage.setItem(variables.staffID, staffID);
    }

    public static getStaffID() {
        return localStorage.getItem(variables.staffID);
    }


    public static isUserLoggedIn() {
        if (localStorage.getItem(variables.Access_Token)) {
            return true;
        }
        return false;
    }

    public setPermissions(_rolePermissions: ModulePermission[]) {
        this.rolePermission = _rolePermissions;
    }

    public getPermissions() {
        return this._httpService.get(StaffApi.getEnterpriseStaffPermissions);
    }

    public hasModulePermission(moduleId: number) {
        let hasPermission = false;
        if (this.rolePermission.some(m => m.ModuleID === moduleId)) {
            hasPermission = true;
        }
        return hasPermission;
    }

    public hasPagePermission(moduleId: number, pageId: number) {
        let hasPermission = false;
        /* Find matching module and then find page in ModulePageList */
        let module = this.rolePermission.find(m => m.ModuleID === moduleId);
        if (module && module.ModulePageList.some(mp => mp.ModulePageID === pageId)) {
            hasPermission = true;
        }
        return hasPermission;
    }

    public static logout() {
        localStorage.removeItem(variables.Access_Token);
        localStorage.removeItem(variables.staffID);
        localStorage.removeItem(variables.companyID);
        localStorage.removeItem("ProductFavViewIndexes");
    }

}
