import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/application/models/book.model';
import { Category } from 'src/app/application/models/category.model';
import { BookService } from '../../../../application/use-case/book/book.service';
import { CategoryService } from '../../../../application/use-case/category/category.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  listBooks: Book[] = [];
  listBooksFiltered: Book[] = [];
  search = new FormControl();
  listCategories: Category[] = [];
  valueInputSearch = '';
  valueSelect = '0';

  constructor(private booksSvc: BookService, private router: Router,
    private categorySvc: CategoryService) { }

  ngOnInit(): void {
    this.getBooks();
    this.doSearch();
    this.getCategories();
  }

  private getCategories() {
    this.categorySvc.getListCategories().subscribe(c => {
      this.listCategories = c;
    });
  }

  private doSearch() {
    this.search.valueChanges.subscribe(value => {
      this.valueInputSearch = value;
      const valueSearched = value.toLowerCase();
      this.filterArrayByInput(valueSearched);
    });
  }

  private filterArrayByInput(value: any) {
    this.valueInputSearch = value;
    this.listBooksFiltered = [...this.listBooks];
    // Hay algo en input
    if (this.valueInputSearch.length > 0) {
      this.filterBooksByTitle(value);
    }
    // No hay anda en input y select está en todos
    if (this.valueInputSearch.length == 0 && this.valueSelect == '0') {
      this.getBooks();
    }
    // No hay anda en input y select tiene una opción
    if (this.valueInputSearch.length == 0 && this.valueSelect != '0') {
      this.filterArrayBySelect(this.valueSelect);
    }
    // Hay algo en input y select tiene una opción
    if (this.valueInputSearch.length > 0 && this.valueSelect != '0') {
      this.filterArrayBySelect(this.valueSelect);
      this.listBooksFiltered = this.listBooksFiltered.filter(book =>
        book.title.toLowerCase().includes(value)
      );
    }
  }

  private filterBooksByTitle(value: any) {
    this.listBooksFiltered = this.listBooksFiltered.filter(book => book.title.toLowerCase().includes(value)
    );
  }

  filterArrayBySelect(idCategory: string) {
    this.valueSelect = idCategory;
    this.filterBooksByCategory();

    // Hay algo en input y select tiene una opción
    if (this.valueInputSearch.length > 0 && this.valueSelect != '0') {
      this.filterBooksByCategory();
      this.listBooksFiltered = this.listBooksFiltered.filter(book =>
        book.title.toLowerCase().includes(this.valueInputSearch)
      );
    }
    // Hay algo en input y select está en todos
    if (this.valueInputSearch.length > 0 && this.valueSelect == '0') {
      const allBooks = [...this.listBooks];
      const newFilter = allBooks.filter(book =>
        book.title.toLowerCase().includes(this.valueInputSearch)
      );
      this.listBooksFiltered = newFilter;
    }
    // no hay nada en input y select tiene todo
    if (this.valueInputSearch.length == 0 && this.valueSelect == '0') {
      this.listBooksFiltered = [...this.listBooks];
    }
  }

  private filterBooksByCategory() {
    this.listBooksFiltered = [...this.listBooks];
    let newCategories: Book[] = [];
    this.listBooksFiltered.forEach(l => {
      l.category.forEach(c => {
        if (c == Number(this.valueSelect)) {
          newCategories.push(l);
        };
      });
    });
    this.listBooksFiltered = newCategories;
  }

  private getBooks() {
    this.booksSvc.getListBooks().subscribe(r => {
      this.listBooks = r;
      this.listBooksFiltered = [...this.listBooks];
    });
  }

  async seeBook(book: Book) {
    sessionStorage.setItem('book', JSON.stringify(book));
    await this.router.navigate(['/admin', 'books', 'view', book.id]);
  }

}
