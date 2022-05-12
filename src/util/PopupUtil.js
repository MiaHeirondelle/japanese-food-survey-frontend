import toast from 'react-hot-toast';

export function displayInfoPopup(text) {
  toast.success(text, {
    duration: 5000,
    position: 'top-right'
  })
}

export function displayWarningPopup(text) {
  toast.loading(text, {
    duration: 5000,
    position: 'top-right'
  })
}