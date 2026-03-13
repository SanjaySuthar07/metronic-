import CryptoJS from "crypto-js";

export function decryptLaravelData(encrypted: string, appKey: string) {
  try {
    const key = CryptoJS.enc.Base64.parse(appKey.replace("base64:", ""));

    const payload = JSON.parse(
      Buffer.from(encrypted, "base64").toString("utf8")
    );

    const iv = CryptoJS.enc.Base64.parse(payload.iv);

    const decrypted = CryptoJS.AES.decrypt(payload.value, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Decrypt error:", error);
    return null;
  }
}