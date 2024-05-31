import { Component, OnInit } from '@angular/core';
import { Project, defaultProject } from '../project.model';
import { User, deactivatedUser } from '../user.model';
import { APIService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  private routeSubscription!: Subscription;
  projects: Project[] = [];
  currentUser: User = deactivatedUser;
  currentCompanyID: number = 0;
  currentTeamID: number = 17;
  currentTeam: any = {};
  showNewProjectPopup: boolean = false;
  newProject: Project = { ...defaultProject };

  constructor(private apiservice: APIService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const teamIdString = params.get('teamId');
      console.log("test", teamIdString);
      this.currentTeamID = teamIdString ? parseInt(teamIdString) : 0;
  
      const userString = localStorage.getItem('currentUser');
      if (userString) {
        this.currentUser = JSON.parse(userString);
      }
  
      const companyIDString = localStorage.getItem('currentCompanyID');
      if (companyIDString) {
        this.currentCompanyID = JSON.parse(companyIDString);
      }
  
      this.loadTeam();
      this.loadProjects();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  

  loadTeam(): void {
    this.apiservice.getTeam(this.currentTeamID).subscribe(
      (team: any) => {
        this.currentTeam = team;
      },
      (error) => {
        console.error('Error fetching team:', error);
      }
    );
  }

  loadProjects(): void {
    this.apiservice.getProjects(this.currentCompanyID, this.currentTeamID).subscribe(
      (projects: Project[]) => {
        this.projects = projects;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  openNewProjectPopup(): void {
    this.newProject = { ...defaultProject };
    this.showNewProjectPopup = true;
  }

  closeNewProjectPopup(): void {
    this.showNewProjectPopup = false;
    this.newProject = { ...defaultProject };
  }

  reloadProjects(): void {
    this.loadProjects();
  }

  onSubmit(): void {
    const { name, description, active } = this.newProject;
    const newProject = { 
      name: name,
      description: description,
      active: active,
      team: this.currentTeam,
    };
    this.apiservice.createProject(this.currentTeamID, newProject).subscribe(
      () => {
        this.loadProjects();
        this.closeNewProjectPopup();
      },
      (error) => {
        console.error('Error creating project:', error);
      }
    );
  }
}
