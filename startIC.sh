echo "Checking Canister ITO Cycles..."
dfx canister --network ic status ito
sleep 2
echo "Checking Canister Index Cycles..."
dfx canister --network ic status index
sleep 2
echo "Starting Canister deployment..."
dfx deploy --network ic index
dfx deploy --network ic jasmine_dapp_assets