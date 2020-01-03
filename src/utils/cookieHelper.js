function removeCookie(key) {
  var date = new Date();
  date.setTime(date.getTime() - 10000);
  document.cookie = key + "=" + key + ";expires=" + date.toGMTString();
}

function getCookie(key, defaultVal) {
  let arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    let arr2 = arr[i].split('=');
    if (arr2[0] === key) {
      return decodeURIComponent(arr2[1]);
    }
  }
  return defaultVal;
}

function setCookie(key, value) {
  document.cookie = key + '=' + encodeURIComponent(value);
}

export default {
  'getCookie': getCookie,
  'setCookie': setCookie,
  'removeCookie': removeCookie
}
