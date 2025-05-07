import { API_URL } from './Config'

export default function GetImg(img, urlGetImg) {
  let imgEx = null
  if (img) {
    imgEx = img.split('.')[1]
    if (imgEx) {
      if (
        imgEx === 'png' ||
        imgEx === 'jpg' ||
        imgEx === 'gif' ||
        imgEx === 'jpeg'
      ) {
        return `${urlGetImg}/${img}`
      } else {
        return img
      }
    }
  } else return `${API_URL}/upload/user/no-img`
}
