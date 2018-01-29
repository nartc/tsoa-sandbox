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
import {TaskFormComponent} from './components/task-form/task-form.component';

const defaultRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {title: 'TSOAsandbox | Home', pageTitle: 'Home'}
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {title: 'TSOAsandbox | Login', pageTitle: 'Login'},
    // canActivate: [ResumeGuardGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {title: 'TSOAsandbox | Register', pageTitle: 'Register'},
    // canActivate: [ResumeGuardGuard]
  }
];

const userRoutes: Routes = [
  {
    path: '',
    redirectTo: ':username',
    pathMatch: 'full'
  },
  {
    path: 'tasks/edit/:id',
    component: TaskFormComponent,
    data: {title: 'TSOAsandbox | Edit Task', pageTitle: 'Tasks'}
  },
  {
    path: 'tasks/create',
    component: TaskFormComponent,
    data: {title: 'TSOAsandbox | Create Task', pageTitle: 'Tasks'}
  },
  {
    path: 'tasks',
    component: TasksComponent,
    data: {title: 'TSOAsandbox | Tasks', pageTitle: 'Tasks'}
  },
  {
    path: ':username',
    component: DashboardComponent,
    data: {title: 'TSOAsandbox | Dashboard', pageTitle: 'Dashboard'}
  },
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
    data: {title: 'TSOAsandbox | Resume', pageTitle: 'Resume'}
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
