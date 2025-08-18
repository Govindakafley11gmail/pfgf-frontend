import { Component, OnInit } from '@angular/core';
import { UserService } from '../views/_service/user.service';
@Component({
  selector: 'app-download-form',
  templateUrl: './download-form.component.html',
  styleUrls: ['./download-form.component.scss']
})
export class DownloadFormComponent implements OnInit {

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }
  downloadResources(event) {
   this.userService.downloadResourcesForm(event).subscribe(res=>{
    let blob: any = new Blob([res], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    open(url);
   })
  }
}
