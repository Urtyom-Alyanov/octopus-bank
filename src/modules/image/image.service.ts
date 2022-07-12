import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import sharp from 'sharp';
import { join } from 'path';

interface CropProps {
  rotation: number;
  x: number;
  y: number;
  width: number;
  height: number;
  buffer: Buffer;
  isAvatar: boolean;
}

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private ImageRepo: Repository<Image>,
  ) {}

  async upload(data: Buffer, contentType: string) {
    const newimg = this.ImageRepo.create({
      Data: data,
      ContentType: contentType,
    });

    const savedimg = await this.ImageRepo.save(newimg);

    return savedimg.Id;
  }

  async findOne(
    id: number,
  ): Promise<{ data?: Uint8Array; contentType: string }> {
    const img = await this.ImageRepo.findOneBy({ Id: id });

    if (!img)
      return {
        contentType: 'not-found',
      };

    return {
      data: img.Data,
      contentType: img.ContentType,
    };
  }

  async cropImage(props: CropProps) {
    const rotation = parseFloat((props.rotation as unknown as string) || '0');
    const cropInfo = {
      left: parseFloat((props.x as unknown as string) || '0'),
      top: parseFloat((props.y as unknown as string) || '0'),
      width: parseFloat((props.width as unknown as string) || '0'),
      height: parseFloat((props.height as unknown as string) || '0'),
    };

    const image = sharp(props.buffer);

    await image.metadata().then((metadata) => {
      console.log(`Source image size is ${metadata.width}x${metadata.height}`);
    });

    console.log(`Rotating... ${rotation} degrees`);
    await image.rotate(rotation);

    const meta = await sharp(await image.toBuffer()).metadata();
    console.log(`Rotated image size is ${meta.width}x${meta.height}`);

    console.log(`Cropping...`, cropInfo);

    cropInfo.top = Math.round((cropInfo.top / 100) * meta.height);
    cropInfo.left = Math.round((cropInfo.left / 100) * meta.width);
    cropInfo.width = Math.round((cropInfo.width / 100) * meta.width);
    cropInfo.height = Math.round((cropInfo.height / 100) * meta.height);

    if (cropInfo.width !== cropInfo.height && props.isAvatar) {
      console.log(`Resize to avatar...`);
      if (cropInfo.height > cropInfo.width) {
        const chlen = Math.round((cropInfo.height - cropInfo.width) / 2);
        cropInfo.top += chlen;

        cropInfo.height = cropInfo.width;
      }
      if (cropInfo.height < cropInfo.width) {
        const chlen = Math.round((cropInfo.width - cropInfo.height) / 2);
        cropInfo.left += chlen;

        cropInfo.width = cropInfo.height;
      }
      console.log(`Resizing to avatar...`, cropInfo);
    }

    await image.extract(cropInfo);

    console.log('image croped', cropInfo);

    await image.toFormat('jpeg');

    console.log('image jpeged');

    const imgBuffer = await image.toBuffer();

    console.log('image buffered');

    return imgBuffer;
  }

  async uploadAndCrop(cropProps: CropProps) {
    const croppedFile = await this.cropImage(cropProps);
    const savedFileId = await this.upload(croppedFile, 'image/jpeg');
    return savedFileId;
  }

  async deleteFromId(id: number) {
    return this.ImageRepo.delete({ Id: id });
  }

  static getUrl(id: number) {
    return `http://192.168.0.67:3000/methods/image/${id}`;
  }
}
