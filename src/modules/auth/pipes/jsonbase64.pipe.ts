import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class JsonBase64Pipe implements PipeTransform {
  transform(value: string, metadata?: ArgumentMetadata) {
    return JSON.parse(Buffer.from(value, 'base64').toString('utf-8'));
  }
}
