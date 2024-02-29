import { Injectable, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface userInterface {
  id: number
  username: string
  password: string
}

export interface loginInterface {
  user?: userInterface[]
  token?: string
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  responseLogin?: loginInterface;

  loginUser(username: string, password: string): Observable<boolean> {
    const body = { username: username, password: password };
    return this.http.post<loginInterface>('http://localhost:3000/login', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map((data: loginInterface) => {
        debugger
        this.responseLogin = data;
        return data.token !== undefined;
      })
    );
  }

  isLoggin() {
    if (this.responseLogin?.token !== undefined) {
      return true
    }
    else {
      return false
    }
  }
}
