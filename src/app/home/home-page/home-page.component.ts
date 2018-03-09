import { Component, OnInit, KeyValueDiffers } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { HttpErrorResponse } from '@angular/common/http';
import { CustomError } from '@app/core/error-handling/custom-error';
import { environment } from '@env/environment';

import { GenerateProjectRequest, KeyValuePair } from '@app/home/requests/GenerateProjectRequest';
import { GenerateProjectResponse } from '@app/home/responses/GenerateProjectResponse';
import { DownloadProjectRequest } from '@app/home/requests/DownloadProjectReqeust';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private httpClient: HttpClient) {
  }

  generateProjectRequest: GenerateProjectRequest = new GenerateProjectRequest();
  currentKV: KeyValuePair<string, string> = new KeyValuePair<string, string>();

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
    this.httpClient
      .post<GenerateProjectResponse>(environment.DotNetTemplateUrl + '/generator/', this.generateProjectRequest)
      .subscribe((response) => {
        let downloadProjectRequest = new DownloadProjectRequest(response.token);
        this.httpClient.post(environment.DotNetTemplateUrl + '/download/', downloadProjectRequest, { responseType: 'blob' })
          .subscribe((response) => {
            const blob = new Blob([response], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
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
}