import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value;
    if (AC.get('verifiedPassword').touched || AC.get('verifiedPassword').dirty) {
      let verifyPassword = AC.get('verifiedPassword').value;

      if (password != verifyPassword) {
        AC.get('verifiedPassword').setErrors({MatchPassword: true});
      } else {
        return null;
      }
    }
  }
}
