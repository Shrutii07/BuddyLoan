import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Admin} from '../../domain/admin'

import Swal from 'sweetalert2';
//import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoanService } from 'src/app/services/loan.service';


@Component({
  selector: 'app-login',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminComponent implements OnInit {

  adminForm = this.fb.group({
    employeeId: new FormControl(), 
    password: new FormControl()
   
  });

  submitted = false;
  user: Admin = {
    employeeId: "",
    password: ""
    
  };
  constructor(private fb: FormBuilder, private router: Router,private http:HttpClient, private service: LoanService){

  }
  ngOnInit(): void {
    
    this.adminForm  = this.fb.group({
      employeeId: new FormControl(this.user.employeeId, [Validators.required,Validators.pattern(/^[R][B][S][0-9]{4}$/)]),
      password: new FormControl(this.user.password, [Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/)]),
      
    });
  }

 
  submit(){
    this.submitted = true;
    this.service.getAdminDetails(this.adminForm .value.employeeId).subscribe(res=>{
        if(res != null){
          
        if(res.employeeId===this.adminForm .value.employeeId && res.password===this.adminForm .value.password){
          localStorage.setItem('employeeId',this.adminForm .value.employeeId);
          this.alertWithSuccess();
        } 
        else{
          Swal.fire('Invalid Login','Check Credentials', 'error');
        }
      }
        else{
          Swal.fire('Invalid Login','Check Credentials', 'error');
        }
   }), (error:any)=>{
    Swal.fire('Something is wrong','', 'error');
    //console.log(error);
   }
  }
  alertWithSuccess() {
    Swal.fire('Logged in succesfully','', 'success').then((result) => {
      if (result.value) {
        this.router.navigate(['/rbs/panel']);
    }});

  }

}
