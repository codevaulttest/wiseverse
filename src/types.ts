export type VerifyState = 'verified' | 'onchain' | 'invalid';
export type Lang = 'en' | 'zh' | 'zh-hant' | 'ja' | 'ru' | 'ar' | 'es' | 'fr' | 'pt' | 'th' | 'vi';
export type Theme = 'dark' | 'light';

export interface TransferRecord {
  date: string;
  from?: string;
  to: string;
  txHash: string;
  initial?: boolean;
}
