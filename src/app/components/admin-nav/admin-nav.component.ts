import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit {

  isAdmin:boolean=true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.isAdmin=false;
    localStorage.setItem('aadhaarId',"");
    Swal.fire({title:"Are you sure?",icon:"warning",showCancelButton:true,confirmButtonText:"Yes"}).then((result) => {
      if(result.value){
        Swal.fire({title:"Thank you!",text:"Have a great day",icon:"info",showConfirmButton: false,timer:2300})
        setTimeout(() => 
        {
              this.router.navigate(['/alogin']);
        },
        2000); 
      }
    else{
      this.isAdmin=true;
      this.router.navigate([this.router.url]);
    }});
  }

}
