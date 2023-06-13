import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closePopup', () => {
    const spy = jest.spyOn(component, 'closePopup');
    const emitSpy = jest.spyOn(component.isVisibleChange, 'emit');
    component.closePopup();
    expect(spy).toHaveBeenCalled();
    expect(component.isVisible).toBeFalsy();
    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
