const main = async () => {
  // complies contract and generates files in the artifacts/ directory
  const helloContractFactory = await hre.ethers.getContractFactory(
    'HelloEther'
  );

  // Hardhat will create a local blockchain to work on and debug in
  const helloContract = await helloContractFactory.deploy();
  await helloContract.deployed();
  console.log('Contract deployed to:', helloContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
