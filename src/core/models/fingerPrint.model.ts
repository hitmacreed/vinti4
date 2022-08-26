export interface SendFingerPrint {
  posAutCode: string;
  timeStamp: string;
  amount: number;
  merchantRef: string;
  merchantSession: string;
  posID: string;
  currency: string;
  transactionCode: string;
  entityCode: string;
  referenceNumber: number;
  is3DSec: string;
  urlMerchantResponse: string;
  languageMessages: string;
  fingerprintversion: string;
  fingerprint?: string;
  [x: string]: any;
}

export interface MerchantFingerPrint {
  posAutCode: string;
  messageType: string;
  merchantRespCP: string;
  merchantRespTid: string;
  merchantRespMerchantRef: string;
  merchantRespMerchantSession: string;
  merchantRespPurchaseAmount: unknown;
  merchantRespMessageID: string;
  merchantRespPan: string;
  merchantResp: string;
  merchantRespTimeStamp: string;
  merchantRespReferenceNumber: string;
  merchantRespEntityCode: string;
  merchantRespClientReceipt: string;
  merchantRespAdditionalErrorMessage: string;
  merchantRespReloadCode: string;
}

export interface SuccessFingerPrint {
  posAutCode: string;
  merchantResponse: string;
  timeStamp: any;
  reference: string;
  clientReceipt: string;
  additionalErrorMessage: string;
  reloadCode: string;
  entity: string;
  clearingPeriod: string;
  transactionID: string;
  merchantReference: string;
  merchantSession: string;
  amount: number;
  messageID: string;
  messageType: string;
  pan: string;
}
