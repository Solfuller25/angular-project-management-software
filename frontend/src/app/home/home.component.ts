import { Component, OnInit } from '@angular/core';
import { Announcement, defaultAnnouncement } from '../announcement.model';
import { User, deactivatedUser } from '../user.model';
import { APIService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  announcements: Announcement[] = [];
  currentUser: User = deactivatedUser;
  currentCompanyID: number = 0;
  showPopup: boolean = false;
  newAnnouncement = { ...defaultAnnouncement };

  constructor(private apiservice: APIService, private router: Router) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    }
    else{
      this.router.navigate(['/']);
    }

    const companyIDString = localStorage.getItem('currentCompanyID');
    if (companyIDString) {
      this.currentCompanyID = JSON.parse(companyIDString);
    }

    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.apiservice.getAnnouncements(this.currentCompanyID).subscribe(
      (announcements: Announcement[]) => {
        announcements.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.announcements = announcements;
        console.log(this.announcements);
      },
      (error) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }

  toggleMinimize(announcement: Announcement): void {
    announcement.minimized = !announcement.minimized;
  }

removeAnnouncement(announcement: Announcement): void {
  const index = this.announcements.indexOf(announcement);
  if (index !== -1) {
    this.announcements[index].animateOut = true;
    setTimeout(() => {
      this.announcements.splice(index, 1);
    }, 500);
  }
}


  openPopup(): void {
    this.newAnnouncement = { ...defaultAnnouncement };
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.newAnnouncement = { ...defaultAnnouncement };
  }

  onSubmit(): void {
    const announcementDto = {
      date: new Date(),
      title: this.newAnnouncement.title,
      message: this.newAnnouncement.message,
      company: this.currentCompanyID,
      author: this.currentUser,
    };
    this.apiservice.createAnnouncement(announcementDto, this.currentCompanyID, this.currentUser.id).subscribe(
      (createdAnnouncement: Announcement) => {
        this.announcements.unshift(createdAnnouncement);
        this.closePopup();
      },
      error => {
        console.error('Error creating announcement:', error);
      }
    );
  }
}
