
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './components/payment/payment.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { HistoryComponent } from './components/history/history.component';
import { LoginComponent } from './components/login/login.component';
import { BankDetailComponent } from './components/bank-detail/bank-detail.component';
import { NavwrapperComponent } from './components/navwrapper/navwrapper.component';
import { AdminComponent } from './components/adminlogin/adminlogin.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { AdminnavwrapperComponent } from './components/adminnavwrapper/adminnavwrapper.component';
import { AdminregComponent } from './components/adminreg/adminreg.component';
import { FooterComponent } from './components/footer/footer.component';
import { PieComponent } from './charts/pie/pie.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PaymentComponent,
    RegisterComponent,
    HistoryComponent,
    LoginComponent, 
    BankDetailComponent, 
    NavwrapperComponent, 
    AdminComponent, 
     AdminNavComponent, AdminpanelComponent, AdminnavwrapperComponent, AdminregComponent, FooterComponent, PieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
