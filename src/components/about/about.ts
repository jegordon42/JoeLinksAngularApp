import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  standalone: true,
  imports : [CommonModule]
})
export class About {
}
