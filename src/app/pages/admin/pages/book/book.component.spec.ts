import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { BookComponent } from './book.component';
import { Book } from 'src/app/application/models/book.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let locationMock: Partial<Location>;

  beforeEach(async () => {
    locationMock = {
      back: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BookComponent],
      providers: [{ provide: Location, useValue: locationMock }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return empty string when book has no categories', () => {
    const book: Book = {
      title: 'Test Book',
      categoriesSelectedAllData: [],
      author: '',
      resume: '',
      image: '',
      url: '',
      userRegister: '',
      category: [],
      public: false,
      isbn13: 0,
      price: ''
    };

    const result = component.listCategoriesByName(book);

    expect(result).toEqual('');
  });

  it('should call Location.back() method when back() is invoked', () => {
    component.back();
    expect(locationMock.back).toHaveBeenCalled();
  });
  it('should initialize the component with correct values', () => {
    const mockBook = {
      title: 'Test Book',
      categoriesSelectedAllData: [
        { description: 'Category 1' },
        { description: 'Category 2' },
      ],
    };
    const mockSessionStorage = {
      getItem: jest.fn().mockReturnValueOnce(JSON.stringify(mockBook)),
    };

    jest.spyOn(sessionStorage, 'getItem').mockImplementation(mockSessionStorage.getItem);

    fixture.detectChanges();

    expect(component.book).toEqual(mockBook);
    expect(component.showSpinner).not.toBeFalsy();
    expect(component.listCategoriesBookByName).toBe('Category 1, Category 2');
  });

});
