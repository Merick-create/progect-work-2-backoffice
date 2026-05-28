import { Component } from '@angular/core';
import { BikeTypology } from '../../../enity/bike-typologies/bike-typologies-entity';
import { BikeTypologiesService } from '../../service/bike-typologies/bike-typologies.service';

@Component({
  selector: 'app-bike-typologies',
  standalone: false,
  templateUrl: './bike-typologies.component.html',
  styleUrl: './bike-typologies.component.css'
})
export class BikeTypologiesComponent {
  typologies: BikeTypology[] = [];
  loading = false;
  error = '';
  
  
  showForm = false;
  editingId: string | null = null;
  formModel = {
    name: '',
    halfDateRate: 0
  };

  constructor(private bikeTypologiesService: BikeTypologiesService) {}

  ngOnInit(): void {
    this.loadTypologies();
  }

  loadTypologies(): void {
    this.loading = true;
    this.error = '';
    
    this.bikeTypologiesService.getAll().subscribe({
      next: (data) => {
        this.typologies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Errore nel caricamento';
        this.loading = false;
      }
    });
  }

  addNew(): void {
    this.editingId = null;
    this.formModel = {
      name: '',
      halfDateRate: 0
    };
    this.showForm = true;
  }

  edit(typology: BikeTypology): void {
    this.editingId = typology.id;
    this.formModel = {
      name: typology.name,
      halfDateRate: typology.halfDateRate
    };
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
    this.formModel = { name: '', halfDateRate: 0 };
  }

  save(): void {
    if (!this.formModel.name || this.formModel.halfDateRate <= 0) {
      this.error = 'Nome e tariffa sono obbligatori';
      return;
    }

    if (this.editingId) {
      // Modifica esistente
      this.bikeTypologiesService.update(this.editingId, this.formModel).subscribe({
        next: () => {
          this.loadTypologies();
          this.cancel();
        },
        error: (err) => {
          this.error = err.message || 'Errore nel salvataggio';
        }
      });
    } else {
      this.bikeTypologiesService.create(this.formModel).subscribe({
        next: () => {
          this.loadTypologies();
          this.cancel();
        },
        error: (err) => {
          this.error = err.message || 'Errore nel salvataggio';
        }
      });
    }
  }

  delete(id: string): void {
    if (confirm('Sei sicuro di voler eliminare questa tipologia?')) {
      this.bikeTypologiesService.delete(id).subscribe({
        next: () => {
          this.typologies = this.typologies.filter(t => t.id !== id);
        },
        error: (err) => {
          this.error = err.message || 'Errore nell\'eliminazione';
        }
      });
    }
  }
}
