import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { Product } from './product.class';
import { ProductsService } from './products.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  products: Product[] = [];
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  data: any[];

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];

    this.primengConfig.ripple = true;


    this.loadData();

  }


    loadData() {
    this.productsService.getProducts().subscribe(data => {
      this.data = data;
      this.cdr.detectChanges(); // detect changes
    });
  }


  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

}
