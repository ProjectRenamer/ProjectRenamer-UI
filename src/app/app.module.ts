import { NgModule, ErrorHandler } from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { SharedModule } from '@app/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { appRouter } from './app.routing';

import { CustomErrorHandler } from '@app/core/error-handling/custom-error-handler';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    appRouter,
    CoreModule,
    SharedModule,
    ToastrModule.forRoot(
      {
        onActivateTick: true,
        closeButton: true
      }
    ),
    NgxSpinnerModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
