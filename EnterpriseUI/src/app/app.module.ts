
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptService } from './helper/app.http.intercept.service';
import { SpinnerComponent } from './home/spinner/spinner.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormsModule } from '@angular/forms';
import { AppInitService } from './app-init.service';


var language = navigator.language;

export function init_app(appLoadService: AppInitService) {
  return () => appLoadService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppInitService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptService, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: language },
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MatSlideToggleModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    FormsModule,
   
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
