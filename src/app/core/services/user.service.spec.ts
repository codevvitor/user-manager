import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    { id: 1, name: 'João', email: 'joao@email.com', phone: '123', phoneType: 'CELULAR', cpf: '111.111.111-11' },
    { id: 2, name: 'Maria', email: 'maria@email.com', phone: '456', phoneType: 'FIXO', cpf: '222.222.222-22' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar lista de usuários', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('João');
    });
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('deve buscar usuário por id', () => {
    service.getUserById(1).subscribe(user => {
      expect(user.id).toBe(1);
      expect(user.name).toBe('João');
    });
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers[0]);
  });

  it('deve criar usuário', () => {
    const novoUsuario = { name: 'José', email: 'jose@email.com', phone: '789', phoneType: 'CELULAR' as const, cpf: '333.333.333-33' };
    service.createUser(novoUsuario).subscribe(user => {
      expect(user.name).toBe('José');
    });
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, ...novoUsuario });
  });

  it('deve atualizar usuário', () => {
    const dadosAtualizados = { name: 'João Atualizado' };
    service.updateUser(1, dadosAtualizados).subscribe(user => {
      expect(user.name).toBe('João Atualizado');
    });
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1, ...dadosAtualizados });
  });
});
