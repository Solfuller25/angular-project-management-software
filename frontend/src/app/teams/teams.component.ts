import { Component, OnInit } from '@angular/core';
import { APIService } from '../api.service';
import { Team, User, deactivatedUser } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
  currentCompanyID: number = 0;
  teams: Team[] = [];
  showOverlay: boolean = false;
  currentUser: User = deactivatedUser;

  constructor(private apiservice: APIService, private router: Router) {}

  ngOnInit(): void {
    const companyIDString = localStorage.getItem('currentCompanyID');
    if (companyIDString) {
      this.currentCompanyID = JSON.parse(companyIDString);
    }
    
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    }
    else {
      this.router.navigate(['/']);
    }
    this.loadTeams();
  }

  loadTeams(): void {
    this.apiservice.getTeams(this.currentCompanyID).subscribe(
      (teams: Team[]) => {
        this.teams = teams;
      },
      (error) => {
        console.error('Error fetching teams:', error);
      }
    );
  }

  addTeam(newTeam: Team) {
    this.teams.push(newTeam);
    this.showOverlay = false;
  }
}
