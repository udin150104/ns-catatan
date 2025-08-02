import { ObservableArray, Observable } from '@nativescript/core';
import { NoteService } from '~/services/note.service';
import { Note } from '~/models/note.model';


export class AddNoteViewModel extends Observable {
  public titlePage: string = "Tambah Catatan";

  public title: string = '';
  public content: string = '';
  private editingNote: Note | null = null;

  constructor() {
    super();
  }

  setNote(note: Note) {
    this.title = note.title;
    this.content = note.content;
    this.editingNote = note;
    this.titlePage = 'Edit Catatan';
    this.notifyPropertyChange('title', this.title);
    this.notifyPropertyChange('content', this.content);
    this.notifyPropertyChange('titlePage', this.titlePage);
  }

  saveNote(title: string, content: string) {
    if (this.editingNote) {
      this.editingNote.title = title;
      this.editingNote.content = content;
      this.editingNote.date = new Date();
      NoteService.update(this.editingNote);
    } else {
      const newNote = new Note(title, content);
      NoteService.save(newNote);
    }
  }

}
