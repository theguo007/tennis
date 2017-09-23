import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as alertify from 'alertify.js';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  registerForm: FormGroup;  

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService)
    {
      this.createForm();
    }

  ngOnInit() {
  }

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required ],
      email: ['', [Validators.email]],
      passwords: this.fb.group(
        {
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)] ],
        password_confirm: ['', [Validators.required] ],
        }, { validator: this.passwordMatchValidator}
      ),
    });

    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  passwordMatchValidator(fg: FormGroup) {
    return fg.get('password').value === fg.get('password_confirm').value 
        ? null : {'mismatch': true};
  }

  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'name': '',
    'email': '',
    'passwords.password': '',
    'passwords.password_confirm': ''
  }

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'email': 'Please enter a valid email address.'
    },
    'passwords.password': {
      'required': 'Please enter a password between 6 and 20 characters long.',
      'minlength': 'Password must be at least 6 characters.',
      'maxlength': 'Password must be at most 20 characters.'
    }

  }

  onRegister() {
    const user = {
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('passwords.password').value
    }

    this.userService.createUser(user).subscribe(data => {
      if(data.success == false){
        alertify.error(data.message);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
