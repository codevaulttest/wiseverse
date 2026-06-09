export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'on_chain'
  | 'printing'
  | 'shipped'
  | 'completed';

export type WorkStatus = OrderStatus;

export interface Work {
  id: string;
  title: string;
  videoHash: string;
  videoDuration: string;
  videoSize: string;
  videoCodec: string;
  status: WorkStatus;
  onChainTokenId?: string;
  onChainIssuerAddress?: string;
  nfcTagId?: string;
  certNumber?: string;
  rightsHolder: string;
  issuedAt?: string;
  shippedAt?: string;
  trackingNumber?: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail?: string;
}

export interface Order {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  address: string;
  country: string;
  status: OrderStatus;
  totalAmount: number;
  submittedAt: string;
  works: Work[];
  activityLog: ActivityEntry[];
}

export interface NfcTag {
  id: string;
  sequenceNumber: string;
  tagId: string;
  encryptionKey: string;
  assignedToCertNumber?: string;
  assignedAt?: string;
  status: 'available' | 'assigned';
}

export type Page =
  | 'login'
  | 'orders'
  | 'order-detail'
  | 'nfc-tags'
  | 'email-preview';
