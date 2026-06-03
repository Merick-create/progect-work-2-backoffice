import { Component } from '@angular/core';
import { ReservationService } from '../../service/reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BikeService } from '../../service/bikes.service';
import { InsuranceCoverageService } from '../../service/coverage.service';
import { BikeAccessoryService } from '../..//service/bike-accessory.service';
import { LocationEntity } from '../../../enity/location/location-entity';
import { LocationService } from '../../service/location.service';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
    form!: FormGroup;

  pickupSlots = [
    '09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00'
  ];

  locations: LocationEntity[] = [];
  availableBikes: any[] = [];
  accessories: any[] = [];
  insuranceCoverages: any[] = [];

  selectedBikes: string[] = [];

  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private bikeService: BikeService,
    private locationService: LocationService,
    private bikeAccessoryService: BikeAccessoryService,
    private insuranceCoverageService: InsuranceCoverageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.listenChanges();
  }

  private initForm(): void {
    this.form = this.fb.group({
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      returnDateTime: ['', Validators.required],
      bikes: [[], Validators.required],
      accessories: [[]],
      insuranceCoverage: ['']
    });
  }

  private loadData(): void {
    this.locationService.list().subscribe(r => this.locations = r);
    this.bikeAccessoryService.list().subscribe(r => this.accessories = r);
    this.insuranceCoverageService.list().subscribe(r => this.insuranceCoverages = r);
  }

  private listenChanges(): void {
    this.form.valueChanges.subscribe(v => {
      if (v.pickupLocation && v.pickupDate && v.pickupTime) {
        this.loadAvailableBikes(v.pickupLocation);
      }
    });
  }

  private loadAvailableBikes(locationId: string): void {
    this.loading = true;

    this.bikeService.getAvailable(locationId).subscribe({
      next: (bikes) => {
        this.availableBikes = bikes;
        this.selectedBikes = [];
        this.form.patchValue({ bikes: [] });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleBike(id: string): void {
    if (this.selectedBikes.includes(id)) {
      this.selectedBikes = this.selectedBikes.filter(x => x !== id);
    } else {
      this.selectedBikes.push(id);
    }

    this.form.patchValue({ bikes: this.selectedBikes });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const data = {
      pickupDate: new Date(this.form.value.pickupDate),
      pickupTime: this.form.value.pickupTime,
      pickupLocation: this.form.value.pickupLocation,
      returnDateTime: new Date(this.form.value.returnDateTime),
      bikes: this.selectedBikes,
      accessories: this.form.value.accessories,
      insuranceCoverage: this.form.value.insuranceCoverage
    };

    this.reservationService.add(data).subscribe({
      next: () => {
        this.form.reset();
        this.selectedBikes = [];
        this.availableBikes = [];
        this.submitting = false;
      },
      error: () => {
        alert('Errore prenotazione');
        this.submitting = false;
      }
    });
  }
}
