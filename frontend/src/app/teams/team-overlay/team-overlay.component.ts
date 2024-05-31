import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIService } from '../../api.service';
import { User, Team, deactivatedUser } from '../../user.model';

@Component({
  selector: 'app-team-overlay',
  templateUrl: './team-overlay.component.html',
  styleUrls: ['./team-overlay.component.css'],
})
export class TeamOverlayComponent implements OnInit {
  @Input() showOverlay: boolean = false;
  @Output() closeOverlay = new EventEmitter<boolean>();
  @Output() newTeamAdded = new EventEmitter<Team>();

  teamName: string = '';
  description: string = '';
  companyUsers: User[] = [];
  teammates: User[] = [];
  errorMessage: string = '';
  currentCompanyID: number = 0;

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    const companyIDString = localStorage.getItem('currentCompanyID');
    if (companyIDString) {
      this.currentCompanyID = JSON.parse(companyIDString);
    }
    this.setCompanyUsers();
  }

  setCompanyUsers() {
    this.apiService.getUsersByCompany(this.currentCompanyID).subscribe(
      (users: User[]) => {
        this.companyUsers = users;
      },
      (error) => {
        console.error('Error fetching company users:', error);
      }
    );
  }

  toggleTeammate(user: User) {
    const index = this.teammates.indexOf(user);
    if (index === -1) {
      this.teammates.push(user);
    } else {
      this.teammates.splice(index, 1);
    }
  }

  onSubmit() {
    if (!this.teamName.length) {
      this.errorMessage = 'Must provide a Team Name';
      return;
    }

    if (!this.description.length) {
      this.errorMessage = 'Must provide a Team Description';
      return;
    }

    const newTeam: Team = {
      name: this.teamName,
      description: this.description,
      teammates: this.teammates,
    };

    const companyIDString = localStorage.getItem('currentCompanyID');
    const userString = localStorage.getItem('currentUser');

    if (companyIDString && userString) {
      const companyID = JSON.parse(companyIDString);
      const adminId = JSON.parse(userString).id;

      this.apiService.createTeam(newTeam, adminId, companyID).subscribe(
        (team: any) => {
          this.newTeamAdded.emit(team);
          this.closeOverlay.emit(true);
        },
        (error) => {
          this.errorMessage = 'Error creating team';
          console.error('Error creating team:', error);
        }
      );
    }
  }
}
