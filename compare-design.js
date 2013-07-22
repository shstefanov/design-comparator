 (function(){ 
  var filename = window.location.href.split("/").pop()
  if(filename==""){ var image = "index.png"; }
  else{ var image = filename.replace("html", "png"); }

  $ghost = $("<img style='z-index:0;display:none;' src = '"+image+"' />");
  $duplicator = $("<div style='z-index:2000;display:none;'></div>");

  $ghost.css({
    position:"absolute", top:"0px",  left:"0px",
    opacity: "0.5", display:"none"
  });
  $duplicator.css({
    width:$ghost.width()+"px",  height:$ghost.height()+"px",
    position:"absolute", top:"0px",  left:"0px"
  });
  var move=false, ghost_on = false;
  var start = {x:0,y:0}, element_start = {x:0,y:0};
  var shift = false;

  $(document)
  .mouseup(function(){move=false;})
  .keyup(function(e){
    if(e.keyCode == 16){
      $("body").css({overflow:"auto"});
      shift = false;
    }
  })
  .keydown(function(e){
    switch(e.keyCode){
      case 16: //Shift
        $("body").css({overflow:"hidden"});
        shift = true;
        break;
      case 27: //Escape
        $duplicator.css({ width:$ghost.css("width"), height:$ghost.css("height") });
        $duplicator.toggle();
        $ghost.toggle();
        ghost_on = !ghost_on;
        break;
      case 37://Arrow left
      case 39://Arrow right
        if(shift && ghost_on){
          var curx = parseInt($ghost.css("left").replace("px", ""))
          var deltax = e.keyCode - 38;
          $ghost.css({left:(curx+deltax)+"px"});
          $duplicator.css({left:(curx+deltax)+"px"});
        }
        break;
      case 38://Arrow down
      case 40://Arrow up
        if(shift && ghost_on){
          var cury = parseInt($ghost.css("top").replace("px", ""));
          var deltay = e.keyCode - 39;
          $ghost.css({top:(cury+deltay)+"px"});
          $duplicator.css({top:(cury+deltay)+"px"});
        }
        break;
    }//End switch
  }).mousemove(function(e){
    if(move){
      var deltax = e.pageX- start.x;
      var deltay = e.pageY- start.y;
      $ghost.css({ 
        left: (element_start.x+deltax)+"px",
        top: (element_start.y+deltay)+"px",
      });
      $duplicator.css({ 
        left: (element_start.x+deltax)+"px",
        top: (element_start.y+deltay)+"px",
      });
    }
  });
  $duplicator.mousedown(function(e){
    start = { x:e.pageX, y:e.pageY };
    element_start = {
      x: parseInt($duplicator.css("left").replace("px", "")),
      y: parseInt($duplicator.css("top").replace("px", ""))
    };
    move = true;
  });
  var handleMW = function(e){
    if(ghost_on && shift){
      var direction = e.wheelDelta>0? 0.05 : -0.05;
      var cur_opacity = parseFloat($ghost.css("opacity"));
      if(cur_opacity<=0.00 && direction<0){ var new_opacity = 0; }
      else if(cur_opacity>=1 && direction>0){ var new_opacity = 1; }
      else{ var new_opacity = cur_opacity+direction; }
      $ghost.css({"opacity":new_opacity+""});
    }
  };

  //Native mousewheel implementation
  var MWEvt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  //if IE (and Opera depending on user setting)
  if (document.attachEvent) document.attachEvent("on"+MWEvt, handleMW)
  //WC3 browsers
  else if (document.addEventListener) document.addEventListener(MWEvt, handleMW, false);
  $(document).ready(function(){$("body").append($ghost).append($duplicator);});
}());