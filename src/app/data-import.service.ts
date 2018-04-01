import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';;


import 'rxjs/add/operator/toPromise';
import { catchError, map, tap } from 'rxjs/operators';

import { MapOption } from './app.component';
import { ImportType } from './app.component';
import { ErrorType } from './app.component';
import { Observable } from 'rxjs/Observable';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class DataImportService {

  private headers = new Headers({'Content-Type': 'application/json'});

  private MapFieldOptionsUrl = 'api/MapFieldOptions';  // URL to web api

  private PartsMasterMapFields = 'api/PartsMasterMapFields';

  private CompaniesMapFields = 'api/CompaniesMapFields';

  private ImportTypesUrl = 'api/ImportTypes';

  private ErrorListUrl = 'api/ErrorList';



  constructor(
    private http: HttpClient) { }





  /*getMapFieldOptions(): Observable<MapOption[]> {
    return this.http.get<MapOption[]>(this.MapFieldOptionsUrl);
    /*.pipe(
      tap(MapFieldOptions => this.log(`fetched import types`)),
      catchError(this.handleError('getImportTypes', []))
    );*/
/*}*/


  getMapFieldOptions(ImportId: number): Observable<MapOption[]> {
     switch (ImportId) {
     case 1 : {
       return this.http.get<MapOption[]>(this.PartsMasterMapFields);
     }

     case 2 : {
      return this.http.get<MapOption[]>(this.PartsMasterMapFields);
     }

     case 3: {
       return this.http.get<MapOption[]>(this.CompaniesMapFields);
     }

     default : {
      return this.http.get<MapOption[]>(this.CompaniesMapFields);
    }
      /*.pipe(
        tap(MapFieldOptions => this.log(`fetched import types`)),
        catchError(this.handleError('getImportTypes', []))
       );*/
     }
    }




  getImportTypes (): Observable<ImportType[]> {
    return this.http.get<ImportType[]>(this.ImportTypesUrl);
      /*.pipe(
        tap(ImportTypes => this.log(`fetched import types`)),
        catchError(this.handleError('getImportTypes', []))
      );*/
  }


  getImportValidation (ImportId: number, dataset: any[]): Observable<ErrorType[]> {
    return this.http.get<ErrorType[]>(this.ErrorListUrl);
      /*.pipe(
        tap(ImportTypes => this.log(`fetched import types`)),
        catchError(this.handleError('getImportTypes', []))
      );*/
  }





  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

