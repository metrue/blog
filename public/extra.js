window.onload = () => {
  const eles = document.getElementsByTagName('p');
  const keys = Object.keys(eles);
  keys.forEach((k) => {
    eles[k].style.textAlign = 'justify';
    eles[k].style.lineHeight = 1.58;
  });

  document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  document.body.style.fontSize = '16px';
};
