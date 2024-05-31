import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, deactivatedUser } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyComponent implements OnInit {

  currentUser: User = <User>{};

  companySelection(event: any) {
    if (event.target.value !== 'Pick An Option') {
      localStorage.setItem('currentCompanyID', event.target.value);
      this.router.navigate(['/home']);
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userObject = localStorage.getItem('currentUser');
    if (userObject) {
      this.currentUser = JSON.parse(userObject);
      if (!this.currentUser.admin) {
        this.router.navigate(['/home']);
      }
    }
  }



}
