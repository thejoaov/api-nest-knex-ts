import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OpenedValidator {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public deviceId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public notificationToken: string;
}
