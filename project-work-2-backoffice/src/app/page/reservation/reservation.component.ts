import { Component, inject } from '@angular/core';
import { ReservationService } from '../../service/reservation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BikeService } from '../../service/bikes.service';
import { InsuranceCoverageService } from '../../service/coverage.service';
import { BikeAccessoryService } from '../..//service/bike-accessory.service';
import { LocationEntity } from '../../../enity/location/location-entity';
import { LocationService } from '../../service/location.service';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
    private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);
  private bikeService = inject(BikeService);
  private locationService = inject(LocationService);
  private bikeAccessoryService = inject(BikeAccessoryService);
  private insuranceCoverageService = inject(InsuranceCoverageService);

  form!: FormGroup;
  refresh$ = new BehaviorSubject<void>(undefined);
  loading = false;
  submitting = false;

  pickupSlots = [
    '09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00'
  ];

  locations: LocationEntity[] = [];
  availableBikes: any[] = [];
  accessories: any[] = [];
  insuranceCoverages: any[] = [];
  selectedBikes: string[] = [];

  locations$ = this.refresh$.pipe(
    switchMap(() =>
      this.locationService.list().pipe(
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
    )
  );

  accessories$ = this.refresh$.pipe(
    switchMap(() =>
      this.bikeAccessoryService.list().pipe(
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
    )
  );

  insuranceCoverages$ = this.refresh$.pipe(
    switchMap(() =>
      this.insuranceCoverageService.list().pipe(
        catchError(err => {
          console.error(err);
          return of([]);
        })
      )
    )
  );

  ngOnInit(): void {
    this.initForm();
    this.loadData();
    this.listenChanges();
  }

   initForm(): void {
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

   loadData(): void {
    this.locations$.subscribe(r => this.locations = r);
    this.accessories$.subscribe(r => this.accessories = r);
    this.insuranceCoverages$.subscribe(r => this.insuranceCoverages = r);
  }

   listenChanges(): void {
    this.form.valueChanges.subscribe(v => {
      if (v.pickupLocation && v.pickupDate && v.pickupTime) {
        this.loadAvailableBikes(v.pickupLocation);
      }
    });
  }

   loadAvailableBikes(locationId: string): void {
    this.loading = true;

    this.bikeService.getAvailable(locationId).subscribe({
      next: (bikes) => {
        this.availableBikes = bikes;
        this.selectedBikes = [];
        this.form.patchValue({ bikes: [] }, { emitEvent: false });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleBike(id: string | number): void {
    const idStr = String(id);
    console.log('Toggle bike id:', idStr, 'current selected:', this.selectedBikes);
    
    if (this.selectedBikes.includes(idStr)) {
      this.selectedBikes = this.selectedBikes.filter(x => x !== idStr);
      console.log('Rimosso bike, ora:', this.selectedBikes);
    } else {
      this.selectedBikes.push(idStr);
      console.log('Aggiunto bike, ora:', this.selectedBikes);
    }

    this.form.patchValue({ bikes: this.selectedBikes }, { emitEvent: false });
    console.log('Form bikes value:', this.form.value.bikes);
  }

  submit() {
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
        this.refresh$.next();
        this.submitting = false;
      },
      error: () => {
        alert('Errore prenotazione');
        this.submitting = false;
      }
    });
  }
}
