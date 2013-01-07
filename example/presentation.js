/* 
 * @class Presentation
 * file name: presentation.js
 * @author Betti Oesterholz
 * @date 18.08.2012
 * @mail webmaster@BioKom.info
 *
 * System: JavaScript
 *
 * This should implement a presentation website.
 *
 * Copyright (C) @c GPL3 2012 Betti Oesterholz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * This should implement a presentation website.
 */



Presentation = new CreatePresentation();

var originalWindowHeight = 1090;
var originalWindowWidth  = 1560;

var scalingX = 1.0;
var scalingY = 1.0;
var zoomFactor = 1.0;

/**
 * John Resig, erklärt auf Flexible Javascript Events
 * (http://ejohn.org/blog/flexible-javascript-events/)
 */
function addEvent( obj, type, fn ){
	
   if ( obj.addEventListener ){
      obj.addEventListener( type, fn, false );
   } else if ( obj.attachEvent ){
      obj["e"+type+fn] = fn;
      obj[type+fn] = function(){ obj["e"+type+fn]( window.event ); }
      obj.attachEvent( "on"+type, obj[type+fn] );
   }
}

/**
 * John Resig, erklärt auf Flexible Javascript Events
 * (http://ejohn.org/blog/flexible-javascript-events/)
 */
function removeEvent( obj, type, fn ){
	
   if (obj.removeEventListener) {
      obj.removeEventListener( type, fn, false );
   } else if (obj.detachEvent) {
      obj.detachEvent( "on"+type, obj[type+fn] );
      obj[type+fn] = null;
      obj["e"+type+fn] = null;
   }
}

var _this;

function CreatePresentation(){

	//set init values
	this.SlideNr = 0;
	this.Modus = "HTML";//HTML or SLIDE
	this.Name  = "Fib-Development";
	this.Language = "en";
	this.Client  = "blank.htm";
	this.Slide = new Array();
	this.Notes = new Array();
	this.SlideNumber = new Array();
	
	//set method references
	this.setName   = Presentation_SetName;
	this.setLanguage = Presentation_SetLanguage;
	this.setClient = Presentation_setClient;
	this.Add     = Presentation_Add;
	this.AddPage = Presentation_AddPage;
	this.AddSubPage = Presentation_AddSubPage;
	this.Next    = Presentation_Next;
	this.Previos = Presentation_Previos;
	this.GoTo    = Presentation_GoTo;
	this.GoToSlide  = Presentation_GoToSlide;
	this.Start   = Presentation_Start;
	this.onclick = Presentation_onclick;
	this.init   = Presentation_init;

	this.Show = Presentation_Show;
	this.ShowHtml = Presentation_ShowHtml;
	this.ShowActualSlide = Presentation_ShowActualSlide;
	this.Resize   = Presentation_Resize;
	
	this.getWindowWidth  = Presentation_getWindowWidth;
	this.getWindowHeight = Presentation_getWindowHeight;
	
	this.Event_For_Key_Pressed = Presentation_Event_For_Key_Pressed;
	this.Event_For_Resize = Presentation_Event_For_Resize;
	
	//detecting fullscreen state change
	document.addEventListener( "fullscreenchange", function() {
		fullscreenState.innerHTML = (document.fullscreen)? this.Show() : this.ShowHtml();
	}, false);

	document.addEventListener( "mozfullscreenchange", function() {
		fullscreenState.innerHTML = (document.mozFullScreen)? this.Show() : this.ShowHtml();
	}, false);

	document.addEventListener( "webkitfullscreenchange", function() {
		fullscreenState.innerHTML = (document.webkitIsFullScreen)? this.Show() : this.ShowHtml();
	}, false);
	
	//TODO delete?
	//document.onclick = doOnClickBody;
	
	//frameSlide.onclick=Function("Presentation.Next()");
	//document.body.onclick=this.Next;
	//document.body.onclick=Presentation_Next;
	//document.body.onClick = 'this.Next()';
	//document.body.onClick = 'Presentation_Next()';
	//document.body.addEventListener('click', function() { this.Next(); }, false);
	//document.body.onclick=function(){Presentation_Next();};
	//document.body.addEventListener("click", Presentation_Next, false);
	
	/*if ( document.body.addEventListener ){
	  document.body.addEventListener("click", Presentation_Next, false);
	}
	else if ( document.body.attachEvent ){
	  document.body.attachEvent("onclick", Presentation_Next);
	}*/
	//document.onmousedown=this.Next;
	//addEvent( obj, type, fn )
	//addEvent( document, "mousedown", this.Next );
	
	//this works
	removeEvent( document, "keypress", this.Event_For_Key_Pressed );
	addEvent( document, "keypress", this.Event_For_Key_Pressed );
	
	_this = this;
}


