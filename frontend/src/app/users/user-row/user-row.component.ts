import { Component, Input, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { User, defaultUser } from 'src/app/user.model';

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent implements OnInit {

  @Input() user: User = defaultUser;
  companyID: number = 0;
  adminID: number = 0;

  toggleActive() {
    this.user.active = !this.user.active;
    this.apiService.toggleActiveUser(this.user.id, this.companyID, this.adminID).subscribe();
    console.log(`UserID ${this.user.id} toggled active to ${this.user.active ? 'YES' : 'NO'}`);
  }

  constructor(private apiService: APIService) {}

  ngOnInit() {
    let currentCompany = localStorage.getItem('currentCompanyID');
    if (currentCompany) {
      this.companyID = parseInt(currentCompany);
    }

    let loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser){
      this.adminID = JSON.parse(loggedInUser).id;
    }
  }
}
