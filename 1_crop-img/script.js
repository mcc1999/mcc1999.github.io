const imgFile = document.getElementById('img_file');
const previewImg = document.getElementById('img_preview');
const croppedImg = document.getElementById('img_cropped');
const x_pos = document.getElementById('x');
const y_pos = document.getElementById('y');
const width_crop = document.getElementById('width');
const height_crop = document.getElementById('height');
const saveFileName = document.getElementById('save_file');

// 创建canvas对象
const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');
let cropSize = { x: 0, y: 0, width: 0, height: 0 };

imgFile.addEventListener('change', () => {
  const reader = new FileReader();
  reader.readAsDataURL(imgFile.files[0]);
  reader.onloadend = function (e) {
    previewImg.src = e.target.result;
    // 在img 对象的src 属性是空字符串(“”)的时候，
    // 浏览器认为这是一个缺省值，值的内容为当前网页的路径。
    // 浏览器会用当前路径进行再一次载入，并把其内容作为图像的二进制内容并试图显示。
    // croppedImg.src = ''; 这是不对的
    croppedImg.removeAttribute('src');
  };
});

const handleClickCrop = () => {
  const x_val = x_pos.value;
  const y_val = y_pos.value;
  const width_val = width_crop.value;
  const height_val = height_crop.value;
  if (x_val && y_val && width_val && height_val) {
    cropSize = { ...cropSize, x: x_val, y: y_val, width: width_val, height: height_val };
    getImage(previewImg.src);
  } else {
    alert('Please fill in the parameters(x、y、width、height)');
  }
}

const handleClickSave = () => {
  if (croppedImg.src) {
    // 获取图片地址
    const url = croppedImg.src;
    // 创建一个a节点插入的document
    const a = document.createElement('a');
    // 模拟鼠标click点击事件
    const event = new MouseEvent('click');
    // 设置a节点的download属性值
    a.download = saveFileName.value || 'croppedImg';
    // 将图片的src赋值给a节点的href
    a.href = url;
    a.dispatchEvent(event);
  }
}

/**
 * canvas drawImage，then toDataURL as cropped img src
 * @param {string} base64 原图的base64
 */
const getImage = function (base64) {
  // 创建图片对象
  const image = new Image();
  image.src = `${base64}`;
  image.onload = function () {
    // 获取原图宽高
    const height = this.height;
    const width = this.width;
    //设置canvas大小与原图宽高一致
    canvas.height = cropSize.height;
    canvas.width = cropSize.width;
    // 在canvas绘制图片
    ctx.drawImage(this, cropSize.x, cropSize.y, cropSize.width, cropSize.height, cropSize.x, cropSize.y, cropSize.width, cropSize.height);
    // 截图：
    croppedImg.src = canvas.toDataURL('image/png');
  }
}