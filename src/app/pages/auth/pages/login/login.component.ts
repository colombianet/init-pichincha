import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/application/use-case/user/user.service';
import { isValidFieldCustom, isValidFieldRequired } from 'src/app/shared/utils/form-validations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isPopupVisible: boolean = false;
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private userSvc: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  fieldIsValidRequired(nameField: string) {
    return isValidFieldRequired(this.loginForm, nameField);
  }

  fieldIsValidCustom(nameField: string, nameError: string) {
    return isValidFieldCustom(this.loginForm, nameField, nameError);
  }

  loginUser() {
    this.userSvc.loginUser(this.loginForm.value).subscribe((r: any) => {
      sessionStorage.setItem('token', r.access_token);
      sessionStorage.setItem('user', this.loginForm.get('username')?.value);
      this.goToAdmin();
    }, () => {
      this.togglePopup();
    });
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  goToAdmin() {
    this.router.navigate(['/admin', 'books']);
  }
}
