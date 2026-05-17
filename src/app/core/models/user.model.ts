export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  phoneType: 'CELULAR' | 'FIXO';
  cpf: string;
}
