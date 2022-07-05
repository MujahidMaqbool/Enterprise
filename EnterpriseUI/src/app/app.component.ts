import { Component } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { LoaderService } from './services/app.loader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  
})
export class AppComponent {

  constructor(private _router: Router, private _loaderService: LoaderService ) {
  }
  ngOnInit() {
    this._router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this._loaderService.show();
      } else if (event instanceof RouteConfigLoadEnd) {
        this._loaderService.hide();
      }
    });
  }
}
