export class Note {
  id: number;
  title: string;
  content: string;
  date: Date;

  constructor(title: string, content: string, id?: number, date?: Date) {
    this.id = id ?? Date.now();
    this.title = title;
    this.content = content;
    this.date = date ?? new Date(); // ← penting, harus objek Date
  }

  get contentSnippet(): string {
    const plainText = this.content?.replace(/<[^>]+>/g, '') || '';
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
  }


  get contenthtml(): string {
    const plainText = this.content?.replace(/"/g, '\\"').replace(/\n/g, '\\n') || '';
    console.log(plainText);
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
  }

  get titleShort(): string { 
    return this.title.length > 30 ? this.title.slice(0, 30) + '…' : this.title;
  }

  get formattedDate(): string {
    return this.date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

}
