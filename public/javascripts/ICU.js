'use strict';

(function(window){
	var PARAMS = {
		BOX_SIZE: {
			width: '480px',
			heigth: '360px'
		},
		MAX_IMAGE_SIZE: {
			width: '480px',
			height: '360px'
		},
		BOX_BACKGROUND: '#888888',
		IMAGE_TYPE: 'image/jpeg', 	// output image type ('image/png' or 'image/jpeg')
		IMAGE_QUALITY_LEVEL: 1.0	// output image quality level (range 0.0 ~ 1.0 / only jpeg)
	};
	
	// use event list
	var EVENTS = {
		DOM_CONTENT_LOADED: 'DOMContentLoaded'
	};
	
	// ICU uses class names
	var ICU_CLASS_NAME = {
		CANVAS: 'ICU-canvas',
		DD_OBJECT: 'ICU-ddObject'
	};
	
	var ICUObjects;
	
	/**
	 * create ICU's CSS
	 */
	var addICUCSS = function() {
		var ICUStyleSheet = document.createElement('style');
		ICUStyleSheet.type = 'text/css';
		document.getElementsByTagName('head').item(0).appendChild(ICUStyleSheet);
		var css = document.styleSheets.item(0);
		
		var idx = document.styleSheets[0].cssRules.length;
		css.insertRule('.' + ICU_CLASS_NAME.CANVAS + ' { width: ' + PARAMS.BOX_SIZE.width + '; height: ' + PARAMS.BOX_SIZE.heigth + '; position: relative; }', idx++);
		css.insertRule('.' + ICU_CLASS_NAME.CANVAS + ' { background-color: ' + PARAMS.BOX_BACKGROUND + '; }', idx++);
		css.insertRule('.' + ICU_CLASS_NAME.CANVAS + ' { display: table-cell; text-align: center; vertical-align: middle; }', idx++);
		css.insertRule('.' + ICU_CLASS_NAME.CANVAS + ' > canvas { width: 100%; height: 100%; }', idx++);
		css.insertRule('.' + ICU_CLASS_NAME.DD_OBJECT + ' { width: ' + PARAMS.BOX_SIZE.width + '; height: ' + PARAMS.BOX_SIZE.heigth + '; z-index: 1000; position: absolute; top: 0; left: 0;}', idx++);
	};
	
	/**
	 * create canvas in ICUObject
	 * @param {Array} ICUObjects
	 */
	var generateICUCanvas = function(ICUObjs) {
		var obj = document.createElement('canvas');
		for(var i = 0; i < ICUObjs.length; i++) {
			var ICUObject = ICUObjs[i];
			ICUObject.appendChild(obj);
			ICUObject.appendChild(document.createElement('div'));
			var ICUCanvas = ICUObject.getElementsByTagName('canvas').item(0);
			ICUObject.getElementsByTagName('div').item(0).classList.add(ICU_CLASS_NAME.DD_OBJECT);
			ICUCanvas.setAttribute('width', PARAMS.MAX_IMAGE_SIZE.width);
			ICUCanvas.setAttribute('height', PARAMS.MAX_IMAGE_SIZE.height);
			
			ICUObject.addEventListener('dragover', dragOverEventListener, true);
			ICUObject.addEventListener('drop', dropEventListener, true);
		}
	};
	
	/**
	 * render image on canvas
	 * @param {String} image src
	 * @param {Element} IUCObject's Child Element
	 */ 
	var render = function(src, target){
		var image = new Image();
		image.onload = function(){
			var ICUObject = target.parentNode;
			var canvas = ICUObject.getElementsByTagName('canvas').item(0);
			
			var ctx = canvas.getContext("2d");
			
			var maxWidth = Number(PARAMS.MAX_IMAGE_SIZE.width.replace('px', ''));
			var maxHeight = Number(PARAMS.MAX_IMAGE_SIZE.height.replace('px', ''));
			
			var widthRatio = maxWidth / image.width;
			var heightRatio = maxHeight / image.height;
			var ratio = Math.min(widthRatio, heightRatio);
			
			maxWidth = image.width * ratio;
			maxHeight = image.height * ratio;			
			
			// clear canvas draw
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// resize canvas
			canvas.setAttribute('width', maxWidth + 'px');
			canvas.setAttribute('height', maxHeight + 'px');
			// reset canvas css
			canvas.style.width = '100%';
			canvas.style.height = '100%';
			
			widthRatio = maxWidth / ICUObject.clientWidth;
			heightRatio = maxHeight / ICUObject.clientHeight;
			
			if(widthRatio > heightRatio) {
				ratio = heightRatio / widthRatio;
				canvas.style.height = (ratio * 100) + '%';
			} else {
				ratio = widthRatio / heightRatio;
				canvas.style.width = (ratio * 100) + '%';
			}
			
			// drow image on canvas
			ctx.drawImage(image, 0, 0, maxWidth, maxHeight);
			
			createImage(canvas);
		};
		image.src = src;
	};
	
	/**
	 * output image data from canvas
	 * @param {Element} canvas element
	 */
	var createImage = function(canvas) {
		var outputImage;
		outputImage = canvas.toDataURL(PARAMS.IMAGE_TYPE, PARAMS.IMAGE_QUALITY_LEVEL);
		/*if(PARAMS.IMAGE_TYPE === 'image/jpeg') {
			outputImage = canvas.toDataURL(PARAMS.IMAGE_TYPE, PARAMS.IMAGE_QUALITY_LEVEL);
		} else {
			outputImage = canvas.toDataURL(PARAMS.IMAGE_TYPE, PARAMS.IMAGE_QUALITY_LEVEL);
		}*/
		
		var imageObject = document.createElement('img');
		imageObject.src = outputImage;
		
		imageObject.style.border = '1px solid #000000';
		
		var ICUObject = canvas.parentNode;
		ICUObject.parentNode.insertBefore(imageObject, ICUObject.nextSibling);
	};
	
	/**
	 * get image src from FileReader
	 * @param {string} image src
	 * @param {Element} ICUObject's child element
	 */
	var getImage = function(src, target){
		//console.log(src.type);
		
		if(!src.type.match(/image.*/)){
			//	drop file is not image.
			return;
		}
	
		//	create FileReader object.
		var fileReader = new FileReader();
		fileReader.onload = function(event){
			// render image on canvas.
			render(event.target.result, target);
		};
		fileReader.readAsDataURL(src);
	};
	
	var dragOverEventListener = function(event) {
		// cancel default event 
		event.preventDefault();
	};
	
	var dropEventListener = function(event) {
		// cancel default event
		event.preventDefault();
		getImage(event.dataTransfer.files[0], event.target);
	};
	
	var domContentLoadedEventListener = function(){
		addICUCSS();
		
		ICUObjects = document.getElementsByClassName(ICU_CLASS_NAME.CANVAS);
		
		generateICUCanvas(ICUObjects); 
	};
	
	// 
	document.addEventListener(EVENTS.DOM_CONTENT_LOADED, domContentLoadedEventListener);
}(window));