import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoimageComponent } from './noimage.component';

describe('NoimageComponent', () => {
  let component: NoimageComponent;
  let fixture: ComponentFixture<NoimageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoimageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
