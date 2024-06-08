import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class FileSaverService {
  constructor() { }

  saveFile(data: string, filename: string, fileType: string) {
    const blob = new Blob([data], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
