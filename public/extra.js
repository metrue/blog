window.onload = () => {
  const adjustStyle = () => {
    let eles = document.getElementsByTagName('p');
    Object.values(eles).forEach((ele) => {
      ele.style.textAlign = 'justify';
      ele.style.lineHeight = 1.58;
    });

    eles = document.getElementsByTagName('li');
    Object.values(eles).forEach((item) => {
      item.style.textAlign = 'justify';
      item.style.lineHeight = 1.58;
    });

    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
    document.body.style.fontSize = '16px';
  }

  const injectYoYo = () => {
    const element = document.createElement('div');
    element.style.maxWidth = '46em';
    element.style.margin = 'auto';
    element.setAttribute("id", "YoYo");

    const scriptEle = document.createElement('script');
    scriptEle.type = 'text/javascript';
    scriptEle.src  = 'https://yoyo-client-production.s3.amazonaws.com/dist/index.js';

    document.body.appendChild(element);
    document.body.appendChild(scriptEle);
  }


  adjustStyle();
  injectYoYo();
};
