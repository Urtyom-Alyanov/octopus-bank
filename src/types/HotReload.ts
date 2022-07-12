import { DynamicModule } from '@nestjs/common';

export interface IHotData {
  RenderModuleСache: Promise<DynamicModule>;
}
export type HotDataT = Partial<IHotData>;
export type HotDisposeCallback = (data: HotDataT) => void;
export type HotDispose = (callback: HotDisposeCallback) => void;
export interface IHot {
  dispose: HotDispose;
  data?: HotDataT;
  accept: () => void;
}
export type HotModule = NodeModule & {
  hot?: IHot;
};

export default HotModule;
