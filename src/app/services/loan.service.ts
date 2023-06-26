import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Loan } from '../domain/loan';
import { Bank } from '../domain/bank';
import { environment } from 'src/environments/environment';
import { Customer } from '../domain/customer';
import { History } from '../domain/history';
import { Admin } from '../domain/admin';

const httpOptions={headers:new HttpHeaders({
  'Content-Type': 'application/json'
})}

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private loginServeUrl = environment.loginBaseUrl;
  private bankServeUrl = environment.bankBaseUrl;
  private loanServeUrl = environment.loanBaseUrl;
  private adminServiceUrl = environment.adminBaseUrl;

  constructor(private http: HttpClient) { }

  private errorHandler(err: HttpErrorResponse){
    return throwError (() => { new Error('Failed to place the request.') });
  }

  getLoans(id:string): Observable<Loan[]>{
    return this.http.get<Loan[]>(`${this.loanServeUrl}/customers/${id}/loans?sort=dueDate`).pipe(catchError(this.errorHandler));
  }
  
  getBankDetails(id:string): Observable<Bank[]>{
    return this.http.get<Bank[]>(`${this.bankServeUrl}/customers/${id}/banks`).pipe(catchError(this.errorHandler));
  }

  getCusomerDetails(id:string):Observable<Customer>{
    return this.http.get<Customer>(`${this.loginServeUrl}/customers/${id}`).pipe(catchError(this.errorHandler));
  }
  getAdminDetails(id:string):Observable<Admin>{
    return this.http.get<Admin>(`${this.adminServiceUrl}/admins/${id}`).pipe(catchError(this.errorHandler));
  }
  /*
  postAdminDetails(id:string,admin:Admin):Observable<Admin>{
    return this.http.post<Admin>(`${this.adminServiceUrl}/admins`,{
      "employeeId":admin.employeeId,
      "name":admin.name,
      "email":admin.email,
      "password":admin.password
    }).pipe(catchError(this.errorHandler));
  }
*/
  
  deleteLoan(id: number) {
    return this.http.delete(`${this.loanServeUrl}/loans/${id}`);
  }

  getHistoryByAadhaar(id:string): Observable<History[]>{
    return this.http.get<History[]>(`${this.loanServeUrl}/history?id=${id}`).pipe(catchError(this.errorHandler));
  }

  getHistoryByLoanId(id:number): Observable<History[]>{
    return this.http.get<History[]>(`${this.loanServeUrl}/history?loanId=${id}`).pipe(catchError(this.errorHandler));
  }

  getCompletedLoans(id:string): Observable<Loan[]>{
    return this.http.get<Loan[]>(`${this.loanServeUrl}/customers/${id}/loans?sort=complete`).pipe(catchError(this.errorHandler));
  }
  

  addLoan(aadharid:String, newLoan:Loan):Observable<Loan>{
    return this.http.post<Loan>(`${this.loanServeUrl}/customers/${aadharid}/loans`,{
        "loanType": newLoan.loanType,
        "loanAmount": newLoan.loanAmount,
        "duration":newLoan.duration,
        "interestRate": newLoan.interestRate
    },httpOptions).pipe(catchError(this.errorHandler));
  }

  

  getLoanByLoanId(custId:string, id:number): Observable<Loan>{
    return this.http.get<Loan>(`${this.loanServeUrl}/customers/${custId}/loans/${id}`).pipe(catchError(this.errorHandler));
  }

}

