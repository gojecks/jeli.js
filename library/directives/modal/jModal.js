(function(jEli,_)
{
	/*ELI Modal Plugins
	can be injected to Project as a required Module

	@Function Type :  Object Prototype
	@Return Type : Object

		This Directive needs Jquery to Manipululate DOM
		Updated October 04,2015 20:31:10pm
	*/

	var moduleName = 'jEli.Modal',
		module;
	try{
		module = jEli.jModule(moduleName);
	}catch(e)
	{
		jEli.jModule(moduleName,[]);
	}

module
.jFactory('modalFactory',['$document','$window','$http',bnModalFactoryFN])
.jElement('jLoading',['modalFactory','$document',jLoadingDirectiveFn])
.jElement('jModal',['modalFactory','$document',jModalDirectiveFn])
.jElement('jTheatre',['modalFactory','$document',jTheatreDirectiveFn])
.jElement('jTabPreview',['modalFactory','$document',jTabPreviewDirectiveFn])
.jElement('jModalUi',jModalUiFn);

//jTheatre Directive Fn
function jTheatreDirectiveFn($mFactory,$document)
{
	return ({
		$init : jTheatreInitFn
	});

	function jTheatreInitFn(ele,attr,$model)
	{
		//Append All modalFactory Object
			$mFactory.modalObjects.Tbody = _("<div></div>").attr("id", "projata-Tbody").addClass("clearfix");
			$mFactory.modalObjects.Twrap = _('<div></div>').attr("id", "projata-theatre");
			$mFactory.modalObjects.TButtonWrapper = _('<div id="projata-theatre-button"></div>');
    		$mFactory.modalObjects.TBottomC = _('<div id="projata-BottomContainer"></div>').append($mFactory.modalObjects.TButtonWrapper);
    		$mFactory.modalObjects.TMenu = _('<ul id="projata-Menu" theatre-menu-board><li id="pTMenu" j-for="menu in theatreMenu"><a  title="{%menu.title%}"  j-click="$performMenuTask(menu.taskName)" role="button" >{%menu.title%}</a></li></ul>'); //theatre-menu-board
    		$mFactory.modalObjects.Tbutton = _('<a href="javascript:;" title="More Options" j-click="theatre.slideMenu($event)"> Options </a>');
    		$mFactory.modalObjects.TButtonWrapper.append(
    			$mFactory.modalObjects.TMenu,
    			$mFactory.modalObjects.Tbutton
    		);
    		$mFactory.modalObjects.Tclose = _("<a id='projata-theatre-close' title='Close view' j-click='theatre.closeTheatre()'></a>").addClass("fa fa-times fa-2x");
			$mFactory.modalObjects.Timg = _('<div id="projata-theatre-img"></div>');
			$mFactory.modalObjects.Tcomment = _('<div id="projata-theatre-comment" class="" theatre-comment-main-board></div>'); //custom diretcive  theatre-comment-board
			$mFactory.modalObjects.TCDetails = _('<div id="projata-TCDetails" theatre-details-board></div>'); //custom directive  theatre-details-board
			$mFactory.modalObjects.TCBoard = _('<div id="projata-TCBoard" theatre-comment-board></div>');//custom directive  theatre-comment-board
			$mFactory.modalObjects.TCWriteBoard = _('<div id="projata-TCWriteBoard" theatre-write-board></div>');//custom directive  theatre-write-board
			$mFactory.modalObjects.Tbody.append(
			$mFactory.modalObjects.Tclose, 
			$mFactory.modalObjects.Timg,
			$mFactory.modalObjects.Tcomment.append(
				$mFactory.modalObjects.TCDetails,
				$mFactory.modalObjects.TCBoard,
				$mFactory.modalObjects.TCWriteBoard
			));
		$mFactory.modalObjects.Timg.append(
			$mFactory.modalObjects.TCimg = _('<div id="projata-TCimg"></div>'), 
			$mFactory.modalObjects.Thover = _('<div id="projata-hoverNav"></div>').append(
			$mFactory.modalObjects.Tright = _('<a href="javascript:;" id="projata-left" j-click="theatre.end()"><span class="fancy-ico" id="projata-left-ico"></span></a>'), 
			$mFactory.modalObjects.Tleft = _('<a href="javascript:;" id="projata-right" j-click="theatre.showNext()"><span class="fancy-ico" id="projata-right-ico"></span></a>')), 
			$mFactory.modalObjects.TImageData = _('<div id="projata-ImageData"></div>').append(
			$mFactory.modalObjects.TNumDisplay = _('<div id="projata-NumDisplay"></div>'), 
			$mFactory.modalObjects.TDetailsNav = _('<div id="projata-DetailsNav" class="border"></div>')), 
			$mFactory.modalObjects.TLightImage = _('<img id="projata-TBoxImage">')
		);
		
		$mFactory.modalObjects.Twrap
		.append($mFactory.modalObjects.Tbody,$mFactory.modalObjects.TBottomC);

			$mFactory.modalObjects.TDetailsNav.click(function() {});

			$model.theatre = $mFactory.theatre;
			$model.theatre.slideMenu = function($event)
			{
				$mFactory.modalObjects.TMenu.slideToggle("slow", function()
    			{
        			_(this).click(function() 
        			{
            			_(this).fadeOut()
        			});
    			});
			};

			$mFactory.$on('$extend.model',function(e,obj){
				if(obj && jEli.$isObject(obj)){
					for(var name in obj){
						$model[name] = obj[name];
					}
				}
			});

		//append the object to the ele
		ele.append(
			$mFactory.modalObjects.Twrap
		);

		$mFactory.reformatContainer();
	}
}

//jModal Directive Fn
function jModalDirectiveFn($mFactory,$document)
{
	return {
		allowType : 'AE',
		$init : function(ele,attr,$model)
		{
			$mFactory.modalObjects.wrap = _("<div></div>").attr("id", "projata-wrap"), 
			$mFactory.modalObjects.content = _("<div></div>").addClass("ui-corner-all").attr("id", "projata-content"), 
			$mFactory.modalObjects.overlay = _("<div></div>").attr("id", "projata-overlay"),
			$mFactory.modalObjects._temp = _("<div></div>").attr("id", "projata-temp"), 
			$mFactory.modalObjects.title = _("<div></div>").addClass("ui-dialog-titlebar " + "ui-widget-header " + "ui-helper-clearfix");
			$mFactory.modalObjects.titleBar = _("<span></span>").addClass("ui-dialog-title").appendTo($mFactory.modalObjects.title);
			$mFactory.modalObjects.close = _('<a j-click="$closeModal()"></a>').addClass("ui-dialog-titlebar-close " + "ui-corner-all " + "fa fa-times fa-lg").attr("role", "button").attr("id", "pojata-close").appendTo($mFactory.modalObjects.titleBar);
			$mFactory.modalObjects.outter = _("<div></div>").attr({"id":"projata-outter"}).appendTo($mFactory.modalObjects.wrap);
			$mFactory.modalObjects.outter.append($mFactory.modalObjects.content);

			$model.$closeModal = $mFactory.$closejata;

			//append the html content to ele
			ele.append(
				$mFactory.modalObjects.wrap,
				$mFactory.modalObjects.overlay,
				$mFactory.modalObjects._temp
			);

		}
	};
}


//jLoading Directive Fn
function jLoadingDirectiveFn($mFactory,$document)
{
	return({
		template : "<div j-click='$closeModal()' id='projata-loading'><div></div></div>",
		$init : jLoadingInitFn
	});

	function jLoadingInitFn(ele,attr,$model)
	{
		$mFactory.modalObjects.loading = _(ele.getFirstChild());
	}
}


//jModalUi Fn
function jModalUiFn()
{
	return ({ 
		template:function(ele,attr){
			return "<j-modal></j-modal><j-theatre></j-theatre><j-loading></j-loading>";
		}
	});
}

// jTabPreviewDirectiveFn Function
function jTabPreviewDirectiveFn($mFactory,$doc)
{
	return ({
		template : "<div id='jTabHolder' class='tabShade'><span class='fa fa-caret-{%arrow%} fa-2x tabArrow_{%arrow%}'></span><div id='tabBox'><div j-include='url'></div> <div j-html='content'></div></div></div>"
	});


}


//ModalFactory
//@Function Modal Factory

function bnModalFactoryFN($document,$window,$http)
{
	var modalObject = {},
		imgPreloader,  
		netLoad = "<img src=/exc-Loading.gif>",
		Tpos = {},
		descriptionHeight = 70,
		main_pos, 
		d_pos, 
		classNames, 
		imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?_/i,
		badObjects = ["select", "object", "embed"],
		imgLoader, 
		imageArray = [],
		groupName = null,
		classNames, 
		resizeDuration, 
		overlayDuration, 
		container, 
		startImage = null,
		activeImage = null,
		container, 
		loadingTimer, 
		selectedOpts = {},
		selectedArray = [],
		selectedIndex = 0,
		currentArray = [],
		currentIndex = 0,
		currentOpts = {},
		ajaxLoader = null,
		netbuzz = false,
		_events = {};

	function abortjata() 
	{
	    modalObject.loading.hide();
	    if (ajaxLoader) {
	        ajaxLoader.abort()
	    }
	    modalObject._temp.empty()
	}

	function errorjata() 
	{
	    selectedOpts.width = "auto";
	    selectedOpts.height = "auto";
	    modalObject._temp.html('<p id="projata-error">The requested content cannot be loaded.<br />Please try again later.</p>');
	    processInline()
	}

	//set event broadcaster
	function $on(eventName,fn){
		_events[eventName] = fn;
	}

	function buildEvent(evN){
		return ({
			type : evN,
			timeStamp : +new Date,
			preventDefault : function(){},
			currentTarget : function(){
				return null;
			}
		});
	}

	function $broadcast(eventsName,arg){
		if(eventsName && _events[eventsName]){
			_events[eventsName].apply(modalObject,[buildEvent(eventsName),arg]);
		}
	}

	function modalIntializer(a) 
	{
	    var defaults = 
	    {
	        Td: null,
	        prefix: "",
	        title: "",
	        width: 560,
	        height: 340,
	        content: "",
	        onAjaxContentLoaded: null,
	        cH: $document.height(),
	        cW: $window.width(),
	        wH: $window.height(),
	        dW: $document.width(),
	        onWindowClose: null,
	        closeButton: true,
	        transitionIn: "fade",
	        transitionOut: "fade",
	        overlayDuration: 0.4,
	        overlayOpacity: 0.7,
	        scrolling: "auto",
	        startZoom: false,
	        animate: true,
	        padding: 10,
	        showGroupName: false,
	        margin: 40,
	        borderSize: 21,
	        breathingSize: 20,
	        modal: false,
	        theatre: false,
	        featBrowser: true,
	        floating: true,
	        googleAnalytics: false,
	        speedIn: "300",
	        speedOut: "300",
	        enableEscapebutton: true,
	        enableNav: true,
	        resizeSpeed: 7,
	        autoDimensions: true,
	        autoScale: true,
	        buttons: {},
	        ajax: {},
	        hideOnOverlayclick: true,
	        showOverlay: false,
	        centerOnScroll: false,
	        containerId: document,
	        classname: "TLightBox",
	        strings: {
	            closeLink: "",
	            loadingMsg: "loading",
	            nextLink: "",
	            prevLink: "",
	            startSlideshow: "",
	            stopSlideshow: "",
	            numDisplayPrefix: "",
	            numDisplaySeparator: "/"
	        },
	        onStart: function() {},
	        onCancel: function() {},
	        onComplete: function() {},
	        onClosed: function() {},
	        onError: function() {}
	    };
	    var obj = selectedArray[selectedIndex],
	        date = new Date(),
	        tdate = date.getTime(),
	        href, title, type, ret;
	        abortjata();
	    selectedOpts = _.extend({}, defaults, a);
	    classNames = selectedOpts.classname, container = selectedOpts.containerId;
	    if (selectedOpts.animate) {
	        overlayDuration = Math.max(selectedOpts.overlayDuration, 0);
	        selectedOpts.resizeSpeed = Math.max(Math.min(selectedOpts.resizeSpeed, 10), 1);
	        resizeDuration = (11 - selectedOpts.resizeSpeed) * 0.15
	    } else {
	        overlayDuration = 0;
	        resizeDuration = 0
	    }
	    if (selectedOpts.href) {
	        href = selectedOpts.href
	    }
	    if (selectedOpts.content) {
	        type = "normal"
	    }
	    if (selectedOpts.tab) {
	        type = "tabPreview"
	    }
	    if (selectedOpts.theatre && selectedOpts.Td) {
	        type = "theatre"
	    } else if (selectedOpts.href) {
	        type = "ajax"
	    }
	    if (!type) {
	        errorjata();
	        return
	    }
	    selectedOpts.href = href;
	    selectedOpts.type = type;
	    if (selectedOpts.modal) {
	        selectedOpts.hideOnOverlayclick = false;
	        selectedOpts.showOverlay = true
	    }
	    if (selectedOpts.autoDimensions) {
	        if (selectedOpts.type == "normal" || selectedOpts.type == "ajax") {
	            selectedOpts.width = "auto";
	            selectedOpts.height = "auto"
	        } else {
	            selectedOpts.autoDimensions = false
	        }
	    }
	    selectedOpts.padding = parseInt(selectedOpts.padding, 10);
	    selectedOpts.margin = parseInt(selectedOpts.margin, 10);
	    modalObject._temp.css("padding", (selectedOpts.padding + selectedOpts.margin));
	    switch (type) 
	    {
	        case "normal":
	            modalObject._temp.html(selectedOpts.content);
	            processInline();
	            break;
	        case "ajax":
	            netbuzz = false;
	            netLoading();
	            ajaxLoader = _.ajax(_.extend({}, selectedOpts.ajax, {
	                url: selectedOpts.href,
	                data: selectedOpts.data || {},
	                error: function(XMLHttpRequest, textStatus, errorThrown) {
	                    if (XMLHttpRequest.status > 0) {
	                        errorjata()
	                    }
	                },
	                success: function(data, textStatus, XMLHttpRequest) {
	                    var o = typeof XMLHttpRequest == "object" ? XMLHttpRequest : ajaxLoader;
	                    if (o.status == 200) 
	                    {

                            if (data === false) 
                            {
                                loading.hide();
                                return
                            }else 
                            {
                            	ret = data;
                                if(jEli.$isObject(data) || jEli.$isJsonString(data))
                                {
                                	ret = processResponseContent(data);
                                	data = ret.message || '';
                                }
                            }

                            if(selectedOpts.onSuccess)
                            {
                            	selectedOpts.onSuccess.call(selectedOpts.onSuccess , ret);
                            }

	                        modalObject._temp.html(data);
	                        processInline();
	                    }
	                }
	            }));
	            break;
	        case "image":
	            netbuzz = false;
	            imgLoader = new Image();
	            imgLoader.onerror = function() {
	               errorjata()
	            };
	            imgLoader.onload = function() {
	                netbuzz = true;
	                imgLoader.onerror = imgLoader.onload = null;
	                startImageModal()
	            };
	            imgLoader.src = selectedOpts.href;
	            break;
	        case "theatre":
	            netLoading();
	            netbuzz = false;
	            startImageModal(selectedOpts.Td);
	            break;
	        case "tabPreview":
	            netbuzz = false;
	            return tabPreview(selectedOpts.d);
	            break
	    }
	}

	function processResponseContent(result)
	{
		var ret = JSON.parse( result );

		return ret;
	}

	function processInline() 
	{
	    var w = selectedOpts.width,
	        h = selectedOpts.height;
	    if (w.toString().indexOf("%") > -1) {
	        w = parseInt(($window.width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + "px"
	    } else {
	        w = w == "auto" ? "auto" : w + "px"
	    }
	    if (h.toString().indexOf("%") > -1) {
	        h = parseInt((_(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + "px"
	    } else {
	        h = h == "auto" ? "auto" : h + "px"
	    }
	    modalObject._temp.wrapInner('<div style="width:' + w + ";height:" + h + ";overflow: " + (selectedOpts.scrolling == "auto" ? "auto" : (selectedOpts.scrolling == "yes" ? "scroll" : "hidden")) + ';position:relative;"></div>');
	    selectedOpts.width = modalObject._temp.width();
	    selectedOpts.height = modalObject._temp.height();
	    showjata();

	    $broadcast('modal.is.visible',{});
	}

	function showjata() 
	{
	    var pos, equal;
	    modalObject.loading.hide();
	    _(modalObject.content.add(modalObject.overlay)).unbind();
	    $window.unbind("resize.pj scroll.pj");
	    $document.unbind("keydown.pj");
	    if (selectedOpts.showOverlay) 
	    {
	        modalObject.overlay.css({
	            "background": selectedOpts.overlayColor ? selectedOpts.overlayColor : "#818181",
	            "height": $document.height(),
	            "cursor": selectedOpts.hideOverlayclick ? "pointer" : "auto"
	        });
	        if (!modalObject.overlay.is(":visible")) {
	            modalObject.overlay.show()
	        } else {
	            modalObject.overlay.hide()
	        }
	    }

	    main_pos = zoomjata();
	    if (modalObject.wrap.is(":visible")) 
	    {
	        pos = modalObject.wrap.position();
	        d_pos = {
	            top: pos.top,
	            left: pos.left,
	            width: modalObject.wrap.width(),
	            height: modalObject.wrap.height()
	        };
	        equal = (d_pos.width == main_pos.width && d_pos.height == main_pos.height);
	        modalObject.content.fadeTo("fast", 0.3, function()
	        {
	            var finish_resizing = function() {
	                modalObject.content.html(modalObject._temp.contents()).fadeTo("fast", 1, finishjata(this));
	            };
	            modalObject.content.empty().removeAttr("filter").css({
	                "border-width": selectedOpts.padding,
	                "width": main_pos.width - selectedOpts.padding * 2,
	                "height": selectedOpts.autoDimensions ? "auto" : main_pos.height - selectedOpts.padding * 2
	            });
	            if (equal) {
	                finish_resizing()
	            } else {}
	        });
	        return
	    }
	    modalObject.wrap.removeAttr("style");
	    modalObject.content.css("border-width", selectedOpts.padding);
	    modalObject.content.css({
	        "width": main_pos.width - selectedOpts.padding * 2,
	        "height": selectedOpts.autoDimensions ? "auto" : main_pos.height - selectedOpts.padding * 2
	    }).html(modalObject._temp.contents());
	    modalObject.wrap.css(main_pos).fadeIn(selectedOpts.transitionIn == "none" ? 0 : selectedOpts.speedIn, finishjata(this));

	    //trigger event
	    if(selectedOpts.onShow)
        {
            selectedOpts.onShow.call(selectedOpts.onShow , modalObject.content);
        }
	}

	function  navigatejata() 
	{
	    if (selectedOpts.enableEscapebutton || selectedOpts.enableNav) {
	        $document.bind("keydown.pj", function(e) {
	            if (e.keyCode == 27 && selectedOpts.enableEscapebutton) {
	                e.preventDefault();
	                if (!selectedOpts.theatre) {
	                    k()
	                } else {
	                    j();
	                }
	            } else {
	                if ((e.keyCode == 37 || e.keyCode == 39) && selectedOpts.enableNav && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA" && e.target.tagName !== "SELECT") {
	                    e.preventDefault();
	                    navigate[e.keycode == 37 ? "Prev" : "Next"]()
	                }
	            }
	        })
	    }
	}

	function tabPreview(d) 
	{
		var dis = _(d)
	        apos = dis.position(),
	        isActive = dis.data('.activeTab');
		//function destroy
		this.destroy = function()
		{
			if(modalObject.tabPreview)
			{
				$window.unbind(".tab");
	            _(d).unbind(".tab");
	            $document.unbind(".tab");
	            modalObject.tabPreview.remove();
	            modalObject.tabPreview = null;
	            dis.removeData('.activeTab');

	            $broadcast('tab.preview.is.destroy');
			}
		};

	    this.open = function(options)
	    {
	    	if(isActive)
			{
		    	this.destroy();
		    	return;
			}

	    	dis.data('.activeTab','true');
	    	var tabH = _('<j-tab-preview/>'),
		        x_page = (apos.left < 5) ? Math.round((dis.width()) - apos.left) : Math.round(apos.left - (400 + 20)),
		        y_page = Math.round(apos.top - 15),
		        $self = this,
		        modelObj = {
		        	arrow : tabArrowPoints(d),
		        	$destroy : $self.destroy
		        };

		    switch (options.type) 
		    {
		        case "html":
		            modelObj.content = options.content;
		            break;
		        case "load":
		        	modelObj.url = $getHref(d);
		        break;
		        case("grab"):
		        	modelObj.content = _(options.content).html();
		        break;
		        default:
		        break;

		    }
		    var on = null,
		    	$self = this;
	    	dis.after(tabH.appendTo("body").compile(modelObj));
	    	jEli.dom(tabH.getFirstChild())
	    	.css({
		        "top": (y_page) + "px",
		        "left": (x_page) + "px"
		    });
		    tabH.show(1,function(){
		    	$broadcast('tab.preview.open',[dis,$self]);
		    }).bind("mousemove.tab", function() {
		        on = true
		    }).bind("mouseout.tab", function() {
		        on = false
		    }).bind("mouseout.tab", function() {
		        on = false
		    });
		    $window.bind("scroll.tab", function() {
		        if (_(tabH.is(":visible"))) {
		            on = true;
		        }
		    });
		    $document.bind("mouseup.tab", function(event) {
		        if (!on) 
		        {
		           $self.destroy();
		        }
		    });

		    modalObject.tabPreview = tabH;

		    //bind events
		    $on('tab.preview.destroy',function(){
		    	$self.destroy();
		    });
	    };

	    return this;
	}

	function $get(a)
	{
		var request = null;
		if (a.href != null || a.href != "undefined" || a.href != "") 
        {
            var data = null;
            var request = $http({
                type: "GET",
                url: a.href,
                cache: false,
                dataType: a.dtype,
                data: (a.data == data ? data : a.data)
            })
        }
      
      return request;
	}

	function $getTitle(Node) 
    {
        return (Node.getAttribute("title") || Node.getAttribute("push-title"))
    }

    function $getHref(NODE,c) 
    {
        var c = ["href", "ajaxify", "datasrc"];
        return (NODE.getAttribute(c[0]) != "#") ? ((NODE.getAttribute(c[1])) ? NODE.getAttribute(c[1]) : NODE.getAttribute(c[0])) : ((NODE.getAttribute(c[1])) ? NODE.getAttribute(c[1]) : NODE.getAttribute(c[2]))
    }


	function $post(a) 
    {
        if (a.href != null || a.href != "undefined") 
        {
            var request = $http({
                type: "POST",
                url: a.href,
                cache: false,
                dataType: a.dtype,
                data: a.data
            })
        }

        return request
    };

	function tabArrowPoints(d) 
	{
	    var s = _(d);
	    var posLeft = _(d).position();
	    return ((posLeft.left < 5) ? "left" : "right");
	};

	function finishjata(d) 
	{
	    if (selectedOpts.autoDimensions) {
	        modalObject.content.css("height", "auto")
	    }
	    modalObject.wrap.css("height", "auto");
	    if (selectedOpts.title) {
	        modalObject.titleBar.append(selectedOpts.title);
	        modalObject.content.prepend(modalObject.title)
	    }
	    if (selectedOpts.buttons) {
	        createButtons(selectedOpts.buttons)
	    }
	    if (selectedOpts.centerOnScroll) {
	        $window.bind("scroll.fb", _.fancybox.center)
	    }
	        navigatejata();
	    if (!selectedOpts.theatre) {
	        modalObject.wrap.show()
	    }
	    if (selectedOpts.theatre && modalObject.wrap.is(":hidden")) {
	        d()
	    }
	    if (selectedOpts.hideOnOverlayclick) {
	        modalObject.overlay.bind("click", function() {
	            close()
	        })
	    }
	    $window.bind("resize.pj", function() {
	        projataResize()
	    });
	    busy = false;
	    centerProjata()

	    modalObject.content.compile();
	}

	function updateImageList() 
	{
	    _("." + classNames.replace(/^\,/, "._&"), modalObject.container).each(function() {
	        if ($getHref(this)) 
	        {
	            d(this)
	        }
	    })
	}

	function getPageScroll() 
	{
	    var x=0, y=0;
	    if (self.pageYOffset) {
	        x = self.pageXOffset;
	        y = self.pageYOffset
	    } else {
	        if ($document[0].documentElement && $document[0].documentElement.scrollTop) {
	            x = $document[0].documentElement.scrollLeft;
	            y = $document[0].documentElement.scrollTop
	        } else {
	            if ($document.body) {
	                x = $document[0].body.scrollLeft;
	                y = $document[0].body.scrollTop
	            }
	        }
	    }
	    return {
	        x: x,
	        y: y
	    }
	}

	function getPageSize()
	{
	    var wX, wY;
	    if (self.innerHeight) {
	        wX = self.innerWidth;
	        wY = self.innerHeight
	    } else {
	        if ($document[0].documentElement && $document[0].documentElement.clientHeight) {
	            wX = $document[0].documentElement.clientWidth;
	            wY = $document[0].documentElement.clientHeight
	        } else {
	            if ($document[0].body) {
	                wX = $document[0].body.clientWidth;
	                wY = $document[0].body.clientHeight
	            }
	        }
	    }
	    return {
	        winWidth: wX,
	        winHeight: wY
	    }
	}

	function docWH() 
	{
	    var b = $document[0].body,
	        e = $document[0].documentElement,
	        w = 0,
	        h = 0;
	    if (e) {
	        w = Math.max(w, e.scrollWidth, e.offsetWidth);
	        h = Math.max(h, e.scrollHeight, e.offsetHeight)
	    }
	    if (b) {
	        w = Math.max(w, b.scrollWidth, b.offsetWidth);
	        h = Math.max(h, b.scrollHeight, b.offsetHeight);
	        if ($window[0].innerWidth) {
	            w = Math.max(w, $window[0].innerWidth);
	            h = Math.max(h, $window[0].innerHeight)
	        }
	    }
	    return [w, h];
	}

	function getRequireDetails(NODE) 
	{
	    NODE = _(NODE);
	    var d = NODE.data("src");
	    return d ? d : 0;
	}

	function getID(id) 
	{
	    return selectedOpts.prefix + id;
	};
        
	function hideBadObjects() 
	{
	    var tags = badObjects;
	    for (var i = 0; i < tags.length; i++) {
	        _(tags[i]).css({
	            visibility: "hidden"
	        })
	    }
	}

	function getAutoHeight(tbh,winH,padding){
		padding = padding || 40;
		var defaultHeight = 500;
		if((winH - (defaultHeight + tbh)) > padding){
			return Math.round((winH - tbh) - padding);
		}else if((defaultHeight + tbh + padding) > winH){
			return Math.round(winH - (tbh + padding));
		}

		return defaultHeight;
	}

	function reformatContainer() 
	{
	    var Theight = modalObject.Timg.height(),
	        arrayWinSize = getPageSize(),
	        Twidth = modalObject.Tbody.width(),
	        TbottomHeight = modalObject.TBottomC.height(),
	         autoHeight = getAutoHeight(TbottomHeight,arrayWinSize.winHeight,40),
	    TBC = (arrayWinSize.winHeight - TbottomHeight);
	    if (autoHeight > (arrayWinSize.winHeight - TbottomHeight)) {
	        autoHeight = parseInt((arrayWinSize.winHeight - TbottomHeight) - 20)
	    }
	    Tpos.height = autoHeight;
	    //recalculate with page scroll
	    Tpos.top = parseInt((arrayWinSize.winHeight - autoHeight - TbottomHeight) / 2);
	    Tpos.width = arrayWinSize.winWidth - 40;
	    Tpos.left = parseInt((arrayWinSize.winWidth - Tpos.width) / 2);
	    Talign = parseInt(Tpos.width - modalObject.Tcomment.width());
	    modalObject.Timg.css({
	        "width": Talign - 10,
	        "height": Tpos.height
	    });
	    modalObject.Tcomment.css({
	        "margin-left": parseInt(Talign, 10),
	        "height": Tpos.height
	    });
	    modalObject.Thover.css("width", modalObject.Timg.width());
	    modalObject.TImageData.css({
	        "width": modalObject.Timg.width(),
	        "top": parseInt((autoHeight - 50)) + "px"
	    });
	    modalObject.TBottomC.css("width", arrayWinSize.winWidth);
	    modalObject.TCBoard.css({
	        "height": parseInt((autoHeight - modalObject.TCDetails.height() - 75)) + "px"
	    });
	    modalObject.Tbody.css(Tpos)
	}

	function startImageModal(imageLink) 
	{

	    hideBadObjects();
	    hideLoading();
	    reformatContainer();
	    modalObject.TBottomC.show();
	    imageLink = _(imageLink);
	    modalObject.TLightImage.hide().attr({
	        src: ""
	    });
	    if (selectedOpts.startZoom) {
	        modalObject.TCimg.css({
	            width: imageLink.width() + "px",
	            height: imageLink.height() + "px"
	        });
	        if (!document.all) {}
	    } else {
	        modalObject.Twrap.css({
	            opacity: 0
	        }).show().fadeTo(overlayDuration * 1000, selectedOpts.overlayOpacity);
	        modalObject.Tbody.css({
	            left: 0,
	            width: "100%"
	        })
	    }
	    modalObject.Tbody.show();
	    modalObject.Twrap.show();
	    _("body").css("overflow", "hidden");
	    imageArray = [];
	    groupName = null;
	    startImage = 0;
	    _("[aria-theatre=" + imageLink.attr("aria-theatre") + "]", modalObject.container).each(function() {
	        if ($getHref(this)) 
	        {
	            imageArray.push({
	                link: $getHref(this),
	                title: $getTitle(this),
	                details: getRequireDetails(this)
	            });
	            if (this == imageLink.get(0)) {
	                startImage = imageArray.length - 1
	            }
	        }
	    });
	    if (imageArray.length > 1) {
	        groupName = imageLink.attr("class")
	    }
	    if (selectedOpts.featBrowser) {
	        $window.resize(adjustImageSizeNoEffect)
	    }
	    if (selectedOpts.floating) {}
	    $window.resize(adjustOverlay);
	    $window.scroll(adjustOverlay);
	    changeImage(startImage);
	    $broadcast('theatre.started',imageArray);
	}

	function changeImage(imageNum) 
	{
	    activeImage = imageNum;
	    disableKeyBoardNav();
	    if (!selectedOpts.startZoom) {
	        modalObject.TLightImage.hide()
	    }
	    modalObject.TImageData.hide();
	    modalObject.Thover.hide();
	    modalObject.TCWriteBoard.hide();
	    modalObject.TCBoard.html("").hide();
	    modalObject.TMenu.html("");
	    imgPreloader = new Image;
	    imgPreloader.onload = function() {
	        imageArray[activeImage].link = imgPreloader.src;
	        imageArray[activeImage].width = imgPreloader.width;
	        imageArray[activeImage].height = imgPreloader.height;
	        adjustImageSize(false)
	    };
	    if (selectedOpts.startZoom && !modalObject.TLightImage.attr("src")) {
	        imageArray[activeImage].width = 320;
	        imageArray[activeImage].height = 240;
	        adjustImageSize(false, true)
	    }
	    imgPreloader.src = String(imageArray[activeImage].link.split("=")[2]);
	    if (selectedOpts.googleAnalytics) {
	        urchinTracker(imageArray[activeImage].link)
	    }
	}

	function adjustImageSize(recall, noImage) 
	{
	    var imgWidth = imageArray[activeImage].width,
	        imgHeight = imageArray[activeImage].height,
	        arrayTimg = {};
	    arrayTimg.width = modalObject.Timg.width();
	    arrayTimg.height = modalObject.Timg.height();
	    var imageProportion = imgWidth / imgHeight;
	    var _max_size = 482;
	    var _min_size = 200;
	    var _nH;
	    var _nW;
	    if (imgHeight > imgWidth) {
	        _nH = _max_size;
	        _nW = Math.ceil(imageProportion * _max_size)
	    } else {
	        _nW = _max_size;
	        _nH = Math.ceil(imgHeight / imgWidth * _max_size)
	    }
	    if (selectedOpts.featBrowser) {
	        var winProportion = arrayTimg.width / arrayTimg.height;
	        var maxHeight = _nH;
	        var maxWidth = _nW;
	        if (_max_size > arrayTimg.width || _max_size > arrayTimg.height) {
	            _nW = _min_size;
	            _nH = Math.ceil(imageProportion * _min_size)
	        }
	    }
	    var imgTop = getPageScroll().y + (getPageSize().winHeight - (_nH + modalObject.TBottomC)) / 2;
	    var imageContainer = modalObject.TCimg;
	    if (recall == true) 
	    {
	        imageContainer.css({
	            height: imgHeight + "px",
	            width: imgWidth + "px"
	        });
	        if (selectedOpts.floating) {
	            moveEffect(Tbody, imgTop)
	        } else {
	            modalObject.Timg.css({
	                top: imgTop + "px"
	            })
	        }
	    } else {
	        var LImage = modalObject.TLightImage;
	        imageContainer.stop(true, false);
	        LImage.stop(true, false);
	        var LImage2;
	        if (selectedOpts.startZoom && LImage.attr("src")) {
	            LImage2 = LImage;
	            LImage2.attr({
	                id: getID("LImage2")
	            })
	        } else {
	            _("#projata-TBoxImage").remove()
	        }
	        if (!noImage) {
	            LImage = _(imgPreloader);
	            LImage.hide();
	            LImage.attr({
	                id: getID("projata-TBoxImage")
	            });
	            imageContainer.append(LImage)
	        }
	        with(imageContainer) {
	            var resizeFactor = imageProportion / (width() / height())
	        }
	        if (!noImage) {
	            if (selectedOpts.startZoom) {
	                if (LImage2) {
	                    _("LImage2").stop(true, true)
	                }
	                var zoomF = LImage2 ? 120 : 100;
	                if (LImage2) {
	                    with(LImage2) {
	                        css({
	                            width: 1 > resizeFactor ? "auto" : width() / parent().width() * 100 + "%",
	                            height: 1 > resizeFactor ? height() / parent().height() * 100 + "%" : "auto",
	                            left: 0,
	                            top: 0
	                        })
	                    }
	                }
	                LImage.css({
	                    display: "block",
	                    position: "absolute",
	                    width: _nW,
	                    height: _nH,
	                    left: parseInt((modalObject.Timg.width() - _nW) / 2),
	                    top: parseInt((modalObject.Timg.height() - _nH) / 2) + "px"
	                })
	            }
	            if (selectedOpts.startZoom) {
	                modalObject.loading.hide()
	            }
	        }
	        resizeImageContainer(imgTop, _nW, _nH, resizeFactor, noImage)
	    }
	}

	function resizeImageContainer(imgTop, imgWidth, imgHeight, resizeFactor, noImage) 
	{
	    var imageContainer = modalObject.TCimg,
	        LImage = modalObject.TLightImage;
	    if (!noImage) {
	        var lightboxImage2 = _("LImage2");
	    }
	    if (selectedOpts.startZoom) {
	        LImage.fadeTo(resizeDuration * 1000, 1);
	        if (!document.all) {
	            modalObject.TCimg.fadeTo(resizeDuration * 1000, 1)
	        }
	    }
	    if (selectedOpts.startZoom && !noImage) {
	        lightboxImage2.animate(_.extend({
	            opacity: 0
	        }, resizeFactor < 1 ? {
	            height: "120%",
	            top: "0",
	            left: "0%"
	        } : {
	            width: "120%",
	            left: "-10%",
	            top: (100 - resizeFactor * 120) / 2 + "%"
	        }), {
	            queue: false,
	            duration: resizeDuration * 1000,
	            complete: function() {
	                _(this).remove()
	            }
	        })
	    }
	    imageContainer.animate({
	        width: imgWidth + "px",
	        height: imgHeight + "px"
	    }, {
	        queue: false,
	        duration: resizeDuration * 1000,
	        complete: !noImage ? function() {
	            showImage()
	        } : null
	    })
	}

	function moveEffect(lightbox, imgTop) 
	{
	    modalObject.lightbox.stop(true, false);
	    modalObject.lightbox.animate({
	        left: parseInt((getPageSize().winWidth - Tpos.width) / 2)
	    }, {
	        queue: false,
	        duration: resizeDuration * 1000,
	        complete: function() {
	            reformatContainer()
	        }
	    })
	}

	function showImage() 
	{
	    modalObject.loading.hide();
	    if (selectedOpts.startZoom)
	     {
	        updateDetails()
	    } else {
	        modalObject.TLightImage.css({
	            opacity: 0
	        }).show().fadeTo(500, 1, function() {
	           updateDetails()
	        })
	    }
	    preloadNeighborImages()
	}

	//Fixed this code as it will be needing Open Source re-usable FN
	function updateDetails() 
	{
		var maxImage = 1;
	    if (imageArray.length > 1) 
	    {
	        var num_display = selectedOpts.strings.numDisplayPrefix + " " + eval(activeImage + 1) + " " + selectedOpts.strings.numDisplaySeparator + " " + imageArray.length;
	        if (selectedOpts.showGroupName && groupName) 
	        {
	            num_display += " " + selectedOpts.strings.numDisplaySeparator + " " + groupName
	        }
	        modalObject.TImageData.show();
	        modalObject.TNumDisplay.show();
	        modalObject.TNumDisplay.html(imageArray[activeImage].title || "");
	        modalObject.TDetailsNav.html(num_display).show();

	        maxImage = imageArray.length;

	    }

	    $broadcast('imageLoaded',{currentImage:imageArray[activeImage],totalImage:maxImage,status:"Success"});
	    modalObject.Timg.animate({
	        height: "show",
	        opacity: "show"
	    }, 650, null, function() {
	        updateNav();
	    })
	}

	function getReport(d) 
	{
	    var a = d.getAttribute("data");
	    return _(a)
	}

	function updateNav() 
	{
	    var d = 1 / imageArray.length;
	    descriptionHeight = descriptionHeight * (1 - d) + modalObject.Timg.height() * d;
	    if (imageArray.length > 1) {
	        modalObject.Thover.show();
	    }
	    enableKeyboardNav()
	}

	function showNext() 
	{
	   if (imageArray.length > 1) {
	        if (!selectedOpts.loop && (activeImage == imageArray.length - 1 && startImage == 0 || activeImage + 1 == startImage)) {
	            i();
	            return
	        }
	        if (activeImage == imageArray.length - 1) 
	            changeImageWithData(0)
	        else 
	            changeImageWithData(activeImage + 1)
	    }
	}

	function changeImageWithData(imageNum) 
	{
	    modalObject.TCimg.animate({
	        height: "hide",
	        opacity: "hide"
	    }, 650, null, function() {
	        changeImage(imageNum)
	    })
	}

	function showPrevious() 
	{
	    if (imageArray.length > 1) 
	    {
	        if (activeImage == 0) 
	            changeImageWithData(imageArray.length - 1)
	        else 
	           changeImageWithData(activeImage - 1)
	    }
	}

	function showFirst() 
	{
	    if (imageArray.length > 1) 
	        changeImageWithData(0);
	}

	function showLast() 
	{
	    if (imageArray.length > 1) 
	    changeImageWithData(imageArray.length - 1)
	}

	function enableKeyboardNav() 
	{
	    $document.on('keydown',keyboardAction);
	}

	function disableKeyBoardNav() 
	{
	    $document.on('keydown',"")
	}

	function keyboardAction(ev)
	{
	    if (ev == null) 
	        keycode = event.keyCode;
	    else 
	        keycode = ev.which;

	       var key = String.fromCharCode(keycode).toLowerCase();
	        if (key == "c" && ev.target.tagName !== "INPUT" && ev.target.tagName !== "TEXTAREA" && ev.target.tagName !== "SELECT") {
	            end();
	        } else 
	        {
	            if (key == "%" && ev.target.tagName !== "INPUT" && ev.target.tagName !== "TEXTAREA" && ev.target.tagName !== "SELECT") {
	               showPrevious()
	            } else {
	                if (key == "'" && ev.target.tagName !== "INPUT" && ev.target.tagName !== "TEXTAREA" && ev.target.tagName !== "SELECT") {
	                   showNext()
	                } else {
	                    if (key == "f" && ev.target.tagName !== "INPUT" && ev.target.tagName !== "TEXTAREA" && ev.target.tagName !== "SELECT") {
	                        showFirst()
	                    } else {
	                        if (key == "l" && ev.target.tagName !== "INPUT" && ev.target.tagName !== "TEXTAREA" && ev.target.tagName !== "SELECT") {
	                           showLast()
	                        }
	                    }
	                }
	            }
	        }
	}

	function preloadNeighborImages() 
	{
	    var nextImageID = imageArray.length - 1 == activeImage ? 0 : activeImage + 1;
	    (new Image).src = imageArray[nextImageID].link.split("=")[2];
	    var prevImageID = activeImage == 0 ? imageArray.length - 1 : activeImage - 1;
	    (new Image).src = imageArray[prevImageID].link.split("=")[2];
	}

	function end(ev) 
	{
	    if (ev) 
	    {
	        var id = _(ev.target).attr("id");
	        if (getID("projata-theatre-close") != id && getID("projata-Tbody") != id && getID("projata-theatre") != id) {
	            return
	        }
	    }
	    modalObject.TCimg.stop(true, false);
	    modalObject.TLightImage.stop(true, false);
	    imgPreloader.onload = null;
	    disableKeyBoardNav();
	    modalObject.Tbody.hide();
	    modalObject.TBottomC.hide();
	    if (selectedOpts.overlayOpacity) {
	        modalObject.Twrap.fadeOut(overlayDuration * 1000)
	    } else {
	        modalObject.Twrap.hide()
	    }
	    $window.unbind("resize", adjustImageSizeNoEffect);
	    $window.unbind("scroll", adjustImageSizeNoEffect);
	    $window.unbind("resize", adjustOverlay);
	    $window.unbind("scroll", adjustOverlay);
	    showBadObjects();
	    _("body").css("overflow", "auto");

	    $broadcast('theatre.ended');
	}

	function adjustImageSizeNoEffect() {
	    adjustImageSize(true)
	}

	function adjustOverlay() 
	{
	    modalObject.Twrap.css({
	        left: getPageScroll().x + "px",
	        top: 0,
	        width: "100%",
	        height: getPageSize().winHeight + "px"
	    })
	}

	function showBadObjects() 
	{
	    var els;
	    var tags = badObjects;
	    for (var i = 0; i < tags.length; i++) {
	        els = $document[0].getElementsByTagName(tags[i]);
	        for (var j = 0; j < els.length; j++) {
	            _(els[j]).css({
	                visibility: "visible"
	            })
	        }
	    }
	}

	function createButtons(buttons) 
	{
	    var hasButtons = false,
	        buttonPanel = _("<div></div>").addClass("ui-dialog-buttonpane " + "ui-widget-content " + "ui-helper-clearfix"),
	        setButton = _("<div></div>").addClass("ui-dialog-buttonset").appendTo(buttonPanel);
	    modalObject.wrap.find(".ui-dialog-buttonpane").remove();
	    if (typeof buttons === "object" && buttons !== null) {
	        _.each(buttons, function() {
	            return !(hasButtons = true)
	        })
	    }
	    if (hasButtons) 
	    {
	        _.each(buttons, function(name, props) {
	            var button = _('<button type="button"></button>').attr("text", name).unbind("click").addClass("ui-button " + "ui-widget " + "ui-state-default " + "ui-corner-all " + "ui-button-text-only").click(function() {
	                props(true)
	            });
	            var buttonText = _("<span></span>").addClass("ui-button-text").html(button.attr("text"));
	            button.append(buttonText);
	            button.appendTo(setButton)
	        });
	        buttonPanel.appendTo(modalObject.content)
	    }
	}

	function projataResize() 
	{
	    if (modalObject.overlay.is(":visible")) {
	        modalObject.overlay.css("height", $document.height())
	    }
	    centerProjata(true)
	}

	function centerProjata() 
	{
	    var view, align;
	    if (netbuzz) 
	    {
	        return
	    }
	    align = arguments[0] === true ? 1 : 0;
	    view = viewjata();
	    if (!align && (modalObject.wrap.width() > view[0] || modalObject.wrap.height() > view[1])) {
	        return
	    }
	    modalObject.wrap.stop().animate({
	        "top": parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - modalObject.content.height() - 40) * 0.5) - selectedOpts.padding)),
	        "left": parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - modalObject.content.width() - 40) * 0.5) - selectedOpts.padding))
	    }, typeof arguments[0] == "number" ? arguments[0] : 200)
	}

	function viewjata() 
	{
	    return [$window.width() - (selectedOpts.margin * 2), $window.height() - (selectedOpts.margin * 2), $document.scrollLeft() + selectedOpts.margin, $document.scrollTop() + selectedOpts.margin]
	}

	function zoomjata() 
	{
	   var view = viewjata(),
	        to = {},
	        resize = selectedOpts.autoScale,
	        double_padding = selectedOpts.padding * 2,
	        ratio;
	    if (selectedOpts.width.toString().indexOf("%") > -1) {
	        to.width = parseInt((view[0] * parseFloat(selectedOpts.width)) / 100, 10)
	    } else {
	        to.width = selectedOpts.width + double_padding
	    }
	    if (selectedOpts.height.toString().indexOf("%") > -1) {
	        to.height = parseInt((view[1] * parseFloat(selectedOpts.height)) / 100, 10)
	    } else {
	        to.height = selectedOpts.height + double_padding
	    }
	    if (resize && (to.width > view[0] || to.height > view[1])) {
	        if (selectedOpts.type == "image" || selectedOpts.type == "swf") {
	            ratio = (selectedOpts.width) / (selectedOpts.height);
	            if ((to.width) > view[0]) {
	                to.width = view[0];
	                to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10)
	            }
	            if ((to.height) > view[1]) {
	                to.height = view[1];
	                to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10)
	            }
	        } else {
	            to.width = Math.min(to.width, view[0]);
	            to.height = Math.min(to.height, view[1])
	        }
	    }
	    to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - 40) * 0.5)), 10);
	    to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 40) * 0.5)), 10);
	    return to
	}

	function netLoading()
	 {
	    if (modalObject.loading.is(":visible")) 
	    {
	        return
	    }
	    _("div", modalObject.loading).html(netLoad);
	    modalObject.loading.show()
	}

	function hideLoading() 
	{
	    if (modalObject.loading.is(":visible")) {
	        modalObject.loading.hide()
	    }
	}

	function cancel() 
	{
	    if (netbuzz) {
	        return
	    }
	    netbuzz = true;
	    abortjata();
	    netbuzz = false
	}

	function closeJata(t) 
	{
	    if (netbuzz || modalObject.wrap.is(":hidden")) {
	        return
	    }
	    netbuzz = true;
	    abortjata();
	    $window.unbind("resize.pj scroll.pj");
	    $document.unbind("keydown.pj");
	    modalObject.wrap.stop();

	    function cleanupjata() 
	    {
	        modalObject.overlay.fadeOut();
	        modalObject.wrap.hide();
	        modalObject.content.empty();
	        modalObject.titleBar.empty().append(modalObject.close);
	        selectedOpts.onClosed(selectedArray, selectedIndex, selectedOpts);
	        netbuzz = false;

	    }
	    modalObject.wrap.fadeOut((t) ? t : 300, cleanupjata);
	    $broadcast('cleanup');
	    $broadcast('modal.is.destroyed');
	}

	function $alert(obj) 
	{
	    modalIntializer({
	        modal: 1,
	        content: obj.content,
	        title: obj.title,
	        buttons: {
	            "Close": jEli.$isUndefined(obj.callback)?closeJata:obj.callback
	        }
	    });

	    if(obj.timeOut)
	    {
	        setTimeout((obj.callback || closeJata),obj.timeOut);
	    }
	}

	function confirm(obj) 
	{
	    modalIntializer(
	    {
	        content: obj.content,
	        title: obj.title,
	        modal : 1,
	        buttons: {
	            "Ok": obj.callback,
	            "Cancel": function() 
	            {
	               closeJata();
	            }
	        }
	    });
	}

	function $prompt(obj) 
	{
	    modalIntializer(obj);
	}

	return {
			modalObjects : modalObject,
			modal : modalIntializer,
		    tabPreview : tabPreview,
		    startImagejata: startImageModal,
		    theatre : 
		    {
		        showNext: showNext,
		        showPrev: showPrevious,
		        showFirst : showFirst,
		        showLast : showLast,
		        closeTheatre : end

		    },
		    loader : {
		        show : netLoading,
		        hide : hideLoading
		    },
		    $closejata : closeJata,
		    $alert: $alert,
		    $confirm:confirm,
		    $prompt : $prompt,
		    reformatContainer : reformatContainer,
		    $on : $on,
		    $broadcast : $broadcast
		};
}

})(jEli,jEli.dom);