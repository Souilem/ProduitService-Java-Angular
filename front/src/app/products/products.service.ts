import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable  } from 'rxjs';
import { Product } from './product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    private static productslist: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    constructor(private http: HttpClient) { }

	// recuperer tous les produits
    getProducts(): Observable<Product[]> {
      if(!ProductsService.productslist) {
          this.http.get<Product[]>('http://localhost:8085/products/').subscribe(
              data => {
                  ProductsService.productslist = data;
                  console.log(data);
                  this.products$.next(ProductsService.productslist);
              },
              error => {
                  console.log('Error fetching products', error);
              }
          );
      } else {
          this.products$.next(ProductsService.productslist);
      }

      return this.products$;
  }



	// creer un nouveau produit
	create(prod: Product): Observable<Product[]> {
    return new Observable(observer => {
        this.http.post<Product[]>('http://localhost:8085/products/addOneProduct', prod)
            .subscribe(
                data => {
                    if (Array.isArray(data)) {
                        ProductsService.productslist.push(...data);
                        this.products$.next(ProductsService.productslist);

                    }
                    observer.next(data);
                    window.location.reload(); // reload the page or ChangeDetectorRef
                },
                error => {
                    console.log('Error creating product', error);
                    observer.error(error);
                },
                () => {
                    observer.complete();
                }
            );
    });
}


	// mettre a jour un produit
	update(id: number, updatedProduct: Product): Observable<Product> {
	  const url = `http://localhost:8085/products/${id}`;
	  return this.http.put<Product>(url, updatedProduct);
	}


	// supprimer un produit par id
	delete(id: number): Observable<Product[]> {
	    return new Observable(observer => {
	        this.http.delete<Product[]>(`http://localhost:8085/products/${id}`)
	            .subscribe(
	                deletedProducts => {
	                    ProductsService.productslist = deletedProducts;
	                    this.products$.next(deletedProducts);
	                    observer.next(deletedProducts);
	                    window.location.reload(); // reload the page or ChangeDetectorRef
	                },
	                error => {
	                    console.log('Error deleting product', error);
	                    observer.error(error);
	                },
	                () => {
	                    observer.complete();
	                }
	            );
	    });
	}


	// une autre facon de supprimer un produit rapidement
	  /*  delete(id: number){
	    return this.http.delete("http://localhost:8085/products/"+id);
	  }
	  */

}
