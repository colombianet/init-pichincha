import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../../../../../application/models/book.model';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent implements OnInit {

  @Input() book!: Book;
  defaultImageUrl = '/assets/image/noimage.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
