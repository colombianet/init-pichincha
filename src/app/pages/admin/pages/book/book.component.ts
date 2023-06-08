import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/application/models/book.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  book!: Book;
  categories: string[] = [];
  showSpinner = true;
  listCategoriesBookByName = '';

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.book = JSON.parse(sessionStorage.getItem('book') || '') as Book || {} as Book;
    setTimeout(() => {
      this.showSpinner = false;
    }, 3000);
    this.listCategoriesBookByName = this.listCategoriesByName(this.book);
  }

  back() {
    this.location.back();
  }

  listCategoriesByName(book: Book) {
    let arrayTemp: string[] = [];
    book.categoriesSelectedAllData.forEach(b => {
      arrayTemp.push(b.description);
    });
    return arrayTemp.join(", ");
  }
}
