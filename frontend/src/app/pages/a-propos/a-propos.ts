import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-a-propos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.scss'
})
export class AProposComponent {
  nomComplet = 'Tony Mourrah';
  titre = 'Étudiant en génie logiciel — ÉTS';
  githubUrl = 'https://github.com/TonyMourrah';
  linkedinUrl = 'https://www.linkedin.com/in/tony-mourrah-b819551b2/';
  email = 'tony.mourrah.1@ens.etsmtl.ca';

  technologies = [
    { nom: 'Angular', icone: 'bi-code-slash' },
    { nom: '.NET / C#', icone: 'bi-server' },
    { nom: 'Entity Framework Core', icone: 'bi-database' },
    { nom: 'Azure SQL Database', icone: 'bi-cloud' },
    { nom: 'Azure App Service', icone: 'bi-cloud-arrow-up' },
    { nom: 'GitHub Actions (CI/CD)', icone: 'bi-gear-wide-connected' },
    { nom: 'Bootstrap 5', icone: 'bi-palette' },
    { nom: 'Leaflet / OpenStreetMap', icone: 'bi-geo-alt' }
  ];

  fonctionnalites = [
    'Authentification et gestion d\'utilisateurs',
    'Gestion complète (CRUD) des actifs routiers — ponts, viaducs, tunnels',
    'Traçabilité complète : création et modification horodatées par utilisateur',
    'Géolocalisation automatique des actifs avec carte interactive (Leaflet + OpenStreetMap)',
    'Recherche géographique en cascade (nom précis → ville → position par défaut)',
    'Tableau de bord avec statistiques en temps réel (santé moyenne, urgences)',
    'Galerie d\'images par actif pour documenter visuellement l\'état des structures',
    'Historique visuel de l\'état de santé avec graphique d\'évolution dans le temps',
    'Mots de passe sécurisés par hachage cryptographique (BCrypt)',
    'Tests automatisés (unitaires et intégration) intégrés au pipeline CI/CD',
    'Export CSV des données pour rapports',
    'Déploiement cloud complet sur Azure avec pipeline CI/CD automatisé'
  ];
}