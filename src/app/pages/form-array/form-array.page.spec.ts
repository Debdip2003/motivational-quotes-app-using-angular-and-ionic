import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArrayPage } from './form-array.page';

describe('FormArrayPage', () => {
  let component: FormArrayPage;
  let fixture: ComponentFixture<FormArrayPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormArrayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
