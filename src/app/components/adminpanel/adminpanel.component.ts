import { Component, OnInit } from "@angular/core";
import { LoanService } from "src/app/services/loan.service";
import { Loan } from "src/app/domain/loan";
import { BankService } from "src/app/services/bankservice.service";
import { Admin } from "src/app/domain/admin";
import "../../../assets/smtp.js";


declare let Email:any;

@Component({
  selector: "app-adminpanel",
  templateUrl: "./adminpanel.component.html",
  styleUrls: ["./adminpanel.component.css"],
})
export class AdminpanelComponent implements OnInit {
  approvalsList: string[] = ["Approval", "Reject"];
  local: { [id: string]: Loan } = {};

  bankbalance: number[] = [];
  employeeId: string;
  admin: Admin;
  id: string[] = [];
  imageString: string;
 

  constructor(private service: LoanService, private bankService: BankService) {}

  ngOnInit(): void {
    this.employeeId = localStorage.getItem("employeeId") || "";
    this.service.getAdminDetails(this.employeeId).subscribe((data) => {
      if (data !== undefined) this.admin = data;
    });
    this.local = JSON.parse(localStorage.getItem("pending_loans") || "{}");

    Object.keys(this.local).forEach((key) => {
      this.id.push(this.local[key].aadharId || "Invalid");
    });

    for (let id of this.id) {
      this.bankBalance(id);
    }

    setTimeout(() => {
      this.imageString = this.changeImage();
    }, 100);

    console.log(this.imageString);
  }

  changeImage() {
    let tempString: string;
    if (this.admin.image !== undefined && this.admin.image !== null) {
      tempString = this.admin.image.substring(
        this.admin.image.lastIndexOf("d/") + 2,
        this.admin.image.lastIndexOf("/")
      );

      console.log(tempString);

      return "https://drive.google.com/uc?export=view&id=".concat(tempString);
    } else {
      return "";
    }
  }

  addloan(aadharId: any, loan: Loan) {
    this.service.addLoan(aadharId, loan).subscribe((data) => console.log(data));
  }

  sendEmail(body: string) {
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "shrutim@students.vnit.ac.in",
      Password: "181DC2B97DCE0CABAB2FC1BBBC549F094BB5",
      From: "shrutim@students.vnit.ac.in",
      To: "shrutimurarka5@gmail.com",
      Subject: "Loan Status - BuddyLoan",
      Body: body,
    }).then((message:any) => console.log(message));
  }

  bankBalance(aadharId: string) {
    this.bankService.getHighestBankBalance(aadharId).subscribe(
      (data) => {
        if (data != null) this.bankbalance.push(data);
        else this.bankbalance.push(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loanchange(value: string, key: string) {
    if (value === "1") {
      //console.log(this.local[key])
      if (this.local[key].aadharId !== undefined) {
        this.local[key].status = true;
        this.local[key].pending = false;
        this.local[key].accepted = true;
        this.sendEmail(` <h2>Congratulations!! Your loan application has been approved.</h2>
        Your ${this.local[key].loanType} loan of <span>&#8377;</span> ${this.local[key].loanAmount} for ${this.local[key].duration} has been approved by BuddyLoan. <br>
                          Total Payable amount: <span>&#8377;</span> ${this.local[key].totalPayableAmount} <br>
                          EMI per month: <span>&#8377;</span> ${this.local[key].emi} <br> <br> <br>
                          For more information, <a href="https://localhost:4200">Visit BuddyLoan.com!</a>. <br> <br> <br>
                          Thank you for trusting us!!! <br> <br> <br>
                          Regards,<br>
                          BuddyLoan <br>
                          Contact us: +91 (7249323112)
                          `)
        this.addloan(this.local[key].aadharId, this.local[key]);
      } else {
        console.log("Undefined AadharId");
      }
    }
    if (value === "2") {
      this.local[key].pending = false;
      this.local[key].accepted = false;
      this.local[key].status = false;
      this.sendEmail(` <h2>Sorry!! We are looking best offers for you.</h2><h4>Please try later!!</h4>
                        Your ${this.local[key].loanType} loan of <span>&#8377;</span> ${this.local[key].loanAmount} for ${this.local[key].duration} has been rejected by BuddyLoan. <br>
                        For more information, <a href="https://localhost:4200">Visit BuddyLoan.com!</a>. <br> <br> <br>
                        Thank you for trusting us!!! <br> <br> <br>
                        Regards,<br>
                        BuddyLoan <br>
                        Contact us: +91 (7249323112)`)
    }
    localStorage.setItem("approved_loans", JSON.stringify(this.local));
    //delete this.local[key];
    localStorage.setItem("pending_loans", JSON.stringify(this.local));
  }
}
