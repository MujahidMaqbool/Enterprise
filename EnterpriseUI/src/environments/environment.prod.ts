// export const environment = {
//   production: true,
//   imageUrl: 'https://fileswellyxproductioneu.s3.eu-west-2.amazonaws.com/Images/CP{ImagePath}/',
//   qrCodeUrl: 'https://fileswellyxproductioneu.s3.eu-west-2.amazonaws.com/QRCode/',
//   apiUrl: 'https://api.wellyx.com/api/Core/',
//   fileUrl: 'https://fileswellyxproductioneu.s3.eu-west-2.amazonaws.com/Documents/CP{ImagePath}/',
//   stripeRedirectUrl: 'https://core.wellyx.com/setup/configurations/payments',
//   stripeConnectUrl: 'https://connect.stripe.com',
//   formUrl: 'https://web.wellyx.com/{CompanyID}/{BranchID}/{SourceType}/{FormID}/{CustomerFormID}',
//   goCardlessConnectUrl: 'https://connect.gocardless.com',
//   tinyUrl: 'https://tinyurl.com/api-create.php?url=',
//   ENVName: 'live'
// };
// export const environment = {
//     version: '0.0.135',
//     production: true
//   };
import { DynamicEnvironment } from './dynamic-environment';

class Environment extends DynamicEnvironment {

  public production: boolean;
  public version:'0.0.0';
  constructor() {
    super();
    this.production = true;
  }
}

export const environment = new Environment();