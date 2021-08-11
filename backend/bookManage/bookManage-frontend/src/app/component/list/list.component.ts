import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  show: false;
  key: string;
  books=[];
  title = "latest book";
  num=1;
  countsOnPage=3;
  show_books = [];
  cur = 1;
  constructor(private http: Http) { }
  ngOnInit() {
   // http://localhost:8088/rest/list http://jsonplaceholder.typicode.com/users
   
    this.goPage(this.cur);
  }
  goPage(index) {
    this.http.get("http://localhost:8088/rest/list/"+index+"/"+this.countsOnPage+""). pipe(map((response) => response.json())).subscribe((data)=> {
      console.log(data);
      this.books=data;
      this.show_books=this.books;
      
  })
   
   // for (let i = 0; i < this.books.length; i++) {
     // if (film.books[i].page == index) {
      //  this.movies = film.info[i].data;
      //  break;
     // }
   // }
  }
  prev() {
    this.cur--;
    if (this.cur == 0) this.cur = 1;
    this.goPage(this.cur);
  }
  next() {
    this.cur++;
    if (this.cur > 2) this.cur = 2;
    this.goPage(this.cur);
  }
  search() {
    var tmp = [];
    if (this.key != "") {
     // for (let i = 0; i < this.books.info.length; i++) {
        for (let j = 0; j < this.books.length; j++) {
          if (this.books[j].title.indexOf(this.key) != -1) {
            tmp.push(this.books[j])
          }
        }
      //}
      this.show_books = tmp;
    } else {
      this.show_books = film.books[0];
    }
  }
}
