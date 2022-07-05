//----------for view roles-----------//

export class ViewRole{
     public RoleID: number = 0;
    public RoleName: string = "";
    public RoleModuleList: RoleModuleList[] = [];
}
//----------for save module and pages list-----------//
export class SaveRoles {
    public RoleID: number = 0;
    public RoleName: string = "";
    public Description: string = "";
    public IsActive: boolean = true;
    public ModuleList: ModuleList[] = [];
}

export class ModuleList {
    public ModuleID: number = 0;
    public ModulePageList: ModulePageList[] = [];
}

export class ModulePageList {
    public ModulePageID: number;
}

//----------for Search parametes-----------//

export class RoleSearchParameter {
    public RoleName: string = "";
    public IsActive: number = 1;
}

export class RoleModuleList {
    public ModuleID: number = 0;
    public ModuleName: string = "";
    public IsModuleSelected: boolean;

    public ModulePageList: RoleModulePageList[] = [];

}

export class RoleModulePageList {
    public ModulePageID: number;
    public ModulePageName: string = "";
    public IsPageSelected: boolean;
    public IsDashboardPage: boolean;
}

export class Roles {
        RoleID: number;
        RoleName: string;
        Description: string;
        IsActive: boolean;     
}