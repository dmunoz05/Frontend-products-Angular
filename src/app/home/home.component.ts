import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { HomeService } from './home.service';
import { productInterface } from './home.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  localStorage: any;

  constructor(private homeService: HomeService, private router: Router) {
    if(document !== undefined)
      this.localStorage = document.defaultView?.localStorage || null;

  }
  form = new FormGroup({
    id: new FormControl<number>(0),
    name: new FormControl<string>('Nombre'),
    price: new FormControl<number>(0),
    quantity: new FormControl<number>(0),
    description: new FormControl<string>('Descripción')
  }, {
    validators: [
      Validators.required,
    ]
  })

  token: string = localStorage.getItem('token') || ''
  showProducts = signal<boolean>(false)
  showEditProduct = signal<boolean>(false)
  products = signal<productInterface[]>([])
  newProduct = signal<productInterface[]>([])

  ngOnInit() {
    this.getProducts()
  }

  getProducts() {
    this.homeService.getProducts(this.token).subscribe((data: productInterface[]) => {
      if (data.length > 0) {
        this.products.set(data)
      }
      else if (data.length === 0) {
        this.products.set([])
      }
      else {
        this.router.navigate(['/'])
      }
    }, error => {
      this.products.set([])
    })
  }

  deleteProduct(id: number) {
    this.homeService.deleteProduct(id, this.token).subscribe((data: any) => {
      this.products.set(data)
      this.getProducts()
    })
  }

  showCreateProduct() {
    this.showProducts.set(!this.showProducts())
    this.newProduct.set([])
  }

  handleEditProduct(product: productInterface) {
    this.showProducts.set(!this.showProducts())
    this.newProduct.set([])
    this.form.setValue({
      id: product.id || 0,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description
    })
    this.showEditProduct.set(true)
  }

  createProductHandle() {
    const formData = this.form.value;
    // Crear un nuevo objeto que coincida con productInterface
    const newProduct: productInterface = {
      name: formData.name || '',
      price: formData.price || 0,
      quantity: formData.quantity || 0,
      description: formData.description || ''
    };

    this.homeService.createProduct(newProduct, this.token).subscribe((data: any) => {
      this.products.set(data);
      this.getProducts();
      this.showProducts.set(!this.showProducts());
    });
  }

  cancelEdit() {
    this.showProducts.set(false)
    this.showEditProduct.set(false)
  }

  editProduct() {
    const formData = this.form.value;
    // Crear un nuevo objeto que coincida con productInterface
    const newProduct: productInterface = {
      name: formData.name || '',
      price: formData.price || 0,
      quantity: formData.quantity || 0,
      description: formData.description || ''
    };
    const id = formData.id || 0;

    this.homeService.updateProduct(id, newProduct, this.token).subscribe((data: any) => {
      this.products.set(data)
      this.getProducts()
      this.showProducts.set(!this.showProducts())
      this.showEditProduct.set(false)
    })
  }
}
