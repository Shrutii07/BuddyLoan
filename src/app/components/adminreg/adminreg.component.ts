import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Admin} from '../../domain/admin'

import Swal from 'sweetalert2';
//import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoanService } from 'src/app/services/loan.service';
import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-adminreg',
  templateUrl: './adminreg.component.html',
  styleUrls: ['./adminreg.component.scss']
})
export class AdminregComponent implements OnInit {

  private admin:Admin= new Admin();

  adminForm = this.fb.group({
    employeeId: new FormControl(), 
    password: new FormControl(),
    name:new FormControl(),
    email:new FormControl(),
    image:new FormControl()
   
  });

  submitted = false;
  user: Admin = {
    employeeId: "",
    password: "",
    name:"",
    email:"",
    image:""
  };

  constructor(private fb: FormBuilder, private router: Router,private http:HttpClient, private service: AdminService){

  }

  ngOnInit(): void {
    this.adminForm  = this.fb.group({
      employeeId: new FormControl(this.user.employeeId, [Validators.required,Validators.pattern(/^[R][B][S][0-9]{4}$/)]),
      name:new FormControl(this.user.name, [Validators.required,Validators.pattern(/^[A-Z]{1}[a-zA-Z][a-zA-Z ]*$/),Validators.minLength(4),Validators.maxLength(20)]),
      email: new FormControl(this.user.name, [Validators.required,Validators.pattern(/^[\w-\.]+@(([n][a][t][w][e][s][t]+\.+[\w-]{2,4})|([r][b][o][s]+\.[c][o]+\.[u][k]))$/)]),
      password: new FormControl(this.user.password, [Validators.required,Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/)]),
      image: new FormControl(this.user.image, [Validators.required])
    });
  }
  
  submit(){
    if(this.adminForm.valid){
          this.admin.employeeId=this.adminForm.value.employeeId;
          this.admin.email = this.adminForm.value.email;
          this.admin.name = this.adminForm.value.name;
          this.admin.password = this.adminForm.value.password;
          this.admin.image = this.adminForm.value.image;
          this.service.createAdmin(this.admin).subscribe(data => console.log("Posted"))
          console.log(this.admin);
          Swal.fire('Registration Successfull','Please Login', 'success').then((result) => { 
            this.adminForm.reset();
            this.router.navigate(['/alogin']);
          });
      }
      else{
        this.adminForm.reset();
        Swal.fire('Registration Failed','Please try again', 'error');
      }
      
    }

}
