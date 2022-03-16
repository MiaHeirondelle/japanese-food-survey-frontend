import toast from 'react-hot-toast';

export function displayInfoPopup(text) {
  toast.success(text, {
    duration: 10000,
    position: 'top-right'
  })
}