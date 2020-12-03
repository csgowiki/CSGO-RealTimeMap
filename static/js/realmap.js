function draw(data) {
   var test = document.getElementById("test");
   var new_x = parseFloat(data.cx);
   var new_y = parseFloat(data.cy);
   var origin_x = parseFloat(test.getAttribute("cx"));
   var origin_y = parseFloat(test.getAttribute("cy"));
   test.setAttribute("cx", (origin_x + (new_x - origin_x) / 50).toString() + "px");
   test.setAttribute("cy", (origin_y + (new_y - origin_y) / 50).toString() + "px");
}

function drawUtility(data){
   let start = Date.now();
   let timer = setInterval(function() {
      let timePassed = Date.now() - start;
      if (timePassed >= 1000) {
         clearInterval(timer);
         return;
      }
      draw(data)
   }, 20);
}

$(function(){
   window.setInterval(function() {
      $.ajax({
         async: false,
         url: "/api/ajax_update",
         type: "get",

         success(data) {
            drawUtility(data);
         }
      })
   }, 1000);
})