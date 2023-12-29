import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { cipher, util, random, hmac, pkcs5 } from "node-forge";

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
    // private secretKey = 's1L2a3S4h';
    // generateMac(message: string): string {
    //     const mac = CryptoJS.HmacSHA256(message, this.secretKey);
    //     return CryptoJS.enc.Base64.stringify(mac);
    //   }
    //   verifyHMAC(message: string, receivedHMAC: string, secretKey: string): boolean {
    //     const calculatedHMAC = this.generateMac(message);
    //     return calculatedHMAC === receivedHMAC;
    //   }

  encodedEncryptedData:string='';
  authenticatedTag;
  encryptedOutput;
  associatedData = "0f3f056e5a7a4a4f3a82a1034b283c6e";
  name = "{username:sdlfjsd;password:sdfsdfdd}";
  encrypt = this.encryptData(this.name);
  decrypt = this.decryptData(this.encodedEncryptedData);

  get data() {
    return {
      origin: this.name,
      encrypt: this.encrypt
    };
  }

  encryptData(plainText: string): any {

    let secretKey = "f0ae60f1adcd4f28e89189689cbe3afe";
    let iv = random.getBytesSync(12);
    console.log("Encryption: Initialization Vector: " + iv);

    let hmacSha1 = hmac.create();
    hmacSha1.start("sha1", secretKey);
    hmacSha1.update(plainText);
    console.log(
      "Encryption: DERIVE key (from secret and salt): " + hmacSha1.digest().toHex()
    );

    let salt = random.getBytesSync(16);
    console.log("Encryption: salt: " + salt);
    let derivedKey = pkcs5.pbkdf2(secretKey, salt, 65536, 16);
    console.log(
      "Encryption: derivedKey by PBKDF2WithHmacSHA1; 16 byte key; with 65536 iterations: " +
        derivedKey
    );

    const cipherGCM = cipher.createCipher("AES-GCM", derivedKey);
    //console.log(cipherGCM);
    cipherGCM.start({
      iv: iv, // should be a 12-byte binary-encoded string or byte buffer
      additionalData: this.associatedData, // optional
      tagLength: 128 // optional, defaults to 128 bits
    });
    cipherGCM.update(util.createBuffer(random.getBytes(16)));
    cipherGCM.finish();

    let encryptedData = cipherGCM.output;
    this.authenticatedTag = cipherGCM.mode.tag;

    // outputs encrypted hex
    console.log("Encryption: encrypted hex: " + encryptedData.toHex());
    // outputs authentication tag
    console.log("Encryption: authentication tag: " + this.authenticatedTag.toHex());
    this.encodedEncryptedData = util.encode64(cipherGCM.output.getBytes());
    console.log("Encryption: Base64 encoded encrypted Data: " + this.encodedEncryptedData);

    this.encryptedOutput = cipherGCM.output;
  }
  decryptData(encryptedText: string): any {
    let decodedData = util.decode64(encryptedText);
    let associatedData = "0f3f056e5a7a4a4f3a82a1034b283c6e";
    let secretKey = "f0ae60f1adcd4f28e89189689cbe3afe";
    console.log("Decryption: decodedData: " + decodedData);

    let iv = random.getBytesSync(12);
    console.log("Decryption: Initialization Vector: " + iv);

    let hmacSha1 = hmac.create();
    hmacSha1.start("sha1", secretKey);
    hmacSha1.update(decodedData);
    console.log(
      "Decryption: DERIVE key (from secret and salt): " + hmacSha1.digest().toHex()
    );

    let salt = random.getBytesSync(16);
    console.log("Decryption: salt: " + salt);
    let derivedKey = pkcs5.pbkdf2(secretKey, salt, 65536, 16);
    console.log(
      "Decryption: derivedKey by PBKDF2WithHmacSHA1; 16 byte key; with 65536 iterations: " +
        derivedKey
    );

    let decipher = cipher.createDecipher("AES-GCM", derivedKey);
    decipher.start({
      iv: iv,
      additionalData: this.associatedData, // optional
      tagLength: 128, // optional, defaults to 128 bits
      tag: this.authenticatedTag // authentication tag from encryption
    });
    decipher.update(this.encryptedOutput);
    let pass = decipher.finish();
    console.log("Decryption: " + pass);

    if(pass){
      console.log("Decryption: decrypted HEX: " + decipher.output.toHex());
    }
  }
}
