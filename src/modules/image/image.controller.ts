import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ImageService } from './image.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import sharp from 'sharp';

const parseFloatOrUndefiend = (unparsed?: string) => {
  if (!unparsed) return undefined;
  const parsedFloat = parseFloat(unparsed);
  if (parsedFloat === NaN) return undefined;
  return parsedFloat;
};

@Controller({
  path: '/methods/image',
  version: '2.0a',
})
export class ImageController {
  constructor(
    @Inject(ImageService)
    private ImageService: ImageService,
  ) {}

  @Get(['/null', '/undefined', '/none'])
  async findNull(
    @Res({ passthrough: true }) res: Response,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('fit') fit: 'cover' | 'contain' | 'fill' = 'cover',
  ) {
    const image = sharp(join(process.cwd(), 'images', 'null_image.jpg'));

    if (height || width)
      image.resize(
        parseFloatOrUndefiend(width),
        parseFloatOrUndefiend(height),
        {
          fit,
        },
      );

    const stream = Readable.from(await image.toBuffer());

    res.setHeader('Content-Type', 'image');
    return new StreamableFile(stream);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
    @Query('width') width?: string,
    @Query('height') height?: string,
    @Query('fit') fit: 'cover' | 'contain' | 'fill' = 'cover',
  ) {
    const img = await this.ImageService.findOne(id);
    if (!img.data || img.contentType === 'not-found')
      throw new NotFoundException({
        errorCode: 201,
        errorText: 'Картинка не найдена',
      });

    const image = sharp(img.data);

    if (height || width)
      image.resize(
        parseFloatOrUndefiend(width),
        parseFloatOrUndefiend(height),
        {
          fit,
        },
      );

    const stream = Readable.from(await image.toBuffer());

    res.setHeader('Content-Type', 'image');
    return new StreamableFile(stream);
  }
}
