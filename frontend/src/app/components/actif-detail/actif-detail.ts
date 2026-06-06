import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActifService, ActifRoutier } from '../../services/actif';

@Component({
  selector: 'app-actif-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './actif-detail.html',
  styleUrls: ['./actif-detail.scss']
})
export class ActifDetailComponent implements OnInit {
  actif: ActifRoutier | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,       
    private actifService: ActifService  
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    
    if (id) {
      this.actifService.getActifById(id).subscribe({
        next: (data) => {
          this.actif = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = "Impossible de charger les détails de cet actif.";
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}