import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PublicLibraryComponent } from './public-library.component';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CategoryService } from '../../../../application/use-case/category/category.service';
import { BookService } from '../../../../application/use-case/book/book.service';


describe('Cart component', () => {

    let component: PublicLibraryComponent;
    let fixture: ComponentFixture<PublicLibraryComponent>;
    let categoService: CategoryService;
    let bookService: BookService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule
            ],
            declarations: [
              PublicLibraryComponent
            ],
            providers: [
              CategoryService, BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });


    beforeEach(() => {
        fixture = TestBed.createComponent(PublicLibraryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        categoService = fixture.debugElement.injector.get(CategoryService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize array of categories', () => {
      const categories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
      ];

      jest.spyOn(categoService, 'getListCategories').mockReturnValue(of(categories) as any);

      component.ngOnInit();

      const categoriesArray = component.booksPublicForm.get('categories') as FormArray;
      expect(categoriesArray.length).toBe(3);

      categories.forEach((category, index) => {
        const formGroup = categoriesArray.at(index) as FormControl;
        expect(formGroup.value.data).toEqual(category);
        expect(formGroup.value.valueCheck).toBe(false);
      });
    });

    it('should filter listBooksPublics by title when valueInputSearch is not empty', () => {
      const category = [
        { valueCheck: true, data: { description: 'Category 1' } },
        { valueCheck: true, data: { description: 'Category 2' } }
      ];

      const listBooksAll: any[] = [
        { title: 'Book 1', categoriesSelectedAllData: [{ description: 'Category 1' }] },
        { title: 'Book 2', categoriesSelectedAllData: [{ description: 'Category 2' }] },
        { title: 'Book 3', categoriesSelectedAllData: [{ description: 'Category 1' }, { description: 'Category 2' }] }
      ];

      component.categoriesSelected = category as any;
      component.listBooksAll = listBooksAll;
      component.valueInputSearch = 'book';

      component.filterByCheckboxCategories(category);

      expect(component.listBooksPublics).toBeDefined();
    });

    it('should update listBooksAll and call filterBooksPublic', () => {

      component['getBooks']();

      expect(component.listBooksAll).toBeDefined();
    });
    it('should update valueInputSearch and call filterBooksPublic and filterBooksByTitle', () => {
      const mockValue = 'search value';
      const filterBooksPublicSpy = jest.spyOn(component, 'filterBooksPublic');

      component['doSearch']();
      component.search.setValue(mockValue);

      expect(component.valueInputSearch).toEqual(mockValue.toLowerCase());
      expect(filterBooksPublicSpy).toHaveBeenCalledWith(component.listBooksAll);
    });

    it('should filter listBooksPublics by title and call filterByCheckboxCategories when categoriesSelected is not empty', () => {
      const mockValue = 'search value';
      const mockBook1 = { title: 'Book 1' };
      const mockBook2 = { title: 'Book 2' };
      component.listBooksPublics = [mockBook1, mockBook2] as any;
      component.categoriesSelected = [{ data: { description: 'Category 1' }, valueCheck: true }] as any;

      const filterByCheckboxCategoriesSpy = jest.spyOn(component, 'filterByCheckboxCategories');

      component['filterBooksByTitle'](mockValue);

      expect(filterByCheckboxCategoriesSpy).toHaveBeenCalledWith(component.categoriesSelected);
      expect(component.listBooksPublics).toBeDefined();
    });

    it('should set book in sessionStorage and navigate to view book page', async () => {
      const mockBook = { id: 1, title: 'Book 1' };
      const setItemSpy = jest.spyOn(sessionStorage, 'setItem');

      component.seeBook(mockBook as any);

      expect(setItemSpy).toHaveBeenCalledWith('book', JSON.stringify(mockBook));
    });
});
