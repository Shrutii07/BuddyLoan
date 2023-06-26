import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Loan } from 'src/app/domain/loan';
import { LoanService } from 'src/app/services/loan.service';
import { BankService } from 'src/app/services/bankservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})





export class RegisterComponent implements OnInit {

  form:FormGroup;
  emi:number=0;
  totalPayableAmount:number=0;
  loan: Loan=new Loan();
  name:string;

  static count:number = 1;
  static local:{[id:string]:Loan}={};
  existingLoan:{[id:string]:Loan}={};

  aadharId:string;
  interestRate:{[id:string]:number}={"Home":8,  "Car":9, "Education":10, "Agriculture":4, "Gold":11, "Personal":12}

  categories = ["Home", "Car", "Education", "Agriculture", "Gold", "Personal"]
  bankbalance:number = 10000000;
  

  
  
  constructor(private fb: FormBuilder, private router:Router, private service:LoanService, private bankService: BankService ) {
    
    this.form= this.fb.group({
      amount: ['', {
        validators:[Validators.required, Validators.min(1000), Validators.max(this.bankbalance*5)], 
        updateOn:'change'
      }],
      purpose: ['', Validators.required],
      duration:['', [Validators.required, Validators.min(1)]]
    })  
    
    console.log(this.bankbalance)
    // setTimeout(()=>{
        
    //  },2000)
    
   }

  maxBal(control: AbstractControl) {
    let balance = control.value;
    if(balance > this.bankbalance*5)  return {maxBalance: true};
      return null;
  }

  ngOnInit(): void {
    this.aadharId = JSON.parse(localStorage.getItem('aadhaarId') || '{}'); 
    //this.bankbalance = this.setBalance(); 
    setTimeout( ()=>(this.bankService.getHighestBankBalance(this.aadharId).subscribe(data=>
      {
        if(data!=null)          this.bankbalance = data
        else this.bankbalance=100000;
      }, error =>{
        console.log(error)
      },
      ()=>{
        
        //console.log(this.bankbalance);
      }
    )), 1 )


    this.service.getCusomerDetails(this.aadharId).subscribe(data =>
      {if(data!=null && data.name !== undefined) 
        this.name = data.name.trim()
      },
        error=>{console.log(error)}
      )
    
      this.existingLoan = JSON.parse(localStorage.getItem("pending_loans") || "{}");
      console.log(this.existingLoan);
      if(Object.keys(this.existingLoan).length>0){
        Object.keys(this.existingLoan).forEach(key => {
          RegisterComponent.local[key] = this.existingLoan[key] ;
        });
        RegisterComponent.count = Object.keys(this.existingLoan).length+1;
        console.log(RegisterComponent.local);
      }
  }

  calculateEmi(){
    let rate = ((this.interestRate[this.form.value.purpose])/12)/100;
    if(this.loan.loanAmount !== undefined && this.loan.duration !== undefined)
    {this.emi = Math.round(((100*this.loan.loanAmount*rate*((1+rate)**this.loan.duration))/(100*(((1+rate)**this.loan.duration)-1))))}
    this.totalPayableAmount = Math.round((this.emi*this.form.value.duration*100)/100);
  }


  addLoan(){
    this.service.addLoan(this.aadharId, this.loan).subscribe(data => console.log(data))
  }

  gereateId(){
      
      let id:string = "loan_"+ this.name.replace(" ","_") + "_" +RegisterComponent.count;
      RegisterComponent.count= RegisterComponent.count+1;
      return id;
      
  }


  onSubmit(){
    console.log("Form submitted");

    if(this.form.valid){
      this.loan.loanAmount = this.form.value.amount;
      this.loan.loanType = this.form.value.purpose;
      this.loan.duration =this.form.value.duration;
      this.loan.aadharId = this.aadharId;
      this.calculateEmi();
      this.loan.emi = this.emi;
      this.loan.interestRate = this.interestRate[this.form.value.purpose];
      this.loan.totalPayableAmount =this.totalPayableAmount;
      this.loan.status = null;
      this.loan.pending=true;
      this.loan.accepted=null;
      RegisterComponent.local[this.gereateId()] = this.loan ;
      console.log(RegisterComponent.local);
      localStorage.setItem("pending_loans", JSON.stringify(RegisterComponent.local));
      localStorage.setItem("approved_loans", JSON.stringify(RegisterComponent.local));
      
      // this.addLoan();
      Swal.fire('Thank you for Applying','We will get back to you shortly!', 'success').then((result) => { 
        this.form.reset();
        this.router.navigate(['/in/profile']);
      });
       
    }
  }
}