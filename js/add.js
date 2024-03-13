$("#adddata").click(function () {
    //var data=$("#user_form").serialize();
    let username = $("#name").val();
    let email = $("#email").val();
    let data = { User: { username, email } };
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/test/index.php/site/add",
        context: document.body,

    }).done(function (data) {
        console.log(data);
    }
    );
});