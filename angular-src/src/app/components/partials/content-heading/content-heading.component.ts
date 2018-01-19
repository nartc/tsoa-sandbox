import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-content-heading',
  templateUrl: './content-heading.component.html',
  styleUrls: ['./content-heading.component.scss']
})
export class ContentHeadingComponent implements OnInit {
  @Input() headingText: string;

  constructor() {
  }

  ngOnInit() {
  }

}
