import { useState } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

function App() {
  const [mnemonic, setMnemonic] = useState('')
  const [pvt, setPvt] = useState('');
  const [pub, setPub] = useState('');
  const handleClick = () => {
    const generatedMnemonic = generateMnemonic();
    setMnemonic(generatedMnemonic);
    const seed= mnemonicToSeedSync(generatedMnemonic);
    



    const path = `m/44'/501'/0'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    setPvt(Buffer.from(secret).toString('hex'));
   
    

    const keypair = Keypair.fromSecretKey(secret);
    setPub(keypair.publicKey.toString())
  };

  return (
   
    <>
    <button onClick={handleClick}>create mnemonic</button>
    <p>Seed Phrase: {mnemonic}</p>
      <p>Private Key: {pvt}</p>
      <p>Public Key: {pub}</p>
  
    </>
  )
}

export default App
