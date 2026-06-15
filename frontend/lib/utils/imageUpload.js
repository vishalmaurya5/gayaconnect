export const PROFILE_IMAGE_MAX_BYTES = 100 * 1024
export const PROFILE_IMAGE_MAX_LABEL = '100 KB'

export function validateImageDataUrl(dataUrl, fieldName = 'Profile photo') {
  if (!dataUrl) return null
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    throw new Error(`${fieldName} must be an image file`)
  }

  const [metadata, base64 = ''] = dataUrl.split(',')
  if (!metadata.includes(';base64') || !base64) {
    throw new Error(`${fieldName} is not a valid image`)
  }

  const sizeInBytes = Math.ceil((base64.length * 3) / 4)
  if (sizeInBytes > PROFILE_IMAGE_MAX_BYTES) {
    throw new Error(`${fieldName} must be less than ${PROFILE_IMAGE_MAX_LABEL}`)
  }

  return dataUrl
}
