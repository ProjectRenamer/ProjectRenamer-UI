import { Injectable, ErrorHandler } from '@angular/core';
import { CustomError } from './custom-error';
import { CustomNotificationService } from '@app/core/services/custom-notification.service';
import { CustomSpinnerService } from '@app/core/services/custom-spinner.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor(private customNotificationService: CustomNotificationService, private customSpinnerService: CustomSpinnerService) { }

    handleError(error: any): void {

        console.log(error);

        this.customSpinnerService.Hide();

        if (error.error !== undefined && error.error !== null) {
            error = error.error;
        }
        if (error.friendlyMessage !== undefined && error.friendlyMessage !== null) {
            this.customNotificationService.Error({ MessageContent: error.friendlyMessage });
        }
        else if (error.status === 401) {
            this.customNotificationService.Error({ MessageContent: 'Unauthorized Request' });
        }
        else {
            this.customNotificationService.Error({ MessageContent: 'Unexpected error occurs' });
        }
    }
}
