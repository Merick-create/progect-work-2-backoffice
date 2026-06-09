import { Component, inject } from '@angular/core';
import { ReservationService } from '../../service/reservation.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BikeService } from '../../service/bikes.service';
import { InsuranceCoverageService } from '../../service/coverage.service';
import { BikeAccessoryService } from '../../service/bike-accessory.service';
import { LocationEntity } from '../../../enity/location/location-entity';
import { LocationService } from '../../service/location.service';
import { BehaviorSubject, catchError, combineLatest, of, switchMap } from 'rxjs';
import { BikeTypologiesService } from '../../service/bike-typologies.service';
import { BikeSizesService } from '../../service/bike-sizes.service';
import { ToastService } from '../../service/toast.service';

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
  private bikeTypologiesService = inject(BikeTypologiesService);
  private bikeSizesService = inject(BikeSizesService);
  private toastService = inject(ToastService);

  form!: FormGroup;
  refresh$ = new BehaviorSubject<void>(undefined);
  loading = false;
  submitting = false;

  currentStep = 0;

  steps = [
    { label: 'Sede', icon: 'bi-geo-alt' },
    { label: 'Data', icon: 'bi-calendar-check' },
    { label: 'Bici', icon: 'bi-bicycle' },
    { label: 'Extra', icon: 'bi-tools' }
  ];

  pickupSlots = [
    '09:00','10:00','11:00','12:00','13:00',
    '14:00','15:00','16:00','17:00','18:00'
  ];

  locations: LocationEntity[] = [];
  availableBikes: any[] = [];
  accessories: any[] = [];
  insuranceCoverages: any[] = [];
  bikeTypologies: any[] = [];
  bikeSizes: any[] = [];
  selectedBikes: string[] = [];
  selectedAccessories: string[] = [];
  selectedTypology = '';
  selectedSize = '';

  /* Calendar */
  calendarMonth = 0;
  calendarYear = 0;
  calendarDays: (number | null)[][] = [];
  selectedDateStr = '';
  selectedTimeStr = '';

  returnCalendarMonth = 0;
  returnCalendarYear = 0;
  returnCalendarDays: (number | null)[][] = [];
  returnSelectedDateStr = '';
  returnSelectedTimeStr = '';

  weekDays = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  monthNames = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

  timeGroups = [
    { label: 'Mattina', icon: 'bi-sunrise', subtitle: '09:00 - 12:00', slots: ['09:00','10:00','11:00','12:00'] },
    { label: 'Pomeriggio', icon: 'bi-sun', subtitle: '13:00 - 16:00', slots: ['13:00','14:00','15:00','16:00'] },
    { label: 'Sera', icon: 'bi-moon', subtitle: '17:00 - 18:00', slots: ['17:00','18:00'] },
  ];

  locations$ = this.refresh$.pipe(
    switchMap(() =>
      this.locationService.list().pipe(
        catchError(err => { console.error(err); return of([]); })
      )
    )
  );

  accessories$ = this.refresh$.pipe(
    switchMap(() =>
      this.bikeAccessoryService.list().pipe(
        catchError(err => { console.error(err); return of([]); })
      )
    )
  );

  insuranceCoverages$ = this.refresh$.pipe(
    switchMap(() =>
      this.insuranceCoverageService.list().pipe(
        catchError(err => { console.error(err); return of([]); })
      )
    )
  );

  bikeTypologies$ = this.refresh$.pipe(
    switchMap(() =>
      this.bikeTypologiesService.list().pipe(
        catchError(err => { console.error(err); return of([]); })
      )
    )
  );

  bikeSizes$ = this.refresh$.pipe(
    switchMap(() =>
      this.bikeSizesService.list().pipe(
        catchError(err => { console.error(err); return of([]); })
      )
    )
  );

  ngOnInit(): void {
    const now = new Date();
    this.calendarMonth = now.getMonth();
    this.calendarYear = now.getFullYear();
    this.buildCalendar();

    this.returnCalendarMonth = now.getMonth();
    this.returnCalendarYear = now.getFullYear();
    this.buildReturnCalendar();

    this.initForm();
    this.loadData();
    this.watchFilters();
    this.watchPickupDate();
  }

  initForm(): void {
    this.form = this.fb.group({
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      pickupLocation: ['', Validators.required],
      returnDate: ['', Validators.required],
      returnTime: ['', Validators.required],
      bikes: [[], [Validators.required, minBikesValidator()]],
      accessories: [[]],
      insuranceCoverage: ['']
    }, { validators: returnAfterPickupValidator });
  }

  loadData(): void {
    this.locations$.subscribe(r => this.locations = r);
    this.accessories$.subscribe(r => this.accessories = r);
    this.insuranceCoverages$.subscribe(r => this.insuranceCoverages = r);
    this.bikeTypologies$.subscribe(r => this.bikeTypologies = r);
    this.bikeSizes$.subscribe(r => this.bikeSizes = r);
  }

  watchFilters(): void {
    combineLatest([
      this.form.get('pickupLocation')!.valueChanges,
      this.form.get('pickupDate')!.valueChanges,
      this.form.get('returnDate')!.valueChanges
    ]).subscribe(([locId, pickup, ret]) => {
      if (locId && pickup && ret) {
        this.selectedTypology = '';
        this.selectedSize = '';
        this.loadAvailableBikes(locId, pickup, ret);
      }
    });
  }

  watchPickupDate(): void {
    this.form.get('pickupDate')?.valueChanges.subscribe(pickup => {
      const ret = this.form.value.returnDate;
      const retTime = this.form.value.returnTime;
      if (ret && pickup && ret < pickup) {
        this.form.patchValue({ returnDate: '', returnTime: '' });
        this.returnSelectedDateStr = '';
        this.returnSelectedTimeStr = '';
      } else if (ret && retTime && pickup && ret === pickup) {
        const pickupTime = this.form.value.pickupTime;
        if (pickupTime && retTime <= pickupTime) {
          this.form.patchValue({ returnTime: '' });
          this.returnSelectedTimeStr = '';
        }
      }
    });
  }

  loadAvailableBikes(locationId: string, startDate: string, endDate: string): void {
    this.loading = true;
    this.bikeService.getAvailable(locationId, startDate, endDate, this.selectedTypology, this.selectedSize).subscribe({
      next: (bikes) => {
        this.availableBikes = bikes;
        this.selectedBikes = [];
        this.form.patchValue({ bikes: [] }, { emitEvent: false });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  selectTypology(id: string): void {
    this.selectedTypology = id;
    this.reloadBikesWithFilters();
  }

  selectSize(id: string): void {
    this.selectedSize = id;
    this.reloadBikesWithFilters();
  }

  private reloadBikesWithFilters(): void {
    const locId = this.form.value.pickupLocation;
    const start = this.form.value.pickupDate;
    const end = this.form.value.returnDate;
    if (locId && start && end) this.loadAvailableBikes(locId, start, end);
  }

  toggleBike(id: string | number): void {
    const idStr = String(id);
    if (this.selectedBikes.includes(idStr)) {
      this.selectedBikes = this.selectedBikes.filter(x => x !== idStr);
    } else {
      this.selectedBikes.push(idStr);
    }
    this.form.patchValue({ bikes: this.selectedBikes }, { emitEvent: false });
  }

  toggleAccessory(id: string): void {
    const idx = this.selectedAccessories.indexOf(id);
    if (idx >= 0) {
      this.selectedAccessories.splice(idx, 1);
    } else {
      this.selectedAccessories.push(id);
    }
    this.form.patchValue({ accessories: [...this.selectedAccessories] }, { emitEvent: false });
  }


  buildCalendar(): void {
    const firstDay = new Date(this.calendarYear, this.calendarMonth, 1);
    const daysInMonth = new Date(this.calendarYear, this.calendarMonth + 1, 0).getDate();
    const startDow = firstDay.getDay();
    const startOffset = startDow === 0 ? 6 : startDow - 1;

    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];

    for (let i = 0; i < startOffset; i++) week.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) { weeks.push(week); week = []; }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    this.calendarDays = weeks;
  }

  prevMonth(): void {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
    this.buildCalendar();
  }

  nextMonth(): void {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
    this.buildCalendar();
  }

  selectDay(day: number): void {
    const iso = `${this.calendarYear}-${String(this.calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    this.form.patchValue({ pickupDate: iso });
    this.selectedDateStr = `${day} ${this.monthNames[this.calendarMonth]} ${this.calendarYear}`;
  }

  isToday(day: number): boolean {
    const now = new Date();
    return day === now.getDate() && this.calendarMonth === now.getMonth() && this.calendarYear === now.getFullYear();
  }

  pad(n: number): string { return String(n).padStart(2, '0'); }

  fmtDate(day: number): string {
    return `${this.calendarYear}-${this.pad(this.calendarMonth + 1)}-${this.pad(day)}`;
  }

  /* Return Calendar */
  buildReturnCalendar(): void {
    const firstDay = new Date(this.returnCalendarYear, this.returnCalendarMonth, 1);
    const daysInMonth = new Date(this.returnCalendarYear, this.returnCalendarMonth + 1, 0).getDate();
    const startDow = firstDay.getDay();
    const startOffset = startDow === 0 ? 6 : startDow - 1;
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) week.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }
    this.returnCalendarDays = weeks;
  }

  prevReturnMonth(): void {
    if (this.returnCalendarMonth === 0) {
      this.returnCalendarMonth = 11;
      this.returnCalendarYear--;
    } else {
      this.returnCalendarMonth--;
    }
    this.buildReturnCalendar();
  }

  nextReturnMonth(): void {
    if (this.returnCalendarMonth === 11) {
      this.returnCalendarMonth = 0;
      this.returnCalendarYear++;
    } else {
      this.returnCalendarMonth++;
    }
    this.buildReturnCalendar();
  }

  isReturnToday(day: number): boolean {
    const now = new Date();
    return day === now.getDate() && this.returnCalendarMonth === now.getMonth() && this.returnCalendarYear === now.getFullYear();
  }

  fmtReturnDate(day: number): string {
    return `${this.returnCalendarYear}-${this.pad(this.returnCalendarMonth + 1)}-${this.pad(day)}`;
  }

  isReturnPastDay(day: number): boolean {
    const now = new Date();
    now.setHours(0,0,0,0);
    const d = new Date(this.returnCalendarYear, this.returnCalendarMonth, day);
    if (d < now) return true;
    const pickup = this.form?.value?.pickupDate;
    if (pickup) {
      const pickupDate = new Date(pickup);
      pickupDate.setHours(0,0,0,0);
      if (d < pickupDate) return true;
    }
    return false;
  }

  isReturnSlotBeforePickup(slot: string): boolean {
    const returnDate = this.form?.value?.returnDate;
    const pickupDate = this.form?.value?.pickupDate;
    const pickupTime = this.form?.value?.pickupTime;
    if (!returnDate || !pickupDate || !pickupTime) return false;
    if (returnDate === pickupDate) return slot <= pickupTime;
    return false;
  }

  selectReturnDay(day: number): void {
    const iso = `${this.returnCalendarYear}-${String(this.returnCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    this.form.patchValue({ returnDate: iso });
    this.returnSelectedDateStr = `${day} ${this.monthNames[this.returnCalendarMonth]} ${this.returnCalendarYear}`;
    if (this.returnSelectedTimeStr && iso === this.form.value.pickupDate && this.returnSelectedTimeStr <= this.form.value.pickupTime) {
      this.returnSelectedTimeStr = '';
      this.form.patchValue({ returnTime: '' });
    }
  }

  selectReturnTime(slot: string): void {
    if (this.isReturnSlotBeforePickup(slot)) return;
    this.returnSelectedTimeStr = slot;
    this.form.patchValue({ returnTime: slot });
  }

  isPastDay(day: number): boolean {
    const now = new Date();
    now.setHours(0,0,0,0);
    const d = new Date(this.calendarYear, this.calendarMonth, day);
    return d < now;
  }

  selectTime(slot: string): void {
    this.selectedTimeStr = slot;
    this.form.patchValue({ pickupTime: slot });
  }

  nextStep(): void {
    if (this.currentStep === 0) {
      this.form.get('pickupLocation')?.markAsTouched();
      if (!this.form.value.pickupLocation) return;
    }
    if (this.currentStep === 1) {
      ['pickupDate', 'pickupTime', 'returnDate', 'returnTime'].forEach(f => this.form.get(f)?.markAsTouched());
      if (!this.form.value.pickupDate || !this.form.value.pickupTime || !this.form.value.returnDate || !this.form.value.returnTime) return;
      if (this.form.errors?.['returnAfterPickup']) return;
    }
    if (this.currentStep < this.steps.length - 1) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  goToStep(i: number): void {
    if (i < this.currentStep) this.currentStep = i;
  }

  canGoNext(): boolean {
    if (this.currentStep === 0) return !!this.form.value.pickupLocation;
    if (this.currentStep === 1) return !!this.form.value.pickupDate && !!this.form.value.pickupTime && !!this.form.value.returnDate && !!this.form.value.returnTime;
    if (this.currentStep === 2) return this.selectedBikes.length > 0;
    if (this.currentStep === 3) return true;
    return false;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Compila tutti i campi obbligatori');
      return;
    }

    this.submitting = true;

    const data: any = {
      pickupDate: new Date(this.form.value.pickupDate),
      pickupTime: this.form.value.pickupTime,
      pickupLocation: this.form.value.pickupLocation,
      returnDateTime: new Date(`${this.form.value.returnDate}T${this.form.value.returnTime}`),
      bikes: this.selectedBikes,
      accessories: this.form.value.accessories,
    };

  if (this.form.value.insuranceCoverage) {
    data.insuranceCoverage = this.form.value.insuranceCoverage;
  }

    this.reservationService.add(data).subscribe({
      next: () => {
        this.form.reset();
        this.selectedBikes = [];
        this.selectedAccessories = [];
        this.availableBikes = [];
        this.selectedDateStr = '';
        this.selectedTimeStr = '';
        this.returnSelectedDateStr = '';
        this.returnSelectedTimeStr = '';
        this.currentStep = 0;
        this.refresh$.next();
        this.submitting = false;
        this.toastService.success('Prenotazione confermata!');
      },
      error: () => {
        this.submitting = false;
      }
    });
  }

  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  fieldError(control: string): string {
    const c = this.form.get(control);
    if (!c || !c.errors || !(c.dirty || c.touched)) return '';
    if (c.errors['required']) return 'Campo obbligatorio';
    if (c.errors['email']) return 'Email non valida';
    if (c.errors['minlength']) return `Minimo ${c.errors['minlength'].requiredLength} caratteri`;
    if (c.errors['minBikes']) return 'Seleziona almeno una bici';
    if (c.errors['returnAfterPickup']) return 'La data di restituzione deve essere uguale o successiva al ritiro';
    return '';
  }
}

export function minBikesValidator(): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    return Array.isArray(val) && val.length > 0 ? null : { minBikes: true };
  };
}

export function returnAfterPickupValidator(group: AbstractControl): ValidationErrors | null {
  const pickup = group.get('pickupDate')?.value;
  const ret = group.get('returnDate')?.value;
  if (pickup && ret && ret < pickup) return { returnAfterPickup: true };
  return null;
}