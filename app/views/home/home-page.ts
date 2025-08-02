/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page's data binding.
*/
import { confirm, NavigatedData, Page, Color, Application, EventData, Frame, ItemEventData} from '@nativescript/core'
import { HomeViewModel } from './home-view-model'
import { Note } from '~/models/note.model';
import { NoteService } from '~/services/note.service';

const pageForm = 'views/add-note/add-note-page';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.actionBarHidden = true;
  page.bindingContext = new HomeViewModel();

  if (Application.android) {
    const window = Application.android.startActivity.getWindow();
    window.setStatusBarColor(new Color('#ffffffff').android);
    
    // Mengubah teks status bar menjadi hitam
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      const decorView = window.getDecorView();
      let flags = decorView.getSystemUiVisibility();
      flags |= android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
      decorView.setSystemUiVisibility(flags);
    }
  }
}

export function onAddTap() {
  Frame.topmost().navigate(pageForm);
}

export function onEdit(args: EventData) {
  const note = (<any>args.object).bindingContext as Note;

  Frame.topmost().navigate({
    moduleName: pageForm,
    context: { noteId: note.id },
  });
}

export function onDelete(args: EventData) {
  const page = (<any>args.object).page as Page;
  const note = (<any>args.object).bindingContext as Note;
  const vm = page.bindingContext;  
  confirm({
    title: "Hapus Catatan",
    message: "Apakah kamu yakin ingin menghapus catatan ini?",
    okButtonText: "Ya",
    cancelButtonText: "Batal"
  }).then((result) => {
    if (result) {
      NoteService.deleteById(note.id);
      vm.refreshNotes();
    }
  });
}