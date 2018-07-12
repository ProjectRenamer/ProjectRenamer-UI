import { Injectable, ErrorHandler } from '@angular/core';
import { CustomError } from './custom-error';
import { CustomNotificationService } from '@app/core/services/custom-notification.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor(private customNotificationService: CustomNotificationService) { }

    handleError(error: any): void {

        console.log(error);

        if (error.error !== undefined && error.error !== null) {
            error = error.error;
        }
        if (error.friendlyMessage !== undefined && error.friendlyMessage !== null) {
            this.customNotificationService.Error({ MessageContent: error.friendlyMessage });
        }
        else if (error.status === 401) {
            this.customNotificationService.Error({ MessageContent: 'Yetkisiz erişim' });
        }
        else {
            this.customNotificationService.Error({ MessageContent: 'Beklenmedik bir hata oluştu' });
        }
    }
}
