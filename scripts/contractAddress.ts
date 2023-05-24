import * as fs from "fs";

export const readAddressList = function () {
  // const filePath = __dirname + "/address.json"
  return JSON.parse(fs.readFileSync("info/address.json", "utf-8"));
};

export const storeAddressList = function (addressList: any) {
  fs.writeFileSync(
    "info/address.json",
    JSON.stringify(addressList, null, "\t")
  );
};

export const readAirdropList = function () {
  // const filePath = __dirname + "/address.json"
  return JSON.parse(fs.readFileSync("info/airdrop.json", "utf-8"));
};

export const storeAirdropList = function (addressList: any) {
  fs.writeFileSync(
    "info/airdrop.json",
    JSON.stringify(addressList, null, "\t")
  );
};
