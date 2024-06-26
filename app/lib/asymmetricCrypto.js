export async function encrypt(plaintext, publicKey) {
  const encodedText = new TextEncoder().encode(plaintext)
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encodedText
  )
  return btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
}

export async function decrypt(encryptedData, privateKey) {
  const binaryString = atob(encryptedData)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const decryptedText = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    bytes
  )

  const decodedText = new TextDecoder().decode(decryptedText)
  return decodedText
}

async function deriveKeyAndIv(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    password,
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const keyLength = 32
  const ivLength = 16
  const numBits = (keyLength + ivLength) * 8
  const derivedBytes = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-512',
      salt,
      iterations: 10000,
    },
    passwordKey,
    numBits
  )
  const key = await crypto.subtle.importKey(
    'raw',
    derivedBytes.slice(0, keyLength),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  )
  const iv = derivedBytes.slice(keyLength, keyLength + ivLength)
  return {
    key,
    iv,
  }
}

const arrayBufferToHex = (input) => {
  input = new Uint8Array(input)
  const output = []
  for (let i = 0; i < input.length; ++i) {
    output.push(input[i].toString(16).padStart(2, '0'))
  }
  return output.join('')
}

export async function passwordEncrypt(password, salt, plaintext) {
  const { key, iv } = await deriveKeyAndIv(encode(password), encode(salt))
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encode(plaintext)
  )
  return arrayBufferToHex(ciphertext)
}

export async function passwordDecrypt(password, salt, ciphertext) {
  const { key, iv } = await deriveKeyAndIv(encode(password), encode(salt))
  return await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    ciphertext
  )
}

export const encode = (input) => new TextEncoder().encode(input)
export const decode = (input) => new TextDecoder().decode(new Uint8Array(input))
