# Get started with Casper

## 1. Create and deploy a simple smart contract

First I installed the Casper Crates with the following command:
```text
cargo install cargo-casper
```
Then I created a new smart contract project:
```text
cargo casper 1-smart-contract
```
I had trouble running the next commands at first, but I fixed them by updating them to the following:
```text
cd contract
rustup install $(cat ../rust-toolchain)
rustup target add --toolchain $(cat ../rust-toolchain) wasm32-unknown-unknown
```
After that I built the contract:
```text
cargo build --release
```
Finally, it was time to test the contract, so I changed directories:
```text
cd ../tests
cargo test
```
But I was met with an error... which was alleviated by moving the `contract.wasm` in the `my-project/contract/target/wasm32-unknown-unknown/release` directory to `tests/wasm`. After alleviating that issue, I received this output:
```text
    Finished test [unoptimized + debuginfo] target(s) in 0.15s
    Running unittests (target/debug/deps/integration_tests-4df7173c208773ee)

running 2 tests
test tests::should_error_on_missing_runtime_arg - should panic ... ok
test tests::should_store_hello_world ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.06s

```