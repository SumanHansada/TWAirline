import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { MaterialModule } from './shared/material.module';
import { RangeSliderModule  } from 'ngx-rangeslider-component';
import { FormsModule } from '@angular/forms';
import { FlightService } from './services/flight.service';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    RangeSliderModule,
    HttpClientModule,
    NgSelectModule
    // MaterialModule
  ],
  providers: [FlightService],
  bootstrap: [AppComponent]
})
export class AppModule { }
