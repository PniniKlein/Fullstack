import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/User';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7093/api/User'
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(new User(0, '', '', '', '',[], [],''));

  constructor(private http: HttpClient) { }

  getFull() {
    return this.http.get<User[]>(`${this.baseUrl}/Full`);
  }

  getById(id: number) {
    console.log(id);
    debugger
    this.http.get<User>(`${this.baseUrl}/${id}/Full`).subscribe(data => {
      console.log(data);   
      this.user.next(data as User);
      console.log(this.user.value);
    }
    );
  }

   updateUser(user: User) {
    // return this.http.post<User>(`${this.baseUrl}`, user);
    this.http.post<any>(this.baseUrl+"/"+this.user.value.id,user).subscribe(data=>
      this.user = data ,
      error => alert("failed")
    );
  }

  clearUser()
  {
    this.user = new BehaviorSubject<User>(new User(0, '', '', '', '',[], [],''));
  }

  getUserFromToken() {
    const token = sessionStorage.getItem('authToken')
    if (token)
      try {
        const decodedToken: any = jwtDecode(token)
        console.log(decodedToken)
        this.getById(decodedToken.id)
        console.log(this.user.value)
      }
      catch (error) {
        console.error('שגיאה בפענוח ה-Token:', error)
      }
  }

  ngOnInit() {
    this.getUserFromToken()
  }

}
