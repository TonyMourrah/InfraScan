import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  motDePasse: string = '';
  identifiant: string = '';
  isLoading: boolean = false;   
  erreurMessage: string = '';   

  onLogin() {
    if (this.isLoading) return;   
    this.isLoading = true;
    this.erreurMessage = '';

    const credentials = {
      username: this.identifiant,
      password: this.motDePasse
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Connecté !', response);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        this.erreurMessage = "Connexion au serveur en cours de réveil, réessaie dans quelques secondes.";
        this.isLoading = false;
      }
    });
  }
}