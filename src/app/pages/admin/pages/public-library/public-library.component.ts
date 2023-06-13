import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Book } from 'src/app/application/models/book.model';
import { Category } from 'src/app/application/models/category.model';
import { BookService } from '../../../../application/use-case/book/book.service';
import { CategoryService } from '../../../../application/use-case/category/category.service';

@Component({
  selector: 'app-public-library',
  templateUrl: './public-library.component.html',
  styleUrls: ['./public-library.component.scss']
})
export class PublicLibraryComponent implements OnInit {

  listBooksAll: Book[] = [];
  listBooksPublics: Book[] = [];
  categories: Category[] = [];

  search = new FormControl();
  valueInputSearch = '';
  categoriesSelected: Category[] = [];

  booksPublicForm: FormGroup;

  constructor(
    private booksSvc: BookService,
    private categorySvc: CategoryService,
    private fb: FormBuilder,
  ) {
    this.booksPublicForm = this.fb.group({
      categories: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getBooks();
    this.doSearch();
    this.initArrayCategories();
    this.listenerCheckboxCategories();
  }

  private initArrayCategories() {
    this.categorySvc.getListCategories().subscribe(categories => {
      const categoriesArray = this.booksPublicForm.get('categories') as FormArray;
      categories.forEach(category => {
        const data = this.fb.group({
          data: [category],
          valueCheck: [false]
        });
        categoriesArray.push(data);
      });
      return categoriesArray;
    });
  }

  get listCategories() {
    return this.booksPublicForm.get('categories') as any;
  }

  listenerCheckboxCategories() {
    this.booksPublicForm.get('categories')?.valueChanges.subscribe((category: Category[]) => {
      this.filterByCheckboxCategories(category);
    });
  }

  filterByCheckboxCategories(category: any[]) {
    this.categoriesSelected = category.filter(c => c.valueCheck);
    this.filterBooksPublic([...this.listBooksAll]);

    let booksTemp: Book[] = [];
    let categorySelected: string = '';
    let categorieSelecteds: string[] = [];

    this.categoriesSelected.forEach((c: any) => {
      categorySelected = c.data.description;
      categorieSelecteds.push(c.data.description);
    });

    this.listBooksPublics.forEach(l => {
      l.categoriesSelectedAllData.forEach(lf => {
        categorieSelecteds.forEach(cs => {
          if (lf.description == cs && !booksTemp.includes(cs as unknown as Book)) {
            booksTemp.push(l);
          }
        });
        if (categorieSelecteds.length == 0) {
          this.filterBooksPublic(this.listBooksAll);
        }
      });
    });

    if (categorySelected == '') {
      this.filterBooksPublic(this.listBooksAll);
    } else {
      this.listBooksPublics = booksTemp.filter((valor, indice, arreglo) => arreglo.indexOf(valor) === indice);
    }

    if (this.valueInputSearch != '') {
      this.listBooksPublics = this.listBooksPublics.filter(
        book => book.title.toLowerCase().includes(this.valueInputSearch)
      );
    }
  }

  filterBooksPublic(books: Book[]) {
    this.listBooksPublics = books.filter(l => l.public === true);
  }

  private getBooks() {
    this.booksSvc.getListBooks().subscribe(r => {
      this.listBooksAll = [...r];
      this.filterBooksPublic(this.listBooksAll);
    });
  }

  private doSearch() {
    this.search.valueChanges.subscribe(value => {
      this.valueInputSearch = value.toLowerCase();
      this.filterBooksPublic(this.listBooksAll);
      this.filterBooksByTitle(this.valueInputSearch);
    });
  }

  private filterBooksByTitle(value: string) {
    if (this.categoriesSelected.length == 0) {
      this.listBooksPublics = this.listBooksPublics.filter(
        book => book.title.toLowerCase().includes(value)
      );
    }

    if (this.categoriesSelected.length > 0) {
      this.filterByCheckboxCategories(this.categoriesSelected);
      this.listBooksPublics = this.listBooksPublics.filter(
        book => book.title.toLowerCase().includes(value)
      );
    }
  }


  seeBook(book: Book) {
    sessionStorage.setItem('book', JSON.stringify(book));
  }
}
