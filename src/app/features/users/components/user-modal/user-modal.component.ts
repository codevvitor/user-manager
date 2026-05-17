import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
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
      email: [this.data?.email ?? '', [
        Validators.required,
        Validators.email
      ]],
      name: [this.data?.name ?? '', [
        Validators.required
      ]],
      cpf: [this.data?.cpf ?? '', [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      ]],
      phone: [this.data?.phone ?? '', [
        Validators.required
      ]],
      phoneType: [this.data?.phoneType ?? 'CELULAR', [
        Validators.required
      ]]
    });
  }

  get emailError() {
    const c = this.form.get('email');
    if (c?.hasError('required')) return 'Email é obrigatório';
    if (c?.hasError('email')) return 'Email inválido';
    return '';
  }

  get nameError() {
    const c = this.form.get('name');
    if (c?.hasError('required')) return 'Nome é obrigatório';
    return '';
  }

  get cpfError() {
    const c = this.form.get('cpf');
    if (c?.hasError('required')) return 'CPF é obrigatório';
    if (c?.hasError('pattern')) return 'CPF inválido (ex: 000.000.000-00)';
    return '';
  }

  get phoneError() {
    const c = this.form.get('phone');
    if (c?.hasError('required')) return 'Telefone é obrigatório';
    return '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
