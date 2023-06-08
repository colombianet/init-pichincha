import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from '../../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseURL = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getListBooks(): Observable<Book[]> {
    const url = `${ this.baseURL }/books/owner`;
    return this.http.get<Book[]>( url );
  }

  createBook(book: Book): Observable<Book[]> {
    const url = `${ this.baseURL }/books/owner`;
    return this.http.post<Book[]>( url, book );
  }
}
