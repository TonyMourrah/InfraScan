import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class AccueilComponent {
  private authService = inject(AuthService);

  get estConnecte(): boolean {
    return this.authService.isLoggedIn();
  }

  pointsForts = [
    {
      icone: 'bi-shield-check',
      titre: 'Suivi structurel en temps réel',
      description:
        "Visualisez l'indice de santé de chaque pont, viaduc et tunnel, avec alertes automatiques pour les infrastructures critiques.",
    },
    {
      icone: 'bi-geo-alt',
      titre: 'Géolocalisation intégrée',
      description:
        'Chaque actif est localisé automatiquement sur une carte interactive, pour une vision géographique claire du territoire couvert.',
    },
    {
      icone: 'bi-clock-history',
      titre: 'Traçabilité complète',
      description:
        'Chaque création et modification est horodatée et attribuée à un inspecteur, pour un historique fiable et auditable.',
    },
    {
      icone: 'bi-graph-up',
      titre: 'Historique visuel',
      description:
        "Suivez l'évolution de l'indice de santé de chaque actif dans le temps grâce à des graphiques détaillés.",
    },
    {
      icone: 'bi-file-earmark-excel',
      titre: 'Export de rapports',
      description: 'Générez des rapports CSV en un clic pour vos analyses et présentations.',
    },
  ];
}
