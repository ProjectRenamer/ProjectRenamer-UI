import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { homeRouter } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  imports: [
    homeRouter,
    SharedModule
  ],
  declarations: [HomePageComponent]
})
export class HomeModule { }
