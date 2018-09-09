import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class CustomSpinnerService {
    private showSubject = new Subject<string>();
    private hideSubject = new Subject<string>();

    public Show(message?: string) {
        if (message == null || message === undefined || message === '') {
            message = 'Please Wait';
        }
        this.showSubject.next(message);
    }

    public Hide() {
        this.hideSubject.next('');
    }

    public ObserveShow(): Observable<string> {
        return this.showSubject.asObservable();
    }

    public ObserveHide(): Observable<string> {
        return this.hideSubject.asObservable();
    }
}
