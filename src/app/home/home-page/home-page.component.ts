import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { HttpErrorResponse } from '@angular/common/http';
import { CustomError } from '@app/core/error-handling/custom-error';
import { environment } from '@env/environment';

import { saveAs } from 'file-saver/FileSaver';

import { CustomSpinnerService } from '@app/core/services/custom-spinner.service';
import { CustomNotificationService } from '@app/core/services/custom-notification.service';
import { StorageService } from '@app/core/services/storage-service';

import { GenerateProjectOverGitRequest } from '@app/home/requests/generate-project-over-git-request';
import { GenerateProjectResponse } from '@app/home/responses/GenerateProjectResponse';
import { DownloadProjectRequest } from '@app/home/requests/download-project-request';
import { GenerateProjectOverZipRequest, KeyValuePair } from '../requests/generate-project--over-zip-request';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  generateProjectOverGitRequest: GenerateProjectOverGitRequest = new GenerateProjectOverGitRequest();
  generateProjectOverZipRequest: GenerateProjectOverZipRequest = new GenerateProjectOverZipRequest();
  currentKV: KeyValuePair<string, string> = new KeyValuePair<string, string>();
  keyValuePairs: KeyValuePair<string, string>[] = [];
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
    this.keyValuePairs.push({ key: placeHolder, value: val });
    this.currentKV = { key: '', value: '' };
  }

  remove(index: number) {
    this.keyValuePairs.splice(index, 1);
  }

  generate() {
    if (this.webApiUrl === null || this.webApiUrl === '') {
      throw new CustomError('Web Api End-Point must be expressed');
    }

    this.generateProjectOverGitRequest.renamePairs = this.keyValuePairs;
    this.generateProjectOverZipRequest.renamePairs = this.keyValuePairs;

    if (this.generateProjectOverGitRequest.repositoryLink != null
      && this.generateProjectOverGitRequest.repositoryLink != "") {
      this.generateOverGit();
    }
    else if (this.generateProjectOverZipRequest.file != null) {
      this.generateOverZip();
    }
    else {
      throw new CustomError("Repository Link should not be empty or File should bi provided");
    }
  }

  generateOverZip() {
    this.customSpinnerService.Show();

    this.customNotificationService.Info({ MessageContent: 'Project refactor request is sent to server' });

    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    let params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('file', this.generateProjectOverZipRequest.file);
    formData.append('renamePairs', String(this.generateProjectOverZipRequest.renamePairs));

    this.httpClient
      .post<GenerateProjectResponse>(this.webApiUrl + '/generate-over-zip/', formData, { headers: headers, params: params })
      .subscribe((generatorResponse) => {
        this.customNotificationService.Info({ MessageContent: 'Project download process will be start' });
        const downloadProjectRequest = new DownloadProjectRequest(generatorResponse.token);
        this.download(downloadProjectRequest);
      }
      );
  }

  generateOverGit() {

    this.customSpinnerService.Show();

    this.customNotificationService.Info({ MessageContent: 'Project refactor request is sent to server' });

    this.httpClient
      .post<GenerateProjectResponse>(this.webApiUrl + '/generate-over-git/', this.generateProjectOverGitRequest)
      .subscribe((generatorResponse) => {
        this.customNotificationService.Info({ MessageContent: 'Project download process will be start' });
        const downloadProjectRequest = new DownloadProjectRequest(generatorResponse.token);
        this.download(downloadProjectRequest);
      }
      );
  }

  download(downloadProjectRequest: DownloadProjectRequest) {
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

  setWebApiUrl(url: string) {
    this.webApiUrl = url;
    this.storageService.SaveValueToLocal(this.storageService.webApiUrlKey, url, new Date(Date.now() + environment.expireTime));
  }
}
