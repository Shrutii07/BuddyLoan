import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Loan } from '../domain/loan';

@Injectable({
  providedIn: 'root'
})

export class HistoryService{
  private loanServeUrl = environment.loanBaseUrl;

  constructor(private http: HttpClient) { }

  private errorHandler(err: HttpErrorResponse){
    return throwError (() => { new Error('Failed to place the request.') });
  }
  
  getHistoryByLoanId(id:number): Observable<History[]>{
    return this.http.get<History[]>(`${this.loanServeUrl}/history?loanId=${id}`).pipe(catchError(this.errorHandler));
  }

  getAllHistoryByCustomerId(id:string): Observable<History[]>{
    return this.http.get<History[]>(`${this.loanServeUrl}/customers/${id}/history`).pipe(catchError(this.errorHandler));
  }

  getLoansByCustomerId(id:string):Observable<Loan[]>{
    return this.http.get<Loan[]>(`${this.loanServeUrl}/customers/${id}/loans`).pipe(catchError(this.errorHandler));
  }

  

  

}

