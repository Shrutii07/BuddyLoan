import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Login} from '../../domain/Login'

import Swal from 'sweetalert2';
//import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoanService } from 'src/app/services/loan.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm:FormGroup;

  

  submitted = false;
  user: Login = {
    adhaarId: "",
    password: ""
    
  };
  constructor(private fb: FormBuilder, private router: Router,private http:HttpClient, private service: LoanService){
    this.userForm = this.fb.group({
      adhaarId: new FormControl(), 
      password: new FormControl()
    });
  }
  ngOnInit(): void {
    
    this.userForm = this.fb.group({
      adhaarId: new FormControl(this.user.adhaarId, [Validators.required,Validators.pattern(/^[2-9]{1}[0-9]{11}$/)]),
      password: new FormControl(this.user.password, [Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/)]),
      
    });
  }

 
  submit(){
    this.submitted = true;
    this.service.getCusomerDetails(this.userForm.value.adhaarId).subscribe(res=>{
        if(res != null){
        if(res.aadhaarId===this.userForm.value.adhaarId && res.password===this.userForm.value.password){
          localStorage.setItem('aadhaarId',this.userForm.value.adhaarId);
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
        this.router.navigate(['/in/profile']);
    }});

  }

}
