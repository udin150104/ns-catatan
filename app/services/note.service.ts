import { ApplicationSettings } from '@nativescript/core';
import { Note } from '~/models/note.model';

export class NoteService {
  private static key = 'notes';

  static getAll(): Note[] {
    const json = ApplicationSettings.getString(this.key, '[]');
    const raw = JSON.parse(json);
    return raw.map((item: any) => new Note(
      item.title,
      item.content,
      item.id,
      new Date(item.date)
    ));
  }

  static save(note: Note): void {
    const notes = this.getAll();
    notes.push(note);
    ApplicationSettings.setString(this.key, JSON.stringify(notes));
  }

  static clearAll(): void {
    ApplicationSettings.remove(this.key);
  }

  static getById(id: number): Note | null {
    const all = this.getAll();
    const found = all.find(n => n.id === id);
    return found ? new Note(found.title, found.content, found.id, new Date(found.date)) : null;
  }

  static update(note: Note): void {
    const notes = this.getAll();
    const index = notes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      notes[index] = note;
      ApplicationSettings.setString(this.key, JSON.stringify(notes));
    }
  }

  static deleteById(id: number): void {
    const notes = this.getAll().filter(note => note.id !== id);
    ApplicationSettings.setString(this.key, JSON.stringify(notes));
  }
}
