import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { User } from 'src/app/user.model';
import { UserRegistryService } from 'src/app/services/userRegistry.service';
import { UserRowComponent } from '../user-row/user-row.component';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-user-overlay',
  templateUrl: './user-overlay.component.html',
  styleUrls: ['./user-overlay.component.css']
})
export class UserOverlayComponent implements AfterViewInit {
  @Output() closeOverlay = new EventEmitter<boolean>();
  @Input() loggedInUser: User = <User>{};

  adminID: number = 0;
  companyID: number = 0;
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  adminRole: boolean = false;
  passwordType: string = 'password';
  showPassword: boolean = false;
  errorMessage: string = '';
  adminCompanies: number[] = [];
  showCompanyOptions: boolean = false;

  setFirstName(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkFirstName(value);
    if (errorMessage.length === 0) {
      this.firstName = value;
    }
    this.errorMessage = errorMessage;
    
  }

  checkFirstName(firstName: string) {
    if (firstName.length < 1) {
      this.firstName = '';
      return 'A first name is required.';
    } else {
      return '';
    }
  }

  setLastName(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkLastName(value);
    if (errorMessage.length === 0) {
      this.lastName = value;
    } 
    this.errorMessage = errorMessage;
  }

  checkLastName(lastName: string) {
    if (lastName.length < 1) {
      this.lastName = '';
      return 'A last name is required.';
    } else {
      return '';
    }
  }

  setUsername(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkUsername(value);
    if (errorMessage.length === 0) {
      this.username = value;
    } 
    this.errorMessage = errorMessage;
  }

  checkUsername(username: string) {
    if (username.length < 5) {
      this.username = '';
      return 'A username is required and must be at least 5 characters in length.';
    } else {
      return '';
    }
  }

  setEmail(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkEmail(value);
    if (errorMessage.length === 0) {
      this.email = value;
    }
    this.errorMessage = errorMessage;
  }

  checkEmail(email: string) {
    if (email.length < 7) {
      this.email = '';
      return 'An email is required.';
    } else {
      // Split email by @
      let emailArray = email.split('@');
      if (emailArray.length === 2) {
        let domainArray = emailArray[1].split('.');
        if (domainArray.length === 2) {
          if (domainArray[1].length === 3 && domainArray[0].length > 0) {
            return '';
          }
        }
      }
      this.email = '';
      return 'Please ensure the email provided is in the correct format';
    }
  }

  setPhone(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkPhone(value);
    if (errorMessage.length === 0) {
      this.phone = value;
    }
    this.errorMessage = errorMessage;
  }

  checkPhone(phone: string) {
    if (phone.length === 10 && (/^\d+$/.test(phone))) {
      return '';
    } else {
      this.phone = '';
      return 'Please provide a 10 digit phone number.';
    }
  }

  setPassword(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkPassword(value);
    if (errorMessage.length === 0) {
      this.password = value;
    }
    this.errorMessage = errorMessage;
  }

  checkPassword(password: string) {
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d)(?=.*[A-Z]).*$/;
    if (!passwordRegex.test(password))  {
      this.password = '';
      return 'Please provide a password that contains at least one each of a special character, number, and capital letter.';
    } else if (password.length < 8 || password.length > 25) {
      this.password = '';
      return 'Please provide a password that is between 8 and 25 characters in length';
    } else {
      return '';
    }
  }

  setConfirmPassword(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkConfirmPassword(value);
    if (errorMessage.length === 0) {
      this.confirmPassword = value;
    }
    this.errorMessage = errorMessage;
  }

  checkConfirmPassword(confirmPassword: string) {
    if (confirmPassword !== this.password) {
      this.confirmPassword = '';
      return 'Passwords must match!';
    } else {
      return '';
    }
  }

  setAdminRole(event: any) {
    let value = event.target.value;
    let errorMessage = this.checkAdminRole(value);
    if (errorMessage.length === 0) {
      this.adminRole = (value === 'Yes') ? true : false;
      if (value === 'Yes') {
        this.showCompanyOptions = true;
      } else {
        this.showCompanyOptions = false;
      }
    }
    this.errorMessage = errorMessage;
  }

  checkAdminRole(adminRole: string) {
    if (adminRole === 'Pick An Option') {
      return 'Please pick a valid admin role.';
    } else {
      return '';
    }
  }

  toggleCompany(companyID: number) {
    if (!this.adminCompanies.includes(companyID)) {
      this.adminCompanies.push(companyID);
    } else {
      this.adminCompanies.splice(this.adminCompanies.indexOf(companyID), 1);
    }
  }

  submitNewUser() {
    // Check all values
    if (this.checkFirstName(this.firstName).length === 0 && this.checkLastName(this.lastName).length === 0 &&
      this.checkUsername(this.username).length === 0 && this.checkEmail(this.email).length === 0 && this.checkPhone(this.phone).length === 0 &&
      this.checkPassword(this.password).length === 0 && this.checkConfirmPassword(this.confirmPassword).length === 0) {

        let newUser: User = {
          id: 0,
          username: this.username,
          password: this.password,
          profile: {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
          },
          active: true,
          admin: this.adminRole,
          status: 'PENDING',
          companies: []
        }
        
        // Create new user and add to companies
        this.apiService.createNewUser(newUser, this.adminID).subscribe((returnedUser) => {
          newUser = returnedUser;
          
          console.log('Created new user with ID: ' + newUser.id);

          this.userRegistryService.addUserToRegistry(newUser); 
          this.hideModal();
          // Check for companies
          if (this.adminRole) {
            // Add to how many admin roles they were chosen for
            if (this.adminCompanies.length > 0) {
              this.adminCompanies.forEach(company => {
                this.apiService.addUserToCompany(returnedUser.id, company, this.adminID).subscribe(() => {
                  console.log('Add Users To Company Success');
                });
              });
            } else {
              this.apiService.addUserToCompany(returnedUser.id, this.companyID, this.adminID).subscribe(() => {
                console.log('Add User To Company Success');
              });
            }
          } else {
            // Just add to this company
            this.apiService.addUserToCompany(returnedUser.id, this.companyID, this.adminID).subscribe(() => {
              console.log('Add User To Company Success');
            });
          }
        });
    } else {
      this.errorMessage = 'Please double check to ensure you have provided valid inputs.';
    }
  }

  hideModal() {
    this.closeOverlay.emit(true);
  }

  showPasswordClick() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.showPassword = true;
    } else {
      this.passwordType = 'password';
      this.showPassword = false;
    }
  }

  constructor(private userRegistryService: UserRegistryService, private apiService: APIService) {}

  ngAfterViewInit() {
    let currentCompany = localStorage.getItem('currentCompanyID');
    if (currentCompany) {
      this.companyID = parseInt(currentCompany);
    }

    let loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser){
      this.adminID = JSON.parse(loggedInUser).id;
    }
    console.log("CUrrent user ID: " + this.adminID);
  }
}
