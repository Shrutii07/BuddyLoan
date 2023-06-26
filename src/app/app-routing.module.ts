import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BankDetailComponent } from './components/bank-detail/bank-detail.component';
import { PaymentComponent } from './components/payment/payment.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HistoryComponent } from './components/history/history.component';
import { NavwrapperComponent } from './components/navwrapper/navwrapper.component';
import { AdminComponent } from './components/adminlogin/adminlogin.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { AdminnavwrapperComponent } from './components/adminnavwrapper/adminnavwrapper.component';
import { AdminregComponent } from './components/adminreg/adminreg.component';

const routes: Routes = [
  
{path: 'login', component: LoginComponent},
{path:'register',component:AdminregComponent},
{path:'alogin',component:AdminComponent},
{path:'rbs', component:AdminnavwrapperComponent,
    children:[{path:'panel', component: AdminpanelComponent}]
},
{path:'in',component:NavwrapperComponent,
    children:[{ path: 'payment', component: PaymentComponent },
    { path: 'profile', component: BankDetailComponent },
    {path: 'newLoan', component: RegisterComponent},
    {path: 'history', component: HistoryComponent},]},
{ path: '', redirectTo: '/login', pathMatch: 'full'}
]; 



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
