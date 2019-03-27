/*
*   File:   Carousel.js
*
*   Desc:   Carousel widget that implements ARIA Authoring Practices
*
*/

/*
*   @constructor CarouselTablist
*
*
*/
var Carousel = function (domNode) {
  this.domNode = domNode;

  this.items = [];

  this.firstItem = null;
  this.lastItem = null;
  this.currentDomNode = null;
  this.liveRegionNode = null;
  this.currentItem = null;
  this.pauseButton = null;

  this.playLabel = 'Start automatic slide show';
  this.pauseLabel = 'Stop automatic slide show';

  this.rotate = true;
  this.hasFocus = false;
  this.hasHover = false;
  this.isStopped = false;
  this.timeInterval = 5000;
};

Carousel.prototype.init = function () {

  this.liveRegionNode = this.domNode.querySelector('.carousel-items');

  var items = this.domNode.querySelectorAll('.carousel-item');

  for (var i = 0; i < items.length; i++) {
    var item = new CarouselItem(items[i], this);

    item.init();
    this.items.push(item);

    if (!this.firstItem) {
      this.firstItem = item;
      this.currentDomNode = item.domNode;
    }
    this.lastItem = item;

    var imageLinks = items[i].querySelectorAll('.carousel-image a');

    if (imageLinks && imageLinks[0]) {
      imageLinks[0].addEventListener('focus', this.handleImageLinkFocus.bind(this));
      imageLinks[0].addEventListener('blur', this.handleImageLinkBlur.bind(this));
    }

  }

  // Next Slide and Previous Slide Buttons

  var elems = document.querySelectorAll('.carousel .carousel-control');

  for (var i = 0; i < elems.length; i++) {
    var button = new CarouselButton(elems[i], this);
    button.init();
  }

  this.currentItem = this.firstItem;

  this.pauseButton = this.domNode.parentNode.parentNode.querySelector('button.carousel-pause');
  if (this.pauseButton) {
    var button = new PauseButton(this.pauseButton, this);
    button.init();
    this.pauseButton.setAttribute('aria-label', this.pauseLabel);
    this.pauseButton.classList.add('pause');
  }

  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

  // Start rotation
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

Carousel.prototype.setSelected = function (newItem, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  for (var i = 0; i < this.items.length; i++) {
    this.items[i].hide();
  }

  this.currentItem = newItem;
  this.currentItem.show();

  if (moveFocus) {
    this.currentItem.domNode.focus();
  }
};

Carousel.prototype.setSelectedToPreviousItem = function (currentItem, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  var index;

  if (typeof currentItem !== 'object') {
    currentItem = this.currentItem;
  }

  if (currentItem === this.firstItem) {
    this.setSelected(this.lastItem, moveFocus);
  }
  else {
    index = this.items.indexOf(currentItem);
    this.setSelected(this.items[index - 1], moveFocus);
  }
};

Carousel.prototype.setSelectedToNextItem = function (currentItem, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  var index;

  if (typeof currentItem !== 'object') {
    currentItem = this.currentItem;
  }

  if (currentItem === this.lastItem) {
    this.setSelected(this.firstItem, moveFocus);
  }
  else {
    index = this.items.indexOf(currentItem);
    this.setSelected(this.items[index + 1], moveFocus);
  }
};

Carousel.prototype.rotateSlides = function () {
  if (this.rotate) {
    this.setSelectedToNextItem();
  }
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

Carousel.prototype.updatePauseButtonDisabledState = function () {
  if (this.hasHover || this.hasFocus) {
    this.pauseButton.setAttribute('aria-disabled', 'true');
  }
  else {
    this.pauseButton.removeAttribute('aria-disabled');
  }
};

Carousel.prototype.updateRotation = function () {

  if (!this.hasHover && !this.hasFocus && !this.isStopped) {
    this.rotate = true;
  }
  else {
    this.rotate = false;
  }

  if (this.isStopped) {
    this.liveRegionNode.setAttribute('aria-live', 'off');
    this.pauseButton.setAttribute('aria-label', this.playLabel);
    this.pauseButton.classList.remove('pause');
    this.pauseButton.classList.add('play');
  }
  else {
    this.liveRegionNode.setAttribute('aria-live', 'polite');
    this.pauseButton.setAttribute('aria-label', this.pauseLabel);
    this.pauseButton.classList.remove('play');
    this.pauseButton.classList.add('pause');
  }

  this.updatePauseButtonDisabledState();
};

Carousel.prototype.toggleRotation = function () {
  if (this.isStopped) {
    if (this.pauseButton.getAttribute('aria-disabled') !== 'true') {
      this.isStopped = false;
      this.updateRotation();
    }
  }
  else {
    this.isStopped = true;
    this.updateRotation();
  }
};

Carousel.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add('focus');
};

Carousel.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove('focus');
};

Carousel.prototype.handleMouseOver = function (event) {
  if (!this.pauseButton.contains(event.target)) {
    this.hasHover = true;
  }
  this.updateRotation();
};

Carousel.prototype.handleMouseOut = function () {
  this.hasHover = false;
  this.updateRotation();
};

/* Initialize Carousel Tablists */

window.addEventListener('load', function (event) {
  var carousels = document.querySelectorAll('.carousel');

  for (var i = 0; i < carousels.length; i++) {
    var carousel = new Carousel(carousels[i]);
    carousel.init();
  }
}, false);

