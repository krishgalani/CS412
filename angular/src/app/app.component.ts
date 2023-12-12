//app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
// import jsonData from '../assets/mock_data.json';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  jsonData: any;
  fetchData() {
    fetch('../assets/mock_data.json') // Adjust the path accordingly
      .then(response => response.json())
      .then(data => this.jsonData = data)
      .catch(error => console.error('Error fetching data:', error));
  }
}
