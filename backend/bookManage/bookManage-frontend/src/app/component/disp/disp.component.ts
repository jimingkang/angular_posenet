import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-disp',
  templateUrl: './disp.component.html',
  styleUrls: ['./disp.component.css']
})
export class DispComponent implements OnInit {
  title = "detail";
  book = [];
  constructor(private route: ActivatedRoute,private http: Http) {

  }
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id')
      console.log(id);
      this.http.get("http://localhost:8088/rest/book/"+id). pipe(map((response) => response.json())).subscribe((data)=> {
        console.log(data);
        this.book=data;
      })
     
     /* for (let i = 0; i < film.info.length; i++) {
        for (let j = 0; j < film.info[i].data.length; j++) {
          if (film.info[i].data[j].id == id) {
            this.movie = film.info[i].data[j];
            break;
          }
        }
      } */
    })
  }
}
