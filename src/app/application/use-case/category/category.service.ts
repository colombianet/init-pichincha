import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseURL = environment.baseURL;

  constructor( private http: HttpClient ) { }

  getListCategories(): Observable<Category[]> {
    const url = `${ this.baseURL }/category`;
    return this.http.get<Category[]>( url );
  }
}
