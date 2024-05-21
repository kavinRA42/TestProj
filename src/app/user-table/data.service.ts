import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private formData = new BehaviorSubject<any>(null);
  formData$ = this.formData.asObservable();
  
  constructor(private http: HttpClient) {}

  getForms(page: number, size: number): Observable<any> {
   
    const url = `http://localhost:8081/data?page=${page}&size=${size}`;
    console.log(url)
    return this.http.get<any>(url);
  }

  searchForms(page: number, size: number, searchTerm: string ): Observable<any> {
   
    const url = `http://localhost:8081/search?page=${page}&size=${size}&search=${searchTerm}`;
    console.log(url)
    return this.http.get<any>(url);
  }
  
  setFormData(data: any) {
    this.formData.next(data);
  }

  
  fetchData(pageNumber: number, pageSize: number, sort: string, direction: string): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString())
      .set('sort', sort + ',' + direction); 

    return this.http.get<any>('http://localhost:8081/users', { params });
  }

}
