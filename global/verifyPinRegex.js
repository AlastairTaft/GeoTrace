export function verifyPinRegex (pin) {
  const regex = /^[A-Z0-9]{3}$/i
  if (pin.match(regex)) {
    return true
  } else {
    return false
  }
}
