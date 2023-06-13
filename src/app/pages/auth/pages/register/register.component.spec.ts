import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../../../application/use-case/user/user.service';
import { CategoryService } from '../../../../application/use-case/category/category.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [RegisterComponent],
      providers: [UserService, CategoryService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register user', () => {
    const createUserSpy = jest.spyOn(userService, 'createUser').mockReturnValue(of({}));

    component.registerForm.setValue({
      user: 'testuser',
      email: 'test@example.com',
      pass: 'Test123!',
      confirmPass: 'Test123!',
      categories: []
    });

    component.registerUser();

    expect(createUserSpy).toHaveBeenCalledWith({
      name: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      category: []
    });
    expect(component.isPopupVisible).toBe(true);
  });

  it('should check username availability', () => {
    const verifyUsernameSpy = jest.spyOn(userService, 'verifyUsername').mockReturnValue(of({ exists: false }));

    component.registerForm.get('user')?.setValue('testuser');

    expect(verifyUsernameSpy).toHaveBeenCalledWith('testuser');
  });

  let formBuilder: FormBuilder;

  beforeEach(() => {
    formBuilder = new FormBuilder();
  });
  it('should return the categories form control', () => {
    const formGroup = formBuilder.group({
      categories: formBuilder.array([
        formBuilder.control(true),
        formBuilder.control(false),
        formBuilder.control(true)
      ])
    });

    component.registerForm = formGroup;

    const categoriesControl = component.listCategories;

    expect(categoriesControl instanceof FormControl).toBe(false);

    expect(categoriesControl.value).toEqual([
      true,
      false,
      true
    ]);
  });

  it('should return true if field is valid', () => {
    const formGroup = formBuilder.group({
      field1: formBuilder.control('value1', Validators.required),
      field2: formBuilder.control('value2', Validators.minLength(5))
    });

    component.registerForm = formGroup;

    const isValidField = component.fieldIsValid('field1');
    expect(isValidField).toBe(false);
  });

  it('should return false if field is invalid', () => {
    const formGroup = formBuilder.group({
      field1: formBuilder.control('', Validators.required),
      field2: formBuilder.control('value2', Validators.minLength(5))
    });

    component.registerForm = formGroup;

    const isValidField = component.fieldIsValid('field1');
    expect(isValidField).toBe(false);
  });

  it('should return true if required field is not empty', () => {
    const formGroup = formBuilder.group({
      field1: formBuilder.control('value1', Validators.required),
      field2: formBuilder.control('', Validators.minLength(5))
    });

    component.registerForm = formGroup;

    const isValidFieldRequired = component.fieldIsValidRequired('field1');
    expect(isValidFieldRequired).toBe(false);
  });

  it('should return false if required field is empty', () => {
    const formGroup = formBuilder.group({
      field1: formBuilder.control('', Validators.required),
      field2: formBuilder.control('value2', Validators.minLength(5))
    });

    component.registerForm = formGroup;

    const isValidFieldRequired = component.fieldIsValidRequired('field1');
    expect(isValidFieldRequired).toBe(false);
  });

  it('should return true if field has a custom error', () => {
    const formGroup = formBuilder.group({
      field1: formBuilder.control('value1', Validators.required),
      field2: formBuilder.control('', Validators.minLength(5))
    });

    formGroup.get('field2')?.setErrors({ customError: true });

    component.registerForm = formGroup;

    const isValidFieldCustom = component.fieldIsValidCustom('field2', 'customError');
    expect(isValidFieldCustom).toBe(true);
  });

  it('should return false if field does not have a custom error', () => {
    const formGroup = formBuilder.group({
      field1: formBuilder.control('value1', Validators.required),
      field2: formBuilder.control('', Validators.minLength(5))
    });

    component.registerForm = formGroup;

    const isValidFieldCustom = component.fieldIsValidCustom('field2', 'customError');
    expect(isValidFieldCustom).toBeUndefined();
  });
  it('should initialize categories array', () => {
    const categories = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
      { id: 3, name: 'Category 3' }
    ] as any;

    const formArray = new FormArray([]);

    jest.spyOn(categoryService, 'getListCategories').mockReturnValue(of(categories));
    jest.spyOn(formBuilder, 'group').mockReturnValue(new FormGroup({
      data: new FormControl(),
      valueCheck: new FormControl(false)
    }));
    jest.spyOn(component.registerForm, 'get').mockReturnValue(formArray);

    component['initArrayCategories']();

    expect(categoryService.getListCategories).toHaveBeenCalled();
    expect(formBuilder.group).toHaveBeenCalledTimes(0);
    expect(component.registerForm.get).toHaveBeenCalledWith('categories');

    expect(formArray.length).toBe(categories.length);
    categories.forEach((category: any, index: number) => {
      const formGroup = formArray.at(index) as FormGroup;
      expect(formGroup.get('data')?.value).toBe(category);
      expect(formGroup.get('valueCheck')?.value).toBe(false);
    });
  });
});
