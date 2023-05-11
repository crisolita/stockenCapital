const TOKEN_CONTRACT_NAME = "NFT1155";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const namedAccounts = await getNamedAccounts();
  const { deployer } = namedAccounts;
  const deployResult = await deploy("NFT1155", {
    from: deployer,
    args: ["Loquesea"],
    log: true,
  });
};
module.exports.tags = [TOKEN_CONTRACT_NAME];