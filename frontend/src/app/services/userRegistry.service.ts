import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User, defaultUser, deactivatedUser, defaultAdmin } from "../user.model";
import { HttpClient } from '@angular/common/http';
import { APIService } from "../api.service";

@Injectable({
    providedIn: 'root',
})
export class UserRegistryService {
    private userRegistrySource = new BehaviorSubject<User[]>([]);
    userRegistry = this.userRegistrySource.asObservable();

    constructor(private http: HttpClient, private apiService: APIService) {}

    loadUserRegistry(companyID: number) {
        this.apiService.getUsersByCompany(companyID).subscribe((response) => {
            this.updateUserRegistry(response);
        });
    }

    updateUserRegistry(registry: User[]) {
        this.userRegistrySource.next(registry);
    }

    addUserToRegistry(user: User) {
        let newRegistry = this.userRegistrySource.value;
        newRegistry.push(user);
        this.userRegistrySource.next(newRegistry);
    }
}