var cereal_data;
d3.csv("data/a1-cereals-mine.csv", function(error, data){
    cereal_data = data;
    console.log(data);
    console.log(error);
    //var keys = Object.keys(foo);
    var cereals = [];
    var man = [];
    data.forEach(function(d){
        cereals[d["Cereal"]] = 1;
        man[d["Manufacturer"]] = 1;
    });
    var labels = Object.keys(cereals);
    var man_labels = Object.keys(man);
    console.log(labels);
    var dropdown = document.getElementById("cereal_name");
    var contents = "";
    labels.forEach(function(label){
        contents += "<option value='" + label + "'>" + label + "</option>";
    })
    dropdown.innerHTML = contents;
    var m_dropdown = document.getElementById("manufacturer_name");
    contents = "";
    man_labels.forEach(function(label){
        contents += "<option value='" + label + "'>" + label + "</option>";
    })
    m_dropdown.innerHTML = contents;
//    document.getElementById("category").innerHTML = "<option></option>";
});

