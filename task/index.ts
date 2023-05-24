import { task } from "hardhat/config";
import { FurionBlindBox__factory } from "../typechain-types";

task("start").setAction(async (args, hre) => {
  const { network } = hre;

  const [dev] = await hre.ethers.getSigners();

  const blindBox = new FurionBlindBox__factory(dev).attach(
    "0x383c7c01Afc7b55F6531b9a09adA22F7ac30f794"
  );

  const tx = await blindBox.start();
  console.log("tx details", await tx.wait());
});
