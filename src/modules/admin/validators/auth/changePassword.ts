import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordValidator {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public currentPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @ApiProperty({ required: true, minLength: 5, maxLength: 20 })
  public newPassword: string;
}
