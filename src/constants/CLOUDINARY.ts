import { CloudinaryService } from '../services/CloudinaryService'

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME ?? ''

export const CLOUDINARY = new CloudinaryService({
  cloud: { cloudName: CLOUD_NAME }
})
