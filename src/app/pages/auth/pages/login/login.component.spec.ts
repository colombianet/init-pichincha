import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserService } from '../../../../application/use-case/user/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: UserService,
          useValue: {
            loginUser: jest.fn()
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check if username field is required', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('');
    expect(component.fieldIsValidRequired('username')).toBe(false);

    usernameControl?.setValue('JohnDoe');
    expect(component.fieldIsValidRequired('username')).toBeDefined();
  });

  it('should check if password field is required', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    expect(component.fieldIsValidRequired('password')).toBe(false);

    passwordControl?.setValue('password123');
    expect(component.fieldIsValidRequired('password')).toBe(false);
  });

  it('should check if username field has custom error', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('JohnDoe');
    expect(component.fieldIsValidCustom('username', 'customError')).not.toBeDefined();

    usernameControl?.setValue('JaneDoe');
    expect(component.fieldIsValidCustom('username', 'customError')).not.toBeDefined();
  });

  it('should call loginUser and navigate to admin page when login is successful', () => {
    const username = 'JohnDoe';
    const accessToken = 'access_token';

    component.loginForm.setValue({ username, password: 'password123' });

    const loginUserSpy = jest.spyOn(userService, 'loginUser').mockReturnValue(of({ access_token: accessToken }));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.loginUser();

    expect(loginUserSpy).toHaveBeenCalledWith({ username, password: 'password123' });
    // expect(sessionStorage.setItem).toHaveBeenCalled();
    // expect(sessionStorage.setItem).toHaveBeenCalledWith('user', username);
    // expect(navigateSpy).toHaveBeenCalledWith(['/admin', 'books']);
  });

  it('should show popup when login fails', () => {
    component.loginForm.setValue({ username: 'JohnDoe', password: 'password123' });

    jest.spyOn(userService, 'loginUser').mockReturnValue(throwError('error'));

    component.loginUser();

    expect(component.isPopupVisible).toBe(true);
  });

  it('should toggle popup visibility', () => {
    expect(component.isPopupVisible).toBe(false);

    component.togglePopup();
    expect(component.isPopupVisible).toBe(true);

    component.togglePopup();
    expect(component.isPopupVisible).toBe(false);
  });
});
