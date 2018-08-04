

    //the following code get reference from: http://jsfiddle.net/SzR6h/25/
    $('.main').click(function() {
        var $el = $(this);

        // reset all
        $('.sub').slideUp("slow");
        $('.arrow').html("&#9654;");


        // set current
        $el.next('.sub').slideDown("slow");
        $('.arrow', $el).html("&#9660;");


    });

    // var initVal = [59, 90, 60, 60, 55];
    var proteinData = 0;
    var fatData = 0;
    var carbData = 0;
    var fiberData = 0;
    var sugarData = 0;
    var calciumData = 0;
    var vitaminData = 0;

    var proteinData_temp_1 = 0;
    var fatData_temp_1 = 0;
    var carbData_temp_1 = 0;
    var fiberData_temp_1 = 0;
    var sugarData_temp_1 = 0;
    var calciumData_temp_1 = 0;
    var vitaminData_temp_1 = 0;
    var energyData_temp_1 = 0;



    queue()
    // .defer(d3.json, "data/cerealData.json")
    .defer(d3.csv, "data/a1-cereals-mine.csv").await(function (error, data, root) {
        if (error) throw error;
        createCereal(data);
    });


    // var cereal_data;
    // d3.csv("data/a1-cereals-mine.csv", function(error, data){
    //     cereal_data = data;
    //     console.log(data);
    //     console.log(error);
    //
    // });



    var width = 800,
        height =800,
        padding = 10, // separation between same-color nodes
        clusterPadding = 20, // separation between different-color nodes
        maxRadius = 12;

    //reference: http://jsfiddle.net/cyril123/1ag52e8s/
    var nodeEachCluster=[20,20,20,20,20,20,20];
    var n = d3.sum(nodeEachCluster, function (d) {
        return d
    }); // total number of nodes
    var m = nodeEachCluster.length; // number of distinct clusters
    var color = d3.scale.category10()
        .domain(d3.range(m));

    // The largest node for each cluster.
    var clusters = new Array(m);

    var nodes = [];

    nodeEachCluster.forEach(function(cn,i){

        var r=6;
        for (var j=0;j<cn; j++){
            var d = {
                cluster: i,
                radius: r,
                x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
            };

            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            nodes.push(d);

        }

    });


    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.02)
        .charge(0)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("class", "cerealBowl")
        .attr("width", width)
        .attr("height", height);

    var g=svg.append("g");
    var img=g.append("svg:image")
        .attr("xlink:href", "images/bowl.jpg")
        .attr("x", width/7.5)
        .attr("y", height/10)
        .attr("height", 650)
        .attr("width", 650);



    var node = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .style("fill", "none")
        .style("stroke", function(d) { return color(d.cluster); })
        .style("stroke-width", 5)
        .style("opacity", 0.2)
        .call(force.drag);

    node.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
            var i = d3.interpolate(0, d.radius);
            return function(t) { return d.radius = i(t); };
        });

    function tick(e) {
        node
            .each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function(d) {
            var cluster = clusters[d.cluster];
            //console.log(d.cluster);
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }

    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

    function changeNodeCol(proteinData, fatData, carbData, fiberData, sugarData, calciumData, vitaminData){
        node.style("opacity", 0.2);



        node.filter(function(d){

            var fullColor=[];


            if((d.cluster == 0 && d.index >= 0 && d.index<Math.round(proteinData*0.2))||
                (d.cluster==1 && d.index>=20 && d.index<20+Math.round(fatData*0.2))||
                (d.cluster==2 && d.index>=40 && d.index<40+Math.round(carbData*0.2))||
                (d.cluster==3 && d.index>=60 && d.index<60+Math.round(fiberData*0.2))||
                (d.cluster==4 && d.index>=80 && d.index<80+Math.round(sugarData*0.2))||
                (d.cluster==5 && d.index>=100 && d.index<100+Math.round(calciumData*0.2))||
                (d.cluster==6 && d.index>=120 && d.index<120+Math.round(vitaminData*0.2))){
                fullColor.push(d.index);
            }else{
                fullColor.push(1000000);
            }

            return d.index==fullColor;
        })
            .style("opacity", "1");
    }


    function createCereal(data1){
         d3.selectAll("select[name=filter_val]").on("change", function(d){
            // value of selected radio
            var selectedValue = this.value;
            //holds the selected index
            var value = this.selectedIndex;
            proteinData+=data1[value].ProteinPer - proteinData_temp_1;
            fatData+=data1[value].FatPer - fatData_temp_1;
            carbData+=data1[value].CarbohydratesPer - carbData_temp_1;
            fiberData+=data1[value].FiberPer - fiberData_temp_1;
            sugarData+=data1[value].SugarsPer - sugarData_temp_1;
            calciumData+=data1[value].PotassiumPer - calciumData_temp_1;
            vitaminData+=data1[value].SodiumPer - vitaminData_temp_1;

            proteinData_temp_1 = data1[value].ProteinPer;
            fatData_temp_1 = data1[value].FatPer;
            carbData_temp_1 = data1[value].CarbohydratesPer;
            fiberData_temp_1 = data1[value].FiberPer;
            sugarData_temp_1 = data1[value].SugarsPer;
            calciumData_temp_1 = data1[value].PotassiumPer;
            vitaminData_temp_1 = data1[value].SodiumPer;
            // alert("The input value has changed. The new value is: " + proteinData );

            changeNodeCol(proteinData, fatData, carbData, fiberData, sugarData, calciumData, vitaminData);


        });


//reference:http://jsfiddle.net/UBf9y/
//http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6
//http://plnkr.co/edit/Yr1WKeuSXX6Ij0nfvEYu?p=preview
//http://jsbin.com/image-instead-of-radio-button/5/edit?html,css,output
//http://jsfiddle.net/cyril123/1ag52e8s/
//http://stackoverflow.com/questions/15229094/d3-append-an-image-with-svg-extension
//https://bl.ocks.org/mbostock/7881887



    }

function doSomething(data)
{
    debugger;
    alert("hello "+data);
   // var selected_cereal = data;
   //
   //  d3.csv("data/a1-cereals-mine.csv", function(error, data){
   //      cereal_data = data;
   //      var cereals = [];
   //      var man = [];
   //      data.forEach(function(d){
   //          cereals[d["Cereal"]] = 1;
   //          man[d["Manufacturer"]] = 1;
   //         d.Cereal == cereal_data
   //      });
   //
   //  var value = data;
   //
   //      d3.values(dataGroup).map(function(d) { return d.category; }).
   //
   //          proteinData+=data1[value].ProteinPer - proteinData_temp_1;
   //  fatData+=data1[value].FatPer - fatData_temp_1;
   //  carbData+=data1[value].CarbohydratesPer - carbData_temp_1;
   //  fiberData+=data1[value].FiberPer - fiberData_temp_1;
   //  sugarData+=data1[value].SugarsPer - sugarData_temp_1;
   //  calciumData+=data1[value].PotassiumPer - calciumData_temp_1;
   //  vitaminData+=data1[value].SodiumPer - vitaminData_temp_1;
   //
   //  proteinData_temp_1 = data1[value].ProteinPer;
   //  fatData_temp_1 = data1[value].FatPer;
   //  carbData_temp_1 = data1[value].CarbohydratesPer;
   //  fiberData_temp_1 = data1[value].FiberPer;
   //  sugarData_temp_1 = data1[value].SugarsPer;
   //  calciumData_temp_1 = data1[value].PotassiumPer;
   //  vitaminData_temp_1 = data1[value].SodiumPer;
   //  alert("The input value has changed. The new value is: " + proteinData );
   //
   //  changeNodeCol(proteinData, fatData, carbData, fiberData, sugarData, calciumData, vitaminData);
   //  };
};