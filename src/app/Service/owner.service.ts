import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private baseUrl = `${environment.baseUrl}/Account/updateOwnerInfo`;
  private baseUrl2 = `${environment.baseUrl}/Account/getOwnerInfo`;

  constructor(private http: HttpClient) {}

  getAllOwners(
    page: number,
    pageSize: number,
    accountStatus: number | null,
    isBlocked: boolean | null,
    selectedUserType: string | null
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/owners`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (accountStatus !== null) {
      params = params.set('status', accountStatus.toString());
    }

    if (isBlocked !== null) {
      params = params.set('isBlocked', isBlocked.toString());
    }

    if (selectedUserType !== null) {
      params = params.set('userType', selectedUserType);
    }

    return this.http.get(url, { params });
  }

  toggleBlockStatus(
    ownerId: string,
    action: 'block' | 'unblock'
  ): Observable<any> {
    const url = `${environment.baseUrl}/Admin/${action}Owner`;
    const params = { ownerId };

    const queryParams = new HttpParams().set('ownerId', ownerId);

    return this.http.put(url, null, { params: queryParams });
  }

  GetOwnerDetails(ownerId: string): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}/Admin/GetOwnerById/${ownerId}`;
    return this.http.get(url, { headers });
  }

  acceptOwner(ownerId: string): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}/Admin/AcceptOwner?ownerId=${ownerId}`;
    return this.http.put(url, headers);
  }
  declineOwner(ownerId: string): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.baseUrl}/Admin/DeclineOwner?ownerId=${ownerId}`;
    return this.http.put(url, headers);
  }
  GetOwnerInfo(email: string): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl2}?email=${email}`;
    return this.http.get(url, { headers });
  }

  UpdateOwnerInfo(UpdateOwnerInfo: FormData): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(this.baseUrl, UpdateOwnerInfo, { headers });
  }

  GetProfileImage(imagePath: string): Observable<Blob> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${environment.UrlForImages}/${imagePath}`;
    return this.http.get(url, { headers, responseType: 'blob' });
  }
}
