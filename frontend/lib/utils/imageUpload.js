export const PROFILE_IMAGE_MAX_BYTES = 50 * 1024
export const PROFILE_IMAGE_MAX_LABEL = '50 KB'

export function validateImageDataUrl(dataUrl, fieldName = 'Profile photo') {
  if (!dataUrl) return null
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/jpeg;')) {
    throw new Error(`${fieldName} must be a JPG or JPEG image file`)
  }

  const [metadata, base64 = ''] = dataUrl.split(',')
  if (!metadata.includes(';base64') || !base64) {
    throw new Error(`${fieldName} is not a valid image`)
  }

  // Security check: Valid JPEG base64 always starts with "/9j/"
  if (!base64.startsWith('/9j/')) {
    throw new Error(`${fieldName} contains invalid or malicious file data`)
  }

  const sizeInBytes = Math.ceil((base64.length * 3) / 4)
  if (sizeInBytes > PROFILE_IMAGE_MAX_BYTES) {
    throw new Error(`${fieldName} must be less than ${PROFILE_IMAGE_MAX_LABEL}`)
  }

  return dataUrl
}
