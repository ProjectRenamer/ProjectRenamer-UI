import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export class CustomNotificationMessage {
    public MessageTitle?= '';
    public MessageContent?= '';
}

@Injectable()
export class CustomNotificationService {
    private errorNotification = new Subject<CustomNotificationMessage>();
    private warningNotification = new Subject<CustomNotificationMessage>();
    private infoNotification = new Subject<CustomNotificationMessage>();
    private successNotification = new Subject<CustomNotificationMessage>();

    public Error(notificationMessage: CustomNotificationMessage) {
        this.errorNotification.next(notificationMessage);
    }

    public Warning(notificationMessage: CustomNotificationMessage) {
        this.warningNotification.next(notificationMessage);
    }

    public Info(notificationMessage: CustomNotificationMessage) {
        this.infoNotification.next(notificationMessage);
    }

    public Success(notificationMessage: CustomNotificationMessage) {
        this.successNotification.next(notificationMessage);
    }

    public ObserveError(): Observable<CustomNotificationMessage> {
        return this.errorNotification.asObservable();
    }

    public ObserveWarning(): Observable<CustomNotificationMessage> {
        return this.warningNotification.asObservable();
    }

    public ObserveInfo(): Observable<CustomNotificationMessage> {
        return this.infoNotification.asObservable();
    }

    public ObserveSuccess(): Observable<CustomNotificationMessage> {
        return this.successNotification.asObservable();
    }
}
