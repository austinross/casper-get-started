const keyManager = require('./key-manager');
const TRANSFER_AMOUNT = process.env.TRANSFER_AMOUNT || 2500000000;

(async function () {

    // To achieve the 4th scenario, we will:
    // 1. Set mainAccount's weight to 3.
    // 2. Set Keys Management Threshold to 3.
    // 3. Set Deploy Threshold to 2.
    // 4. Add browser key with weight 1.
    // 5. Add mobile key with weight 1.
    // 6. Make a transfer from mainAccount using the new accounts.
    // 7. Remove the browser and mobile accounts.
    // 8. Add new browser and mobile keys with mainAccount.
    // 9. Make a transfer from faucet using the new accounts.
    // 10. Attempt a transfer with the lost keys, results in an error.

    let deploy;

    // 0. Initial state of the account.
    // There should be only one associated key (faucet) with weight 3.
    // Deployment Threshold should be set to 2.
    // Key Management Threshold should be set to 3.
    let masterKey = keyManager.randomMasterKey();
    let mainAccount = masterKey.deriveIndex(1);
    let browserAccount = masterKey.deriveIndex(2);
    let mobileAccount = masterKey.deriveIndex(3);

    const deploymentThreshold = 2;
    const keyManagementThreshold = 3;

    console.log("\n0.1 Fund main account.\n");
    await keyManager.fundAccount(mainAccount);
    await keyManager.printAccount(mainAccount);

    console.log("\n[x]0.2 Install Keys Manager contract");
    deploy = keyManager.keys.buildContractInstallDeploy(mainAccount);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 1. Set mainAccount's weight to 3
    console.log("\n1. Set faucet's weight to 3\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, mainAccount, 3);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 2. Set Keys Management Threshold to 3.
    console.log("\n2. Set Keys Management Threshold to 3\n");
    deploy = keyManager.keys.setKeyManagementThresholdDeploy(mainAccount, keyManagementThreshold);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 3. Set Deploy Threshold to 2.
    console.log("\n3. Set Deploy Threshold to 2.\n");
    deploy = keyManager.keys.setDeploymentThresholdDeploy(mainAccount, deploymentThreshold);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 4. Add first new key with weight 1 (first account).
    console.log("\n4. Add browser key with weight 1.\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, browserAccount, 1);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 5. Add second new key with weight 1 (second account).
    console.log("\n5. Add mobile key with weight 1.\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, mobileAccount, 1);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 6. Make a transfer from faucet using the accounts.
    console.log("\n6. Make a transfer from faucet using the accounts.\n");
    deploy = keyManager.transferDeploy(mainAccount, browserAccount, TRANSFER_AMOUNT);
    await keyManager.sendDeploy(deploy, [browserAccount, mobileAccount]);
    await keyManager.printAccount(mainAccount);

    // 7.1 Remove first account.
    console.log("\n7.1 Remove the first account\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, browserAccount, 0);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 7.2 Remove second account.
    console.log("\n7.2 Remove the second account\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, mobileAccount, 0);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 8. Add new browser and mobile keys
    let newBrowserAccount = masterKey.deriveIndex(4);
    let newMobileAccount = masterKey.deriveIndex(5);

    console.log("\n8.1 Add new browser key with weight 1.\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, newBrowserAccount, 1);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    console.log("\n8.2 Add new mobile key with weight 1.\n");
    deploy = keyManager.keys.setKeyWeightDeploy(mainAccount, newMobileAccount, 1);
    await keyManager.sendDeploy(deploy, [mainAccount]);
    await keyManager.printAccount(mainAccount);

    // 9. Make a transfer from faucet using the new accounts.
    console.log("\n9. Make a transfer from faucet using the new accounts.\n");
    deploy = keyManager.transferDeploy(mainAccount, newBrowserAccount, TRANSFER_AMOUNT);
    await keyManager.sendDeploy(deploy, [newBrowserAccount, newMobileAccount]);
    await keyManager.printAccount(mainAccount);

    // 10. Attempt a transfer with the lost keys.
    console.log("\n10. Attempt a transfer with the lost keys.\n");
    deploy = keyManager.transferDeploy(mainAccount, browserAccount, TRANSFER_AMOUNT);
    await keyManager.sendDeploy(deploy, [browserAccount, mobileAccount]);
    await keyManager.printAccount(mainAccount);
})();
