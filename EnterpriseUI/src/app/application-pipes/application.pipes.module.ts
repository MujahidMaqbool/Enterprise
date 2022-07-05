import { NgModule } from "@angular/core";
import { CustomDatePipe } from "./custom.date.pipe";
import { SafeHtmlPipe } from "./safe.html.pipe";
import { TrimPipe } from "./trim";

@NgModule({
  imports: [
  ],
  declarations: [ 
    CustomDatePipe, 
    SafeHtmlPipe,
    TrimPipe
  ],
  exports: [
    CustomDatePipe,
    SafeHtmlPipe,
    TrimPipe
    
  ],
  providers: [
    CustomDatePipe,
    TrimPipe
  ]
})
export class ApplicationPipesModule {}