import { MerkleTree } from "merkletreejs";
import { readAddressList } from "./contractAddress";
import hre from "hardhat";
import { FurionBlindBox__factory } from "../typechain-types";

import * as fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const addressList = readAddressList();

  const blindBox = new FurionBlindBox__factory(deployer).attach(
    addressList[hre.network.name].FurionBlindBox
  );

  const list = JSON.parse(fs.readFileSync("info/airdrop.json", "utf-8"));
  console.log("Total items", list.length);

  const leaves = list.map((item: any) => {
    console.log("Address", item.address, "Amount", item.amount);
    return hre.ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [item.address, item.amount]
    );
  });

  console.log("total leaves", leaves.length);

  const tree = new MerkleTree(leaves, hre.ethers.utils.keccak256, {
    sort: true,
  });
  const root = tree.getHexRoot();

  console.log("Merkle root", root);

  const tx = await blindBox.setRoot(root);
  console.log("tx details", await tx.wait());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
