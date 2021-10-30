export interface SendFingerPrint {
    posAutCode: string,
    timeStamp: any,
    amount: number,
    merchantRef: string,
    merchantSession: string,
    posID: string,
    currency: string,
    transactionCode: any;
    entityCode: string
    referenceNumber: number;
    is3DSec: string,
    urlMerchantResponse: string,
    languageMessages: string,
    fingerprintversion: string;
    fingerprint?: any
    [x: string]: any;
}

export interface SuccessFingerPrintModel {
    posAutCode: string,
    messageType: string,
    merchantRespCP: string,
    merchantRespTid: string,
    merchantRespMerchantRef: string,
    merchantRespMerchantSession: string,
    merchantRespPurchaseAmount: any,
    merchantRespMessageID: string,
    merchantRespPan: string,
    merchantResp: string,
    merchantRespTimeStamp: string,
    merchantRespReferenceNumber: string,
    merchantRespEntityCode: string,
    merchantRespClientReceipt: string,
    merchantRespAdditionalErrorMessage: string,
    merchantRespReloadCode: string,
}

export interface SuccessFingerPrint {
    posAutCode: string,
    merchantResponse: string,
    timeStamp: any,
    reference: string,
    clientReceipt: string,
    additionalErrorMessage: string,
    reloadCode: string,
    entity: string,
    clearingPeriod: string,
    transactionID: string,
    merchantReference: string,
    merchantSession: string,
    amount: number,
    messageID: string,
    messageType: string,
    pan: string
}

