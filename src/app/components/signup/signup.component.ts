import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../shared/passwordMatchValidator';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthserviceService } from '../../services/authservice.service';
import { User } from '../../../interfaces/interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthserviceService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }
  
  get fullName() {
    return this.registerForm.controls['fullName'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
    console.log('pressed')
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;
    localStorage.setItem('userData', JSON.stringify(postData));
    this.authService.registerUser(postData as unknown as User).subscribe(
      (response: any) => {
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.router.navigate(['verify-otp']);
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error });
      }
    );
  }
}