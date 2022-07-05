
import { DynamicEnvironment } from './dynamic-environment';

class Environment extends DynamicEnvironment {

  public production: boolean;
  public apiUrl:string;
  public imageUrl:string;
  public version:'0.0.0';
  constructor() {
    super();
    this.production = false;
  
  }
}

export const environment = new Environment();
