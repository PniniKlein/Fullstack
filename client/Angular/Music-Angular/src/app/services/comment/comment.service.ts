import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../models/Comment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
 private baseUrl = 'https://singsong-api.onrender.com/api/Comment'

  public comments: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  constructor(private http: HttpClient) { }


  getComments() {
    // return this.http.get<User[]>(`${this.baseUrl}/Full`);
    this.http.get<Comment[]>(`${this.baseUrl}/Full`).subscribe(data =>
      this.comments.next(data),
      error => alert("failed")
    );
  }
}
