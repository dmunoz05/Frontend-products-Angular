import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { Observable, catchError, map, of } from 'rxjs';

export interface productInterface {
  id?: number,
  name: string,
  price: number,
  quantity: number,
  description: string
}

export interface productDeletInterface {
  message : string
  product : { id: number }
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

  deleteProduct(id: number, tokenStorage: string): Observable<productDeletInterface[]> {
    const token: string = this.loginService.responseLogin?.token || tokenStorage;
    return this.http.delete(`http://localhost:3000/product/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).pipe(
      map((data: any) => {
        return data;
      }), catchError((error) => {
        return of(error);
      })
    )
  }

  createProduct(product: productInterface, tokenStorage: string): Observable<productInterface[]> {
    const token: string = this.loginService.responseLogin?.token || tokenStorage;
    return this.http.post<productInterface[]>('http://localhost:3000/product/', product, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }).pipe(
      map((data: productInterface[]) => {
        return data;
      }), catchError((error) => {
        return of(error);
      })
    )
  }
}
