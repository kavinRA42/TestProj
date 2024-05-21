import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from "ngx-spinner";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FormComponentComponent } from './form-component/form-component.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; 
import { UpdateComponent } from './update/update.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AlertModule } from './_alert';
import { DialogConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { ConfirmBoxConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { ToastNotificationConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { provideNgVibeToastify } from '@ng-vibe/toastify';
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import {NgConfirmModule} from 'ng-confirm-box';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CustomInterceptorService } from './services/custom.interceptor.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserTableComponent,
    FormComponentComponent,
    UpdateComponent,
    AlertBoxComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule,
    NgConfirmModule,
    HttpClientModule,
    FormsModule,
    AlertModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    BrowserAnimationsModule,

    DialogConfigModule.forRoot(),
    ConfirmBoxConfigModule.forRoot(),
    ToastNotificationConfigModule.forRoot()
  ],
  schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CustomInterceptorService,
    multi: true
  },
  [provideNgVibeToastify(),ToastifyRemoteControl],[AuthGuard]
] ,
  bootstrap: [AppComponent],
})
export class AppModule { }
