export default class Picture {
  async initialization() {
    const response = await fetch('https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=cb1454ac18e85a39726e72808fffabe2be9f8b1773db69611667b77b351fec81');
    const inform = await response.json();

    const img = new Image();
    const imageURL = inform.urls.regular;
    img.src = imageURL;

    const outerWrapper = document.querySelector('.outer-wrapper');

    img.onload = function loadImage() {
      outerWrapper.style.backgroundImage = `url('${imageURL}')`;
    };
  }
}
