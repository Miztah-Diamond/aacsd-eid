import QRCode from "qrcode";
import bwipjs from "bwip-js";

export function appBaseUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function verifyUrl(publicToken: string) {
  return `${appBaseUrl()}/v/${publicToken}`;
}

export function cardUrl(publicToken: string) {
  return `${appBaseUrl()}/id/${publicToken}`;
}

export async function makeQrDataUrl(publicToken: string) {
  return QRCode.toDataURL(verifyUrl(publicToken), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 180,
    color: { dark: "#0A2A6B", light: "#FFFFFF" },
  });
}

export async function makeBarcodePngDataUrl(publicToken: string) {
  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text: publicToken,
    scale: 2,
    height: 10,
    includetext: false,
    backgroundcolor: "FFFFFF",
    barcolor: "0A2A6B",
  });
  return `data:image/png;base64,${png.toString("base64")}`;
}
