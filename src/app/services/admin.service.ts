import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Admin } from '../domain/admin';
import { Customer } from '../domain/customer';

const httpOptions={headers:new HttpHeaders({
  'Content-Type': 'application/json'
})}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminServiceUrl = environment.adminBaseUrl;
  private customerUrl = environment.loginBaseUrl;

  constructor(private http: HttpClient) { }

  private errorHandler(err: HttpErrorResponse){
    return throwError (() => { new Error('Failed to place the request.') });
  }

  createAdmin(admin: Admin):Observable<Admin>{
    return this.http.post<Admin>(`${this.adminServiceUrl}/admins`, admin, httpOptions)
    .pipe(catchError(this.errorHandler));
  }

  updateFeedback(id:string, feedback:number ):Observable<Customer>{
    return this.http.put<Customer>(`${this.customerUrl}/customers/feedback/${id}`,{
      "feedback": feedback
  },httpOptions).pipe(catchError(this.errorHandler));

  }


}
