import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { SignupComponent } from './signup.component';
import { SignupModule } from './signup.module';
import { AuthService } from '../services/auth';

class SignupPage {
  submitBtn: DebugElement;
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;
  dietPreferences: DebugElement[];

  addPageElements() {
    this.submitBtn = fixture.debugElement.query(By.css('button'));
    this.usernameInput = fixture.debugElement.query(By.css('[name=username]')).nativeElement;
    this.passwordInput = fixture.debugElement.query(By.css('[name=password]')).nativeElement;
    this.dietPreferences = fixture.debugElement.queryAll(By.css('[name=preference]'));
  }
}

class MockAuthService {
  signup(credentials) {}
}

let component: SignupComponent;
let fixture: ComponentFixture<SignupComponent>;
let signupPage: SignupPage;
let authService: AuthService;

describe('SignupComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SignupModule],
      // imports: [FormsModule],
      // declarations: [ SignupComponent ]
    })
    .overrideComponent(SignupComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    signupPage = new SignupPage();
    authService = fixture.debugElement.injector.get(AuthService);

    fixture.detectChanges(); // Initializes our component calling ngOnInit
    return fixture.whenStable().then(() => { // Resolves once the asynchronous events within our test have finished (such as any asynchronous HTTP requests made within our component’s ngOnInit)
      fixture.detectChanges(); // Updates our view with any return values from the first .detectChanges()
      signupPage.addPageElements(); // Queries the DOM for the elements we need after all potential asynchronous are completed.
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a user with valid credentials and diet preferences', () => {
    signupPage.usernameInput.value = 'johndoe';
    signupPage.passwordInput.value = 'password';
    signupPage.usernameInput.dispatchEvent(new Event('input'));
    signupPage.passwordInput.dispatchEvent(new Event('input'));
    signupPage.dietPreferences[0].nativeElement.click();
    signupPage.dietPreferences[1].nativeElement.click();

    spyOn(authService, 'signup').and.callFake(() => {
      return of({ token: 's3cr3tt0ken' });
    });
    signupPage.submitBtn.nativeElement.click();

    expect(authService.signup).toHaveBeenCalledWith({
      username: 'johndoe',
      password: 'password',
      dietPreferences: ['BBQ', 'Burger']
    });
    // TODO: Add expectation to redirect to user dashboard.
  });

  it('should display an error message with invalid credentials', () => {
    const errorMsg = 'Your password must be at least 5 characters long.';
    signupPage.usernameInput.value = 'janedoe';
    signupPage.passwordInput.value = 'pswd';
    signupPage.usernameInput.dispatchEvent(new Event('input'));
    signupPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(authService, 'signup').and.callFake(() => {
      return throwError({
        error: {
          message: errorMsg
        }
      });
    });
    signupPage.submitBtn.nativeElement.click();

    fixture.detectChanges();
    const errorMessage: DebugElement = fixture.debugElement.query(By.css('.error.alert.alert-danger'));
    expect(errorMessage.nativeElement.textContent).toEqual(errorMsg);
  });
});