function Presentation_ShowActualSlide(){

	if ( _this.Modus != "SLIDE" ){
		//change to slide modus
		_this.Show();
		return;
	}
	
	//set the actual slide
	document.body.firstChild.src = "content/" + _this.Slide[ _this.SlideNr ] + "";
	document.body.lastChild.children[ 1 ].firstChild.src =
		"numbers/" + _this.SlideNumber[ _this.SlideNr ] + ".htm";
	
	//TODO resize
	//document.body.style.zoom = zoomFactor;
	//document.body.style.MozTransform = "scale( " + scalingX + ", " + scalingY + " )";

	//document.onclick=this.Next();Presentation_Next
	//document.body.onclick=this.Next;
	//document.onclick=this.Next;
	//document.body.onClick = 'Presentation_Next()';
	//document.onmousedown=this.Next;
	
	//resize window content
	//TODO comment in
	//_this.Resize();
}


function Presentation_Next(){

	_this.SlideNr++;
	if ( _this.Slide.length <= _this.SlideNr ){
		_this.SlideNr = 0;
	}
	_this.ShowActualSlide();
}


function Presentation_Previos(){

	if ( _this.SlideNr == 0 ){
		_this.SlideNr = _this.Slide.length - 1;
	}else{
		_this.SlideNr--;
	}
	_this.ShowActualSlide();
}


function Presentation_GoTo( number ){
	
	if ( ( 0 < number ) &&
			( number <= _this.SlideNumber[ _this.Slide.length - 1 ] ) ){
		
		for ( _this.SlideNr = number - 1; ( _this.SlideNr <= _this.Slide.length ) &&
				( _this.SlideNumber[ _this.SlideNr ] != number );
				_this.SlideNr = _this.SlideNr + 1 ){
		  //nothing to do
		}
		if ( _this.Slide.length <= _this.SlideNr ){
			//slide with number not found -> go to last slide
			_this.SlideNr = _this.Slide.length - 1;
		}
		_this.ShowActualSlide();
	}
}



function Presentation_getWindowWidth(){
	
  if ( window.innerWidth ){
    return window.innerWidth;
  }else if ( document.body && document.body.offsetWidth ) {
    return document.body.offsetWidth;
  }else{
    return 800;
  }
}


function Presentation_getWindowHeight(){
	
  if ( window.innerHeight ){
    return window.innerHeight;
  }else if ( document.body && document.body.offsetHeight ) {
    return document.body.offsetHeight;
  }else{
    return 600;
  }
}


/**
 * Event wich is called if the window is resized
 */
function Presentation_Event_For_Resize( event ){
	
	if ( _this.Modus != "SLIDE" ){
		//just resize slides
		return;
	}
	//alert( "The window is resized  new height= " + newWindowHeight + "  new width" + newWindowWidth );
	// resize frame content:
	var actualWindowHeight = _this.getWindowHeight();
	var actualWindowWidth  = _this.getWindowWidth();
	
	scalingX = actualWindowWidth / originalWindowWidth;
	scalingY = actualWindowHeight / originalWindowHeight;
	/* TODO weg
	zoomFactor = scalingX;
	if ( scalingY < zoomFactor ){
		zoomFactor = scalingY;
	}
	*/
	_this.Show();
}


function Presentation_ResizeSubElements( element ){
	//TODO
	//for every subelement
		//if subelement is a div element
		
		//if subelement is text
		
		//if subelement is image
		
		
		//if subelement contains more subelements
	
}


function Presentation_ResizeFrame( frame ){
	//TODO

}


/**
 * This function resize the presentation page content acording to its window size.
 * Call it directly after the content was loaded.
 */
