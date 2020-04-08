import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutValidator {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public deviceId: string;
}
