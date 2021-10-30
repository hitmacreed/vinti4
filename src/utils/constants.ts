

/**
 * @class Constants
 * @summary Server constants, this is "only for demo purposes", this should be on a "enviroment file"
 */

export class Constants {
    static readonly posID = "90051";
    static readonly posAutCode = "123456789A";
    static readonly currency = "132"; //CVE
    static readonly is3DSec = "1";
    static readonly transactionCode = "1"; // 1 - CREDIT CARD / 2 - SERCIVE PAYMENT / 3 - MOBILE RECHARGE 
    static readonly successMessageType = ["8", "10", "M", "P"]; // SUCCESS ARRAY LIST TYPE
    static readonly fingerPrintVersion = "1";
    static readonly urlMerchantResponse = "http://localhost:4200/callback"; // your ServerApiUrl
    static readonly CardPaymentUrl = "https://mc.vinti4net.cv/Client_VbV_v2/biz_vbv_clientdata.jsp?FingerPrint=";
}
