export type OrderStatus =
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
  shippingMethod?: string;
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

export type Permission =
  | 'nfc_manage'
  | 'admin_manage'
  | 'email_templates'
  | 'edit_order'
  | 'change_order_status';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  permissions: Permission[];
  password?: string;
}

export interface EmailTemplate {
  id: number;
  label: string;
  subject: string;
  body: string;
  desc: string;
}

export type Page =
  | 'login'
  | 'orders'
  | 'order-detail'
  | 'nfc-tags'
  | 'email-preview'
  | 'admin-users';
