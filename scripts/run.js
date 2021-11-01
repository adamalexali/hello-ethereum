const main = async () => {
  // complies contract and generates files in the artifacts/ directory
  const myContractFactory = await hre.ethers.getContractFactory(
    'HelloEthereum'
  );

  // Hardhat will create a local blockchain to work on and debug in
  const myContract = await myContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await myContract.deployed();
  console.log('Contract deployed to:', myContract.address);

  // get contract balance before
  let contractBalance = await hre.ethers.provider.getBalance(
    myContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  // send interaction
  let interactTxn = await myContract.interact('First interaction');
  await interactTxn.wait(); // wait for the transaction to be mined

  let interactTxn2 = await myContract.interact('Second interaction');
  await interactTxn2.wait(); // wait for the transaction to be mined

  // get contract balance after
  contractBalance = await hre.ethers.provider.getBalance(myContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allInteractions = await myContract.getAllInteractions();
  console.log(allInteractions);
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
