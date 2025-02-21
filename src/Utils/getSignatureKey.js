import { hextob64, KJUR } from "jsrsasign";
import { v4 as uuidv4 } from "uuid";

const secretKey = process.env.REACT_APP_SECRET_KEY;
const publicKey = process.env.REACT_APP_PUBLIC_KEY;
export const MESSAGE = `${uuidv4()}`;
export const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
  ${secretKey}
  -----END RSA PRIVATE KEY-----`;

export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
  ${publicKey}
  -----END PUBLIC KEY-----`;

export const generateSignature = () => {
  try {
    const rsa = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
    rsa.init(PRIVATE_KEY);
    rsa.updateString(MESSAGE);
    const hex = rsa.sign();
    const base64Signature = hextob64(hex);

    return base64Signature;
  } catch (error) {
    console.error("Error generating signature:", error);
    throw new Error("Failed to generate signature");
  }
};
