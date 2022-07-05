import { ImagesPlaceholder } from "./config/app.placeholder";
import { variables } from "./config/app.variable";


export class AppUtilities {
    static setImagePath(): string {
        return localStorage.getItem(variables.companyID);
    }
}