import { Injectable } from '@angular/core';
import { Song } from '../../models/Song';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private baseUrl = 'https://localhost:7093/api/Song'

  public songs: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  constructor(private http: HttpClient) { }


  getSongs() {
    this.http.get<Song[]>(`${this.baseUrl}/Full`).subscribe({
      next: data => {
        this.songs.next(data);
        if (data) {
          for (let i = 0; i < this.songs.value.length; i++) {
            let totalStars = 0;
            for (let j = 0; j < (this.songs.value[i].comments?.length || 0); j++) {
              totalStars += this.songs.value[i].comments![j].star;
            }
            this.songs.value[i].stars = totalStars;
          }
        }
      },
      error: () => alert("failed")
    });
  }

  addSong(song: Song) {
    // return this.http.post<User>(`${this.baseUrl}`, user);
    this.http.post<any>(this.baseUrl,song).subscribe(data=>
      this.getSongs(),
      error => alert("failed")
    );
  }

  deleteSong(id: number) {
    // return this.http.delete(`${this.baseUrl}/${id}`);
    this.http.delete<any>(this.baseUrl+"/"+id).subscribe(data=>
      this.getSongs(),
      error => alert("failed")
    )
  }
}
