import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpErrorResponse } from '@angular/common/http';
import { CustomError } from '@app/core/error-handling/custom-error';
import { environment } from '@env/environment';

import { saveAs } from 'file-saver/FileSaver';

import { CustomNotificationService } from '@app/core/services/custom-notification.service';
import { StorageService } from '@app/core/services/storage-service';

import { GenerateProjectRequest, KeyValuePair } from '@app/home/requests/generate-project-request';
import { GenerateProjectResponse } from '@app/home/responses/GenerateProjectResponse';
import { DownloadProjectRequest } from '@app/home/requests/download-project-request';
import { CustomSpinnerService } from '@app/core/services/custom-spinner.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  generateProjectRequest: GenerateProjectRequest = new GenerateProjectRequest();
  currentKV: KeyValuePair<string, string> = new KeyValuePair<string, string>();
  webApiUrl = '';
  renamerApiFixed = environment.renamerApiFixed;

  constructor(private httpClient: HttpClient,
    private storageService: StorageService,
    private customNotificationService: CustomNotificationService,
    private customSpinnerService: CustomSpinnerService) {
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

    this.customSpinnerService.Show();

    this.customNotificationService.Info({ MessageContent: 'Project refactor request is sent to server' });

    this.httpClient
      .post<GenerateProjectResponse>(this.webApiUrl + '/generate-over-git/', this.generateProjectRequest)
      .subscribe((generatorResponse) => {
        this.customNotificationService.Info({ MessageContent: 'Project download process will be start' });
        const downloadProjectRequest = new DownloadProjectRequest(generatorResponse.token);
        this.httpClient.post(this.webApiUrl + '/download/', downloadProjectRequest, { responseType: 'blob' })
          .subscribe((downloadResponse) => {
            const blob = new Blob([downloadResponse], { type: 'application/zip' });
            const fileName = String(Date.now()) + '.zip';
            saveAs(blob, fileName);

            this.customNotificationService.Success({ MessageContent: 'Operation is completed' });

            this.customSpinnerService.Hide();
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
