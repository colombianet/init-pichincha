import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Book } from 'src/app/application/models/book.model';
import { BookService } from '../../../../application/use-case/book/book.service';
import { CategoryService } from '../../../../application/use-case/category/category.service';
import { isValidField, isValidFieldCustom } from '../../../../shared/utils/form-validations';

@Component({
  selector: 'app-register-book',
  templateUrl: './register-book.component.html',
  styleUrls: ['./register-book.component.scss']
})
export class RegisterBookComponent implements OnInit {

  categoriesArray!: FormArray;
  categoriesSelected: any[] = [];
  userRegister = '';
  isPopupVisible: boolean = false;
  book!: Book;
  isNewBook!: boolean;
  registerBookForm!: FormGroup;

  createForm(): void {
    this.registerBookForm = this.fb.group({
      bookname: [!this.isNewBook && this.book?.title || '', [Validators.required]],
      authorname: [!this.isNewBook && this.book?.author || '', [Validators.required]],
      urlbook: [this.setUrl(), [Validators.required,
      Validators.pattern(/^(http:\/\/|https:\/\/).+/)]],
      image: [!this.isNewBook && this.book?.image || '', [Validators.required,
      Validators.pattern(/^(http:\/\/|https:\/\/).+/)]],
      summary: [!this.isNewBook && this.book?.resume || '', [Validators.required]],
      post: [!this.isNewBook && this.book?.public || false],
      categories: this.fb.array([], this.validateArraySelections(1))
    });
  }

  private setUrl() {
    if(!this.isNewBook) {
      return this.book.url == '/assets/image/noimage.jpg'
        ? 'Selecciona una nueva imagen'
        : this.book.url;
    } else {
      return '';
    }
  }

  constructor(private categorySvc: CategoryService, private fb: FormBuilder,
    private bookSvc: BookService, private location: Location, private aRouter: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.initArrayCategories();
    this.userRegister = sessionStorage.getItem('user') || '';
    const bookObject: Book = eval(`(${sessionStorage.getItem('book')})`);
    this.book = bookObject;
    this.isNewRegisterBook();
  }

  private isNewRegisterBook() {
    this.aRouter.paramMap
      .pipe(
        map(params => {
          return params.get('mode');
        })
      )
      .subscribe(mode => {
        this.isNewBook = mode === 'new';
        this.createForm();
      });
  }

  back() {
    this.location.back();
  }

  private initArrayCategories() {
    this.categorySvc.getListCategories().subscribe(categories => {
      this.categoriesArray = this.registerBookForm.get('categories') as FormArray;
      categories.forEach(category => {
        let data = new FormGroup({
          data: new FormControl(category),
          valueCheck: new FormControl(false),
        });
        this.categoriesArray.push(data);
      });
      return this.categoriesArray;
    });
  }

  isValidField(nameField: string) {
    return isValidField(this.registerBookForm, nameField);
  }

  isValidFieldCustom(nameField: string, nameError: string) {
    return isValidFieldCustom(this.registerBookForm, nameField, nameError);
  }

  get listCategories() {
    return this.registerBookForm.get('categories') as any;
  }

  validateArraySelections(minSelections: number): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      this.categoriesSelected = (formArray as FormArray).getRawValue().filter(({ valueCheck }) => valueCheck === true);
      return this.categoriesSelected.length >= minSelections ? null : { insufficientSelections: true };
    };
  }

  addBook() {
    if (this.registerBookForm.invalid) return;
    const { bookname, authorname, urlbook, image, summary, post } = this.registerBookForm.value;
    const categoriesSelected: any[] = [];
    const categoriesSelectedAllData: any[] = [];
    this.categoriesSelected.forEach(c => {
      if (c.valueCheck) {
        categoriesSelected.push(c.data.id)
        categoriesSelectedAllData.push(c.data);
      }
    });
    const dataRegisterBook = {
      userRegister: this.userRegister, price: '', isbn13: 2, title: bookname,
      author: authorname, url: urlbook, image, resume: summary, public: post,
      category: categoriesSelected, categoriesSelectedAllData
    };
    this.bookSvc.createBook(dataRegisterBook).subscribe(r => {
      this.togglePopup();
    })
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  goToListBooks() {
    this.router.navigate(['/admin', 'books']);
  }
}
