import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private apiService: APIService) {}

  loginUser() {
    this.apiService.login(this.username, this.password).subscribe(
      (data) => {
        console.log("User login successful:", data);
        localStorage.setItem('currentUser', JSON.stringify(data));
        if (data.admin) {
          this.router.navigate(['/company']);
        } else {
          this.router.navigate(['/home']);
          localStorage.setItem('currentCompanyID', data.companies[0].id.toString());
        }
      },
      (error) => {
        console.error("User login error:", error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}