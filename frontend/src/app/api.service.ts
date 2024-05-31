import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Announcement } from './announcement.model';
import { Observable } from 'rxjs';

import { Company, Team, User } from './user.model';

import { Project } from './project.model';

const apiUrl = 'api/';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private http: HttpClient) {}

  getAnnouncements(companyID: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(
      `${apiUrl}company/${companyID}/announcements`
    );
  }

  createAnnouncement(
    announcementDto: Announcement,
    companyID: number,
    adminId: number
  ): Observable<Announcement> {
    const adminHeaders = new HttpHeaders().set('admin-id', adminId.toString());
    return this.http.post<Announcement>(
      `${apiUrl}company/${companyID}/announcement`,
      announcementDto,
      { headers: adminHeaders }
    );
  }

  toggleActiveUser(userID: number, companyID: number, adminID: number) {
    const adminHeaders = new HttpHeaders().set('admin-id', adminID.toString());
    return this.http.patch<User>(`${apiUrl}company/${companyID}/user/${userID}`, '', { headers: adminHeaders });
  }

  getProjects(companyID: number, teamID: number): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${apiUrl}company/${companyID}/teams/${teamID}/projects`
    );
  }

  createProject(teamID: number, project: Project): Observable<Project> {
    return this.http.post<Project>(
      `${apiUrl}projects/${teamID}/teams`,
      project
    );
  }

  editProject(
    companyID: number,
    editedProject: Project,
    adminId: number
  ): Observable<Project> {
    const adminHeaders = new HttpHeaders().set('admin-id', adminId.toString());
    return this.http.patch<Project>(
      `${apiUrl}company/${companyID}/teams/${editedProject.team.id}/projects/${editedProject.id}`,
      editedProject,
      { headers: adminHeaders }
    );
  }

  login(username: string, password: string): Observable<any> {
    const credentialsDto = { username: username, password: password };
    return this.http.post(`${apiUrl}users/login`, credentialsDto);
  }

  getUsersByCompany(companyID: number): Observable<User[]> {
    return this.http.get<User[]>(`${apiUrl}company/${companyID}/users`);
  }

  getAllProjectsByTeam(
    companyID: number,
    teamID: number
  ): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${apiUrl}company/${companyID}/teams/${teamID}/projects`
    );
  }

  getAllTeams(companyID: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${apiUrl}company/${companyID}/teams`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiUrl}users/`);
  }

  getTeams(companyID: number): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${apiUrl}company/${companyID}/teams`);
  }

  getTeam(teamID: number): Observable<any> {
    return this.http.get<any>(`${apiUrl}team/${teamID}`);
  }

  createTeam(teamDto: any, adminID: number, companyID: number) {
    const header = new HttpHeaders().set('admin-id', adminID.toString());
    return this.http.post(`${apiUrl}team/${companyID}/company`, teamDto, { headers: header });
  }

  createNewUser(user: User, adminID: number): Observable<any> {
    let userRequest = {
      credentials: {
        username: user.username,
        password: user.password,
      },
      "profile": user.profile,
      "admin": user.admin
    }
    const header = new HttpHeaders().set('admin-id', adminID.toString());
    console.log('Username: ' + user.username);
    return this.http.post(`${apiUrl}users`, userRequest, { headers: header });
  }

  addUserToCompany(userID: number, companyID: number, adminID: number) {
    const header = new HttpHeaders().set('admin-id', adminID.toString());
    return this.http.patch(`${apiUrl}company/${companyID}/users`, [userID], { headers: header });
  }
}
