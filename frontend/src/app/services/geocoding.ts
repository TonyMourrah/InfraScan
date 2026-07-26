import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResultatGeocode {
  lat: string;
  lon: string;
  display_name: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  rechercherAdresse(query: string): Observable<ResultatGeocode[]> {
    return this.http.get<ResultatGeocode[]>(this.NOMINATIM_URL, {
      params: {
        format: 'json',
        q: query,
        countrycodes: 'ca',
        limit: '1'
      }
    });
  }
}