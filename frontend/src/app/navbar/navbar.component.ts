import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;
  firstName: string = '';
  lastName: string = '';
  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const currentUser = JSON.parse(userString);
      this.isAdmin = currentUser.admin;
      this.firstName = currentUser.profile.firstName;
      this.lastName = currentUser.profile.lastName;
    }
  }

  logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCompanyID');
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}