function Presentation_Resize(){
	
	if ( this.Modus != "SLIDE" ){
		//just resize slides
		return;
	}
	
	//get actual scaling factors
	var actualWindowHeight = _this.getWindowHeight();
	var actualWindowWidth  = _this.getWindowWidth();
	
	scalingX = actualWindowWidth / originalWindowWidth;
	scalingY = actualWindowHeight / originalWindowHeight;
	
	//for all window frames
	for ( frameNumber = 0; frameNumber < window.frames.length;
			frameNumber = frameNumber + 1 ){
		Presentation_ResizeFrame( window.frames[ frameNumber ].document );
	}
}



function Presentation_Event_For_Key_Pressed( event ){
	/*to print key info comment in:
	var text = "Key identifier:\"" + event.keyIdentifier + "\" Key code:\"" + event.keyCode +
		"\" Key char:\"" + event.charCode + "\" Key location:\"" + event.keyLocation + "\"";
	if ( event.shiftKey == true ){
		text = text + " The shift key was pressed!";
	}
	if ( event.ctrlKey == true ){
		text = text + " The ctrl key was pressed!";
	}
	alert( text );
	*/
	if ( event.ctrlKey == false ){
		if ( event.keyCode == 0 ){
			switch( event.charCode ){
				case 32://space bar
					if ( _this.Modus == "SLIDE" ){
						_this.Next();
					}else{//else just show actual slide
						_this.Show();
					}
				break;
				//number keys
				case 49:
					_this.GoTo( 1 );
				break;
				case 50:
					_this.GoTo( 2 );
				break;
				case 51:
					_this.GoTo( 3 );
				break;
				case 52:
					_this.GoTo( 4 );
				break;
				case 53:
					_this.GoTo( 5 );
				break;
				case 54:
					_this.GoTo( 6 );
				break;
				case 55:
					_this.GoTo( 7 );
				break;
				case 56:
					_this.GoTo( 8 );
				break;
				case 57:
					_this.GoTo( 9 );
				break;
				case 48:
					_this.GoTo( 10 );
				break;
				case 113://q
					_this.GoTo( 11 );
				break;
				case 119://w
					_this.GoTo( 12 );
				break;
				case 101://e
					_this.GoTo( 13 );
				break;
				case 114://r
					_this.GoTo( 14 );
				break;
				case 116://t
					_this.GoTo( 15 );
				break;
				case 122://z
					_this.GoTo( 16 );
				break;
				case 117://u
					_this.GoTo( 17 );
				break;
				case 105://i
					_this.GoTo( 18 );
				break;
				case 111://o
					_this.GoTo( 19 );
				break;
				case 112://p
					_this.GoTo( 20 );
				break;
				case 252://ü
					_this.GoTo( 21 );
				break;
				case 60://<
					if ( _this.Modus != "HTML" ){
						//change to html modus if not allready html modus
						_this.ShowHtml();
					}
				break;
				//default: do nothing
			}
			
		}else{// event.keyCode != 0
			if ( _this.Modus == "SLIDE" ){
				switch( event.keyCode ){
					case 13://Enter
						_this.Next();
					break;
					case 37://arrow left
						_this.Previos();
					break;
					case 38://arrow up
						_this.GoTo( 1 );
					break;
					case 39://arrow right
						_this.Next();
					break;
					case 40://arrow down
						_this.GoTo( _this.SlideNumber[ _this.SlideNumber.length - 1 ] );
					break;
					//default: do nothing
				}
			}else{//modus not slide modus
				switch( event.keyCode ){
					case 13://Enter
						_this.Show();
					break;
					//default: do nothing
				}
			}
		}// end if event.keyCode
	}
}



