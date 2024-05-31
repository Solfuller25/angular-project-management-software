import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {

  @Input() team: any;
  @Input() numProjects: string = '';

  ngOnInit(): void {
    console.log(this.team);
  }

}