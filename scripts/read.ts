import * as fs from "fs";

import { parse } from "csv-parse";
import { storeAirdropList } from "./contractAddress";

async function main() {
  //   const file = JSON.parse(fs.readFileSync("info/testnet.csv", "utf-8"));
  //   console.log(file);

  const list = await readAddresses();

  storeAirdropList(list);

  console.log(list);
}

async function readAddresses() {
  const parser = parse({ columns: true, delimiter: "," });

  let addresses: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream("info/testnet.csv")
      .pipe(parser)
      .on("data", (data) => {
        if (Object.values(data)[7] != 0)
          addresses.push({
            address: Object.values(data)[1],
            amount: Object.values(data)[7],
          });
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve(addresses);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
