import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project, defaultProject } from '../../project.model';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {

  @Input() project: Project = defaultProject;
  @Input() isAdmin: boolean = false;
  @Output() projectSaved: EventEmitter<void> = new EventEmitter<void>();

  constructor(private apiservice: APIService) { }

  editedProject: Project = defaultProject;
  showPopup: boolean = false;

  editProject() {
    this.editedProject = { ...this.project };
    this.openPopup();
  }

  saveProject() {
    let companyID = 0, adminId = 0;
    const companyIDString = localStorage.getItem('currentCompanyID');
    if (companyIDString) {
      companyID = JSON.parse(companyIDString);
    }

    const userString = localStorage.getItem('currentUser');
    if (userString) {
      adminId = JSON.parse(userString).id;
    }

    console.log('Edited project:', this.editedProject);
    this.apiservice.editProject(companyID, this.editedProject, adminId).subscribe(
      (project: Project) => {
        console.log(project);
        this.projectSaved.emit();
      }
    );
    this.showPopup = false;
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
