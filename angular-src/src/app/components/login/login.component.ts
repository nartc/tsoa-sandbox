import {Component, OnInit} from '@angular/core';
import {BaseForm} from '../../utils/BaseForm';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthClientService} from '../../services/auth-client.service';
import {ILoginParams, ILoginResponse, UserRole} from '../../swagger-api';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseForm implements OnInit {
  form: FormGroup;
  usernameOrEmail: FormControl;
  password: FormControl;
  rememberMe: FormControl;


  private emailRegExp: RegExp = new RegExp('([\\w\\.\\-_]+)?\\w+@[\\w-_]+(\\.\\w+){1,}');

  constructor(private formBuilder: FormBuilder,
              private authService: AuthClientService,
              private router: Router,
              private alertService: AlertService) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.minLength(6)],
      rememberMe: [false]
    });
    this.exposeControls();
  }

  submit() {
    let usernameInput;
    let emailInput;
    if (this.emailRegExp.test(this.usernameOrEmail.value)) {
      emailInput = this.usernameOrEmail.value;
      usernameInput = '';
    } else {
      usernameInput = this.usernameOrEmail.value;
      emailInput = '';
    }

    const loginParams: ILoginParams = {
      username: usernameInput,
      email: emailInput,
      password: this.password.value
    };

    this.authService.loginUser(loginParams, !this.rememberMe.value)
      .subscribe((result: ILoginResponse) => {
        this.alertService.showSuccessGrowlMessage('Successfully logged in', 'Successful');
        const role = result.role;
        /**
         * UserRole:
         * - Admin
         * - User
         */
        if (role === UserRole.User) {
          this.router.navigate(['/user', result.username]);
        } else if (role === UserRole.Admin) {
          this.router.navigate(['/admin', result.username]);
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

}
