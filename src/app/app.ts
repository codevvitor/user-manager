import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { UserModalComponent } from './features/users/components/user-modal/user-modal.component';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    UserListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private dialog = inject(MatDialog);

  @ViewChild(UserListComponent)
  userList!: UserListComponent;

  openModal(user?: User) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: user ?? null,
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) return;

      if (user) {
        this.userList.updateUserLocally(result);
      } else {
        this.userList.addUserLocally(result);
      }
    });
  }
}
