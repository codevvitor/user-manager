import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, switchMap, startWith, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    UserCardComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  searchControl = new FormControl('');
  editUser = output<User>();
  loading = signal(false);
  error = signal<string | null>(null);
  users = signal<User[]>([]);
  private allUsers: User[] = [];

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.userService.getUsers().pipe(
          catchError(() => {
            this.error.set('Erro ao carregar usuários. Tente novamente.');
            return of([]);
          })
        );
      })
    ).subscribe(users => {
      this.allUsers = users;
      this.applyFilter();
      this.loading.set(false);
    });
  }

  applyFilter() {
    const term = this.searchControl.value?.toLowerCase() ?? '';
    this.users.set(
      this.allUsers.filter(u => u.name.toLowerCase().includes(term))
    );
  }

  updateUserLocally(updatedUser: User) {
    this.allUsers = this.allUsers.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    this.applyFilter();
  }

  addUserLocally(newUser: User) {
    this.allUsers = [...this.allUsers, { ...newUser, id: Date.now() }];
    this.applyFilter();
  }

  onEditUser(user: User) {
    this.editUser.emit(user);
  }
}
