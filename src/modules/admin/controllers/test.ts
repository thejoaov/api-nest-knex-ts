import { Body, Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UploadService } from 'modules/common/services/upload';

@Controller('/test')
export class TestController {
  constructor(private uploadService: UploadService) {}

  @Get()
  @ApiExcludeEndpoint()
  public async upload(@Body() model: any) {
    return this.uploadService.save(model.filename, model.base64);
  }
}
