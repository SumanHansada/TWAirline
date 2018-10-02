import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FlightSearch } from '../models/flightsearch';
import { FlightDetails } from '../models/flightdetails';
import { FlightService } from '../services/flight.service';
import {NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Airports } from '../models/airports';
import { FlightDetailsReturn } from '../models/flightdetailsReturn';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class HomeComponent implements OnInit {
  minFlightPrice = 0;
  maxFlightPrice = 0;
  flightPriceRange = [];
  flightType = '';
  flightSearch: FlightSearch;
  flightDetails: FlightDetails[];
  flightDetailsReturn: FlightDetailsReturn[];
  airportLists: Airports[];
  today = new Date();
  filterdFlights: FlightDetails[] = [];
  filterdFlightsHC: FlightDetails[] = [];
  tempFlightDetails: FlightDetails;
  filteredReturnFlights: FlightDetailsReturn[] = [];
  filteredReturnFlightsHC: FlightDetailsReturn[] = [];
  tempReturnFlightDetails: FlightDetailsReturn;
  showErrors = false;
  minDepartureDate = {};
  minDYear = 0; minDMonth = 0; minDDay = 0;


  rangeChanged(event: any) {
    if (this.flightType === 'onewayFlight') {
      this.filterdFlights = this.filterdFlightsHC.filter(x => x.Fare >= event[0] && x.Fare <= event[1]);
    } else if (this.flightType === 'returnFlight') {
      this.filteredReturnFlights = this.filteredReturnFlightsHC.filter(x => x.DepartureFare + x.ReturnFare >= event[0]
        && x.DepartureFare + x.ReturnFare <= event[1]);
    }
    // console.log(this.filterdFlights);
    this.cdRef.detectChanges();
  }
  changeflightType(type) {
    this.flightType = type;
  }

  searchFlights(flightType) {
    this.flightType = flightType;
    console.log(this.flightType);
    if (this.flightType === 'onewayFlight') {
    this.filterdFlights = [];
    this.filterdFlightsHC = [];
    // console.log(new Date(this.flightSearch.DepartureDate));
    // console.log(this.flightDetails);
    const departureMoment = moment(this.flightSearch.DepartureDate);
    // console.log(departureMoment);
    if (departureMoment.date() !== moment(this.today).date() && (departureMoment.hour() === 12)) {
        departureMoment.subtract(12, 'hours');
    }
    // console.log(this.today);
    for (let i = 0; i < this.flightDetails.length; i++) {
      let flightMoment;
      let tempFare = 0;
      flightMoment =  moment(this.flightDetails[i].DepartureTime);
      if (flightMoment >= departureMoment && flightMoment.date() === departureMoment.date()
      && this.flightDetails[i].Origin === this.flightSearch.Origin
      && this.flightDetails[i].Destination === this.flightSearch.Destination) {
      tempFare = this.flightDetails[i].Fare;
      let tempFlightDetails;
      tempFlightDetails = Object.assign({}, this.flightDetails[i]);
      if (this.flightSearch.PassangersCount >= 1) {
        tempFlightDetails.Fare = tempFare * this.flightSearch.PassangersCount;
        this.filterdFlights.push(tempFlightDetails);
        this.filterdFlightsHC.push(tempFlightDetails);
      }
      }
      // console.log(new Date(this.flightDetails[i].DepartureTime).toDateString());
    }
    try {
    this.maxFlightPrice = this.filterdFlights.reduce((prev, current) => {
      return (prev.Fare > current.Fare) ? prev : current;
    }).Fare;
    } catch (ex) {
      this.maxFlightPrice = 0;
      console.log('No Flight Data Avialable');
    }
    // this.minFlightPrice = this.filterdFlights.reduce((prev, current) => {
    //   return (prev.Fare < current.Fare) ? prev : current;
    // }).Fare;
    this.flightPriceRange = [this.minFlightPrice, this.maxFlightPrice];
    this.flightSearch.PriceRange = this.flightPriceRange;
    // console.log('Filtered Flights :-', this.filterdFlights);

    } else if (this.flightType === 'returnFlight') {
    this.filteredReturnFlights = [];
    this.filteredReturnFlightsHC = [];


    const departureMoment = moment(this.flightSearch.DepartureDate);
    if (departureMoment.date() !== moment(this.today).date() && (departureMoment.hour() === 12)) {
        departureMoment.subtract(12, 'hours');
    }
    const returnMoment = moment(this.flightSearch.ReturnDate);
    if (returnMoment.date() !== moment(this.today).date() && (returnMoment.hour() === 12)) {
        returnMoment.subtract(12, 'hours');
    }
    // console.log(this.today);
    for (let i = 0; i < this.flightDetails.length; i++) {
      let tempReturnFlightDetails: FlightDetailsReturn ;
    tempReturnFlightDetails = {
      DepartureOrigin : '',
      DepartureDestination : '',
      DepartureFare: null,
      DepartureTime: null,
      ArrivalTime: null,
      DepartureAirline: '',
      DepartureFlightNo: null,
      ReturnOrigin: '',
      ReturnDestination: '',
      ReturnFare: null,
      ReturnTime: null,
      ReturnArrivalTime: null,
      ReturnAirline: '',
      ReturnFlightNo: ''
    };
      let flightDepatureMoment;
      flightDepatureMoment =  moment(this.flightDetails[i].DepartureTime);
      let tempDepartFare = 0;
      let tempReturnFare = 0;
      if (flightDepatureMoment >= departureMoment && flightDepatureMoment.date() === departureMoment.date()
      && this.flightDetails[i].Origin === this.flightSearch.Origin
      && this.flightDetails[i].Destination === this.flightSearch.Destination) {
        tempDepartFare = this.flightDetails[i].Fare;
        let tempFlightDepartureDetails;
        tempFlightDepartureDetails = Object.assign({}, this.flightDetails[i]);
        if (this.flightSearch.PassangersCount >= 1) {
          tempFlightDepartureDetails.Fare = tempDepartFare * this.flightSearch.PassangersCount;
          tempReturnFlightDetails.DepartureOrigin = tempFlightDepartureDetails.Origin;
          tempReturnFlightDetails.DepartureDestination = tempFlightDepartureDetails.Destination;
          tempReturnFlightDetails.DepartureFare = tempFlightDepartureDetails.Fare;
          tempReturnFlightDetails.DepartureTime = tempFlightDepartureDetails.DepartureTime;
          tempReturnFlightDetails.ArrivalTime = tempFlightDepartureDetails.ArrivalTime;
          tempReturnFlightDetails.DepartureAirline = tempFlightDepartureDetails.Airline;
          tempReturnFlightDetails.DepartureFlightNo = tempFlightDepartureDetails.FlightNo;
        }
        for (let j = 0; j < this.flightDetails.length; j++) {
          let flightReturnMoment;
          flightReturnMoment =  moment(this.flightDetails[j].DepartureTime);
          if (flightReturnMoment >= returnMoment && flightReturnMoment.date() === returnMoment.date()
          && this.flightDetails[j].Origin === this.flightSearch.Destination
          && this.flightDetails[j].Destination === this.flightSearch.Origin) {
          tempReturnFare = this.flightDetails[j].Fare;
          let tempFlightReturnDetails;
          tempFlightReturnDetails = Object.assign({}, this.flightDetails[j]);
          if (this.flightSearch.PassangersCount >= 1) {
            tempFlightReturnDetails.Fare = tempReturnFare * this.flightSearch.PassangersCount;
            tempReturnFlightDetails.ReturnOrigin = tempFlightReturnDetails.Origin;
            tempReturnFlightDetails.ReturnDestination = tempFlightReturnDetails.Destination;
            tempReturnFlightDetails.ReturnFare = tempFlightReturnDetails.Fare;
            tempReturnFlightDetails.ReturnTime = tempFlightReturnDetails.DepartureTime;
            tempReturnFlightDetails.ReturnArrivalTime = tempFlightReturnDetails.ArrivalTime;
            tempReturnFlightDetails.ReturnAirline = tempFlightReturnDetails.Airline;
            tempReturnFlightDetails.ReturnFlightNo = tempFlightReturnDetails.FlightNo;
            this.filteredReturnFlights.push(Object.assign({}, tempReturnFlightDetails));
            this.filteredReturnFlightsHC.push(Object.assign({}, tempReturnFlightDetails));
          }
        }
      }
      }
      // console.log(new Date(this.flightDetails[i].DepartureTime).toDateString());
    }
    console.log('Filtered Flights :-', this.filteredReturnFlights);
    try {
      this.maxFlightPrice = this.filteredReturnFlights.reduce((prev, current) => {
        return (prev.DepartureFare > current.DepartureFare) ? prev : current;
      }).DepartureFare +
      this.filteredReturnFlights.reduce((prev, current) => {
        return (prev.ReturnFare > current.ReturnFare) ? prev : current;
      }).ReturnFare;
    } catch (ex) {
      this.maxFlightPrice = 0;
      console.log('No Flight Data Available');
    }
    // this.minFlightPrice = this.filterdFlights.reduce((prev, current) => {
    //   return (prev.Fare < current.Fare) ? prev : current;
    // }).Fare;
    this.flightPriceRange = [this.minFlightPrice, this.maxFlightPrice];
    this.flightSearch.PriceRange = this.flightPriceRange;

    }



  }

  constructor(private _flightService: FlightService,
    private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.flightType = 'onewayFlight';
    this.tempFlightDetails = null;
    this.tempReturnFlightDetails = null;
    this._flightService.getFlightDetails().subscribe(
      result => {
        this.flightDetails = result;
      },
      _error => {
        console.log('Error');
      }
    );
    this._flightService.getAirportLists().subscribe(
      result => {
        this.airportLists = result;
      },
      _error => {
        console.log('Error');
      }
    );
    this.flightSearch = {Origin : null,
      Destination: null,
      DepartureDate: new Date(),
      ReturnDate: new Date(),
      PassangersCount: null,
      PriceRange: this.flightPriceRange
    };
    setTimeout(() => {
      this.maxFlightPrice = 0;
      this.minFlightPrice = 0;
      this.flightPriceRange = [this.minFlightPrice, this.maxFlightPrice];
      this.flightSearch.PriceRange = this.flightPriceRange;
    }, 0);
  }
}
