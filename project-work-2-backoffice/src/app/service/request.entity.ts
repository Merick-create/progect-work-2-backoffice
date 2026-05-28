import { Category } from "./category.entity";

export type Request = {
  id: string;
  dataInizio: Date;
  dataFine: Date;
  categoriaId: string;// FK categoria
  stato: 'In attesa' | 'Approvato' | 'Rifiutato';
  role1ID: string;// FK role1 (untente con meno accesso)
  role2ID?: string;// FK role2
}
