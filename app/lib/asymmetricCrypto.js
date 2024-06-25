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
