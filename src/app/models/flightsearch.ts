export interface FlightSearch {
  Origin: string;
  Destination: string;
  DepartureDate: Date;
  ReturnDate: Date;
  PassangersCount: number;
  PriceRange: number[];
}
