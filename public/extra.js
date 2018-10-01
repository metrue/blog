window.onload = () => {
  const eles = document.getElementsByTagName('p');
  const keys = Object.keys(eles);
  keys.forEach((k) => {
    eles[k].style.textAlign = 'justify';
  });
};
