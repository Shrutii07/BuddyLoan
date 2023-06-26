import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from 'src/app/services/history.service';
import { Customer } from 'src/app/domain/customer';
import { History } from 'src/app/domain/history';
import { Loan } from 'src/app/domain/loan';
import { LoanService } from 'src/app/services/loan.service';

/*import { Router } from '@angular/router';*/

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  historyList: History[]=[];
  allHistory: History[]=[];
  
  allCustomer: Loan[]=[];
  loan: Loan = new Loan();
  sum:number=0;
  customer: Customer;
  selected: number = 0;
  loanId:number = 0;
  payable:number = 0;
  isActive:boolean=false;
  isShow:boolean=false;
  r:number[]=[];
  aadharId:string='';

  constructor(private loanService: LoanService, private service: HistoryService, private router: Router) { }

  ngOnInit(): void {
    this.aadharId = JSON.parse(localStorage.getItem('aadhaarId') || '{}');
    this.service.getAllHistoryByCustomerId(this.aadharId).subscribe((data:any)=>{
      this.allHistory=data;  
    });
  
    this.service.getLoansByCustomerId(this.aadharId).subscribe(data => this.allCustomer = data);
    this.loanService.getCusomerDetails(this.aadharId).subscribe(data => this.customer = data);

    setTimeout(()=>{                           
      this.insertLoanId();
  }, 100);
  }
  
  insertLoanId() {
    this.r=[];
    for (let cus of this.allCustomer) {
        if (cus.loanId != undefined && cus.history!=undefined){
          for(let c of cus.history){
            this.r.push(cus.loanId);
          }
        }
    }
  }
  
  checkHistory() {
    this.isShow=true;
    this.isActive=true;
    this.historyList=[];
    this.service.getHistoryByLoanId(this.selected).subscribe((data:any)=>{
      this.historyList=data;  
    });
    this.loanService.getLoanByLoanId(this.aadharId,this.selected).subscribe((data:any)=>{
      this.loan=data;  
    });
    this.loanId=this.selected;
    
    setTimeout(()=>{                 
      this.payable = this.computePayable() || 0;
    }, 100);
  }
  
  computePayable(){
    this.sum=0;
    if(this.historyList.length>0){
    for(let val of this.historyList){
      if(val.isFullyPaid){
        return 0;
      }
      if(val.amountPaid!==undefined){
        this.sum+=val.amountPaid;
      }
    }
    if(this.loan.totalPayableAmount!==undefined && this.loan.totalPayableAmount>=this.sum){
      return(Math.round(((this.loan.totalPayableAmount-this.sum)*100)/100));
    }
    else{
      return 0;
    }
    }
    else{
      if(this.loan.totalPayableAmount!==undefined){
        return(Math.round((this.loan.totalPayableAmount*100)/100));
      }
      return 0;
    }
  }
}