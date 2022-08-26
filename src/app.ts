import express, { Application, Request, Response } from 'express';
import {
  SendFingerPrint,
  SuccessFingerPrint,
  MerchantFingerPrint,
} from './core/models/fingerPrint.model';
import moment from 'moment';
import { Channel } from './core/models/index';
import {
  CARD_PAYMENT_URL,
  CURRENCY,
  FINGER_PRINT_VERSION,
  IS_3D_SEC,
  POS_AUTH_CODE,
  POS_ID,
  SUCCESS_MESSAGE_TYPE,
  TRANSACTION_CODE,
  URL_MERCHANT_RESPONSE,
} from './core/constants';
import Utils from './core/utils/utils.';

let channel: Channel;
const app: Application = express();
const urlencodedParser = express.urlencoded({ extended: false });

/**
 * Set root folder to use in FrontEnd
 */
app.use(express.static('public'));

/**
 * @function app.get('/')
 * @param req @type {Request}
 * @param res @type {Response}
 * @summary Init the server redirecting to homePage (public/index.html)
 */
app.get('/', (req: Request, res: Response) => {
  /* SILENCE ITS GOLDEN */
});

/**
 * Set the port of our Server
 *
 * @param port - process.env.PORT
 */
app.listen({ port: process.env.PORT || 4200 }, () => {
  console.log('Server Started on Port:4200');
});

/**
 * Receives the data from the product(ex:Amount ect)
 * and excute a postback to CardPaymentUrl
 */
app.post('/postback', urlencodedParser, (req: Request, res: Response) => {
  /**
   * If there is any data from the form data we could receive
   * here in this case they are "HardCoded"
   *
   * @example req.body.amount
   */
  const amount = 5000; // HardCoded number;
  const merchantRef = 'R' + moment().format('YYYYMMDDHHmmss');
  const merchantSession = 'S' + moment().format('YYYYMMDDHHmmss');
  const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  /**
   * This its optional, but if we are using a WebSite,
   * and a Mobile App we can verify and send
   * the calback type we want, WEB OR Mobile (DEEPLINK)
   *
   * @example req.body.channel
   */
  channel = req.body.channel ? req.body.channel : Channel.WEB;

  const formData: SendFingerPrint = {
    posAutCode: POS_AUTH_CODE,
    transactionCode: TRANSACTION_CODE,
    posID: POS_ID,
    merchantRef: merchantRef,
    merchantSession: merchantSession,
    amount: amount,
    currency: CURRENCY,
    is3DSec: IS_3D_SEC,
    urlMerchantResponse: URL_MERCHANT_RESPONSE,
    languageMessages: 'pt',
    timeStamp: dateTime,
    fingerprintversion: FINGER_PRINT_VERSION,
    entityCode: req.body.entityCode || '',
    referenceNumber: req.body.referenceNumber || '',
  };

  formData.fingerprint = Utils.generateSendFingerPrint(formData);

  const postURL =
    CARD_PAYMENT_URL +
    encodeURIComponent(formData.fingerprint) +
    '&TimeStamp=' +
    encodeURIComponent(formData.timeStamp) +
    '&FingerPrintVersion=' +
    encodeURIComponent(formData.fingerprintversion);

  /**
   * Generate Form to trigger autoPost()
   * we could create custom UI, use your imagination
   */

  let formHtml = Utils.generateFormHtml(postURL, formData);

  res.send(formHtml);
});

/**
 * Receives the callback from the payment Result on Vinti4 Server
 * and validate the response OK OR NOK and send it tho the FrontEnd
 *
 * @param urlencodedParser - the urlencoded
 */
app.post('/callback', urlencodedParser, (req: Request, res: Response) => {
  const successMessageType = SUCCESS_MESSAGE_TYPE;

  const resquestModel: MerchantFingerPrint = req.body;

  /**
   * If OK send tho the payment OK page or
   * send the object response by channel (WEB/MOBILE)
   *
   * @example  PAGE => res.send(html)
   * @example  API => res.json(req.body)
   */

  if (successMessageType.includes(resquestModel.messageType)) {
    const posAutCode = POS_AUTH_CODE;

    const dataModel: any = {
      messageType: resquestModel.messageType,
      merchantRespCP: resquestModel.merchantRespCP,
      merchantRespTid: resquestModel.merchantRespTid,
      merchantRespMerchantRef: resquestModel.merchantRespMerchantRef,
      merchantRespMerchantSession: resquestModel.merchantRespMerchantSession,
      merchantRespPurchaseAmount: resquestModel.merchantRespPurchaseAmount,
      merchantRespMessageID: resquestModel.merchantRespMessageID,
      merchantRespPan: resquestModel.merchantRespPan,
      merchantResp: resquestModel.merchantResp,
      merchantRespTimeStamp: resquestModel.merchantRespTimeStamp,
      merchantRespReferenceNumber: resquestModel.merchantRespReferenceNumber,
      merchantRespEntityCode: resquestModel.merchantRespEntityCode,
      merchantRespClientReceipt: resquestModel.merchantRespClientReceipt,
      merchantRespAdditionalErrorMessage:
        resquestModel.merchantRespAdditionalErrorMessage,
      merchantRespReloadCode: resquestModel.merchantRespReloadCode,
      posAutCode,
    };

    const fingerPrintResponse =
      Utils.generateFingerPrintResponseSuccess(dataModel);

    if (req.body.resultFingerPrint === fingerPrintResponse) {
      channel === Channel.WEB
        ? res.send('Pagamento bem sucedido')
        : res.send(`app://callBack?=${JSON.stringify(fingerPrintResponse)}`);
    } else {
      channel === Channel.WEB
        ? res.send('Pagamento sem sucesso: Finger Print de Resposta Inválida')
        : res.send(`app://callBack?=${JSON.stringify(fingerPrintResponse)}`);
    }
  } else if (req.body.UserCancelled === 'true') {
    /**
     * @summary If NOK send tho the PAYMEMT OK PAGE OR SEND THE OBJECT RESPONSE BY CHANNEL (WEB/MOBILE)
     * @example  PAGE => res.send(html)
     * @example  API => res.json(req.body)
     */
    // custom UI use your imagination
    channel === Channel.WEB
      ? res.send('Utilizador Cancelou a compra')
      : res.send('app://callBack?=UserCancelled');
  } else {
    // custom UI use your imagination
    channel === Channel.WEB
      ? res.send('Erro ao processar pagamento')
      : res.send('app://callBack?=PaymentFailed');
  }
});
