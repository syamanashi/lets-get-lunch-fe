import { Component, OnInit } from '@angular/core';

import { AuthService, User, DietPreference, SignupResponse, LoginResponse } from '../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  user: User = {} as User;
  dietPreferences: DietPreference[] = [
    { name: 'BBQ', checked: false },
    { name: 'Burger', checked: false },
    { name: 'Chinese', checked: false },
    { name: 'Deli', checked: false },
    { name: 'Fast Food', checked: false },
    { name: 'Italian', checked: false },
    { name: 'Japanese', checked: false },
    { name: 'Mexican', checked: false },
    { name: 'Pizza', checked: false },
  ];
  errorMessage: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onPrefCheck(index: number) {
    if (this.dietPreferences[index].checked === true) {
      this.dietPreferences[index].checked = false;
    } else {
      this.dietPreferences[index].checked = true;
    }
  }

  signup(credentials: User) {
    credentials.dietPreferences = this.getSelectedPreferences();
    this.authService.signup(credentials).subscribe((res: LoginResponse) => {
      console.log('res', res);
      // TODO: Redirect user to dashboard.
    }, (err: HttpErrorResponse) => {
      this.errorMessage = err.error.message;
    });
  }

  getSelectedPreferences(): string[] {
    return this.dietPreferences
      .filter((preference: DietPreference) => {
        if (preference.checked) {
          return preference;
        }
      })
      .map((preference: DietPreference) => {
        return preference.name;
      });
  }

}
