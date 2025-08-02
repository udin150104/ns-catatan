import { EventData, Frame, LoadEventData, NavigatedData, Page, ImageSource, WebView, TextField, Application } from '@nativescript/core';
import { AddNoteViewModel } from './add-note-view-model';
import { ImagePicker } from '@nativescript/imagepicker';
import { NoteService } from '~/services/note.service';

let webViewRef: WebView;


export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.actionBarHidden = true;
  const noteId = args.context?.noteId;
  const vm = new AddNoteViewModel();
  if (noteId) {
    const existingNote = NoteService.getById(noteId);
    if (existingNote) {
      vm.setNote(existingNote); // isi judul & konten
    }
  }

  page.bindingContext = vm;

  const webView = page.getViewById<WebView>('editor');
  webViewRef = webView;
  webView.src = '~/assets/html/editor.html';
  webView.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
    if (!args.error) {
      const content = vm.content?.replace(/"/g, '\\"').replace(/\n/g, '\\n') || '';

      // Khusus Android
      if (Application.android && webView.android) {
        webView.android.evaluateJavascript(
          `window.setEditorContent("${content}")`,
          null
        );
      }

      // iOS
      if (Application.ios && webView.ios) {
        webView.ios.evaluateJavaScriptCompletionHandler(
          `window.setEditorContent("${content}")`,
          null
        );
      }
    }
  });
}

export function goBack(args: EventData) {
  Frame.topmost().goBack();
}

export function onSave(args: EventData) {
  const page = (<any>args.object).page as Page;
  const titleField = <TextField>page.getViewById('titleField');
  const title = titleField?.text || 'Tanpa Judul';

  if (!webViewRef) {
    console.error('WebView tidak tersedia.');
    return;
  }

  const vm = page.bindingContext as AddNoteViewModel;

  if (Application.android && webViewRef.android) {
    webViewRef.android.evaluateJavascript(
      'window.getEditorHtml()',
      new android.webkit.ValueCallback({
        onReceiveValue: function (value) {
          const html = value?.toString()?.replace(/^"|"$/g, '').replace(/\\"/g, '"');
          vm.saveNote(title, html);
          Frame.topmost().goBack();
        }
      })
    );
  } else if (Application.ios && webViewRef.ios) {
    webViewRef.ios.evaluateJavaScriptCompletionHandler(
      'window.getEditorHtml()',
      (result: any, error: NSError) => {
        if (error) {
          console.error('Error evaluasi JS (iOS):', error.localizedDescription);
          return;
        }
        const html = result?.toString() ?? '';
        vm.saveNote(title, html);
        Frame.topmost().goBack();
      }
    );
  } else {
    console.warn('Platform tidak dikenali.');
  }
}

export function onInsertImage() {
  const picker = new ImagePicker({ mode: 'single' });

  picker
    .authorize()
    .then(() => picker.present())
    .then((selection) => {
      if (!selection.length) return;

      // PERBAIKAN: gunakan fromAsset()
      ImageSource.fromAsset(selection[0].asset)
        .then((source) => {
          const base64 = source.toBase64String('png', 80);
          const dataUrl = `data:image/png;base64,${base64}`;
          const jsCode = `window.insertImage("${dataUrl}");`;

          if (webViewRef.android) {
            webViewRef.android.evaluateJavascript(jsCode, null);
          } else if (webViewRef.ios) {
            webViewRef.ios.evaluateJavaScriptCompletionHandler(jsCode, null);
          } else {
            console.error("Platform WebView tidak dikenali.");
          }

        })
        .catch((err) => {
          console.error('Gagal konversi gambar:', err);
        });
    })
    .catch((e) => {
      console.error('ImagePicker error:', e);
    });
}

function sendJs(js: string) {
  if (webViewRef?.android) {
    webViewRef.android.evaluateJavascript(js, null);
  } else if (webViewRef?.ios) {
    webViewRef.ios.evaluateJavaScriptCompletionHandler(js, null);
  }
}

// Formatting Handlers
export const onBold = () => sendJs(`quill.format('bold', true);`);
export const onItalic = () => sendJs(`quill.format('italic', true);`);
export const onUnderline = () => sendJs(`quill.format('underline', true);`);
export const onStrike = () => sendJs(`quill.format('strike', true);`);
export const onBlockquote = () => sendJs(`quill.format('blockquote', true);`);
export const onCodeBlock = () => sendJs(`quill.format('code-block', true);`);

export const onHeader1 = () => sendJs(`quill.format('header', 1);`);
export const onHeader2 = () => sendJs(`quill.format('header', 2);`);

export const onOrderedList = () => sendJs(`quill.format('list', 'ordered');`);
export const onBulletList = () => sendJs(`quill.format('list', 'bullet');`);

export const onSuper = () => sendJs(`quill.format('script', 'super');`);
export const onSub = () => sendJs(`quill.format('script', 'sub');`);

export const onIndentPlus = () => sendJs(`quill.format('indent', '+1');`);
export const onIndentMinus = () => sendJs(`quill.format('indent', '-1');`);

export const onAlignLeft = () => sendJs(`quill.format('align', 'left');`);
export const onAlignCenter = () => sendJs(`quill.format('align', 'center');`);
export const onAlignRight = () => sendJs(`quill.format('align', 'right');`);
export const onAlignJustify = () => sendJs(`quill.format('align', 'justify');`);

export const onInsertLink = () => {
  const url = prompt("Masukkan URL:");
  if (url) sendJs(`quill.format('link', '${url}');`);
};

export const onClearFormat = () => sendJs(`quill.removeFormat(quill.getSelection().index, quill.getSelection().length);`);