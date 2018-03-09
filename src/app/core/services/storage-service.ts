import { Injectable } from '@angular/core';


@Injectable()
export class StorageService {
    public webApiUrlKey = 'project-renamer-url';

    private expireKey = '-expire';

    public SaveValueToLocal(key: string, value: string, expireTime: Date): void {
        localStorage.setItem(key, value);
        localStorage.setItem(key + this.expireKey, expireTime.toString());
    }

    public SaveArrayValuesToLocal(key: string, values: string[], expireTime: Date): void {
        localStorage.setItem(key, values.join('~'));
        localStorage.setItem(key + this.expireKey, expireTime.toString());
    }

    public DeleteValueFromLocal(key: string): void {
        localStorage.removeItem(key);
        localStorage.removeItem(key + this.expireKey);
    }

    public GetValueFromLocal(key: string): string {
        const expireStr = localStorage.getItem(key + this.expireKey);
        if (expireStr === undefined) {
            this.DeleteValueFromLocal(key);
        }
        else {
            const expire = Date.parse(expireStr);
            if (expire < Date.now()) {
                this.DeleteValueFromLocal(key);
            }
        }

        const tokenValue = localStorage.getItem(key);
        return tokenValue;
    }

    public GetArrayValuesFromLocal(key: string): string[] {
        const expireStr = localStorage.getItem(key + this.expireKey);
        if (expireStr === undefined) {
            this.DeleteValueFromLocal(key);
        }
        else if (expireStr === null) {
            this.DeleteValueFromLocal(key);
        }
        else {
            const expire = Date.parse(expireStr);
            if (expire < Date.now()) {
                this.DeleteValueFromLocal(key);
            }
        }

        const valuesStr = localStorage.getItem(key);
        let result = [];
        if (valuesStr !== undefined && valuesStr !== null) {
            result = valuesStr.split('~');
        }
        return result;
    }

    public IsValueExist(key: string): boolean {
        const valuesStr = localStorage.getItem(key);
        return (valuesStr != undefined && valuesStr != null && valuesStr != '');
    }
}