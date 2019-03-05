import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


interface Person {
  _id: string;
  name: string;
  age: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of people
  people$: Observable<Person[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllPeople();
  }

  // Add one person to the API
  addPerson(name, age) {
    this.http.post(`${this.API}/users`, { name, age }).pipe(
      // map(res => res.json()),
      take(1),
      tap(() => (this.getAllPeople())),
    ).subscribe();
  }

  removePerson({ _id }: Person) {
    this.http.delete(`${this.API}/users/${_id}`).pipe(
      // map(res => res.json()),
      take(1),
      tap(() => (this.getAllPeople())),
    ).subscribe();
  }

  // Get all users from the API
  private getAllPeople() {
    this.people$ = this.http.get<Person[]>(`${this.API}/users`).pipe(take(1));
  }
}
