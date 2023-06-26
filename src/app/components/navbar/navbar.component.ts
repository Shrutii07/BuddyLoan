import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { min } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn:boolean =true;
  aadhaarId:string;
  
  constructor(private router: Router, private service:AdminService) { }

  ngOnInit(): void {
    this.aadhaarId = JSON.parse(localStorage.getItem('aadhaarId') || '{}');
    
  }

  onLogout(){
    this.isLoggedIn=false;
    localStorage.setItem('aadhaarId',"");
    
    Swal.fire({
      title: "Feedback",
      text: "We Love to hear from you!",
      input: 'range',
      showCancelButton: true ,
      confirmButtonColor: '#874277',
      inputAttributes: { min:"0",max:"10",step: "1"},
      inputValue: 8

      
      })
      .then((result) => {
      if (result.value) {
         // Swal.fire('Result:'+result.value);
          this.service.updateFeedback(this.aadhaarId,parseInt(result.value)).subscribe(
            data => {console.log(data)},
            err => console.log(err)
          )

          Swal.fire({title:"Thank you for Rating",text:"Have a wonderful day",icon:"success",showConfirmButton: false,timer:2300})
          
        setTimeout(() => 
        {
              this.router.navigate(['/login']);
        },
        2000);
        
      }
      else{
        this.isLoggedIn=true;
       
        this.router.navigate([this.router.url]);
      }});};
   // Swal.fire({title:"Are you sure?",icon:"warning",showCancelButton:true,confirmButtonText:"Yes"}).then((result) => {
   //   if(result.value){
    //    Swal.fire({title:"Thank you for using our Services",text:"Have a great day",icon:"info",showConfirmButton: false,timer:2300})
     //   setTimeout(() => 
      //  {
     //         this.router.navigate(['/login']);
     //   },
     //   2000);
        
    //  }
    
  }

