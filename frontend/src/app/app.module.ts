import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { CompanyComponent } from './company/company.component';
import { RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { TeamCardComponent } from './teams/team-card/team-card.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { UsersComponent } from './users/users.component';
import { UserRowComponent } from './users/user-row/user-row.component';
import { UserOverlayComponent } from './users/user-overlay/user-overlay.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ProjectCardComponent } from './projects/project-card/project-card.component';
import { TeamOverlayComponent } from './teams/team-overlay/team-overlay.component';


const routes: Routes = [
  { path: "company", component: CompanyComponent },
  { path: "teams", component: TeamsComponent },
  { path: "users", component: UsersComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    CompanyComponent,
    TeamsComponent,
    TeamCardComponent,
    HomeComponent,
    ProjectsComponent,
    UsersComponent,
    UserRowComponent,
    UserOverlayComponent,
    ProjectCardComponent,
    TeamOverlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
