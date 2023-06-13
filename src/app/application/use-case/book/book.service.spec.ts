import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Book } from '../../models/book.model';
import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let httpClientSpy: Partial<HttpClient>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BookService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });

    service = TestBed.inject(BookService);
  });

  it('should call GET method with correct URL to retrieve list of books', () => {
    const expectedBooks: Book[] = [
      { id: '1', title: 'Book 1', author: '', categoriesSelectedAllData: [], category: [], image: '', isbn13: 1, price: '', public: false, resume: '', url: '', userRegister: '' },
      { id: '2', title: 'Book 2', author: '', categoriesSelectedAllData: [], category: [], image: '', isbn13: 1, price: '', public: false, resume: '', url: '', userRegister: '' },
    ];

    (httpClientSpy.get as jest.Mock).mockReturnValue(of(expectedBooks));

    service.getListBooks().subscribe((books) => {
      expect(books).toEqual(expectedBooks);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${service['baseURL']}/books/owner`);
    });
  });

  it('should call POST method with correct URL and book data to create a book', () => {
    const newBook: Book = {
      id: '3', title: 'New Book',
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

    (httpClientSpy.post as jest.Mock).mockReturnValue(of(newBook));

    service.createBook(newBook).subscribe((result) => {
      expect(result).toEqual(newBook);
      expect(httpClientSpy.post).toHaveBeenCalledWith(`${service['baseURL']}/books/owner`, newBook);
    });
  });
});
