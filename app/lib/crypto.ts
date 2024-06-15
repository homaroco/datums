const operations = window.crypto.subtle || window.crypto.webkitSubtle

if (!operations) {
  alert('Web crypto is not supported on this browser')
  console.warn('Web crypto API not supported')
}

const iv = window.crypto.getRandomValues(new Uint8Array(12))

export async function encrypt(data: string) {
  const key = await operations.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )

  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)

  const encryptedData = await operations.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData,
  )
  return {
    encryptedData,
    key,
  }
}

export async function decrypt(encryptedData: BufferSource, key: CryptoKey) {
  const decryptedData = await operations.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  )

  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}