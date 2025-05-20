import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayUserService {

  private baseUrl = 'https://singsong-api.onrender.com/api/User'

  public users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  constructor(private http: HttpClient) { }


  getUsers() {
    // return this.http.get<User[]>(`${this.baseUrl}/Full`);
    this.http.get<User[]>(`${this.baseUrl}/Full`).subscribe(data =>
      this.users.next(data),
      error => alert("failed")
    );
  }

  addUser(user: User) {
    // return this.http.post<User>(`${this.baseUrl}`, user);
    this.http.post<any>(this.baseUrl,user).subscribe(data=>
      this.getUsers(),
      error => alert("failed")
    );
  }

  deleteUser(id: number) {
    // return this.http.delete(`${this.baseUrl}/${id}`);
    this.http.delete<any>(this.baseUrl+"/"+id).subscribe(data=>
      this.getUsers(),
      error => alert("failed")
    )
  }
}
