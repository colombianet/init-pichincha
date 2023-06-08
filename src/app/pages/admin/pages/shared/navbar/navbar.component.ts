import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  nameUser!: string;

  constructor() { }

  ngOnInit(): void {
    this.nameUser = sessionStorage.getItem('user') || '';
  }

}
