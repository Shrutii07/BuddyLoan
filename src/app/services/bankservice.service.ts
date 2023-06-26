import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Bank} from '../domain/bank';
import { environment } from 'src/environments/environment';
import { Loan } from '../domain/loan';
import { History } from '../domain/history';

const httpOptions={headers:new HttpHeaders({
  'Content-Type': 'application/json'
})}

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private bankServerUrl = environment.bankBaseUrl;
  private loanServerUrl = environment.loanBaseUrl;

  
  

  constructor(private http: HttpClient) { }
  private errorHandler(err: HttpErrorResponse){
    return throwError (() => { new Error('Failed to place the request.') });
  }

  getHighestBankBalance(id:String):Observable<number>{
    return this.http.get<number>(`${this.bankServerUrl}/customers/${id}/balance?get=highest`);
  }

  getBankDetails(aadhaarId: String):Observable<Bank[]> {
    return this.http.get<Bank[]>(`${this.bankServerUrl}/customers/${aadhaarId}/banks`);
  }

  getLoanDetails(aadhaarId: String):Observable<Loan[]>{
    return this.http.get<Loan[]>(`${this.loanServerUrl}/customers/${aadhaarId}/loans?sort=dueDate`).pipe(catchError(this.errorHandler));
  }

  getLoanDetailsById(loanId: number):Observable<Loan>{
    return this.http.get<Loan>(`${this.loanServerUrl}/loans/${loanId}`).pipe(catchError(this.errorHandler));
  }

  getBankbyBankName(id: String, bankName: String):Observable<Bank>{
      return this.http.get<Bank>(`${this.bankServerUrl}/customers/${id}/banks?name=${bankName}`).pipe(catchError(this.errorHandler));
  }

  updatePayment(accountnum:number,updatedPay:number):Observable<Bank>{
    return this.http.put<Bank>(`${this.bankServerUrl}/banks/${accountnum}?pay=${updatedPay}`,{
      "bankBalance": updatedPay
    }, httpOptions).pipe(catchError(this.errorHandler));
  }
  
  addHistory(loanId:number, transac:History):Observable<History>{
    return this.http.post<History>(`${this.loanServerUrl}/loans/${loanId}/history`, {
      "amountPaid": transac.amountPaid,
      "isFullyPaid":transac.isFullyPaid
    }, httpOptions).pipe(catchError(this.errorHandler));
  }


  getFullPaymentAmount(loanId:number): Observable<number>{
    return this.http.get<number>(`${this.loanServerUrl}/loans/${loanId}/getRemaining`).pipe(catchError(this.errorHandler));
  }

}

