import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { readAddressList, storeAddressList } from "../scripts/contractAddress";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;

  network.name = network.name == "hardhat" ? "localhost" : network.name;

  const { deployer } = await getNamedAccounts();

  console.log("\n-----------------------------------------------------------");
  console.log("-----  Network:  ", network.name);
  console.log("-----  Deployer: ", deployer);
  console.log("-----------------------------------------------------------\n");

  const balance = await hre.ethers.provider.getBalance(deployer);
  console.log("Deployer balance: ", balance.toString());

  // Read address list from local file
  const addressList = readAddressList();

  const blindBox = await deploy("FurionBlindBox", {
    contract: "FurionBlindBox",
    from: deployer,
    args: [],
    log: true,
  });
  addressList[network.name].FurionBlindBox = blindBox.address;

  console.log("\ndeployed to address: ", blindBox.address);

  storeAddressList(addressList);
};

func.tags = ["BlindBox"];
export default func;
