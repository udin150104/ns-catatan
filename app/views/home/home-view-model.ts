import { ObservableArray, Observable } from '@nativescript/core';
import { Note } from '~/models/note.model';
import { NoteService } from '~/services/note.service';

export class HomeViewModel extends Observable {
  public titlePage: string = "Catatan";
  public notes: ObservableArray<Note>;
  public hasNotes: boolean = false;

  constructor() {
    super();
    this.notes = new ObservableArray<Note>();
    this.loadNotes();
  }

  private loadNotes() {
    const data = NoteService.getAll();
    this.notes.splice(0); // Clear isi dulu
    data.forEach(note => this.notes.push(note));
    this.set('hasNotes', this.notes.length > 0);
  }

  public refreshNotes() {
    this.loadNotes();
  }
}
