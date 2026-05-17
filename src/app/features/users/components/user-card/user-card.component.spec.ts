import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { User } from '../../../../core/models/user.model';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  const mockUser: User = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '123456789'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [provideAnimationsAsync()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o nome do usuário', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('João Silva');
  });

  it('deve exibir o email do usuário', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('joao@email.com');
  });

  it('deve emitir evento ao clicar em editar', () => {
    let emitedUser: User | undefined;
    component.editUser.subscribe((user: User) => emitedUser = user);
    component.onEdit();
    expect(emitedUser).toEqual(mockUser);
  });
});
