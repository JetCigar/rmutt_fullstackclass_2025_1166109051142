import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CategoryData {
  category_id: number;
  name: string;
  description: string;
  image_url: string;
  is_primary: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:9999/api/categories';


   constructor(private http: HttpClient) {}


   getCategories(): Observable<CategoryData[]> {
     return this.http.get<CategoryData[]>(`${this.apiUrl}/test-category`);
   }



}

   
    