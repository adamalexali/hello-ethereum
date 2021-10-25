const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // complies contract and generates files in the artifacts/ directory
  const myContractFactory = await hre.ethers.getContractFactory('HelloEther');

  // Hardhat will create a local blockchain to work on and debug in
  const myContract = await myContractFactory.deploy();
  await myContract.deployed();
  console.log('Contract deployed to:', myContract.address);
  console.log('Contract deployed by:', owner.address);

  // manually calling the functions of the HelloEther.sol contract
  let interactCount;
  interactCount = await myContract.getTotalInteracts();

  let interactTxn = await myContract.interact();
  await interactTxn.wait();

  interactCount = await myContract.getTotalInteracts();

  interactTxn = await myContract.connect(randomPerson).interact();
  await interactTxn.wait();

  interactCount = await myContract.getTotalInteracts();
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
