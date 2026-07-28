import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

export interface ActifRoutier {
  id?: number;
  nom: string;
  type: string;
  ville: string;
  latitude: number;
  longitude: number;
  etatSante: number;
  derniereInspection: string;
  creePar?: string;
  dateCreation?: string;
  modifiePar?: string;
  dateModification?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActifService {
  private apiUrl = `${environment.apiUrl}/actifs`;

  constructor(private http: HttpClient) { }

  getActifs(): Observable<ActifRoutier[]> {
    return this.http.get<ActifRoutier[]>(this.apiUrl);
  }

  getActifById(id: number): Observable<ActifRoutier> {
    return this.http.get<ActifRoutier>(`${this.apiUrl}/${id}`);
  }

  deleteActif(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  postActif(actif: ActifRoutier): Observable<ActifRoutier> {
    return this.http.post<ActifRoutier>(this.apiUrl, actif);
  }

  putActif(id: number, actif: ActifRoutier): Observable<void> {
    const payload = { ...actif, id: id };
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }

  uploaderImage(id: number, fichier: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('fichier', fichier);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/${id}/image`, formData);
  }
}