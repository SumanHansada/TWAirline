import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightDetails } from '../models/flightdetails';
import { Airports } from '../models/airports';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private _http: HttpClient) { }

getFlightDetails(): Observable<FlightDetails[]> {
    return this._http.get<FlightDetails[]>('data/flightsdata.json');
  }

getAirportLists(): Observable<Airports[]> {
    return this._http.get<Airports[]>('data/airportsdata.json');
}
}
