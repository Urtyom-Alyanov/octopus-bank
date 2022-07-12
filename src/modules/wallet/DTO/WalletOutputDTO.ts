export interface IWalletOutputDTO {
    card_number: string;
    owner_name: string;
    balance: number;
    account_id: number;
    template_id: number;
    currency_iso_code: string;
    name: string;
}

export class WalletOutputDTO implements IWalletOutputDTO {
    card_number: string;
    owner_name: string;
    balance: number;
    account_id: number;
    template_id: number;
    currency_iso_code: string;
    name: string;
}