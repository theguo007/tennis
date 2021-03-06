import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AntiAuthGuard } from './guards/antiAuth.guard';

import { UserComponent } from './user/user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AntiAuthGuard] },
  { path: 'users',  component: UserComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/create', component: CreateUserComponent, canActivate: [AntiAuthGuard] },
  { path: 'user/:id', component: UserDetailComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
