import { MerkleTree } from "merkletreejs";
import hre from "hardhat";
import * as fs from "fs";

async function main() {
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

  // Your correct address and amount
  const address = "0x1234";
  const amount = "1";

  const proof = tree.getHexProof(
    hre.ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [address, amount]
    )
  );
  console.log("Merkle proof", proof);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
