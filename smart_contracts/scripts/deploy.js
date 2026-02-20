import hre from "hardhat";

async function main() {
    const ProductVerification = await hre.ethers.getContractFactory("ProductVerification");
    const productVerification = await ProductVerification.deploy();

    await productVerification.waitForDeployment();

    console.log(
        `ProductVerification contract deployed to: ${await productVerification.getAddress()}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
