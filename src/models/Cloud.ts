import { Cloudinary } from '@cloudinary/url-gen'
import { api } from '../constants/SETTINGS'
import { Data } from './Data'

export class Cloud extends Cloudinary {
  public async upload (args: {
    file: File
    uploadPreset: string
  }): Promise<{ secure_url: string; public_id: string }> {
    const formData = new FormData()
    formData.append('file', args.file)
    formData.append('upload_preset', args.uploadPreset)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        this.getConfig().cloud?.cloudName
      }/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await response.json()
    return data
  }

  public async deleteImage (args: { publicId: string }): Promise<Data<boolean>> {
    const response = await api.post<boolean>({
      endpoint: `users/image/${args.publicId}`
    })

    return response
  }
}
