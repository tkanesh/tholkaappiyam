//////////////////////////////////////////////////////////////////////////////////
// CloudCarousel V1.0.5
// (c) 2011 by R Cecco. <http://www.professorcloud.com>
// MIT License
//
// Reflection code based on plugin by Christophe Beyls <http://www.digitalia.be>
//
// Please retain this copyright header in all versions of the software
//////////////////////////////////////////////////////////////////////////////////

(function($) {


    // START Reflection object.
    // Creates a reflection for underneath an image.
    // IE uses an image with IE specific filter properties, other browsers use the Canvas tag.	
    // The position and size of the reflection gets updated by updateAll() in Controller.
    function Reflection(img, reflHeight, opacity) {

        var reflection, cntx, imageWidth = img.width, imageHeight = img.width, gradient, parent;

        parent = $(img.parentNode);
        this.element = reflection = parent.append("<canvas class='reflection' style='position:absolute'/>").find(':last')[0];
        if (!reflection.getContext && $.browser.msie) {
            this.element = reflection = parent.append("<img class='reflection' style='position:absolute'/>").find(':last')[0];
            reflection.src = img.src;
            reflection.style.filter = "flipv progid:DXImageTransform.Microsoft.Alpha(opacity=" + (opacity * 100) + ", style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=" + (reflHeight / imageHeight * 100) + ")";

        } else {
            cntx = reflection.getContext("2d");
            try {


                $(reflection).attr({width: imageWidth, height: reflHeight});
                cntx.save();
                cntx.translate(0, imageHeight - 1);
                cntx.scale(1, -1);
                cntx.drawImage(img, 0, 0, imageWidth, imageHeight);
                cntx.restore();
                cntx.globalCompositeOperation = "destination-out";
                gradient = cntx.createLinearGradient(0, 0, 0, reflHeight);
                gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - opacity) + ")");
                gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
                cntx.fillStyle = gradient;
                cntx.fillRect(0, 0, imageWidth, reflHeight);
            } catch (e) {
                return;
            }
        }
        // Store a copy of the alt and title attrs into the reflection
        //  $(reflection).attr({'alt': $(img).attr('alt'), title: $(img).attr('title')});

    }	//END Reflection object

    // START Item object.
    // A wrapper object for items within the carousel.
    var Item = function(imgIn, options)
    {
        this.orgWidth = imgIn.width;
        this.orgHeight = imgIn.height;
        this.image = imgIn;
        this.reflection = null;
        this.alt = imgIn.alt;
        this.title = imgIn.title;
        this.imageOK = false;
        this.options = options;

        this.imageOK = true;

        if (this.options.reflHeight > 0)
        {
            this.reflection = new Reflection(this.image, this.options.reflHeight, this.options.reflOpacity);
        }
        $(this.image).css('position', 'absolute');// Bizarre. This seems to reset image width to 0 on webkit!	
        $(this.image).css('border-style', 'solid');
        $(this.image).css('border-width', '2px');
        //BL20131027 remove hidden attribute set before loading images in menu.js
        //$(this.image).removeAttr('hidden');

        var itemDetails = imgIn.title;

        var json = JSON.stringify(eval("(" + itemDetails + ")"));
        var obj = JSON.parse(json);
        var colorId = parseInt(obj.colorCode);

        var colorCode = "#8bc53f";
        if (colorId === 1) {
            colorCode = "#8bc53f";
        } else if (colorId === 2) {
            colorCode = "#f89e1c";
        } else if (colorId === 3) {
            colorCode = "#ff4800";
        }

        $(this.image).css('border-color', colorCode);


    };// END Item object


    // Controller object.
    // This handles moving all the items, dealing with mouse clicks etc.	
    var Controller = function(container, images, options)
    {
        var items = [], funcSin = Math.sin, funcCos = Math.cos, ctx = this;
        this.swipehandlerinstalled = false;
        this.opt = options;
        this.controlTimer = 0;
        this.stopped = false;
        //this.imagesLoaded = 0;
        this.container = container;
        this.xRadius = options.xRadius;
        this.yRadius = options.yRadius;
        this.showFrontTextTimer = 0;
        this.autoRotateTimer = 0;
        this.nextImageIndex = (images.length > options.NbMaxImagesDisp) ? options.NbMaxImagesDisp : 0;
        this.LeftImageList = [];
        this.RightImageList = [];
        var target = document.getElementById('spin');
        var spinner_opts = {//See example/doc at http://www.javascriptoo.com/spin-js
            /*          lines: 10, // The number of lines to draw
             length: 7, // The length of each line
             width: 4, // The line thickness
             radius: 10, // The radius of the inner circle
             corners: 1, // Corner roundness (0..1)
             rotate: 0, // The rotation offset
             */
            color: '#FFFFFF'/*, // #rgb or #rrggbb
             speed: 1, // Rounds per second
             trail: 60, // Afterglow percentage
             shadow: false, // Whether to render a shadow
             hwaccel: false, // Whether to use hardware acceleration
             className: 'spinner', // The CSS class to assign to the spinner
             zIndex: 2e9, // The z-index (defaults to 2000000000)
             top: 25, // Top position relative to parent in px
             left: 25 // Left position relative to parent in px
             */
        };
        var spinner = new Spinner(spinner_opts).spin();
        target.appendChild(spinner.el);
        if (options.xRadius === 0)
        {
            this.xRadius = ($(container).width() / 2.3);
        }
        if (options.yRadius === 0)
        {
            this.yRadius = ($(container).height() / 6);
        }

        this.xCentre = options.xPos;
        this.yCentre = options.yPos;
        this.frontIndex = options.NbMaxImagesDisp / 2;	// Index of the item at the front
        this.preIndex = 0;

        // Start with the first item at the front.
        this.rotation = this.destRotation = -Math.PI / 2;
        this.timeDelay = 1000 / options.FPS;

        // Turn on the infoBox
        if (options.altBox !== null)
        {
            $(options.altBox).css('display', 'block');
            $(options.titleBox).css('display', 'block');
        }
        // Turn on relative position for container to allow absolutely positioned elements
        // within it to work.
        $(container).css({position: 'relative', overflow: 'hidden'});

        $(options.buttonLeft).css('display', 'inline');
        $(options.buttonRight).css('display', 'inline');
        /*
         // Setup the buttons.
         $(options.buttonLeft).bind('mouseup', this, function(event) {
         event.data.rotate(-1);
         return false;
         });
         $(options.buttonRight).bind('mouseup', this, function(event) {
         event.data.rotate(1);
         return false;
         });
         */
        if (options.swipe) {
            $(container).on("swipeleft", this, function(event) {
                // BL 2013/11/18 double swipe events correction tentative
                // 2 events received even if handler installed once
                // The 2 events have same target but different timestamp
                // We can't install the handle in $(document).ready() as event data (this) not yet created
                //$(document).delegate(container,"swipeleft",this,function(event) {
                //$(container).bind("swipeleft", this, function(event) {
                //console.log("swipeleft event->",event);
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                event.data.rotate(1);
                return false;
            });
            $(container).bind("swiperight", this, function(event) {
                console.log("swiperight event->", event);
                event.data.rotate(-1);
                return false;
            });

        }

        // You will need this plugin for the mousewheel to work: http://plugins.jquery.com/project/mousewheel
        if (options.mouseWheel)
        {
            $(container).bind('mousewheel', this, function(event, delta) {
                event.data.rotate(delta);
                return false;
            });
        }
        $(container).bind('mouseover click', this, function(event) {

            clearInterval(event.data.autoRotateTimer);		// Stop auto rotation if mouse over.
            var text = $(event.target).attr('alt');
            // If we have moved over a carousel item, then show the alt and title text.

            if (text !== undefined && text !== null)
            {

                clearTimeout(event.data.showFrontTextTimer);
                $(options.altBox).html(($(event.target).attr('alt')));
                $(options.titleBox).html(($(event.target).attr('title')));
                if (options.bringToFront && event.type === 'click')
                {

                    if (this.preIndex === undefined) {
                        this.preIndex = 0;
                    }
                    var idx = $(event.target).data('itemIndex');
                    if (idx === this.preIndex) {
                        $.mobile.changePage("food.html");
                        return;
                    }
                    this.preIndex = idx;



                    var frontIndex = event.data.frontIndex;
                    var absfrontIndex = (this.frontIndex >= 0) ? this.frontIndex : items.length + this.frontIndex;
                    //var	diff = idx - frontIndex;                    
                    var diff = (idx - frontIndex) % items.length;
                    if (Math.abs(diff) > items.length / 2) {
                        diff += (diff > 0 ? -items.length : items.length);
                    }
                    event.data.rotate(-diff);
                }
            }
        });
        // If we have moved out of a carousel item (or the container itself),
        // restore the text of the front item in 1 second.
        $(container).bind('mouseout', this, function(event) {
            var context = event.data;
            clearTimeout(context.showFrontTextTimer);
            context.showFrontTextTimer = setTimeout(function() {
                context.showFrontText();
            }, 1000);
            context.autoRotate();	// Start auto rotation.
        });

        // Prevent items from being selected as mouse is moved and clicked in the container.
        $(container).bind('mousedown', this, function(event) {

            event.data.container.focus();

            return false;
        });
        container.onselectstart = function() {
            return false;
        };		// For IE.

        this.innerWrapper = $(container).wrapInner('<div style="position:absolute;width:100%;height:100%;"/>').children()[0];

        // Shows the text from the front most item.
        this.showFrontText = function()
        {

            var index = this.frontIndex < 0 ? items.length + this.frontIndex : this.frontIndex;

            if (items[index] === undefined) {
                return;
            }	// Images might not have loaded yet.

            var itemDetails = $(items[index].image).attr('title');

            var json = JSON.stringify(eval("(" + itemDetails + ")"));
            var obj = JSON.parse(json);
            var foodname = obj.itemName + "";
            var perServing = obj.perServing + "";
            var carb = parseInt(obj.carb);
            var pro = parseInt(obj.protein);
            var fat = parseInt(obj.totalFat);
            var ps = perServing.split(" ")[0];
            var colorId = parseInt(obj.colorCode);
            var total = carb + pro + fat;
            var energyItem = obj.energy;

            var cabp = parseInt(carb / total * 100, 10);
            var prop = parseInt(pro / total * 100, 10);
            var fatp = parseInt(fat / total * 100, 10);


            $('#lblFoodName').html(foodname.substring(0, 25));
            $('#lblCal').html(obj.energy + "");
            $('#lblCab').html(carb + "g");
            $('#lblPro').html(pro + "g");
            $('#lblFat').html(fat + "g");
            $("#Cbar").attr("src", "img/foodmeter/img_" + cabp + ".png");
            $("#Pbar").attr("src", "img/foodmeter/img_" + prop + ".png");
            $("#Fbar").attr("src", "img/foodmeter/img_" + fatp + ".png");


            window.localStorage.setItem("food_id", obj.id);
            window.localStorage.setItem("food_name", foodname);
            window.localStorage.setItem("food_energy", obj.energy);
            window.localStorage.setItem("food_cab", carb);
            window.localStorage.setItem("food_pro", pro);
            window.localStorage.setItem("food_fat", fat);
            window.localStorage.setItem("food_img", obj.img);
            window.localStorage.setItem("food_cp", obj.cp);
            window.localStorage.setItem("food_ps", ps);

            var img = "img/code_yellow.png";
            if (colorId === 1) {
                img = "img/code_green.png";
            } else if (colorId === 2) {
                img = "img/code_yellow.png";
            } else if (colorId === 3) {
                img = "img/code_red.png";
            }

            $("#imgCode").attr("src", img);

            //Enerygy Consumed
            var energy = window.localStorage.getItem("energyNeed");
            var energyConsumed = window.localStorage.getItem("energyTake");

            if (energyConsumed === null || energyConsumed === "" ) {
                energyConsumed = 0;
            }
            
             console.log(energyConsumed);

            if (energyConsumed > 0) {
                $("#tdEnergyComsumed").html("&nbsp;");
                var ecPercentage = Math.round(energyConsumed / energy * 160);
                $("#tdEnergyComsumed").css("width", ecPercentage + "px");
                $("#tdEnergyComsumed").css("background-color", "#36a348");
            }


            var eiPercentage = Math.round(energyItem / energy * 160);
            $("#tdEnergyAdd").css("width", eiPercentage + "px");
            $("#tdEnergyAdd").css("background-color", "#fcd260");

            var addEnergy = parseInt(energyConsumed) + parseInt(energyItem);
           
            var energypercentage = Math.round(addEnergy / energy * 100);

            $('#lblConsumed').html(Math.round(addEnergy) + " cal");
            $('#lblEnergyPercentage').html(energypercentage + "%");

            if (energypercentage > 100) {
                $("#tdEnergyComsumed").css("background-color", "red");
                $("#tdEnergyAdd").css("background-color", "red");
            }


            // $(options.altBox).html($(items[this.frontIndex].image).attr('alt'));
        };

        this.go = function()
        {
            if (this.controlTimer !== 0) {
                return;
            }
            var context = this;
            this.controlTimer = setTimeout(function() {
                context.updateAll();
            }, this.timeDelay);
        };

        this.stop = function()
        {
            clearTimeout(this.controlTimer);
            this.controlTimer = 0;
        };


        // Starts the rotation of the carousel. Direction is the number (+-) of carousel items to rotate by.
        this.rotate = function(direction)
        {
            console.log('rotate(', direction, '): this.frontindex=', this.frontIndex);
            //Calculate current FrontIndex and Back Index=> (will be used for saving inserting new item)
            var absfrontIndex = (this.frontIndex >= 0) ? this.frontIndex : items.length + this.frontIndex;
            var absbackIndexBefore = (absfrontIndex + options.NbMaxImagesDisp / 2) % items.length;

            if (direction > 0)
            {
                // console.log("rotate:",direction," nextImageIndex:",this.nextImageIndex," absfrontIndex=",absfrontIndex,"items[front].alt=",parseInt(items[absfrontIndex].alt),"imlen-dir=",images.length-direction);
                if (this.nextImageIndex >= images.length && parseInt(items[absfrontIndex].alt) >= images.length - direction)
                {
                    // console.log("cancel rotate");
                    return; //cancel rotate
                }
            }
            else
            {
                // console.log("rotate:",direction," nextImageIndex:",this.nextImageIndex," absfrontIndex=",absfrontIndex,"items[front].alt=",parseInt(items[absfrontIndex].alt),"-dir=",-direction);
                if (this.LeftImageList.length === 0 && parseInt(items[absfrontIndex].alt) < -direction) {
                    console.log("cancel rotate");
                    return; //cancel rotate
                }
            }
            // calculate next frontIndex (when rotate finnish)
            this.frontIndex -= direction;
            absfrontIndex = (this.frontIndex >= 0) ? this.frontIndex : items.length + this.frontIndex;

            this.frontIndex %= items.length;
            this.destRotation += (Math.PI / options.NbMaxImagesDisp) * (2 * direction); //was / items.length
            var absbackIndexAfter = (absfrontIndex + options.NbMaxImagesDisp / 2) % items.length;

            if (images.length > options.NbMaxImagesDisp && this.nextImageIndex) {
                // console.log('rotate:%d, frontIndex:(%d => abs:%d),backIndexBefore=%d backIndexAfter=%d images.lenght:%d, destRotation:%f',direction,this.frontIndex,absfrontIndex,absbackIndexBefore,absbackIndexAfter,images.length,this.destRotation);
                if (direction > 0) {
                    for (var step = 1; step <= direction; step++)
                    {
                        var insertItemIndex = absbackIndexAfter + (direction - step);
                        if (insertItemIndex < 0)
                            insertItemIndex += items.length;
                        //we hide the image to be pushed out of active list or disabled
                        $(items[insertItemIndex].image).attr('hidden', 'hidden');

                        //saving the Item image we are about to replace in a list (to put it back on rotate other direction)
                        if (items[insertItemIndex].imageOK)
                        {
                            //if there is  more images to insert from the right
                            //we do, otherwise we'll just have blank images comming
                            if (this.nextImageIndex < images.length)
                            {
                                this.LeftImageList.push(items[insertItemIndex]);
                                if (this.RightImageList.length === 0)
                                    items[insertItemIndex] = new Item(images[this.nextImageIndex], options); //first time we turn clockwise we create the Item objects                                   
                                else
                                    items[insertItemIndex] = this.RightImageList.pop();//After a anti-clockwise turn we retrieve the items from the list
                                $(images[this.nextImageIndex]).data('itemIndex', insertItemIndex);
                                this.nextImageIndex++;
                            }
                            else
                                items[insertItemIndex].imageOK = false; //won't display image in UpdateAll
                        }
                        else //Image that has been disabled for end of rotation we reenable it
                            items[insertItemIndex].imageOK = true;
                    }
                }
                else { //direction <=0)
                    for (var step = -1; step >= direction; step--) {
                        var insertItemIndex = absbackIndexBefore + (direction - step);
                        if (insertItemIndex < 0)
                            insertItemIndex += items.length;
                        //Hidding  image present in back items slot we are about to replace
                        $(items[insertItemIndex].image).attr('hidden', 'hidden');
                        //replacing it with items previously RemovedImage
                        //This new img is still hidden, will be displayed automatically by updateAll()
                        //saving image on the right 
                        if (items[insertItemIndex].imageOK)
                        {
                            if (this.LeftImageList.length > 0) {
                                this.RightImageList.push(items[insertItemIndex]);
                                this.nextImageIndex--;
                                if (this.nextImageIndex < images.length)
                                {
                                    items[insertItemIndex] = this.LeftImageList.pop();
                                    $(images[this.nextImageIndex]).data('itemIndex', insertItemIndex);
                                }

                            }
                            else
                            {
                                items[insertItemIndex].imageOK = false; //won't display image in UpdateAll
                            }
                        }
                        else //Image that has been disabled for end of rotation are not part of the RightImageList
                            //re-enables it
                            items[insertItemIndex].imageOK = true;

                    }
                }
                // for (var i = 0; i < options.NbMaxImagesDisp; i++)
                //  console.log('items[%d]=', i, items[i]);
            }
            this.showFrontText();
            this.go();
        };


        this.autoRotate = function()
        {
            if (options.autoRotate !== 'no')
            {
                var dir = (options.autoRotate === 'right') ? 1 : -1;
                this.autoRotateTimer = setInterval(function() {
                    ctx.rotate(dir);
                }, options.autoRotateDelay);
            }
        };

        // This is the main loop function that moves everything.
        this.updateAll = function()
        {
            var minScale = options.minScale;	// This is the smallest scale applied to the furthest item.
            var smallRange = (1 - minScale) * 0.5;
            var w, h, x, y, scale, item, sinVal;

            var change = (this.destRotation - this.rotation);
            var absChange = Math.abs(change);

            this.rotation += change * options.speed;
            if (absChange < 0.001) {
                this.rotation = this.destRotation;
            }
            var itemsLen = items.length;
            var spacing = (Math.PI / options.NbMaxImagesDisp) * 2;
            //var	wrapStyle = null;
            var radians = this.rotation;
            var isMSIE = $.browser.msie;

            // Turn off display. This can reduce repaints/reflows when making style and position changes in the loop.
            // See http://dev.opera.com/articles/view/efficient-javascript/?page=3			            
            //BL temp disabled 
            this.innerWrapper.style.display = 'none';

            var style;
            var px = 'px', reflHeight;
            var context = this;
            for (var i = 0; i < itemsLen; i++)
            {
                item = items[i];

                sinVal = funcSin(radians);

                scale = ((sinVal + 1) * smallRange) + minScale;

                x = this.xCentre + (((funcCos(radians) * this.xRadius) - (item.orgWidth * 0.5)) * scale);
                y = this.yCentre + (((sinVal * this.yRadius)) * scale);

                if (item.imageOK)
                {
                    //Removing hidden attribute for active list of image
                    $(item.image).removeAttr('hidden');

                    var img = item.image;
                    w = img.width = item.orgWidth * scale;
                    h = img.height = item.orgHeight * scale;
                    img.style.left = x + px;
                    img.style.top = y + px;
                    img.style.zIndex = "" + (scale * 100) >> 0;	// >>0 = Math.foor(). Firefox doesn't like fractional decimals in z-index.
                    if (item.reflection !== null)
                    {
                        reflHeight = options.reflHeight * scale;
                        style = item.reflection.element.style;
                        style.left = x + px;
                        style.top = y + h + options.reflGap * scale + px;
                        style.width = w + px;
                        if (isMSIE)
                        {
                            style.filter.finishy = (reflHeight / h * 100);
                        } else
                        {
                            style.height = reflHeight + px;
                        }
                    }
                }
                radians += spacing;
            }
            // Turn display back on.					
            this.innerWrapper.style.display = 'block';

            // If we have a preceptable change in rotation then loop again next frame.
            if (absChange >= 0.001)
            {
                this.controlTimer = setTimeout(function() {
                    context.updateAll();
                }, this.timeDelay);
            } else
            {
                // Otherwise just stop completely.				
                this.stop();
            }
        }; // END updateAll		

        // Create an Item object for each image	
//		func = function(){return;ctx.updateAll();} ;

        // Check if images have loaded. We need valid widths and heights for the reflections.
        this.checkImagesLoaded = function()
        {

            var i;
            for (i = 0; i < images.length; i++) {
                if ((images[i].width === undefined) || ((images[i].complete !== undefined) && (!images[i].complete)))
                {
                    return;
                }
            }
            console.log('checkImagesLoaded ok =>')
            for (i = 0; i < images.length && i < options.NbMaxImagesDisp; i++) {
                items.unshift(new Item(images[i], options));
            }
            for (i = 0; i < items.length; i++) {
                $(images[i]).data('itemIndex', parseInt(items[i].alt));
//                console.log('items[%d]',i,'=',parseInt(items[i].alt));
            }



            // If all images have valid widths and heights, we can stop checking.

            clearInterval(this.tt);
            spinner.stop();
            this.showFrontText();
            this.autoRotate();

            this.updateAll();


        };

        this.tt = setInterval(function() {
            ctx.checkImagesLoaded();
        }, 50);


    }; // END Controller object

    // The jQuery plugin part. Iterates through items specified in selector and inits a Controller class for each one.
    $.fn.CloudCarousel = function(options) {

        this.each(function() {
            //BL:Caution default value below are overwritten by call in menu.js
            //custom settings to be defined in menu.js
            options = $.extend({}, {
                NbMaxImagesDisp: 8,
                reflHeight: 0,
                reflOpacity: 0.5,
                reflGap: 0,
                minScale: 0.5,
                xPos: 0,
                yPos: 0,
                xRadius: 0,
                yRadius: 0,
                altBox: null,
                titleBox: null,
                FPS: 30,
                autoRotate: 'no',
                autoRotateDelay: 1500,
                speed: 0.2,
                mouseWheel: false,
                swipe: false,
                bringToFront: true
            }, options);
            // Create a Controller for each carousel.		
            $(this).data('cloudcarousel', new Controller(this, $('.cloudcarousel', $(this)), options));
        });

        return this;
    };

})(jQuery);
