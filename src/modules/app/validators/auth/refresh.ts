import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshValidator {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public refreshToken: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public deviceId: string;
}
