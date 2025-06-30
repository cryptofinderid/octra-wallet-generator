const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const nacl = require("tweetnacl");
const bip39 = require("bip39");

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function bufferToHex(buffer) {
  return Buffer.from(buffer).toString('hex');
}

function base64Encode(buffer) {
  return Buffer.from(buffer).toString('base64');
}

function base58Encode(buffer) {
  if (buffer.length === 0) return '';
  let num = BigInt('0x' + buffer.toString('hex'));
  let encoded = '';
  while (num > 0n) {
    const remainder = num % 58n;
    num = num / 58n;
    encoded = BASE58_ALPHABET[Number(remainder)] + encoded;
  }
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    encoded = '1' + encoded;
  }
  return encoded;
}

function createOctraAddress(publicKey) {
  const hash = crypto.createHash('sha256').update(publicKey).digest();
  return 'oct' + base58Encode(hash);
}

function verifyAddressFormat(address) {
  if (!address.startsWith('oct') || address.length !== 47) return false;
  return [...address.slice(3)].every(c => BASE58_ALPHABET.includes(c));
}

function generateEntropy(strength = 128) {
  return crypto.randomBytes(strength / 8);
}

function deriveMasterKey(seed) {
  const key = Buffer.from('Octra seed', 'utf8');
  const mac = crypto.createHmac('sha512', key).update(seed).digest();
  return {
    masterPrivateKey: mac.slice(0, 32),
    masterChainCode: mac.slice(32, 64),
  };
}

function generateWallet() {
  const entropy = generateEntropy();
  const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const { masterPrivateKey, masterChainCode } = deriveMasterKey(seed);
  const keyPair = nacl.sign.keyPair.fromSeed(masterPrivateKey);
  const privateKeyRaw = Buffer.from(keyPair.secretKey.slice(0, 32));
  const publicKeyRaw = Buffer.from(keyPair.publicKey);
  const address = createOctraAddress(publicKeyRaw);

  if (!verifyAddressFormat(address)) {
    throw new Error('Invalid address format');
  }

  const testMessage = '{"from":"test","to":"test","amount":"1000000","nonce":1}';
  const messageBytes = Buffer.from(testMessage, 'utf8');
  const signature = nacl.sign.detached(messageBytes, keyPair.secretKey);
  const signatureValid = nacl.sign.detached.verify(messageBytes, signature, keyPair.publicKey);

  return {
    mnemonic: mnemonic.split(' '),
    address,
    private_key_b64: base64Encode(privateKeyRaw),
    public_key_b64: base64Encode(publicKeyRaw),
    entropy_hex: bufferToHex(entropy),
    seed_hex: bufferToHex(seed),
    master_chain_hex: bufferToHex(masterChainCode),
    test_signature: base64Encode(signature),
    signature_valid: signatureValid,
  };
}

// === Main Execution ===
console.clear();
console.log("🔐 Generating Octra Wallet...\n");

try {
  const data = generateWallet();
  const timestamp = Math.floor(Date.now() / 1000);
  const filename = `octra_wallet_${data.address.slice(-8)}_${timestamp}.txt`;
  const filePath = path.join(__dirname, filename);

  const fileContent = `OCTRA WALLET
${"=".repeat(50)}

SECURITY WARNING: KEEP THIS FILE SECURE AND NEVER SHARE YOUR PRIVATE KEY

Generated: ${new Date().toISOString().replace("T", " ").slice(0, 19)}
Address Format: oct + Base58(SHA256(pubkey))

Mnemonic: ${data.mnemonic.join(" ")}
Private Key (B64): ${data.private_key_b64}
Public Key (B64): ${data.public_key_b64}
Address: ${data.address}

Technical Details:
Entropy: ${data.entropy_hex}
Signature Algorithm: Ed25519
Derivation: BIP39-compatible (PBKDF2-HMAC-SHA512, 2048 iterations)
`;

  fs.writeFileSync(filePath, fileContent);

  // Tampilan menarik di terminal
  console.log("🪙  Octra Wallet Generated Successfully");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`🔑 Address   : ${data.address}`);
  console.log(`🧠 Mnemonic  : ${data.mnemonic.join(" ")}`);
  console.log(`🔐 Private   : ${data.private_key_b64.slice(0, 12)}...`);
  console.log(`📬 Public    : ${data.public_key_b64.slice(0, 12)}...`);
  console.log(`🧪 Signature : ${data.signature_valid ? "✅ VALID" : "❌ INVALID"}`);
  console.log("\n📄 Saved to  :", filename);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
} catch (err) {
  console.error('❌ Gagal membuat wallet:', err.message);
}
