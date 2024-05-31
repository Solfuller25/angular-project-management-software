import { Component, OnInit } from '@angular/core';
import { UserRegistryService } from '../services/userRegistry.service';
import { User, defaultUser, deactivatedUser, defaultAdmin } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  overlayVisible: boolean = false;
  userRegistry: User[] = [];
  emptyUserRegistry: boolean = false;
  loggedInUser: User = <User>{};

  closeOverlay() {
    if (this.overlayVisible) {
      this.toggleOverlay;
    }
  }

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

  constructor(private userRegistryService: UserRegistryService, private router: Router ) {
  }

  ngOnInit(): void {
    // Get current company ID
    let companyIdString = localStorage.getItem('currentCompanyID');
    let companyID = companyIdString ? parseInt(companyIdString) : 0;

    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.loggedInUser = JSON.parse(userString);
      if(!this.loggedInUser.admin) {
        this.router.navigate(['/home']);
      }
    }

    // Load users for current company ID
    this.userRegistryService.loadUserRegistry(companyID);
    console.log("current company ID: " + companyID);
    this.userRegistryService.userRegistry.subscribe(userRegistryList => {
      this.userRegistry = userRegistryList;
    });
  }
}
