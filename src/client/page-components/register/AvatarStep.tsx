import { AvatarBoilerplate } from '@/client/components/AvatarBoilerplate';
import { Button } from '@/client/components/Button';
import { ErrorAlert } from '@/client/components/ErrorAlert';
import { Modal } from '@/client/components/Modal';
import { PageBlock } from '@/client/components/PageBlock';
import { useCropImage } from '@/client/hooks/useCropImage';
import { useIsMobile } from '@/client/hooks/useIsMobile';
import { IHttpFetchError } from '@/shared/types/IHttpFetchError';
import { FC, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useUploadAvatarMutation } from './useUploadAvatarMutation';

export const AvatarStep: FC<{ after: () => void }> = ({ after }) => {
  const [imageModal, setImageModal] = useState(false);
  const [presentImage, setPresentImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotate] = useState(0);
  const [croppedPresentImageSrc, setCroppedPresentImageSrc] = useState<
    string | null
  >(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const { getCroppedImg } = useCropImage();
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImageSrc(URL.createObjectURL(file));
      setImageModal(true);
    },
    noClick: true,
  });
  const setCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );
      console.log('done', { croppedImage });
      setCroppedPresentImageSrc(croppedImage);
      setImageModal(false);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );
  const isMobile = useIsMobile();
  const [Error, SetError] = useState<IHttpFetchError | null>(null);
  const ClearError = () => SetError(null);
  const { mutate, isLoading } = useUploadAvatarMutation({
    onSuccess(data) {
      after();
    },
    onError(err) {
      SetError(err);
    },
  });
  const uploadToServer = () => {
    mutate({
      ...croppedAreaPixels,
      rotation,
      image: imageFile,
    });
  };
  return (
    <PageBlock>
      <h1 className="text-xl">Аватарка</h1>
      {Error && <ErrorAlert Error={Error} ClearError={ClearError} />}
      <div
        {...getRootProps()}
        className={
          'p-6 flex items-center justify-center border-dashed select-none border-first-500 border-4 mb-4 mt-4'
        }
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div>
            <h1 className="text-xl">Отпусти файл</h1>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-lg">
              Перетащи сюда файл или нажми на кнопку ниже
            </h1>
            <Button OnClick={open}>Выбрать файл</Button>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4">
        {croppedPresentImageSrc ? (
          <>
            <Button Second OnClick={() => setPresentImage(true)}>
              Посмотреть
            </Button>
            <Button OnClick={uploadToServer}>Загрузить</Button>
          </>
        ) : (
          <Button OnClick={after} Second>
            Пропустить
          </Button>
        )}
      </div>

      {imageModal && (
        <Modal
          IsActive={imageModal}
          SetActive={(val) => {
            setImageModal(val);
            setCrop({ x: 0, y: 0 });
          }}
          Title="Установить картинку"
        >
          <div className="flex flex-col h-full">
            <div className="before:hidden after:hidden"></div>
            <div
              className="relative w-full flex-1 sm:flex-none bg-slate-100"
              style={{ height: '800px' }}
            >
              <Cropper
                aspect={1}
                image={imageSrc}
                crop={crop}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                zoom={zoom}
                rotation={rotation}
                onCropComplete={onCropComplete}
                classes={{
                  cropAreaClassName: 'rounded-full before:hidden after:hidden',
                }}
                onMediaLoaded={(mediaSize) => {
                  setZoom(800 / mediaSize.naturalHeight);
                }}
              />
            </div>
            <div className="p-4 flex flex-col items-stretch sm:flex-row sm:items-center gap-4">
              <div className="flex flex-1 items-center gap-2">
                <p className="uppercase">Поворот</p>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  className="w-full"
                  onChange={(e) =>
                    setRotate(Number(e.currentTarget.valueAsNumber))
                  }
                />
              </div>
              {!isMobile && (
                <div className="flex flex-1 items-center gap-2">
                  <p className="uppercase">Приближение</p>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    className="w-full"
                    onChange={(e) =>
                      setZoom(Number(e.currentTarget.valueAsNumber))
                    }
                  />
                </div>
              )}
              <Button OnClick={setCroppedImage} className="flex-shrink-0">
                Законить обработку
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {presentImage && (
        <Modal
          IsActive={presentImage}
          SetActive={setPresentImage}
          AddPadding
          Title="Предварительный просмотр"
        >
          <div className="flex gap-4 justify-center items-center">
            <AvatarBoilerplate src={croppedPresentImageSrc} />
            <p className="text-lg">OAuth авторизация</p>
          </div>
        </Modal>
      )}
    </PageBlock>
  );
};
