import { IsEmpty, IsNotEmpty } from 'class-validator';

export class LoginEmailDto {
  @IsNotEmpty()
  email: string;
  @IsEmpty()
  redirectTo: string;
}
