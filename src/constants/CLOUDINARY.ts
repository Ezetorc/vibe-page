import { CloudService } from '../services/CloudService'

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME ?? ''

export const CLOUDINARY = new CloudService({
  cloud: { cloudName: CLOUD_NAME }
})
