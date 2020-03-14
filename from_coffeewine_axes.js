var x_axisData = [
    { "cx": 0, "cy": 0, "displayText":"midnight"},
    { "cx": 1, "cy": 0, "displayText":"7:30am"}];

// var y_axisData = [];

var x_axis_text = chart.selectAll("text")
                        .data(x_axisData)
                        .enter()
                        .append("text");

var x_axis_textLabels = x_axis_text
                 .attr("x", function(d) { return d.cx; })
                 .attr("y", function(d) { return d.cy; })
                 .text( function (d) { return d.displayText; })
                 .attr("text-anchor", "middle")
                 .attr("alignment-baseline", "middle")
                 .attr("font-family", "serif")
                 .attr("font-size", "2.1vw")
                 .attr("fill", "#aaa");

// var y_axis_text = chart.selectAll("text")
//                         .data(y_axisData)
//                         .enter()
//                         .append("text");
//
// var y_axis_textLabels = y_axis_text
//                  .attr("x", function(d) { return d.cx-cellsize; })
//                  .attr("y", function(d) { return d.cy*cellsize; })
//                  .text( function (d) { return d.displayText; })
//                  .attr("text-anchor", "end")
//                  .attr("alignment-baseline", "middle")
//                  .attr("font-family", "serif")
//                  .attr("font-size", "2.1vw")
//                  .attr("fill", "#aaa");
};
