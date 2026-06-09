export type VerifyState = 'verified' | 'onchain' | 'invalid';
export type Lang = 'en' | 'zh' | 'zh-hant' | 'ko' | 'ja' | 'ru' | 'es' | 'fr' | 'pt' | 'th' | 'vi' | 'ar';
export type Theme = 'dark' | 'light';

export interface TransferRecord {
  date: string;
  from?: string;
  to: string;
  txHash: string;
  initial?: boolean;
}