function Presentation_Show(){

	this.Modus = "SLIDE";//HTML or SLIDE
	
	//Requesting fullscreen
	/*TODO comment in
	var docElm = document.documentElement;
	if ( docElm.requestFullscreen ) {
		docElm.requestFullscreen();
	}
	else if ( docElm.mozRequestFullScreen ) {
		docElm.mozRequestFullScreen();
	}
	else if ( docElm.webkitRequestFullScreen ) {
		docElm.webkitRequestFullScreen();
	}
	*/
	//build the framework for the presentation
	if ( navigator.appName == "Microsoft Internet Explorer" ){
		document.write("<frameset rows='*,40' frameborder='0' framespacing='0' border='0'><frame src='content/" + _this.Slide[ _this.SlideNr ] + "' name='content' scrolling='no' noresize><frameset cols='47%,6%,47%' frameborder='0' framespacing='0' border='0'><frame src='content/own_data.htm' name='own_data'><frameset cols='40%,20%,40%' frameborder='0' framespacing='0' border='0'><frame src='numbers/" + _this.SlideNumber[  _this.SlideNr ] +".htm' name='actual_slide_number' scrolling='no' noresize><frame src='numbers/seperator.htm' name='number seperator' scrolling='no' noresize><frame src='numbers/" + _this.Slide.length + ".htm' name='number total' scrolling='no' noresize></frameset><frame src='clients/" + _this.Client + "' name='client_data' scrolling='no' noresize></frameset></frameset>");

	}else{
		document.body.parentNode.removeChild(document.body);
		
		//create frameset for the page numbering
		var numberActual  = document.createElement("frame");
		numberActual.name = "actual_slide_number";
		numberActual.src  = "numbers/" + _this.SlideNumber[  _this.SlideNr ] +".htm";
		numberActual.scrolling = "no";
		numberActual.noResize  = true;
		
		var numberSeperator  = document.createElement("frame");
		numberSeperator.name = "number_seperator";
		numberSeperator.src  = "numbers/seperator.htm";
		numberSeperator.scrolling = "no";
		numberSeperator.noResize  = true;
		
		var numberTotal  = document.createElement("frame");
		numberTotal.name = "number total";
		numberTotal.src  = "numbers/" + _this.SlideNumber[ _this.SlideNumber.length - 1 ] + ".htm";
		/*TODO auto number:
		numberTotal.document.body.innerHTML ="<div id='number'>" + _this.SlideNumber[ _this.SlideNumber.length - 1 ] + "</div>";*/
		
		numberTotal.scrolling = "no";
		numberTotal.noResize  = true;
		
		var framesetSlideNumber  = document.createElement("frameset");
		framesetSlideNumber.cols = "40%,20%,40%";
		framesetSlideNumber.rows = "*";
		framesetSlideNumber.frameBorder  = "no";
		framesetSlideNumber.framespacing = "0";
		framesetSlideNumber.border       = "0";
		
		//create frameset for the bottom line
		var frameOwnData  = document.createElement("frame");
		frameOwnData.name = "own_data";
		frameOwnData.src  = "content/own_data.htm";
		frameOwnData.scrolling = "no";
		frameOwnData.noResize  = true;
		
		var frameClientData  = document.createElement("frame");
		frameClientData.name = "client_data";
		frameClientData.src  = "clients/" + _this.Client + "";
		frameClientData.scrolling = "no";
		frameClientData.noResize  = true;
		
		var framesetBottomLine  = document.createElement("frameset");
		framesetBottomLine.cols = "47%,6%,47%";
		framesetBottomLine.rows = "*";
		framesetBottomLine.frameBorder  = "no";
		framesetBottomLine.framespacing = "0";
		framesetBottomLine.border       = "0";
		
		//create frameset for the entire page
		var frameSlide  = document.createElement("frame");
		frameSlide.name = "content";
		frameSlide.src  = "content/" + _this.Slide[ _this.SlideNr ] + "";
		frameSlide.scrolling = "no";
		frameSlide.noResize  = true;
		
		var framesetEntirePage  = document.createElement("frameset");
		framesetEntirePage.rows = "*,40";
		framesetEntirePage.cols = "*";
		//TODO I don't know why the next lines dosn't work
		framesetEntirePage.frameBorder  = "no";
		framesetEntirePage.framespacing = "0px";
		framesetEntirePage.border       = "0px";
		//this works instead (even for all included framesets)
		framesetEntirePage.setAttribute('frameborder', 0);
		framesetEntirePage.setAttribute('framespacing', 0);
		framesetEntirePage.setAttribute('border', 0);
		
		//add all together
		framesetSlideNumber.appendChild(numberActual);
		framesetSlideNumber.appendChild(numberSeperator);
		framesetSlideNumber.appendChild(numberTotal);
		
		framesetBottomLine.appendChild(frameOwnData);
		framesetBottomLine.appendChild(framesetSlideNumber);
		framesetBottomLine.appendChild(frameClientData);
		
		framesetEntirePage.appendChild(frameSlide);
		framesetEntirePage.appendChild(framesetBottomLine);
		
		document.body = framesetEntirePage;

		//TODO
		// resize frame content:

		//frameSlide.style = "zoom: 0.5; -moz-transform: scale(0.5); -moz-transform-origin: 0 0; -o-transform: scale(0.5); -o-transform-origin: 0 0;  -webkit-transform: scale(0.5); -webkit-transform-origin: 0 0;"
		
		/*
		if ( framesetEntirePage.style.zoom ){
		
			framesetEntirePage.style.zoom = "0.5";
			
			alert("framesetEntirePage");
		}else if ( framesetEntirePage.style.MozTransform ){
		
			framesetEntirePage.style.MozTransformOrigin = '0 0';
			framesetEntirePage.style.MozTransform = 'scale(0.5)';
			
			alert("framesetEntirePage");
		}
		*/
		//TODO in a way this works:
		//window.innerWidth = originalWindowWidth;
		//window.innerHeight = originalWindowHeight;
		//document.body.style.zoom = zoomFactor;
		//document.body.style.MozTransform = "scale( " + scalingX + ", " + scalingY + " )";
		
		
		//style="transform: scale(2); -webkit-transform: scale(2); -webkit-transform-origin: 0 0; -moz-transform: scale(2); -moz-transform-origin: 0 0; -o-transform: scale(2); -o-transform-origin: 0 0; -ms-transform: scale(2); -ms-transform-origin: 0 0;"
		
		//document.body.style.setAttribute("zoom", "0.5", false);
		
	}
	removeEvent( window, "resize", this.Event_For_Resize );
	addEvent( window, "resize", this.Event_For_Resize );
}


