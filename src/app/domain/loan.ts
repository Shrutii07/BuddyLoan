export class Loan {
    public aadharId?: string;
    public loanId?: number;
    public loanType?: string;
    public loanAmount?: number;
    public emi?: number;
    public duration?: number;
    public interestRate?: number;
    public dueDate?: string;
    public history?: History[];
    public totalPayableAmount?:number;
    public status?:boolean|null;
    public pending?:boolean;
    public accepted?:boolean|null;
}
