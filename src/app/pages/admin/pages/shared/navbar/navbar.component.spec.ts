import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
const sessionStorageMock = {
  clear: jest.fn()
};
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    sessionStorageMock.clear.mockClear();
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set nameUser from sessionStorage on ngOnInit', () => {
    const username = 'John Doe';
    const getItemSpy = jest.spyOn(sessionStorage, 'getItem').mockReturnValue(username);

    component.ngOnInit();

    expect(component.nameUser).toBe(username);
    expect(getItemSpy).toHaveBeenCalledWith('user');
  });
  it('debe limpiar la sesión de almacenamiento', () => {
    const spy = jest.spyOn(component, 'logout');
    component.logout();

    expect(spy).toHaveBeenCalled();
  });
});
