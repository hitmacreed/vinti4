import jsSha512 from 'js-sha512';
import btoa from 'btoa';
import { SendFingerPrint, SuccessFingerPrint } from '../models/index';
import { AMOUNT_TO_MULTIPLE } from '../constants';

export default class Utils {
  /**
   * Converts the Array of number into Base64-encoded ASCII string
   *
   * @param u8 - the string or Buffer
   * @returns a base64-encoded ASCII
   */
  static ToBase64(u8: Array<number>): string {
    return btoa(String.fromCharCode.apply(null, u8));
  }

  /**
   * Hash(SHA512) and return integer array in form of Base64.
   *
   * @param input - the received input
   * @returns Base64-encoded ASCII
   */
  static generateSHA512StringToBase64(input: string): string {
    return this.ToBase64(jsSha512.sha512.digest(input));
  }

  /**
   * Generate the fingerPrint to send to the server
   *
   * @param sendFingerPrint - The SendFingerPrint
   * @returns Hash(SHA512)
   */
  static generateSendFingerPrint(sendFingerPrint: SendFingerPrint): string {
    let toHash =
      this.generateSHA512StringToBase64(sendFingerPrint.posAutCode) +
      sendFingerPrint.timeStamp +
      sendFingerPrint.amount * AMOUNT_TO_MULTIPLE +
      sendFingerPrint.merchantRef.trim() +
      sendFingerPrint.merchantSession.trim() +
      sendFingerPrint.posID.trim() +
      sendFingerPrint.currency +
      sendFingerPrint.transactionCode;

    if (sendFingerPrint.entityCode)
      toHash += Number(sendFingerPrint.entityCode.trim());

    if (sendFingerPrint.referenceNumber)
      toHash += Number(sendFingerPrint.referenceNumber);

    return this.generateSHA512StringToBase64(toHash);
  }

  /**
   * Generate the fingerPrint Success Callback to the frontEnd
   *
   * @param successFingerPrint - The SuccessFingerPrint
   * @returns Hash(SHA512)
   */
  static generateFingerPrintResponseSuccess(
    successFingerPrint: SuccessFingerPrint
  ): string {
    const successFP: SuccessFingerPrint = successFingerPrint;

    const toHash =
      this.generateSHA512StringToBase64(successFP.posAutCode || '') +
      successFP.messageType +
      successFP.clearingPeriod +
      successFP.transactionID +
      successFP.merchantReference +
      successFP.merchantSession +
      successFP.amount * AMOUNT_TO_MULTIPLE +
      successFP.messageID.trim() +
      successFP.pan.trim() +
      successFP.merchantResponse.trim() +
      successFP.timeStamp +
      successFP.reference +
      successFP.entity +
      successFP.clientReceipt.trim() +
      successFP.additionalErrorMessage.trim() +
      successFP.reloadCode.trim();

    return this.generateSHA512StringToBase64(toHash);
  }

  /**
   * Generate the form html
   *
   * @param postURL - The post url
   * @param formData - The form data
   * @returns Hash(SHA512)
   */
  static generateFormHtml(postURL: string, formData: SendFingerPrint): string {
    let formHtml = `
   <html>
   <head>
   <title>Pagamento</title>
   </head>
   <body onload='autoPost()'>
   <div><h3>A Processar...</h3></div>`;

    formHtml += "<form action='" + postURL + "' method='post'>";

    Object.keys(formData).forEach((key) => {
      formHtml +=
        "<input type='hidden' name='" +
        key +
        "' value='" +
        formData[key] +
        "'>";
    });

    formHtml += '</form>';
    formHtml += `
    <script>
      function autoPost(){document.forms[0].submit();}
      </script>
      </body>
    </html>`;

    return formHtml;
  }
}
