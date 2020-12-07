
$(document).ready(function() {
    $("#msg_btn").click(function() {
        $.ajax({
            async: false, url: "/ajax-api/webmsg", type: "post",
            dataType: "json",
            data: {"msg": $("#msg_input").val()},
            success: function(data) {}
        })
        $("#msg_input").val("");        
    })
    $("#msg_input").keydown(function() {
        if (event.keyCode == "13") {
            $("#msg_btn").click();
        }
    })
})