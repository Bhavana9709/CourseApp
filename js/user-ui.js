$("#getdata").click(function () {
    // $("tr:even").css("background-color", "lightgray");
    // $("tr:odd").css("background-color", "lightblue");
    // $.ajax({
    //     method: "GET",
    //     url: "http://localhost/test/crud/index.php/my/getusers",
    //     context: document.body
    // }).done(function (data) {
    //     console.log(data);
    //     console.log("hii");
    //     let table = "<table>";
    //     let trElement = "";
    //     let thElement = "";
    //     let thFlag = true;
    //     data.forEach((row) => {
    //         console.log(row);
    //         trElement += "<tr>";
    //         Object.keys(row).forEach((el) => {
    //             if (thFlag) {
    //                 console.log(el);

    //                 thElement += `<th>${el}</th>`;

    //             }
    //             trElement += `<td>${row[el]}</td>`;
    //         });
    //         thFlag = false;
    //         trElement += '</tr>';
    //     });
    //     //console.log(trElement);
    //     table += `${thElement}${trElement}</table>`;

    //     $("#mycontent").html(`${table}`);
    // });


    var dtable = $("#mytable").DataTable({
        ajax: 'http://localhost/test/crud/index.php/my/getusers',
        columns: [
            { data: 'username' },
            { data: 'email' },
            { data: 'password' },
            { data: 'gender' },
            { data: 'language' },
            { data: 'country' },
            { data: 'city_name' },

            // {
            //     // data: '<a href="#">view</a>'
            //     //  data: null, title: 'Action', wrap: true, "render": function () { return '<div class="btn-group"> <a href="#">view</a></div>' }

            //     // data: null, title: 'Action', wrap: true, "render": function () { return '<div class="btn-group"> <button type="button" id="edit" onclick="myfunction(dtable)" value="0" class="btn btn-success" data-toggle="modal" data-target="create" >View</button></div>' }
            // }

            //{ data: '_id' },

        ]

    });
    // $("tr:even").css("background-color", "yellow");
    // $("tr:odd").css("background-color", "black");



});

// $('#mytable').on('click', 'tr', function () {
//     // $(this).toggleClass('selected');
//     $("tr:even").css("background-color", "lightgray");
//     $("tr:odd").css("background-color", "lightblue");

// });



// function myfunction(dtable) {
//     // console.log($this);
//     alert(dtable.rows('.selected').data().length + ' row(s) selected');

// }

// $('#edit').click(function () {

//     console.log("hii");
//     alert(dtable.rows('.selected').data().length + ' row(s) selected');
// });

$("#data").click(function () {
    let username = $("#name").val();
    let email = $("#email").val();
    let password = $("#password").val();

    let data = { User: { username, email, password } };
    console.log(data);
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/crud/index.php/my/createuser",
        context: document.body,

    }).done(function (data) {
        //console.log(data);
        //$("#result").html(data.message).css("background-color": "lightgray", "font-color": "pink");
    }
    );
});


$("#updatedata").click(function (event) {
    var data = $("#update-form").serialize();
    console.log("hii");
    console.log(data);
    event.preventDefault();
    //debugger;
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/crud/index.php/site/update",
        context: document.body,

    }).done(function (data) {
        //alert("success");
        console.log(data);
        $("#updateresult").html(data.data.message);
    }
    );
    // let id = $("#id").val();
    // let username = $("#name").val();
    // let email = $("#email").val();
    // let data = { User: { id, username, email } };
    // //console.log(data);
    // $.ajax({
    //     data: data,
    //     method: "POST",
    //     url: "http://localhost/test/crud/index.php/site/update",
    //     context: document.body,
    // }).done(function (data) {
    //     $("#result").html(data.message);
    //     //console.log(Response);
    //     $(document).ajaxSuccess(function () {
    //         //console.log(data);
    //     });
    //     //console.log(data);
    //     //alert("updated successfully");
    // });
});



$("#deletedata").click(function () {
    let username = $("#idd").val();
    //console.log(username);
    // if (!username) {
    //     alert("Id cannot be empty!!");
    // }
    // else {
    //     alert("User deleted successfully");
    // }
    let data = { User: { username } };
    console.log(data);
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/crud/index.php/my/deleteuser",
        context: document.body,
    }).done(function (data) {
        console.log(data);
        $("#delresult").html(data.data.message).css("background-color", "lightgray", "font-color", "pink");
    });
});

// $("#register").click(function () {
//     var data = $("#user-form").serialize();

//     console.log(data);
// });
$("#register").click(function (event) {
    var data = $("#user-form").serialize();
    // console.log("hii");
    // console.log(data);
    event.preventDefault();
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/crud/index.php/site/register",
        context: document.body,

    }).done(function (data) {
        //alert("success");
        //console.log(data);
        $("#regresult").html(data.data.message).css("font-color", "green");
    }
    );
});

$("#adminview").click(function (event) {
    event.preventDefault();
    var data = $("#project-form").serialize();
    // console.log(data);
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/crud/index.php/my/adminview",
        context: document.body,
    }).done(function (data) {
        // alert("success");
        // console.log(data.data);
        // $("#admincontent").html("xca");
        data = data.data;
        //console.log(data);
        // console.log("hii");
        let table = "<table id='admintable'>";
        let trElement = "";
        let thElement = "";
        let thFlag = true;
        data.forEach((row) => {
            // console.log(row);
            trElement += "<tr>";
            Object.keys(row).forEach((el) => {
                if (thFlag) {
                    // console.log(el);

                    thElement += `<th>${el}</th>`;

                }
                trElement += `<td>${row[el]}</td>`;
            });
            thFlag = false;
            trElement += '</tr>';
        });
        //console.log(trElement);
        table += `${thElement}${trElement}</table>`;

        $("#admincontent").html(`${table}`);
        // $("tr:even").css("background-color", "yellow");
        $("tr:odd").css("background-color", "lightgray");
        $("th").css("font-size", "16px", "font-family", "serif");
    });

});

$("#send").click(function (event) {
    event.preventDefault();
    var data = $("#sqs-form").serialize();
    // console.log(data);
    $.ajax({
        data: data,
        method: "POST",
        url: "http://localhost/test/crud/index.php/my/sendsqs",
        context: document.body,
    }).done(function (data) {
        console.log("ok");
    });
});

$("#getqueue").click(function (event) {
    event.preventDefault();
    $.ajax({
        method: "POST",
        url: "http://localhost/test/crud/index.php/my/getsqs",
        context: document.body,
    }).done(function (data) {
        // console.log(data);
    });
});