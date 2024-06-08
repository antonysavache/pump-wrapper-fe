import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Output() apply = new EventEmitter<any>();


  constructor() { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        this.handleFileContent(content);
      };

      reader.readAsText(file);
    }
  }

  handleFileContent(content: string) {
    // Здесь можно обработать содержимое файла, например, распарсить JSON
    console.log('File content:', content);
    const data = JSON.parse(content);
    console.log('Parsed data:', data);
    this.apply.emit(data)
  }
}
