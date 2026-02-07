import _sodium from 'libsodium-wrappers'

/**
 * Zenith Encryption Module
 *
 * Secure encryption-at-rest for "Private Notes" using libsodium.
 * Uses a user-derived secret stored locally (client-side) to ensure
 * notes are unreadable even if the database is compromised.
 */

let sodium: any

export async function initSodium() {
  await _sodium.ready
  sodium = _sodium
}

export async function encryptNote(note: string, secretKey: Uint8Array) {
  if (!sodium) await initSodium()

  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
  const ciphertext = sodium.crypto_secretbox_easy(note, nonce, secretKey)

  return {
    ciphertext: sodium.to_hex(ciphertext),
    nonce: sodium.to_hex(nonce),
    version: 'libsodium-v1',
  }
}

export async function decryptNote(
  data: { ciphertext: string; nonce: string },
  secretKey: Uint8Array
) {
  if (!sodium) await initSodium()

  const ciphertext = sodium.from_hex(data.ciphertext)
  const nonce = sodium.from_hex(data.nonce)

  const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, nonce, secretKey)

  return sodium.to_string(decrypted)
}

/**
 * Key Derivation (PBKDF2)
 * Citation: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
 */
export async function deriveSecretKey(userSecret: string, salt: string) {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(userSecret), 'PBKDF2', false, [
    'deriveBits',
    'deriveKey',
  ])

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  const rawKey = await crypto.subtle.exportKey('raw', key)
  return new Uint8Array(rawKey)
}
