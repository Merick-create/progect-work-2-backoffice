import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from './category.entity';



@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  protected http = inject(HttpClient);

}