function Presentation_GoToSlide( itrSlideNumber ){

	//alert("opening slide " + itrSlideNumber);
	
	_this.SlideNr = itrSlideNumber;
	_this.Show();
}


function Presentation_ShowHtml(){

	_this.Modus = "HTML";//HTML or SLIDE
	
	removeEvent( window, "resize", this.Event_For_Resize );
	
	//Cancelling fullscreen
	if ( document.exitFullscreen ){
		document.exitFullscreen();
	}
	else if ( document.mozCancelFullScreen ){
		document.mozCancelFullScreen();
	}
	else if ( document.webkitCancelFullScreen ){
		document.webkitCancelFullScreen();
	}
	//generate the html page
	
//TODO rework
	
	
	if ( navigator.appName == "Microsoft Internet Explorer" ){
		
		var internetExplorerContent = "<frameset frameborder='0' framespacing='0' border='0'>";
		
		for ( itrSlideNumber = 1; itrSlideNumber <= _this.Slide.length ; itrSlideNumber = itrSlideNumber + 1 ){
//TODO
			internetExplorerContent = internetExplorerContent + "<frame src='content/" + _this.Slide[ 0 ] + "' name='content' scrolling='no' noresize><frameset cols='47%,6%,47%' frameborder='0' framespacing='0' border='0'><frame src='content/own_data.htm' name='own_data'><frameset cols='40%,20%,40%' frameborder='0' framespacing='0' border='0'><frame src='numbers/1.htm' name='actual_slide_number' scrolling='no' noresize><frame src='numbers/seperator.htm' name='number seperator' scrolling='no' noresize><frame src='numbers/" + _this.Slide.length + ".htm' name='number total' scrolling='no' noresize></frameset><frame src='clients/" + _this.Client + "' name='client_data' scrolling='no' noresize></frameset>";
		}
		
		internetExplorerContent = "</frameset>";
		document.write( internetExplorerContent );
		
	}else{//use jafascript
		//build the framework table for the presentation
		var bodyEntirePage  = document.createElement("body");
		var tableSlides  = document.createElement("table");
		
		tableSlides.setAttribute('id','slideContentTable');
/*TODO use css
		tableSlides.setAttribute( 'border', 0 );
		tableSlides.setAttribute( 'rules', "none" );
		tableSlides.setAttribute( 'cellspacing', 0 );
		tableSlides.setAttribute( 'cellpadding', 0 );
		tableSlides.setAttribute( 'align', "center" );
*/

		//TODO: tableSlidesBody = document.createElement('tbody');
		
		document.body.parentNode.removeChild( document.body );
		bodyEntirePage.appendChild( tableSlides );
		document.body = bodyEntirePage;
		
		//create frame for the description part
		var frameDescription  = document.createElement("iframe");
		frameDescription.name = "descriptionHtml";
		frameDescription.src  = "content/description_html_" + _this.Language + ".htm";
		frameDescription.scrolling = "auto";
		frameDescription.noResize  = false;
		frameDescription.frameBorder = "1";
		frameDescription.width  = "" + originalWindowWidth + "px";
		frameDescription.height = "664px";
		frameDescription.align  = "middle";
		
		var actualRowDescription  = tableSlides.insertRow( tableSlides.rows.length );
		var actualCellDescription = actualRowDescription.insertCell( 0 );
		actualCellDescription.appendChild( frameDescription );
		
		for ( itrSlideNumber = 0; itrSlideNumber < _this.Slide.length ; itrSlideNumber = itrSlideNumber + 1 ){//TODO _this.Slide.length
			
			//create frame for the slide
			var frameSlide  = document.createElement("iframe");
			frameSlide.name = "content" + itrSlideNumber;
			frameSlide.id = "iframeContent" + itrSlideNumber;
			frameSlide.src  = "content/" + _this.Slide[ itrSlideNumber ] + "";
			frameSlide.scrolling = "no";
			frameSlide.noResize  = true;
			frameSlide.frameBorder = "0";
			frameSlide.width  = "" + originalWindowWidth + "px";
			frameSlide.height = "" + originalWindowHeight + "px";
			frameSlide.align  = "middle";
			/*frameSlide.marginwidth  = "0";
			frameSlide.marginheight = "0";*/
			
			var actualRowSlide  = tableSlides.insertRow( tableSlides.rows.length );
			var actualCellSlide = actualRowSlide.insertCell( 0 );
			actualCellSlide.appendChild( frameSlide );
			
			
			/*TODO document.getElementById("iframeContent" + itrSlideNumber).contentWindow.document.body.onclick = 
				function() {
					alert("slide " + itrSlideNumber + " clicked");
				};*/

			
			var actualRowFooter  = tableSlides.insertRow( tableSlides.rows.length );
			var actualCellFooter = actualRowFooter.insertCell( 0 );
			actualCellFooter.width = "" + originalWindowWidth + "px";
			actualCellFooter.height = "40px";
			
			var tableFooter  = document.createElement("table");
			tableFooter.width = "" + originalWindowWidth + "px";
			tableFooter.height = "40px";
			actualCellFooter.appendChild( tableFooter );
			var actualRowFooterSub = tableFooter.insertRow( tableFooter.rows.length );
			
			//create frameset for the bottom line
			var frameOwnData  = document.createElement("iframe");
			frameOwnData.name = "own_data";
			frameOwnData.src  = "content/own_data.htm";
			frameOwnData.scrolling = "no";
			frameOwnData.noResize  = true;
			frameOwnData.frameBorder = "0";
			frameOwnData.height = "40px";
			frameOwnData.width = "" + (originalWindowWidth * 0.47) + "px";
			
			var actualCellOwnData = actualRowFooterSub.insertCell( 0 );
			actualCellOwnData.width = "" + (originalWindowWidth * 0.47) + "px";
			actualCellOwnData.height = "40px";
			actualCellOwnData.appendChild( frameOwnData );
			
			//create slide number
			var slideNumber = document.createTextNode( "" + _this.SlideNumber[ itrSlideNumber ] + " / " + _this.SlideNumber[ _this.SlideNumber.length - 1 ] );
			
			var actualCellSlideNumber = actualRowFooterSub.insertCell( 1 );
			actualCellSlideNumber.width = "" + (originalWindowWidth * 0.06) + "px";
			actualCellSlideNumber.align = "center";
			actualCellSlideNumber.appendChild( slideNumber );
			
			//create client number
			var frameClientData  = document.createElement("iframe");
			frameClientData.name = "client_data";
			frameClientData.src  = "clients/" + _this.Client + "";
			frameClientData.scrolling = "no";
			frameClientData.noResize  = true;
			frameClientData.frameBorder = "0";
			frameClientData.height = "40px";
			frameClientData.width = "" + (originalWindowWidth * 0.47) + "px";
			
			var actualCellClientData = actualRowFooterSub.insertCell( 2 );
			actualCellClientData.width = "" + (originalWindowWidth * 0.47) + "px";
			actualCellClientData.appendChild( frameClientData );
			
			//add onclick event to go to the slide
			//TODO dosn't work for the whool cell (iframe excluded)
			actualCellSlide.onclick   = function( slideNumber ) { return function(){ _this.GoToSlide( slideNumber ); }; }( itrSlideNumber );
			actualCellOwnData.onclick = function( slideNumber ) { return function(){ _this.GoToSlide( slideNumber ); }; }( itrSlideNumber );
			actualCellSlideNumber.onclick = function( slideNumber ) { return function(){ _this.GoToSlide( slideNumber ); }; }( itrSlideNumber );
			actualCellClientData.onclick  = function( slideNumber ) { return function(){ _this.GoToSlide( slideNumber ); }; }( itrSlideNumber );
			
			
			
			if ( _this.Notes[ itrSlideNumber ] != "" ){
				//if a page for the notes exists
				var frameNote  = document.createElement("iframe");
				frameNote.name = "note" + itrSlideNumber;
				frameNote.id   = "note" + itrSlideNumber;
				frameNote.src  = "content/" + _this.Notes[ itrSlideNumber ] + "";
				frameNote.scrolling = "auto";
				frameNote.noResize  = false;
				frameNote.frameBorder = "1";
				frameNote.width  = "" + originalWindowWidth + "px";
				frameNote.height = "300px";
				frameNote.align  = "middle";
				
				var actualRowNote  = tableSlides.insertRow( tableSlides.rows.length );
				var actualCellNote = actualRowNote.insertCell( 0 );
				actualCellNote.appendChild( frameNote );
				
				//TODO
				//frameNote.height = document.frames[ "note" + itrSlideNumber ].document.body.scrollHeight;
				//document.frames[ "note" + itrSlideNumber ].document.body.scrollHeight;
				
			}
			
			//alert( " bodyEntirePage.rows=" + bodyEntirePage.rows );
		}//end fo all slide pages
		//bodyEntirePage.appendChild( tableSlides );
		
		/*TODO:
		<img alt="Creative Commons Lizenzvertrag" style="border-width:0" src="content/pictures/CC_BY_SA.png" /></a><br />Diese(s) <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/StillImage" rel="dct:type">Werk bzw. Inhalt</span> von <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Betti Österholz</span> steht unter einer <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.de">Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 3.0 Unported Lizenz</a>
		*/
		/*
		document.body.parentNode.removeChild( document.body );

		document.body = bodyEntirePage;
		*/
	}
	
}





