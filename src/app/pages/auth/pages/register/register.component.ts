import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray, FormBuilder, FormControl, FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CategoryService } from 'src/app/application/use-case/category/category.service';
import { UserService } from 'src/app/application/use-case/user/user.service';
import { isValidField, isValidFieldRequired, isValidFieldCustom } from '../../../../shared/utils/form-validations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  categoriesArray!: FormArray;
  categoriesSelected: any[] = [];
  isPopupVisible: boolean = false;

  registerForm = this.fb.group({
    user: ['', [Validators.required], [this.usernameAvailabilityValidator.bind(this)]],
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[\[\]°¬\/¡!@#$%^&*(),.';\-\_¿?":{}|<>]).+$/)]],
    confirmPass: ['', [Validators.required]],
    categories: this.fb.array([], this.validateArraySelections(3))
  }, { validator: this.passwordMatchValidator });

  constructor(private fb: FormBuilder, private userSvc: UserService,
              private categorySvc: CategoryService, private router: Router) { }

  registerUser() {
    if (this.registerForm.invalid) return;
    this.userSvc.createUser(this.createBodyByCreateUser()).subscribe((r: any) => {
      this.togglePopup();
    });
  }

  private createBodyByCreateUser() {
    const category: any[] = [];
    this.categoriesSelected.forEach(c => {
      if (c.valueCheck === true) {
        category.push(c.data.id);
      }
    });
    const { email, pass, user}= this.registerForm.value;
    return { name: user, email, password: pass, category };
  }

  ngOnInit(): void {
    this.initArrayCategories();
  }

  private initArrayCategories() {
    this.categorySvc.getListCategories().subscribe(categories => {
      this.categoriesArray = this.registerForm.get('categories') as FormArray;
      categories.forEach(category => {
        let data = new FormGroup({
          data: new FormControl(category),
          valueCheck: new FormControl(false),
        });
        this.categoriesArray.push(data);
      });
      return this.categoriesArray;
    });
  }

  fieldIsValid(nameField: string) {
    return isValidField(this.registerForm, nameField);
  }

  fieldIsValidRequired(nameField: string) {
    return isValidFieldRequired(this.registerForm, nameField);
  }

  fieldIsValidCustom(nameField: string, nameError: string) {
    return isValidFieldCustom(this.registerForm, nameField, nameError);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('pass');
    const confirmPasswordControl = formGroup.get('confirmPass');

    if (passwordControl?.value !== confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors({ mismatch: true });
    } else {
      confirmPasswordControl?.setErrors(null);
    }
  }

  usernameAvailabilityValidator(control: FormControl): Observable<any> {
    return this.checkUsernameAvailability(control.value).pipe(
      map(res => {
        return !res.exists ? null : { unavailable: true };
      })
    );
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.userSvc.verifyUsername(username);
  }

  get listCategories(): any {
    return this.registerForm.get('categories');
  }

  validateArraySelections(minSelections: number): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      this.categoriesSelected = (formArray as FormArray).getRawValue().filter(({ valueCheck }) => valueCheck === true);
      return this.categoriesSelected.length >= minSelections ? null : { insufficientSelections: true };
    };
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  goToLogin() {
    this.router.navigate(['/auth', 'login']);
  }
}
