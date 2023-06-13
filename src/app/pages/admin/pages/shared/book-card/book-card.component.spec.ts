import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookCardComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the book image', () => {
    const book = {
      id: '123',
      title: 'Book Title',
      author: 'Author Name',
      resume: 'Book Summary',
      image: 'book-image.jpg',
      url: 'book-url',
      userRegister: 'User Name',
      category: [1, 2, 3],
      public: true,
      isbn13: 9781234567890,
      price: '$9.99',
      categoriesSelectedAllData: []
    };

    component.book = book;
    fixture.detectChanges();

    const imgElement = fixture.nativeElement.querySelector('img');
    expect(imgElement).toBeTruthy();
    expect(imgElement.alt).toBe('Book Title');
  });

  it('should display default image if book has no image', () => {
    const book = {
      id: '123',
      title: 'Book Title',
      author: 'Author Name',
      resume: 'Book Summary',
      url: 'book-url',
      userRegister: 'User Name',
      category: [1, 2, 3],
      public: true,
      isbn13: 9781234567890,
      price: '$9.99',
      categoriesSelectedAllData: []
    } as any;

    component.book = book;
    fixture.detectChanges();

    const imgElement = fixture.nativeElement.querySelector('img');
    expect(imgElement).toBeTruthy();
  });
});
