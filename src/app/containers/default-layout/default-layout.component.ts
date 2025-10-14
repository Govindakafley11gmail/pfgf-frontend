import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Navigation } from 'selenium-webdriver';
import { navItems } from '../../views/_nav';
import { UserService } from '../../views/_service/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  userName;
  getDate;
  designation;
  subscription: Subscription;
  time;
  index = 0;
  userActivity;
  userInactive: Subject<any> = new Subject();
  isLoading = false;
  constructor(private router: Router, private userservice: UserService) {
    this.setTimeout();
    this.userInactive.subscribe(() => {
      // localStorage.removeItem('access_token');
      this.logoutUser();
      // location.reload()
    });
  }
  keyPress(event: KeyboardEvent): void {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
  setTimeout(): void {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 1800000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
  data
  ngOnInit() {
    this.getDate = new Date().getFullYear();
    this.getUserName();
    if (localStorage.getItem('foo')) {
      localStorage.removeItem('foo');
      location.reload();
    } else {
      localStorage.removeItem('foo')
    }
  }

  getUserData() {
    return this.userservice.editPermission(localStorage.getItem('id')).subscribe(res => { })
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logoutUser() {
    // this.router.navigate(['../../login']);
    this.isLoading = true;
    this.userservice.logout().subscribe(response => {
      this.isLoading = false;
      location.reload();
      localStorage.removeItem('access_token');
      localStorage.removeItem('id');
     
    }, error => {
      this.isLoading = false;
      location.reload();
      localStorage.removeItem('access_token');
      localStorage.removeItem('id');
    })

  }

  getUserName() {
    this.userName = localStorage.getItem('userName');
    this.designation = localStorage.getItem('designation');
  }
  search(value: string): void {
    // this.countries = this.allCountries.filter((val) => val.name.toLowerCase().includes(value));
  }
}
