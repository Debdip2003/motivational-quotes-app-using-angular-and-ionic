import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import {
  IonItem,
  IonText,
  IonButton,
  IonInput,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast-service/toast';

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.page.html',
  styleUrls: ['./form-array.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonText,
    IonItem,
    IonInput,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FormArrayPage {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  form = this.fb.group({
    formValue: this.fb.array([]),
  });

  index: any;

  get formValue() {
    return this.form.controls['formValue'] as FormArray;
  }

  constructor() {}

  addButton() {
    const formInputValue = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
    });

    this.formValue.push(formInputValue);
  }

  removeField(valueIndex: number) {
    this.formValue.removeAt(valueIndex);
  }

  onSubmit() {
    if (
      this.formValue.value.email == '' ||
      this.formValue.value.password == ''
    ) {
      console.log(this.formValue.value);
    } else {
      this.toast.error('Please enter a value!');
    }
  }
}
