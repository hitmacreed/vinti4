
import jsSha512 from 'js-sha512';
import btoa from 'btoa';
import { SendFingerPrint, SuccessFingerPrint } from "../interface/fingerPrint_interface";

export default class Utils {

    /**
    * @function ToBase64() 
    * @param u8 @type {Array}
    * @summary  converts the Array of number into Base64-encoded ASCII string
    */
    static ToBase64(u8: Array<number>) {
        return btoa(String.fromCharCode.apply(null, u8));
    }


    /**
    * @function generateSHA512StringToBase64()
    * @param input @type {string}
    * @summary Hash(SHA512) and return integer array in form of Base64.
    */
    static generateSHA512StringToBase64(input: string) {
        return this.ToBase64(jsSha512.sha512.digest(input));
    }


    /**
    * @function generateSendFingerPrint()
    * @param sendFingerPrint @type {SendFingerPrint}
    * @summary Generate the fingerPrint to send to the server
    */
    static generateSendFingerPrint(sendFingerPrint: SendFingerPrint) {

        let toHash =
            this.generateSHA512StringToBase64(sendFingerPrint.posAutCode) + sendFingerPrint.timeStamp + (sendFingerPrint.amount) * 1000 +
            sendFingerPrint.merchantRef.trim() + sendFingerPrint.merchantSession.trim() + sendFingerPrint.posID.trim() +
            sendFingerPrint.currency + sendFingerPrint.transactionCode;

        if (sendFingerPrint.entityCode)
            toHash += Number(sendFingerPrint.entityCode.trim());

        if (sendFingerPrint.referenceNumber)
            toHash += Number(sendFingerPrint.referenceNumber);

        return this.generateSHA512StringToBase64(toHash);

    }


    /**
    * @function generateFingerPrintResponseSuccess()
    * @param SuccessFingerPrint @type {SuccessFingerPrint}
    * @summary Generate the fingerPrint Success Callback to the frontEnd
    */
    static generateFingerPrintResponseSuccess(SuccessFingerPrint: any) {

        const successFingerPrint: SuccessFingerPrint = SuccessFingerPrint;

        const toHash =
            this.generateSHA512StringToBase64(successFingerPrint.posAutCode || '') + successFingerPrint.messageType + successFingerPrint.clearingPeriod +
            successFingerPrint.transactionID + successFingerPrint.merchantReference + successFingerPrint.merchantSession + successFingerPrint.amount * 1000 +
            successFingerPrint.messageID.trim() + successFingerPrint.pan.trim() + successFingerPrint.merchantResponse.trim() +
            successFingerPrint.timeStamp + successFingerPrint.reference + successFingerPrint.entity + successFingerPrint.clientReceipt.trim() +
            successFingerPrint.additionalErrorMessage.trim() + successFingerPrint.reloadCode.trim();

        return this.generateSHA512StringToBase64(toHash);
    }

}