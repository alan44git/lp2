import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  newTask = '';
  tasks: string[] = [];

  addTask(): void {
    const trimmedTask = this.newTask.trim();
    if (!trimmedTask) {
      return;
    }

    this.tasks.push(trimmedTask);
    this.newTask = '';
  }

  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
  }
}
