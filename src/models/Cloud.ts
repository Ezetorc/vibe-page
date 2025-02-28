import { Cloudinary } from '@cloudinary/url-gen'

export class Cloud extends Cloudinary {
  public async upload (args: { file: File; uploadPreset: string }) {
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
}
