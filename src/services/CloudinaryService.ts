import { Cloudinary } from '@cloudinary/url-gen'

export class CloudinaryService extends Cloudinary {
  public async upload (params: {
    file: File
    preset: string
  }): Promise<{ secure_url: string; public_id: string }> {
    const formData = new FormData()
    formData.append('file', params.file)
    formData.append('upload_preset', params.preset)
    const url = `https://api.cloudinary.com/v1_1/${
      this.getConfig().cloud?.cloudName
    }/image/upload`

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    return data
  }
}
