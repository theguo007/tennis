import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Constants } from '../models/constants';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as alertify from 'alertify.js';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user: User;
  sexes = Constants.sex;
  ntrp = Constants.ntrp;
  profileForm: FormGroup;

  constructor(private authService:AuthService,
    private userService: UserService,
    private fb: FormBuilder) {
      this.createForm();
    }

  createForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required ],
      birthdate: [''],
      sex: [''],
      description: [''],
      ntrp: ['']
    });

    this.profileForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.profileForm) { return; }
    const form = this.profileForm;

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
  }

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    }
  }

  ngOnInit() {
    this.userService.getProfile().subscribe(data=> {
      this.user = data
      this.setForm();
    });    
  }

  setForm(){
    var formattedBirthday;
    this.profileForm.setValue({
      name: this.user.name || '',
      sex: this.user.sex || "Prefer not to disclose",
      ntrp: this.user.ntrp || "Don't Know",
      birthdate: this.user.birthdate || '',
      description: this.user.description || ''
    });
  }

  save(){
    this.user.birthdate = this.profileForm.get('birthdate').value;
    this.user.name = this.profileForm.get('name').value;
    this.user.sex = this.profileForm.get('sex').value;
    this.user.description = this.profileForm.get('description').value;
    this.user.ntrp = this.profileForm.get('ntrp').value;

    this.userService.editUser(this.user._id, this.user).subscribe(data => {
      if(data.success == false){
        alertify.error(data.message);
      } else {
        alertify.success("Profile successfully edited!")
      }
    });

  }
}
