const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, StakeProgram, Authorized, Lockup, sendAndConfirmTransaction } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const wallet = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);

    const balance = await connection.getBalance(wallet.publicKey);
    console.log(balance);

    const stakeAccount = Keypair.generate();
    const minimumRent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
    const amountUserWantToStack = 0.5 * LAMPORTS_PER_SOL;
    const amountToStack = minimumRent + amountUserWantToStack;
    const createStackAccountTx = StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey),
        fromPubkey: wallet.publicKey,
        lamports: amountToStack,
        lockup: new Lockup(0,0, wallet.publicKey),
        stakePubkey: stakeAccount.publicKey
    });

    const createStackAccountTxId = await sendAndConfirmTransaction(connection, createStackAccountTx, [wallet, stakeAccount]);
    
    console.log('stack account created, Tx Id', createStackAccountTxId);

    let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log('stakeAccount Balance', stakeBalance/LAMPORTS_PER_SOL);

    let stackStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    console.log('StackAccount Status', stackStatus.state);

}

const runMain = async() => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
}

runMain();