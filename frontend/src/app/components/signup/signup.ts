import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  erreurMessage: string = '';
  afficherMotDePasse: boolean = false;

  get critereLongueur(): boolean {
    return this.password.length >= 8;
  }
  get critereMajuscule(): boolean {
    return /[A-Z]/.test(this.password);
  }
  get critereMinuscule(): boolean {
    return /[a-z]/.test(this.password);
  }
  get critereChiffre(): boolean {
    return /[0-9]/.test(this.password);
  }
  get critereSpecial(): boolean {
    return /[\W_]/.test(this.password);
  }
  get motDePasseValide(): boolean {
    return this.critereLongueur && this.critereMajuscule &&
           this.critereMinuscule && this.critereChiffre && this.critereSpecial;
  }

  onSignup() {
    if (this.isLoading || !this.motDePasseValide) return;

    this.isLoading = true;
    this.erreurMessage = '';

    const payload = {
      Username: this.username,
      Password: this.password,
      Role: 'Inspecteur'
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Compte créé ! Tu peux maintenant te connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.erreurMessage = err.error?.message || "Connexion au serveur en cours de réveil, réessaie dans quelques secondes.";
      }
    });
  }
}