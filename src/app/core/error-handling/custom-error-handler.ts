import { Injectable, ErrorHandler } from '@angular/core';
import { CustomError } from './custom-error';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor() { }

    handleError(error: any): void {
        if (error.error !== undefined && error.error !== null) {
            error = error.error;
        }
        if (error.friendlyMessage !== undefined && error.friendlyMessage !== null) {
            console.log(error);
            alert(error.friendlyMessage);
        }
        else if (error.status === 401) {
            alert('Yetkisiz erişim');
            console.log(error);
        }
        else {
            alert('Beklenmedik bir hata oluştu');
            console.log(error);
        }
    }
}
