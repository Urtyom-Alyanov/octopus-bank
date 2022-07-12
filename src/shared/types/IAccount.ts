export interface IAccount {
  id: number;
  name: string;
  image_src?: string;
  tag: string;
  description?: string;
  acc_type: "organization" | "goverment" | "user";
}
