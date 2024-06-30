import { Customer } from './../Interfaces/customer';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GetUsersService {
  private apiUrlForGetById = `${environment.baseUrl}/Admin/ServiceById?id=`;
  constructor(private http: HttpClient) {}


  getServiceById(id:string){
    return this.http.get(`${this.apiUrlForGetById}${id}`);
  }

  toggleBlockCustomer(
    CustomerId: string,
    action: 'block' | 'unblock'
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/${action}Customer`;
    const params = { CustomerId };

    const queryParams = new HttpParams().set('customerId', CustomerId);

    return this.http.put(url, null, { params: queryParams });
  }

  getAllCustomers(
    page: number,
    pageSize: number,
    isBlocked: boolean | null
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/Customers`;
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      isBlocked: isBlocked ? isBlocked.toString() : '',
    };

    return this.http.get(url, { params });
  }
}
