import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { BankService } from 'src/app/services/bankservice.service';
import {Bank} from 'src/app/domain/bank'
import {Loan} from 'src/app/domain/loan';
import { History } from 'src/app/domain/history';
import Swal from 'sweetalert2';
import "../../../assets/smtp.js";

declare let Email:any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{
  

  isActive:boolean=true;
  isFullActive:boolean=false;
  isPartialActive:boolean=false;
  amountToBePaid:number=0;
  aadhaarId:String="";
  isMonthsActive: boolean=false;
  pin:number;
  

  form = new FormGroup({
    bankname: new FormControl('', [Validators.required]),
    accountno: new FormControl(0, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
    loanid: new FormControl('', [Validators.required]),
    radio: new FormControl('', Validators.required),
    months: new FormControl(1,[Validators.required])
  });

  message = 'form submitted';
  

  get bankname(){
    return this.form.get('bankname');
  }
  
  get accountno(){
    return this.form.get('accountno');
  }

  get loanid(){
    return this.form.get('loanid');
  }
  get radio(){
    return this.form.get('radio')
  }
  get months(){
    return this.form.get('months')
  }

  sendEmail(body: string) {
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "shrutim@students.vnit.ac.in",
      Password: "181DC2B97DCE0CABAB2FC1BBBC549F094BB5",
      From: "shrutim@students.vnit.ac.in",
      To: "shrutimurarka5@gmail.com",
      Subject: "Transaction alert - BuddyLoan",
      Body: body,
    }).then((message:any) => console.log(message));
  }
  
  
  constructor(private router: Router, private bankservice:BankService) {
  }
  
  public banks: Bank[] = [];
  public loans: Loan[] = [];
  private selected: number = 0;
  private accountnoint: number = 0;
  private bank_balance: number=0;
  private transaction:History= new History();
  private emi: number = 0;
  
  
  

  ngOnInit():void {
    this.aadhaarId = JSON.parse(localStorage.getItem('aadhaarId') || '{}');
    
    this.bankservice.getBankDetails(this.aadhaarId).subscribe(data => this.banks=data)
    this.bankservice.getLoanDetails(this.aadhaarId).subscribe(data => this.loans=data)    
  }

  
  OnSelected(_$event: any){
    
    if (this.form.value.loanid !== undefined && this.form.value.loanid !== null){
      this.selected = parseInt(this.form.value.loanid)
    }
    
    this.form.get("radio")?.setValue(null)
    this.isFullActive=false;
    this.isPartialActive=false;
  }

  onFull(){
    this.isFullActive=true;
    this.isPartialActive=false;
    this.transaction.isFullyPaid = true;
    this.getBalanceAmount(this.selected);
    console.log(this.amountToBePaid)
    this.isMonthsActive=false;
  }

  onPartial(){
    this.amountToBePaid=0
    this.isFullActive=false;
    this.isPartialActive=true;
    this.transaction.isFullyPaid=false;
    this.isMonthsActive=true;
    
    
    this.bankservice.getLoanDetailsById(this.selected).subscribe(data => {
      if(data!=null) this.emi = data.emi!==undefined?data.emi:0;
      else{this.amountToBePaid = 0;}
      this.amountToBePaid=this.emi
    });
    
    

  }
  MonthChange(){
    console.log(this.form.value.months)
    
      if(this.form.value.months!=null){
        
        this.amountToBePaid=Math.round((this.emi*this.form.value.months*100)/100)
       }
    
    
  }


  pinCheck(){
    Swal.fire({
      text: "Enter your security pin",
      input: 'password',
      showCancelButton: true ,
      confirmButtonColor: '#874277',
      inputAttributes: { min:"4", max:"4"},
      inputPlaceholder:"****",
      inputValidator: (value) => {
        if (!value) return 'Security pin is required!'
        else return null;
      }
      }).then((result) => {
        if (result.value) {
          console.log(this.pin)
          console.log(result.value)
          if(this.pin === parseInt(result.value)){ 
            if(this.bank_balance>this.amountToBePaid){
              this.bank_balance=Math.round(((this.bank_balance-this.amountToBePaid)*100)/100);
              this.bankservice.updatePayment(this.accountnoint, this.bank_balance).subscribe(data => console.log(data))
              this.transaction.amountPaid=this.amountToBePaid;
              this.bankservice.addHistory(this.selected, this.transaction).subscribe(data => console.log("Posted"))
              this.sendEmail(` <h2>Transaction Successful</h2>
              Dear Customer, <br> <br>
                                Your ${this.form.value.bankname} account has been debited <span>&#8377;</span> ${this.amountToBePaid} for LoanId ${this.selected} successfully on ${new Date(Date.now()).toLocaleString()}. <br> 
                                Current bank balance: <span>&#8377;</span> ${this.bank_balance}<br> <br>
                                Please report, if this transaction was not authorized by you. 
                                <br> <br> <br>
                                For more information, Visit <a href="https://localhost:4200">BuddyLoan.com!</a>. <br> <br> <br>
                                Thank you for trusting us!!! <br> <br> <br>
                                Regards,<br>
                                BuddyLoan <br>
                                Contact us: +91 (7249323112)
                                `)
              Swal.fire('Payment Successful','Check out history for transaction confirmation', 'success').then((result) => { 
                this.form.reset();
                this.router.navigate(['/in/profile']);
              });
            }
            else{
              this.sendEmail(` <h2>Transaction Denied</h2>
              Dear Customer, <br> <br>
                                Your ${this.form.value.bankname} account has been tried to make transaction of <span>&#8377;</span> ${this.amountToBePaid} for LoanId ${this.selected} on ${new Date(Date.now()).toLocaleString()}. <br>
                                Transaction was denied due to <i>insufficient balance</i>. <br> <br>
                                Please report, if this transaction was not authorized by you. 
                                <br> <br> <br>
                                For more information, Visit <a href="https://localhost:4200">BuddyLoan.com!</a>. <br> <br> <br>
                                Thank you for trusting us!!! <br> <br> <br>
                                Regards,<br>
                                BuddyLoan <br>
                                Contact us: +91 (7249323112)
                                `)
                this.form.reset();
              Swal.fire('Transaction Failed','Insufficient balance', 'error');
            }
          }
          else{
            Swal.fire('Invalid pin','Check your pin', 'error');
          }          
        }
      },(err)=>{console.log(err)}
      )
  }

  onSubmit(){
    console.log(this.form.value)
    if(this.form.valid){
      this.pinCheck()
    }
  }
  

  getBalanceAmount(loanId:number){
    this.bankservice.getFullPaymentAmount(loanId).subscribe(
        data => {
          if(data!=null) this.amountToBePaid = Math.round((data*100)/100);
        }
    )
  }
    

  getAccNumByName(){
    if (this.form.value.bankname !== undefined && this.form.value.bankname !== null){
     this.bankservice.getBankbyBankName(this.aadhaarId, this.form.value.bankname).subscribe(data=>{
      if(data.accountNum !== undefined && data.accountNum !== null){
        this.accountnoint=data.accountNum
        this.pin = data.pin?data.pin:0
        
        this.form.patchValue(
          {
            accountno: data.accountNum
          }
        )

      }
      if(data.bankBalance !== undefined && data.bankBalance !== null){
        this.bank_balance=data.bankBalance
        

      }
        
     }
     );
    
    //this.bank_balance = this.bankservice.getBankbyBankName(this.aadhaarId, this.form.value.bankname).subscribe(data => data.bankBalance);
    }
  }
}








