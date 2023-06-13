import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterBookComponent } from './register-book.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { BookService } from '../../../../application/use-case/book/book.service';
import { CategoryService } from '../../../../application/use-case/category/category.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegisterBookComponent', () => {
  let component: RegisterBookComponent;
  let fixture: ComponentFixture<RegisterBookComponent>;
  let categoryService: CategoryService;
  let bookService: BookService;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterBookComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: CategoryService,
          useValue: {
            getListCategories: jest.fn().mockReturnValue(of([]))
          }
        },
        {
          provide: BookService,
          useValue: {
            createBook: jest.fn().mockReturnValue(of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: jest.fn().mockReturnValue('new')
            })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        Location
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterBookComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the book data when in edit mode', () => {
    const book = {
      title: 'Book Title',
      author: 'Book Author',
      url: 'book-url',
      image: 'book-image',
      resume: 'book-summary',
      public: true
    };

    jest.spyOn(sessionStorage, 'getItem').mockReturnValue(JSON.stringify(book));
  });

  it('should initialize the form with empty values when in new mode', () => {
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

    expect(component.isNewBook).toBe(true);
    expect(component.registerBookForm.value.bookname).toBe('');
    expect(component.registerBookForm.value.authorname).toBe('');
    expect(component.registerBookForm.value.urlbook).toBe('');
    expect(component.registerBookForm.value.image).toBe('');
    expect(component.registerBookForm.value.summary).toBe('');
    expect(component.registerBookForm.value.post).toBe(false);
  });

  it('should navigate back when the back button is clicked', () => {
    const locationBackSpy = jest.spyOn(location, 'back');

    component.back();

    expect(locationBackSpy).toHaveBeenCalled();
  });

  it('should check if a field is valid', () => {
    component.registerBookForm = component['fb'].group({
      bookname: ['Book Title', [Validators.required]],
      authorname: ['', [Validators.required]],
    });

    expect(component.isValidField('bookname')).toBe(false);
    expect(component.isValidField('authorname')).toBe(false);
  });

  it('should validate array selections with minimum selections', () => {
    component.registerBookForm = component['fb'].group({
      categories: component['fb'].array([], component.validateArraySelections(2))
    });

    const formArray = component.registerBookForm.get('categories') as unknown as FormControl[];
    formArray.push(new FormControl({ data: { id: 1 }, valueCheck: true }));
    formArray.push(new FormControl({ data: { id: 2 }, valueCheck: false }));
    formArray.push(new FormControl({ data: { id: 3 }, valueCheck: true }));

    expect(component.registerBookForm.valid).toBe(true);

    expect(component.registerBookForm.valid).toBe(true);
  });

  it('should add a book', () => {
    component.registerBookForm = component['fb'].group({
      bookname: ['Book Title', [Validators.required]],
      authorname: ['Book Author', [Validators.required]],
      urlbook: ['book-url', [Validators.required]],
      image: ['book-image', [Validators.required]],
      summary: ['book-summary', [Validators.required]],
      post: [true],
      categories: component['fb'].array([], component.validateArraySelections(1))
    });

    const formArray = component.registerBookForm.get('categories') as unknown as FormControl[];
    formArray.push(new FormControl({ data: { id: 1 }, valueCheck: true }));
    jest.spyOn(component, 'togglePopup');

    component.addBook();

    expect(bookService.createBook).toHaveBeenCalledWith({
      userRegister: component.userRegister,
      price: '',
      isbn13: 2,
      title: 'Book Title',
      author: 'Book Author',
      url: 'book-url',
      image: 'book-image',
      resume: 'book-summary',
      public: true,
      category: [1],
      categoriesSelectedAllData: [{ id: 1 }]
    });

    expect(component.togglePopup).toHaveBeenCalled();
  });

  it('should navigate to /admin/books', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    component.goToListBooks();

    expect(navigateSpy).toHaveBeenCalled();
  });
});
