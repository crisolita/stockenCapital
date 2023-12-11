const CONTRACT_NAME = "stockenCapital";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Upgradeable Proxy
  const deployResult = await deploy("stockenCapital", {
    from: deployer,
    proxy: {
      owner: deployer,
      execute: {
        init: {
          methodName: "initialize",
          args: [
           "https;//"
          ],
        },
      },
    },
    log: true,
  });
  console.log(deployResult.address);
};
module.exports.tags = [CONTRACT_NAME];