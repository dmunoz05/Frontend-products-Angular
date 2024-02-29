import { Component, OnInit, signal } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) { }

  username = signal('')
  password = signal('')
  message = signal('')
  showMessage = signal(false)
  localStorage = document.defaultView?.localStorage;

  handleUserName(event: Event) {
    const inputUserName = event.target as HTMLInputElement
    this.username.set(inputUserName.value)
    this.showMessage.set(false)
  }

  handleUserPassword(event: Event) {
    const inputUserPassword = event.target as HTMLInputElement
    this.password.set(inputUserPassword.value);
    this.showMessage.set(false)
  }

  login() {
    this.loginService.loginUser(this.username(), this.password()).subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        //Guardar token en localstorage
        localStorage.setItem('token', this.loginService.responseLogin?.token || '');
        this.router.navigate(['/home']);
      } else {
        this.username.set('')
        this.password.set('')
        this.message.set(this.loginService.responseLogin?.message || '')
        this.showMessage.set(true)
      }
    });
  }
}
