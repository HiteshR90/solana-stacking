const { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, StakeProgram, Authorized, Lockup, sendAndConfirmTransaction, PublicKey } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const STAKE_PROGRAM_ID = new PublicKey("Stake11111111111111111111111111111111111111");
    const VOTE_PUB_KEY = "vgcDar2pryHvMgPkKaZfh8pQy4BJxv7SpwUG7zinWjG";

    const accounts = await connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, {
        filters: [
            {dataSize: 200},
            {
                memcmp : {
                    offset: 124,
                    bytes: VOTE_PUB_KEY,
                }
            }
        ]
    });

    console.log(`Total number of delegators found for ${STAKE_PROGRAM_ID} is ${accounts.length}`)

    if(accounts.length) {
        console.log(`Sample delegators: ${JSON.stringify(accounts[0])}`);
    }
}

const runMain = async() => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
}

runMain();