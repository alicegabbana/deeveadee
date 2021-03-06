$( document ).ready(function() {
    $('.crudbutton').click(function() {
        var db = $(this).attr('id');
        crud_display(db);
    });
});

function crud_display(id) {
    var db = id;
    $.ajax({
        url: '/Admincontroller/crud',
        type: 'POST',
        data: {"db": db},
        success: function (data) {
            switch(db) {
                case "dvd":
                    resultsql = data.resultsql;
                    genres = data.genres;
                    break;
                case "emprunt":
                    resultsql = data.resultsql;
                    break;
                case "notes":
                    resultsql = data.resultsql;
                    break;
                case "remarques":
                    resultsql = data.resultsql;
                    break;
                default : resultsql = data;
            }
            $('#crud').empty();

            var mydata = eval(resultsql);
            var table = $.makeTable(mydata, db);
            $(table).appendTo("#crud");
            $('.cellule').each(function(){
                if($(this).attr("contentEditable") == true){
                    $(this).attr("contentEditable","false");
                } else {
                    $(this).attr("contentEditable","true");
                }
            });

            $('.crudfunction').each(function (index) {
                var tata = this.id.split("_");
                $(this).click(function () {
                    if (tata[0] == "update") {
                        crud_update(tata[2], tata[1],this);
                    } else if (tata[0] == "delete") {
                        crud_delete(tata[2], tata[1]);
                    }
                });
            });
        },
        error: function (data) {
            console.log("erreuuuuuuuuuuuuuuuuur" + data.toString());
        }
    });
}

function makeTable(mydata,db) {
    var table = $('<table class="col-md-12 text-center" border=1>');
    var tblHeader = "<tr>";
    for (var k in mydata[0]) tblHeader += "<th>" + k + "</th>";
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var id = index+1;
        var TableRow = "<tr id='ligne_"+id+"'>";
        var total = mydata.length;
        $.each(value, function (key, val) {
            TableRow += "<td class='cellule "+ db + "_"+ id +"_"+key+"'>" + val + "</td>";

        });
        TableRow += "<td><button  id='delete_"+ id + "_"+db+"' class='crudfunction glyphicon glyphicon-remove'></button><button id='update_"+ id + "_"+db+"' class='crudfunction glyphicon glyphicon-pencil'></button></td>";
        TableRow += "</tr>";
        if (index === total - 1) {
            $.each(value, function (key, val) {
                TableRow += "<td><input type='text'></td>";
            });
            TableRow += "<td><button id='add' class='glyphicon glyphicon-plus'></button></td>";
            TableRow += "</tr>";
            $(table).append(TableRow);
        } else {
            $(table).append(TableRow); }
    });
    return ($(table));
};

function crud_update(db,id) {
    var nligne = "#ligne_"+id+" .cellule";
    var data=[];
    $(nligne).each(function(index) {
        var className = $(this).attr('class').split("_");
        var myObj = {
            "name" : className[2],    //your artist variable
            "value" : $(this).text()   //your title variable
        };
        data.push(myObj);
    });
    $.ajax({
        url: '/Admincontroller/crud_update',
        type: 'POST',
        data: {data: data, db: db},
        success: function (data) {
            crud_display(data);
            console.log(data);
        },
        error: function (data) {
            console.log("erreuuuuuuuuuuuuuuuuur" + data.toString());
        }
    });
}

function crud_delete(db,id) {
    $.ajax({
        url: '/Admincontroller/crud_delete',
        type: 'POST',
        data : {"db": db, "id": id},
        success: function (data) {
            crud_display(data);
        },
        error: function (data) {
            console.log("erreuuuuuuuuuuuuuuuuur" + data.toString());
        }
    });
}