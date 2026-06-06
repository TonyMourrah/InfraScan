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

  user = {
    username: '',
    passwordHash: '', 
    role: 'Inspecteur'
  };

  onSignup() {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Compte créé ! Tu peux maintenant te connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => alert(err.error.message)
    });
  }
}