import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from './components/layouts/default-layout/default-layout.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UserLayoutComponent} from './components/layouts/user-layout/user-layout.component';
import {ResumeComponent} from './components/resume/resume.component';
import {ResumeGuardGuard} from './guards/resume-guard.guard';
import {TasksComponent} from './components/tasks/tasks.component';

const defaultRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {title: 'TSOAsandbox | Home'}
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {title: 'TSOAsandbox | Login'},
    // canActivate: [ResumeGuardGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {title: 'TSOAsandbox | Register'},
    // canActivate: [ResumeGuardGuard]
  }
];

const userRoutes: Routes = [
  {
    path: '',
    redirectTo: ':id',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: DashboardComponent,
    data: {title: 'TSOAsandbox | Dashboard'}
  }
];

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: defaultRoutes
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: userRoutes,
    // canActivate: [ResumeGuardGuard]
  },
  {
    path: 'resume',
    component: ResumeComponent,
    data: {title: 'TSOAsandbox | Resume'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
