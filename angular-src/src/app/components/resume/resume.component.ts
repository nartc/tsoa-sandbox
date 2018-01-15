import {Component, OnInit} from '@angular/core';
import {} from 'chartjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  skillData: any;
  personalSkillData: any;
  barChartOptions: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.barChartOptions = {
      barPercentage: 1,
      categoryPercentage: 1,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }]
      }
    };

    this.skillData = {
      labels: ['Angular', 'Node', 'Express', 'MongoDB', 'Bootstrap', 'PrimeNG', 'HTML5', 'CSS3', 'JavaScript', 'ASP.NET Core', 'Java', 'SQL'],
      datasets: [
        {
          label: 'Skills',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [70, 60, 70, 60, 70, 70, 70, 60, 70, 50, 40, 40, 40]
        }
      ]
    };

    this.personalSkillData = {
      labels: ['Data Analysis', 'Project Management', 'Mathematics', 'Statistics', 'Critical Thinking', 'Warehouse Operations', 'Customer Service', 'Microsoft Office'],
      datasets: [
        {
          label: 'Personal Skills',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [70, 60, 70, 70, 70, 80, 80, 70]
        }
      ]
    };
  }

  downloadFile() {
    window.open('/assets/chau-resume.docx');
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
