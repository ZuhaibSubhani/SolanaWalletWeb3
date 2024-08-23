import { useState } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import './index.css'

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
   
    <div className='w-full h-[100vh] overflow-y-scroll bg-black flex flex-col gap-y-6 p-6'>
      <div className='w-full flex items-center justify-center'><button onClick={handleClick} className='bg-white text-black p-2 px-4 rounded flex items-center justify-center'>Generate Seed Phrase</button></div>
      {mnemonic && <SecretPhrase phrase={mnemonic} />}
      {
        mnemonic && <KeysSection pvt={pvt} pub={pub} />
      }
    </div>
  )
}

export default App


async function copyToClipboard(text:string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

const SecretPhrase = ({phrase}:{phrase:string}) => {
  const [open,setOpen] = useState(false);
  return (
    <div className={`max-w-[1000px] w-full mx-auto flex flex-col gap-y-4 relative overflow-hidden bg-neutral-900 rounded-lg ${open?'h-auto':'h-[76px]'}`}>
      <div onClick={()=>setOpen(!open)} className='text-white flex justify-between items-center p-4  z-10 bg-neutral-900'>
          <span>Secret Phrase</span>
          <span className={`transition-all ${ open ? 'rotate-[270deg]':'rotate-90'} text-lg`}>{`>`}</span>
      </div>
      <div className={` relative transition-all ${open?' -translate-y-[10%]':' -translate-y-[110%]'}`}>
        <div className={`grid grid-cols-4 gap-x-3 gap-y-3 max-w-[1000px] w-full mx-auto cursor-pointer border-2 border-transparent hover:border-neutral-800 p-2 hover:scale-[1.01] `} onClick={()=>copyToClipboard(phrase)}>
          {
            phrase && phrase.split(' ').map((word, index) => 
              <span key={index} className='text-white bg-neutral-800 p-2 rounded-lg flex items-center justify-center min-h-[60px] text-xl'>{word}</span>
          )
          }
        </div>
        <div className='text-neutral-600 p-2'>Click anywhere to copy secret phrase to clipboard</div>
        </div>
    </div>
  )
}

const KeysSection = ({pvt,pub}:{pvt:string,pub:string}) => {
  return (
    <div className='max-w-[1000px] w-full mx-auto flex flex-col gap-y-4'>
      <div className='text-white'>Private Key</div>
      <div className='text-neutral-200 bg-neutral-900 p-3 rounded-md overflow-hidden overflow-x-scroll custom-scroll cursor-pointer' onClick={()=>copyToClipboard(pvt)}>{pvt}</div>
      <div className='text-white'>Public Key</div>
      <div className='text-neutral-200 bg-neutral-900 p-3 rounded-md overflow-hidden overflow-x-scroll custom-scroll cursor-pointer' onClick={()=>copyToClipboard(pub)}>{pub}</div>
    </div>
  )
}
