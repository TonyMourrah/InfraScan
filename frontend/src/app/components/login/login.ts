import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // TRÈS IMPORTANT
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth'; // Ajuste le chemin si besoin

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // On ajoute FormsModule ici
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  private authService = inject(AuthService);
    motDePasse: string = '';
  identifiant: string = ''; 

 onLogin() {
  
  const credentials = { 
    username: this.identifiant, 
    password: this.motDePasse 
  };

  
  this.authService.login(credentials).subscribe({
    next: (response) => {
      console.log('Connecté !', response);
      
    },
    error: (err) => {
      console.error('Erreur de connexion', err);
      alert('Identifiant ou mot de passe incorrect');
    }
  });
}
}