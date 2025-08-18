import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import {IconSetService} from '@coreui/icons-angular';
import {freeSet} from '@coreui/icons';
import { environment } from '../environments/environment';
import { TokenService } from './views/_service/tokenServices';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit {
  isExpired: boolean;
  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private tokenService: TokenService,
  ) {
    const token = localStorage.getItem('access_token');
    this.isExpired = this.tokenService.isTokenExpired(token);
    if(this.isExpired) {
      // localStorage.removeItem('access_token');
      // this.router.navigate(['login'])
      // location.reload();
    }else {
      // this.router.navigate(['/dashboard']);
    }
    // iconSet singleton
    iconSet.icons = { ...freeSet };

  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    
    });
  }
 
}
