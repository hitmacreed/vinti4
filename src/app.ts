import express, { Application, Request, Response } from "express";
import { SendFingerPrint, SuccessFingerPrintModel } from "./interface/fingerPrint_interface";
import { Constants } from "./utils/constants";
import moment from "moment";
import Utils from "./utils/utils";
import { Channel } from "./utils/channel.enum";

let channel: Channel;
const app: Application = express();
const urlencodedParser = express.urlencoded({ extended: false });

/**
* @function app.use()
* @param express.static @type {express}
* @summary Set root folder to use in FrontEnd
*/
app.use(express.static("public"));


/**
* @function app.get('/')
* @param req @type {Request}
* @param res @type {Response}
* @summary Init the server redirecting to homePage (public/index.html)
*/
app.get("/", (req: Request, res: Response) => {
    /* SILENCE ITS GOLDEN */
});


/**
* @function app.listen()
* @param port @type {process.env.PORT}
* @summary Set the port of our Server
*/
app.listen({ port: process.env.PORT || 4200 }, () => {
    console.log("Server Started on Port:4200");
});


/**
* @function app.post('/postback')
* @param urlencodedParser @type {urlencoded}
* @param req @type {Request}
* @param res @type {Response}
* @summary Receives the data from the product(ex:Amount ect) and excute a postback to CardPaymentUrl
*/
app.post("/postback", urlencodedParser, (req: Request, res: Response) => {


    /**
    * @summary If there is any data from the form data we could receive here in this case they are "HardCoded"~
    * @example req.body.amount
    */

    const amount = 5000;
    const merchantRef = "R" + moment().format('YYYYMMDDHHmmss');
    const merchantSession = "S" + moment().format('YYYYMMDDHHmmss');
    const dateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    /**
     * @var channel
     * @summary This its optional, but if we are using a WebSite and a Mobile App we can verify and send the Calback type we want, WEB OR Mobile (DEEPLINK)
     * @example req.body.channel
   */
    channel = req.body.channel ? req.body.channel : Channel.WEB;

    const formData: SendFingerPrint = {
        posAutCode: Constants.posAutCode,
        transactionCode: Constants.transactionCode,
        posID: Constants.posID,
        merchantRef: merchantRef,
        merchantSession: merchantSession,
        amount: amount,
        currency: Constants.currency,
        is3DSec: Constants.is3DSec,
        urlMerchantResponse: Constants.urlMerchantResponse,
        languageMessages: "pt",
        timeStamp: dateTime,
        fingerprintversion: Constants.fingerPrintVersion,
        entityCode: req.body.entityCode || '',
        referenceNumber: req.body.referenceNumber || '',
    };

    formData.fingerprint = Utils.generateSendFingerPrint(formData);

    const postURL = Constants.CardPaymentUrl
        + encodeURIComponent(formData.fingerprint)
        + "&TimeStamp="
        + encodeURIComponent(formData.timeStamp)
        + "&FingerPrintVersion="
        + encodeURIComponent(formData.fingerprintversion);

    /**
     * @summary Generate Form to trigger autoPost()
     * We could create custom UI, use your imagination
    */

    let formHtml = "<html><head><title>Pagamento</title></head><body onload='autoPost()'><div><h3>A Processar...</h3>";
    formHtml += "<form action='" + postURL + "' method='post'>";
    Object.keys(formData).forEach(key => {
        formHtml += "<input type='hidden' name='" + key + "' value='" + formData[key] + "'>";
    });
    formHtml += "</form>";
    formHtml += "<script>function autoPost(){document.forms[0].submit();}</script></body></html>";
    res.send(formHtml);
});


/**
* @function app.post('/callback')
* @param urlencodedParser @type {urlencoded}
* @param req @type {Request}
* @param res @type {Response}
* @summary Receives the Callback from the payment Result on Vinti4 Server and validate the response OK OR NOK and send it tho the FrontEnd
*/
app.post("/callback", urlencodedParser, (req: Request, res: Response) => {

    const successMessageType = Constants.successMessageType;

    const resquestModel: SuccessFingerPrintModel = req.body;


    /**
     * @summary If OK send tho the PAYMEMT OK PAGE OR SEND THE OBJECT RESPONSE BY CHANNEL (WEB/MOBILE)
     * @example  PAGE => res.send(html)
     * @example  API => res.json(req.body)
    */

    if (successMessageType.includes(resquestModel.messageType)) {

        const posAutCode = Constants.posAutCode;

        const dataModel = {
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
            merchantRespAdditionalErrorMessage: resquestModel.merchantRespAdditionalErrorMessage,
            merchantRespReloadCode: resquestModel.merchantRespReloadCode,
            posAutCode
        };

        const fingerPrintResponse = Utils.generateFingerPrintResponseSuccess(dataModel);

        if (req.body.resultFingerPrint === fingerPrintResponse) {
            channel === Channel.WEB ? res.send("Pagamento bem sucedido") : res.send(`app://callBack?=${JSON.stringify(fingerPrintResponse)}`);
        }

        else {
            channel === Channel.WEB ? res.send("Pagamento sem sucesso: Finger Print de Resposta Inválida") : res.send(`app://callBack?=${JSON.stringify(fingerPrintResponse)}`);
        }


    }


    /**
     * @summary If NOK send tho the PAYMEMT OK PAGE OR SEND THE OBJECT RESPONSE BY CHANNEL (WEB/MOBILE)
     * @example  PAGE => res.send(html)
     * @example  API => res.json(req.body)
    */

    else if (req.body.UserCancelled === "true") {
        // custom UI use your imagination
        channel === Channel.WEB ? res.send("Utilizador Cancelou a compra") : res.send("app://callBack?=UserCancelled");
    }
    else {
        // custom UI use your imagination
        channel === Channel.WEB ? res.send("Erro ao processar pagamento") : res.send("app://callBack?=PaymentFailed");
    }

});


