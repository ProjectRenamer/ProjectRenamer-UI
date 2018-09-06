import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpErrorResponse } from '@angular/common/http';
import { CustomError } from '@app/core/error-handling/custom-error';
import { environment } from '@env/environment';

import { saveAs } from 'file-saver/FileSaver';

import { CustomNotificationService } from '@app/core/services/custom-notification.service';
import { StorageService } from '@app/core/services/storage-service';

import { GenerateProjectRequest, KeyValuePair } from '@app/home/requests/GenerateProjectRequest';
import { GenerateProjectResponse } from '@app/home/responses/GenerateProjectResponse';
import { DownloadProjectRequest } from '@app/home/requests/DownloadProjectReqeust';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  generateProjectRequest: GenerateProjectRequest = new GenerateProjectRequest();
  currentKV: KeyValuePair<string, string> = new KeyValuePair<string, string>();
  webApiUrl: string = '';
  renamerApiFixed = environment.renamerApiFixed;

  constructor(private httpClient: HttpClient, private storageService: StorageService, private customNotificationService: CustomNotificationService) {
    if (this.renamerApiFixed) {
      this.webApiUrl = environment.renamerApiUrl;
    }
    else {
      this.webApiUrl = this.storageService.GetValueFromLocal(this.storageService.webApiUrlKey);
    }
  }


  ngOnInit() {
  }

  add(placeHolder: string, val: string) {
    this.generateProjectRequest.renamePairs.push({ key: placeHolder, value: val });
    this.currentKV = { key: '', value: '' };
  }

  remove(index: number) {
    this.generateProjectRequest.renamePairs.splice(index, 1);
  }

  generate() {
    if (this.webApiUrl === null || this.webApiUrl === '') {
      throw new CustomError('Web Api End-Point must be expressed');
    }

    this.customNotificationService.Info({ MessageContent: 'Project refactor request is sent to server' });

    this.httpClient
      .post<GenerateProjectResponse>(this.webApiUrl + '/generator/', this.generateProjectRequest)
      .subscribe((response) => {
        this.customNotificationService.Info({ MessageContent: 'Project download process will be start' });
        let downloadProjectRequest = new DownloadProjectRequest(response.token);
        this.httpClient.post(this.webApiUrl + '/download/', downloadProjectRequest, { responseType: 'blob' })
          .subscribe((response) => {
            const blob = new Blob([response], { type: 'application/zip' });
            let fileName = String(Date.now()) + ".zip";
            saveAs(blob, fileName);

            this.customNotificationService.Success({ MessageContent: 'Operation is completed' });
          },
            (err: HttpErrorResponse) => {
              if (err.status === 404) {
                throw new CustomError('Token Not Valid');
              }
              throw err;
            }
          );
      }
      );
  }

  setWebApiUrl(url: string) {
    this.webApiUrl = url;
    this.storageService.SaveValueToLocal(this.storageService.webApiUrlKey, url, new Date(Date.now() + environment.expireTime));
  }
}