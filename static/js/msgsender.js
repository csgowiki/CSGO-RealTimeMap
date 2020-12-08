
$(document).ready(function() {
    $("#msg_btn").click(function() {
        if ($("#msg_input").val().length == 0) {
            $.toaster("聊天内容不能为空");
            return;
        }
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