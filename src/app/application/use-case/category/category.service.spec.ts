import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Category } from '../../models/category.model';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpClientSpy: Partial<HttpClient>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });

    service = TestBed.inject(CategoryService);
  });

  it('should call GET method with correct URL to retrieve list of categories', () => {
    const expectedCategories: any[] = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ];


    (httpClientSpy.get as jest.Mock).mockReturnValue(of(expectedCategories));

    service.getListCategories().subscribe((categories) => {
      expect(categories).toEqual(expectedCategories);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${service['baseURL']}/category`);
    });
  });
});
