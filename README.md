# IM.js
IM.js is a class to compare images in canvas at pixel level.

## Previous to IM

Tools:

* Desktop tools
* Javascript classes that compare MD5 or base64 result of enconding the image.

These Javascript classes only compare that the image is not the same.
The problem is that if you have some image with the same pixel info the result could be different and return false.

Imagine that you have an image with different compression rate and you want to know if the result is the same.

Then my only solution was to check images at pixel info level.

## Description

IM checks all your images using canvas at pixel level.

When I say compare images at pixel level is compare the image pixel to pixel.

#### Yes it sounds hard! and it is! ;)

I expent a lot of time trying to do it, but some implementations collapse my browser.
I try the same but using workers with the same result.

After some unsuccessful attempts I found the final solution that is that now is implemented in IM.

In the examples you can see how it can test 9 images (300px x 250px) in less than 500 ms.


> - **Different images example only tooks 296ms.**

> - **Equals images example only tooks 449ms**

Browser support:

* IE9 and best
* Mozilla Firefox
* Google Chrome
* Safari
* Konqueror
* Opera


### Benefits and usages:

The idea of create IM was to automatize the image comparison.

I use it in my testing environment. I use Selenium to open the same url in differents browsers and get a screenshot
of each one. I save it with the same name on one folder, then I open one tool where I implemented IM and use it to
save the result in the C.I.(Continuous integration) server. All is done in no more than 10 seconds.

[API documentation](http://tcorral.github.com/IM.js/examples_and_documents/jsdoc/index.html)

[Examples](http://tcorral.github.com/IM.js/examples_and_documents/index.html) to see for yourself!

## Usage

### Before using it:
Insert in your code:

	<script type="text/javascript" src="/path/to/your/js/libs/IM.js"></script>

### Set debug mode

	IM.setDebug(boolean);

If you set debug mode you will be able to see how many time tooks the comparing, and you will see a border in the
canvas that triggers the fail if it fails.

### Set asynchronous mode

	IM.setAsynchronous(boolean);

IM use synchronous loops , by default, when checking the image data in canvas.

If for some reason in some environment you see any problem of performance that blocks your browser,
you can set the asynchronous mode to true, it's a bit slower but not blocking method.

### Create a image object config

When using the create canvas and image mode you will need to create config image objects.

	new IM.image('path/to/images/image.ext', width, height);

### Compare creating canvas with images

When you use this mode you will create a canvas for image

	IM.compare(DOM_Element,
    [
        new IM.image('path/to/images/image.ext', 100, 100),
        new IM.image('path/to/images/image2.ext', 100, 100),
        new IM.image('path/to/images/image.ext', 100, 100),
        new IM.image('path/to/images/image2.ext', 100, 100)
    ],
    function success(aCanvas, nElapsedTime) {
        // Code on success. All images have the same pixel info.
    },
    function fail(oCanvas, nElapsedTime) {
        // Code on failing. Any image is different from others
    });

### Compare using existent canvas

When you use this mode you will need to have the canvas with images before comparing. This allows you to compare
images in an existent environment.

	IM.compare([
        document.getElementById("canvas_1"),
        document.getElementById("canvas_2"),
        document.getElementById("canvas_3"),
        document.getElementById("canvas_4")
    ],
    function success(aCanvas, nElapsedTime) {
        // Code on success. All images have the same pixel info.
    },
    function fail(oCanvas, nElapsedTime) {
        // Code on failing. Any image is different from others
    });

## Documentation

(Links will only work if you clone the repo.)

[API documentation](http://tcorral.github.com/IM.js/examples_and_documents/jsdoc/index.html)

[Examples](http://tcorral.github.com/IM.js/examples_and_documents/index.html) to see for yourself!

## License

IM.js is licensed under the MIT license.
