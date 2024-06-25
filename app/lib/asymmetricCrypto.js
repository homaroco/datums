export async function encrypt(plaintext, publicKey) {
  const encodedText = new TextEncoder().encode(plaintext)
  const encryptedText = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encodedText
  )
  return new TextDecoder().decode(encryptedText)
}

export async function decrypt(ciphertext, privateKey) {
  const decryptedText = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    new TextEncoder().encode(ciphertext)
  )
  const decodedText = new TextDecoder().decode(decryptedText)
  return decodedText
}
