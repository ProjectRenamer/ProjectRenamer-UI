import { Component, ViewChild } from '@angular/core';

import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { CustomNotificationService } from '@app/core/services/custom-notification.service';
import { CustomSpinnerService } from '@app/core/services/custom-spinner.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  token = localStorage.getItem('auth-token');
  spinnerMessage = '';


  @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

  constructor(private toastrService: ToastrService,
    private customNotificationService: CustomNotificationService,
    private customSpinnerService: CustomSpinnerService,
    private spinner: NgxSpinnerService) {
    this.toastrService.overlayContainer = this.toastContainer;

    this.customNotificationService.ObserveError().subscribe(message => {
      this.toastrService.error(message.MessageContent, message.MessageTitle);
    });

    this.customNotificationService.ObserveWarning().subscribe(message => {
      this.toastrService.warning(message.MessageContent, message.MessageTitle);
    });

    this.customNotificationService.ObserveInfo().subscribe(message => {
      this.toastrService.info(message.MessageContent, message.MessageTitle);
    });

    this.customNotificationService.ObserveSuccess().subscribe(message => {
      this.toastrService.success(message.MessageContent, message.MessageTitle);
    });

    this.customSpinnerService.ObserveShow().subscribe(message => {
      this.spinnerMessage = message;
      this.spinner.show();
    });

    this.customSpinnerService.ObserveHide().subscribe(() => {
      this.spinner.hide();
    });
  }
}
