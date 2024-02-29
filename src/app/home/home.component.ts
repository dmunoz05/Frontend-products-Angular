import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { HomeService } from './home.service';
import { productInterface } from './home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService, private router: Router) { }

  products = signal<productInterface[]>([])

  token: string = localStorage.getItem('token') || ''

  ngOnInit() {
    this.homeService.getProducts(this.token).subscribe((data: productInterface[]) => {
      if(data.length >= 0){
        this.products.set(data)
      } else {
        this.router.navigate(['/'])
      }
    }, error => {
      this.products.set([])
    })
  }

}
