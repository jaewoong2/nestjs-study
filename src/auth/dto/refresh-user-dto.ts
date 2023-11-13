import { IsNotEmpty } from 'class-validator';

export class RefreshUserDto {
  @IsNotEmpty()
  refresh_token: string;
}
