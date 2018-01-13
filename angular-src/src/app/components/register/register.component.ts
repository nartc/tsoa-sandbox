import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseForm} from '../../utils/BaseForm';
import {PasswordValidation} from '../../utils/VerifyPassword.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseForm implements OnInit {
  private emailRegex = '([\\w\\.\\-_]+)?\\w+@[\\w-_]+(\\.\\w+){1,}';
  form: FormGroup;
  username: FormControl;
  email: FormControl;
  password: FormControl;
  verifiedPassword: FormControl;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      verifiedPassword: ['', Validators.required]
    }, {validator: PasswordValidation.MatchPassword});
    this.exposeControls();
  }

  submit() {
    console.log(this.form);
  }

}
