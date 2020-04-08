import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendResetValidator {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public email: string;
}
