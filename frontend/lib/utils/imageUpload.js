export const PROFILE_IMAGE_MAX_BYTES = 100 * 1024
export const PROFILE_IMAGE_MAX_LABEL = '100 KB'

export function validateImageDataUrl(dataUrl, fieldName = 'Profile photo', maxBytes = PROFILE_IMAGE_MAX_BYTES, maxLabel = PROFILE_IMAGE_MAX_LABEL) {
  if (!dataUrl) return null
  if (typeof dataUrl !== 'string' || (!dataUrl.startsWith('data:image/jpeg;') && !dataUrl.startsWith('data:image/jpg;'))) {
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
  if (sizeInBytes > maxBytes) {
    throw new Error(`${fieldName} must be less than ${maxLabel}`)
  }

  return dataUrl
}
