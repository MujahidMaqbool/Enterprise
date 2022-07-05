import { DynamicEnvironment } from './dynamic-environment';

class Environment extends DynamicEnvironment {

  public production: boolean;
  public version:'0.0.0';
  constructor() {
    super();
    this.production = false;
  }
}

export const environment = new Environment();