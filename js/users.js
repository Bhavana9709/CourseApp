$("#form_submit").click(function (event) {
    var data = $("#create-form").serialize();
    // console.log("hii");
    console.log(data);
    event.preventDefault();
    // $.ajax({
    //     data: data,
    //     method: "POST",
    //     url: "http://localhost/test/crud/index.php/site/register",
    //     context: document.body,

    // }).done(function (data) {
    //     //alert("success");
    //     //console.log(data);
    //     $("#regresult").html(data.data.message).css("font-color", "green");
    // }
    // );
});

$("#post-submit").click((e) => {
    e.preventDefault();
    var data = $("#post-form").serializeArray();
    console.log(data);
})