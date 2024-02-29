import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { Observable, catchError, map, of } from 'rxjs';

export interface productInterface {
  id: number,
  name: string,
  price: number,
  quantity: number,
  description: string
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  objProducts: productInterface[] = [];

  getProducts(tokenStorage: string): Observable<productInterface[]  > {
    const token: string = this.loginService.responseLogin?.token || tokenStorage;
    return this.http.get<productInterface[]>('http://localhost:3000/products', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).pipe(
      map((data: productInterface[]) => {
        this.objProducts = data
        return this.objProducts;
      }), catchError((error) => {
        this.objProducts = [];
        return of(error);
      })
    )
  }
}
