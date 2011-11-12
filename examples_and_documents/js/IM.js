(function (global) {
	'use strict';
	/**
	 * bDebug is a private flag to know if we want to know what's happening (Log use console.log).
	 * @private
	 * @type Boolean
	 */
	var bDebug = false,
		/**
		 * bAsynchronous is a private flag to know if we want to execute the comparison using asynchronous mode or not.
		 * @private
		 * @type Boolean
		 */
		bAsynchronous = false,
		/**
		 * Number of image that are loaded not important to know if are loaded or with error.
		 * @private
		 * @type Number
		 */
		nImagesLoaded = 0,
		/**
		 * Array of canvas that are created dynamically.
		 * @private
		 * @type Array
		 */
		aCanvas = [],
		/**
		 * fpLoop is a method that will save the asynchronous or not loop type
		 * @private
		 * @type Function
		 */
		fpLoop = loop;
	/**
	 * loopWithoutBlocking is a function to process items in asynchronous mode to avoid the environment to be freeze.
	 * @private
	 * @param aItems {Array} Items array to traverse.
	 * @param fpProcess {Function} Callback to execute on each iteration.
	 * @param fpFinish {Function} Callback to execute when all the items are traversed.
	 */
	function loopWithoutBlocking(aItems, fpProcess, fpFinish) {
		var aCopy = aItems.concat();
		var nIndex = aItems.length - 1;
		var nStart = +new Date();
		setTimeout(function recursive() {
			do {
				nIndex--;
				if (fpProcess(aCopy.shift(), nIndex) === false) {
					return;
				}
			} while (aCopy.length > 0 && (+new Date() - nStart < 50));

			if (aCopy.length > 0) {
				setTimeout(recursive, 25);
			} else {
				fpFinish(aItems);
			}
		}, 25);
	}
	/**
	 * loop is a function to process items.
	 * @private
	 * @param aItems {Array} Items array to traverse.
	 * @param fpProcess {Function} Callback to execute on each iteration.
	 * @param fpFinish {Function} Callback to execute when all the items are traversed.
	 */
	function loop(aItems, fpProcess, fpFinish)
	{
		var aCopy = aItems.concat();
		var nIndex = aItems.length - 1;
		var oItem = null;
		while(Boolean(oItem = aCopy.shift()))
		{
			nIndex--;
			if(fpProcess(oItem, nIndex) === false)
			{

				return;
			}
		}
		fpFinish(aItems);
	}
	/**
	 * compare is the function that starts the comparing of image data.
	 * @param aCanvas {Array} Canvas items to execute the compare of image data.
	 * @param fpSuccess {Function} Callback to execute if all the images are equals in pixel level.
	 * @param fpFail {Function} Callback to execute if any of the images is different in pixel level.
	 */
	function compareWithoutCreate(aCanvas, fpSuccess, fpFail, nStart) {
		var sLastData = null,
			nElapsedTime = undefined;
		if(bDebug && typeof nStart === "undefined")
		{
			nStart = +new Date();
		}
		fpLoop(aCanvas, function (oCanvas, nIndex) {
			var oContext = oCanvas.getContext("2d"),
				aCanvasData = oContext.getImageData(0, 0, oCanvas.height, oCanvas.width),
				sData = JSON.stringify([].slice.call(aCanvasData.data));
			if (sLastData !== null) {
				if (sLastData.localeCompare(sData) !== 0) {
					if(bDebug)
					{
						oCanvas.className = "fail";
						nElapsedTime = (+new Date() - nStart);
						console.log("Fail -> Time: " + nElapsedTime);

						console.log("Failing  canvas is: ");
						console.log(document.getElementById("canvasCompare_" + nIndex));
					}
					fpFail(oCanvas, nElapsedTime);
					return false;
				}
			}
			sLastData = sData;
		}, function (aCanvas) {
			if(bDebug)
			{
				nElapsedTime = (+new Date() - nStart);
				console.log("Success -> Time: " + nElapsedTime);
			}
			fpSuccess(aCanvas, nElapsedTime);
		});
	}
	/**
	 * createAndCompare creates canvas in oContainer and adding images to these canvas, then compare it
	 * @private
	 * @param oContainer {Object} Dom element that will contain all the canvas
	 * @param aImages {Array} Array of objects that will represent images (
	 * @param fpSuccess
	 * @param fpFail
	 */
	function createAndCompare(oContainer, aImages, fpSuccess, fpFail) {
		aCanvas = [];
		if(bDebug)
		{
			var nStart = +new Date();
		}
		fpLoop(aImages, function (oImageConfig, nIndex) {
			var oCanvas, oContext, oImage;
			oCanvas = document.createElement("canvas");
			oCanvas.id = "canvasCompare_" + nIndex;
			aCanvas.push(oCanvas);
			oCanvas.width = oImageConfig.width;
			oCanvas.height = oImageConfig.height;
			oContainer.appendChild(oCanvas);
			oContext = oCanvas.getContext("2d");
			oImage = new Image();
			oImage.onload = function()
			{
				nImagesLoaded++;
				oContext.drawImage(oImage, 0, 0);
			};
			oImage.onerror = function()
			{
				nImagesLoaded++;
			};
			oImage.src = oImageConfig.src;
		}, function finishCallback(aImages) {
			if(nImagesLoaded < aImages.length)
			{
				setTimeout(function()
				{
					finishCallback(aImages);
				}, 25);
			}else
			{
				compareWithoutCreate(aCanvas, fpSuccess, fpFail, nStart);
				if(bDebug && bAsynchronous)
				{
					console.log("After compare -> Time: " + (+new Date() - nStart));
				}
			}
		});
	}
	/**
	 * ImageToCompare is a JSON helper to create new images objects to be compared.
	 * @param sUrl {String} represents the src of the image to be loaded.
	 * @param nWidth
	 * @param nHeight
	 */
	var ImageToCompare = function(sUrl, nWidth, nHeight)
	{
		this.src = sUrl + (sUrl.indexOf("?") === -1? "?": "&") + (+new Date());
		this.width = nWidth;
		this.height = nHeight;
	};

	/**
	 * IM (Image Match) is a class to compare images using canvas at pixel level
	 * @class Represents an Image Match
	 * @constructor
	 * @name IM
	 * @author Tomas Corral Casas
	 * @version 1.0
	 */
	function IM() {
	}

	/**
	 * setDebug is the method to set the debug to allow check the incorrect canvas and log in console how many time it tooks.
	 * @member IM.prototype
	 * @param bDeb
	 * @returns {Boolean} bDebug
	 */
	IM.prototype.setDebug = function setDebug(bLocalDebug)
	{
		bDebug = bLocalDebug;
		return bDebug;
	};
	/**
	 * Change the loop type to and from asynchronous.
	 * @member IM.prototype
	 * @param bLocalAsynchronous
	 * @returns {Boolean} bLocalAsynchronous
	 */
	IM.prototype.setAsynchronous = function setAsynchronous(bLocalAsynchronous)
	{
		bAsynchronous = bLocalAsynchronous;
		fpLoop = bAsynchronous ? loopWithoutBlocking : loop;
		return bLocalAsynchronous;
	};
	/**
	 * Compare is the method that change the behaviour if it's needed to create canvas or not.
	 * @member IM.prototype
	 * @param oContainer/aCanvas
	 * @param aElements/fpSuccess
	 * @param fpSuccess/fpFail
	 * @param fpFail
	 */
	IM.prototype.compare = function(oContainer, aElements, fpSuccess, fpFail)
	{
		if(!oContainer.nodeType)
		{
			compareWithoutCreate.apply(this, arguments);
		}else
		{
			createAndCompare.apply(this, arguments);
		}
	};
	/**
	 * Image is a reference to ImageToCompare.
	 * @member IM.prototype
	 */
	IM.prototype.image = ImageToCompare;
	global.IM = new IM();
}(window));