function Presentation_SetName( inName ){
	
	this.Name = inName;
}


function Presentation_SetLanguage( language ){
	
	this.Language = language;
}


function Presentation_setClient( inClient ){
	
	this.Client = inClient;
}


function Presentation_Add( slide, note, number ){
	
	this.Slide[this.Slide.length] = slide;
	this.Notes[this.Notes.length] = note;
	this.SlideNumber[this.SlideNumber.length] = number;
}


function Presentation_AddPage( slide, note ){
	
	var uiUseSlideNumber = 1;
	if ( 0 < this.SlideNumber.length ){
		uiUseSlideNumber = parseInt( 1 + parseInt( this.SlideNumber[ this.SlideNumber.length - 1 ] ) );
	}
	this.Slide[this.Slide.length] = slide;
	this.Notes[this.Notes.length] = note;
	this.SlideNumber[this.SlideNumber.length] = uiUseSlideNumber;
}

function Presentation_AddSubPage( slide, note ){
	
	var uiUseSlideNumber = 1;
	if ( 0 < this.SlideNumber.length ){
		uiUseSlideNumber = this.SlideNumber[ this.SlideNumber.length - 1 ];
	}
	this.Slide[this.Slide.length] = slide;
	this.Notes[this.Notes.length] = note;
	this.SlideNumber[this.SlideNumber.length] = uiUseSlideNumber;
}



function Presentation_Start(){
	
	this.SlideNr = 0;
	//TODO: 
	//this.Show();
	this.ShowHtml();
}

function Presentation_init(){
	
	this.ShowHtml();
}

function Presentation_onclick(){
	//TODO
	window.open( Presentation.Notes[Presentation.i], '' );
}





