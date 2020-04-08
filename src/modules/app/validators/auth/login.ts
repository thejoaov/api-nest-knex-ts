import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginValidator {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  public email: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public password: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public deviceId: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public deviceName: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  public notificationToken: string;
}
