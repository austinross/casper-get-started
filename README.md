# Get started with Casper

## 1. Create and deploy a simple smart contract

First I installed the Casper Crates with the following command:
```
cargo install cargo-casper
```
Then I created a new smart contract project:
```
cargo casper 1-smart-contract
```
I had trouble running the next commands at first, but I fixed them by updating them to the following:
```
cd contract
rustup install $(cat ../rust-toolchain)
rustup target add --toolchain $(cat ../rust-toolchain) wasm32-unknown-unknown
```
After that I built the contract:
```
cargo build --release
```
Finally, it was time to test the contract, so I changed directories:
```
cd ../tests
cargo test
```
But I was met with an error... which was alleviated by moving the `contract.wasm` in the `my-project/contract/target/wasm32-unknown-unknown/release` directory to `tests/wasm`. After alleviating that issue, I received this output:
```
    Finished test [unoptimized + debuginfo] target(s) in 0.15s
    Running unittests (target/debug/deps/integration_tests-4df7173c208773ee)

running 2 tests
test tests::should_error_on_missing_runtime_arg - should panic ... ok
test tests::should_store_hello_world ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s
```

## 2. Multi-Signature Tutorial

I began by cloning the example contract and client repository, and followed the steps to build the smart contract:

```
cd 2-keys-manager
rustup install $(cat rust-toolchain)
rustup target add --toolchain $(cat rust-toolchain) wasm32-unknown-unknown
cd contract
cargo build --release
```
We can then find the `keys-manager.wasm` file in the `contract/target/wasm32-unknown-unknown/release` directory.

After setting up the local Casper Network, I created the `.env` file and ran:
```
npm install
npm run start:atomic
```
Which resulted in the following steps:
```
0.1 Fund main account.
0.2 Install Keys Manager contract
1. Set faucet's weight to 3
2. Set Keys Management Threshold to 3
3. Set Deploy Threshold to 2.
4. Add first new key with weight 1.
5. Add second new key with weight 1.
6. Make a transfer from faucet using the new accounts.
7. Remove the first account
8. Remove the second account
```
That gives us:
```
Current state of the account:
{
  _accountHash: 'account-hash-ff89...',
  namedKeys: [
    {
      name: 'keys_manager',
      key: 'hash-ace3...'
    },
    {
      name: 'keys_manager_hash',
      key: 'uref-e088f...'
    }
  ],
  mainPurse: 'uref-12b3...',
  associatedKeys: [
    {
      accountHash: 'account-hash-ff89...',
      weight: 3
    }
  ],
  actionThresholds: { deployment: 2, keyManagement: 3 }
}
```

## 3. Additional Scenarios

I decided to go with **Scenario 4: managing lost or stolen keys** to demonstrate my understanding of key management concepts. Add the `scenario-lost.js` to your `client/src`, and update the `package.json` with the one provided in `3-lost-keys`. Run the script and view the results. The results should show in this order: 
```
1. Set mainAccount's weight to 3.
2. Set Keys Management Threshold to 3.
3. Set Deploy Threshold to 2.
4. Add browser key with weight 1.
5. Add mobile key with weight 1.
6. Make a transfer from mainAccount using the new accounts.
7. Remove the browser and mobile accounts.
8. Add new browser and mobile keys with mainAccount.
9. Make a transfer from faucet using the new accounts.
10. Attempt a transfer with the lost keys, results in an error.
```