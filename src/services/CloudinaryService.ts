import { Cloudinary } from '@cloudinary/url-gen'
import { UserEndpoint } from '../models/UserEndpoint'

export class CloudinaryService extends Cloudinary {
  private _cloudName = this.getConfig().cloud?.cloudName

  public async upload (params: {
    file: File
    preset: string
  }): Promise<{ secure_url: string; public_id: string }> {
    const formData = new FormData()
    formData.append('file', params.file)
    formData.append('upload_preset', params.preset)
    const url = `https://api.cloudinary.com/v1_1/${this._cloudName}/image/upload`

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    return data
  }

  public getImageData (image: UserEndpoint['image']): {
    imageId?: string
    imageUrl?: string
  } {
    if (!image) return {}

    const imageId = image.split('.')[0]
    const imageUrl = `https://res.cloudinary.com/${this._cloudName}/image/upload/v1745070945/${image}`

    return { imageId, imageUrl }
  }
}
