import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'tasks/:id', component: TaskDetailsComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
