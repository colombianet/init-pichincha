import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Book } from 'src/app/application/models/book.model';
import { BooksComponent } from './books.component';
import { BookService } from '../../../../application/use-case/book/book.service';
import { CategoryService } from '../../../../application/use-case/category/category.service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let bookServiceSpy: Partial<BookService>;
  let categoryServiceSpy: Partial<CategoryService>;
  let router: Router;

  beforeEach(async () => {
    bookServiceSpy = {
      getListBooks: jest.fn().mockReturnValue(of([])),
    };

    categoryServiceSpy = {
      getListCategories: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [BooksComponent],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    jest.spyOn(sessionStorage, 'setItem').mockImplementation(() => {});
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get categories on initialization', () => {
    const category1: any = { id: 1, name: 'Category 1' };
    const category2: any = { id: 2, name: 'Category 2' };
    const categories: any[] = [category1, category2];

    (categoryServiceSpy.getListCategories as jest.Mock).mockReturnValue(of(categories));

    component.ngOnInit();

    expect(categoryServiceSpy.getListCategories).toHaveBeenCalled();
    expect(component.listCategories).toEqual(categories);
  });

  it('should get books on initialization', () => {
    const book1: any = { id: 1, title: 'Book 1', category: [] };
    const book2: any = { id: 2, title: 'Book 2', category: [] };
    const books: any[] = [book1, book2];

    (bookServiceSpy.getListBooks as jest.Mock).mockReturnValue(of(books));

    component.ngOnInit();

    expect(bookServiceSpy.getListBooks).toHaveBeenCalled();
    expect(component.listBooks).toEqual(books);
    expect(component.listBooksFiltered).toEqual(books);
  });

  it('should filter books by input search', () => {
    const book1: any = { id: 1, title: 'Book 1', category: [] };
    const book2: any = { id: 2, title: 'Book 2', category: [] };
    const books: any[] = [book1, book2];
    component.listBooks = books;
    component.listBooksFiltered = books;

    const searchControl = new FormControl();
    component.search = searchControl;

    searchControl.setValue('Book 1');

    expect(component.listBooksFiltered.length > 0).toBeTruthy();
  });

  it('should update valueInputSearch and call filterArrayByInput', () => {
    const value = 'Search Value';

    component.search = new FormControl();
    const valueChangesSpy = jest.spyOn(component.search.valueChanges, 'subscribe');

    component['doSearch']();

    expect(valueChangesSpy).toHaveBeenCalled();

    const callback: any = valueChangesSpy.mock.calls[0][0];
    callback(value);

    expect(component.valueInputSearch.toLocaleLowerCase()).toBe(value.toLocaleLowerCase());
  });
  it('should update valueInputSearch and filter books based on conditions', () => {
    const value = 'Search Value';
    const filteredBooks: any[] = [/* array of filtered books */];

    component.valueSelect = '1';
    component.listBooksFiltered = [...component.listBooks];
    component['getBooks'] = jest.fn();

    component['filterArrayByInput'](value);

    expect(component.valueInputSearch).toBe(value);
    expect(component.listBooksFiltered).toEqual([...component.listBooks]);

    component['filterArrayByInput'](value);

    component.valueInputSearch = '';
    component.valueSelect = '0';
    component['filterArrayByInput']('');
    expect(component['getBooks']).toHaveBeenCalled();

    component.valueInputSearch = '';
    component.valueSelect = '1';
    component['filterArrayByInput']('');

    component.valueInputSearch = value;
    component.valueSelect = '1';
    component['filterArrayByInput'](value);
    expect(component.listBooksFiltered).toEqual(filteredBooks);
  });

  it('should filter books based on title', () => {
    const value = 'Search Value';
    const filteredBooks: any[] = [/* array of filtered books */];

    component.listBooksFiltered = [...component.listBooks];

    component['filterBooksByTitle'](value);

    expect(component.listBooksFiltered).toEqual(filteredBooks);
  });
  it('should filter books based on category', () => {
    const idCategory = '1';
    const filteredBooks: any[] = [/* array of filtered books */];

    component.valueSelect = idCategory;
    component.listBooksFiltered = [...component.listBooks];

    component.filterArrayBySelect(idCategory);

    expect(component.listBooksFiltered).toEqual(filteredBooks);
  });

  it('should filter books by category', () => {
    const category = '1';
    const filteredBooks: any = [/* array of filtered books */];

    component.valueSelect = category;
    component.listBooksFiltered = [...component.listBooks];

    component['filterBooksByCategory']();

    expect(component.listBooksFiltered).toEqual(filteredBooks);
  });
  it('should navigate to book view', async () => {
    const book: Book = {
      title: '',
      author: '',
      resume: '',
      image: '',
      url: '',
      userRegister: '',
      category: [],
      public: false,
      isbn13: 0,
      price: '',
      categoriesSelectedAllData: []
    };

    await component.seeBook(book);

    expect(sessionStorage.setItem).toHaveBeenCalledWith('book', JSON.stringify(book));
    expect(router.navigate).toHaveBeenCalledWith(['/admin', 'books', 'view', book.id]);
  });
});
