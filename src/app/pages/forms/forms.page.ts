import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-service/auth-service';
import { DataService } from 'src/app/services/data-service/data';
import { ToastService } from 'src/app/services/toast-service/toast';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
  imports: [
    IonText,
    IonButton,
    IonItem,
    IonInput,
    IonLabel,
    IonContent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FormsPage {
  isLoginForm = true;
  private router = inject(Router); //injecting router into the forms page
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  //form groups for auth form
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.createAuthForm(); //make a method to create a form and call it inside the constructor to call the form as soon as the view is created
  }

  createAuthForm() {
    //login form
    this.loginForm = this.fb.group({
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

    //signup form
    this.signupForm = this.fb.group(
      {
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
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  //to match the input password and the confirm password field
  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password');
    const confirm = form.get('confirmPassword');

    if (!pass || !confirm) return null;

    if (pass.value !== confirm.value) {
      confirm.setErrors({ mismatch: true });
    } else {
      confirm.setErrors(null);
    }

    return null;
  }

  //toggle form functionality
  toggleForm() {
    this.isLoginForm = !this.isLoginForm;
    if (this.isLoginForm) {
      this.loginForm.reset();
    } else {
      this.signupForm.reset();
    }
  }

  //on submitting the form
  onSubmit() {
    //if the form not opened is a login form
    if (this.isLoginForm) {
      if (!this.loginForm.valid) {
        this.loginForm.markAllAsTouched();
        return;
      }

      const { email, password } = this.loginForm.value;

      // Check user existence in JSON Server
      this.dataService.getUserByEmail(email).subscribe({
        next: (users) => {
          const user = users.find(
            (u) => u.email === email && u.password === password
          );
          if (user) {
            this.toast.success('Login successful');
            this.authService.login(email);
            this.router.navigate(['']);
            this.loginForm.reset();
          } else {
            this.toast.error(
              'User is not signed up, please sign up to continue'
            );
            this.toggleForm();
          }
        },
        error: (error) => {
          console.log('Error fetching data', error);
          this.toast.error('Please try again later');
        },
      });
    }
    //if the form not opened is a signup form
    else {
      if (!this.signupForm.valid) {
        this.signupForm.markAllAsTouched();
        return;
      }

      const { email, password } = this.signupForm.value;

      // Check if user already exists
      this.dataService.getUserByEmail(email).subscribe({
        next: (users) => {
          const existingUser = users.find((u) => u.email === email);

          if (existingUser) {
            this.toast.warning('Email already registered. Please log in.');
            this.toggleForm();
          } else {
            // Add new user to JSON Server
            this.dataService.addUser({ email, password }).subscribe(() => {
              this.toast.success('Signup successful!');
              this.authService.login(email);
              this.signupForm.reset();
              this.router.navigate(['']);
            });
          }
        },
        error: (error) => {
          console.log('Error fetching data', error);
          this.toast.error('Please try again later');
        },
      });
    }
  }
}
