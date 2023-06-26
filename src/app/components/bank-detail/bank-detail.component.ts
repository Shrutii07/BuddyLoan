import { Component, OnInit } from '@angular/core';
import { Loan } from 'src/app/domain/loan';
import { Router } from '@angular/router';
import { Bank } from 'src/app/domain/bank';
import { LoanService } from 'src/app/services/loan.service';
import { Customer } from 'src/app/domain/customer';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.css']
})

export class BankDetailComponent implements OnInit {

  loans: Loan[]=[];
  localLoans: Loan[]=[];
  banks: Bank[]=[];
  completedLoans: Loan[]=[];
  showList:boolean[]=[];
  customer: Customer= new Customer();
  isActive:boolean=true;
  isAadhar:boolean=false;
  setAadhaar:boolean=false;
  isConfirm:boolean=true;
  isCompleted:boolean=false;
  isActiveLoan:boolean=true;
  isPending:boolean=false;
  isvisible:boolean=false;

  isSet:boolean[]=[];
  status:string='';
  aadharId:string="";
  local: { [id: string]: Loan } = {};

  navigateToPayment() {
    this.isActive=false;
    this.router.navigate(['/in/payment']);
  }

  checkConfirm(id:any) {
    this.loanService.deleteLoan(id).subscribe(() => this.status = 'Delete successful');
  }
  
  showBalance(i:number) {
    this.showList[i]=!this.showList[i];
    this.isSet[i]=!this.isSet[i];
   }

   showAadhaar(){
    this.setAadhaar=!this.setAadhaar;
    this.isAadhar=!this.isAadhar;
   }

   loanchange(value: string) {
    this.isCompleted=false;
    this.isActiveLoan=false;
    this.isPending=false;
     if(value==="1"){
        this.isCompleted=true;
     }
     if(value==="2"){
        this.isActiveLoan=true;
     }
     if(value==="3"){
        this.isPending=true;
     }
   }


  constructor(private router: Router, private loanService: LoanService) { }

  ngOnInit(): void {
    this.aadharId = JSON.parse(localStorage.getItem('aadhaarId') || '{}');
    this.local = JSON.parse(localStorage.getItem("approved_loans") || "{}");
    
    Object.keys(this.local).forEach(key => {
      if(this.local[key].aadharId===this.aadharId){
        this.localLoans.push(this.local[key]);
      }  
    });
    
    console.log(this.localLoans)

    this.loanService.getBankDetails(this.aadharId).subscribe(data => this.banks = data);
    this.loanService.getLoans(this.aadharId).subscribe(data => this.loans = data);
    this.loanService.getCusomerDetails(this.aadharId).subscribe(data => this.customer = data);
    this.loanService.getCompletedLoans(this.aadharId).subscribe(data => this.completedLoans = data);
  }
  
}

