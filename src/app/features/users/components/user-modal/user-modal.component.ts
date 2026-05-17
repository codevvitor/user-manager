import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserModalComponent>);
  private userService = inject(UserService);

  data: User = inject(MAT_DIALOG_DATA);

  loading = signal(false);
  isEditing = signal(false);

  form!: FormGroup;

  ngOnInit() {
    this.isEditing.set(!!this.data);

    this.form = this.fb.group({
      name: [this.data?.name ?? '', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: [this.data?.email ?? '', [
        Validators.required,
        Validators.email
      ]],
      phone: [this.data?.phone ?? '', [
        Validators.required
      ]]
    });
  }

  get nameError() {
    const control = this.form.get('name');
    if (control?.hasError('required')) return 'Nome é obrigatório';
    if (control?.hasError('minlength')) return 'Nome deve ter ao menos 3 caracteres';
    return '';
  }

  get emailError() {
    const control = this.form.get('email');
    if (control?.hasError('required')) return 'Email é obrigatório';
    if (control?.hasError('email')) return 'Email inválido';
    return '';
  }

  get phoneError() {
    const control = this.form.get('phone');
    if (control?.hasError('required')) return 'Telefone é obrigatório';
    return '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);

    const action$ = this.isEditing()
      ? this.userService.updateUser(this.data.id, this.form.value)
      : this.userService.createUser(this.form.value);

    action$.subscribe({
      next: (user) => {
        this.loading.set(false);
        this.dialogRef.close(user);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
