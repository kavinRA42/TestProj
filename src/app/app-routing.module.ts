import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { UserTableComponent } from './user-table/user-table.component';
import { FormComponentComponent } from './form-component/form-component.component';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: 'header-component', component:HeaderComponent},
  {path: 'user-table-component', component:UserTableComponent,canActivate:[AuthGuard]},
  {path: 'form-component-component', component:FormComponentComponent,canActivate:[AuthGuard]},
  {path: 'alert-component', component:AlertBoxComponent},
  {path: 'login', component:LoginPageComponent},
  {path: '', component:LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
