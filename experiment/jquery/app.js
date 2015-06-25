
$(initPage);

function initPage(){

      // function getName(personid) {
      //   var dynamicData = {};
      //   dynamicData["id"] = personID;
      //   return $.ajax({
      //     url: "getName.php",
      //     type: "get",
      //     data: dynamicData
      //   });
      // }

      // getName("2342342").done(function(data) {
      //   // Updates the UI based the ajax result
      //   $(".person-name").text(data.name); 
      // });


      // var list = $("#longlist");

      // list.on("mouseenter", "li", function(){
      //   $(this).text("Click me!");
      // });

      // list.on("click", "li", function() {
      //   $(this).text("Why did you click me?!");
      // });


    jQuery('#hic-line').on("keypress", function (e) {            
        if (e.keyCode == 13) {
            e.preventDefault(); 
            
            var target = $(e.target);
            var val = target.val();
            if(val){
                $('#history').append(
                    $('<div>').append(val)
                );
                target.val('');
            }

        }
    });

};