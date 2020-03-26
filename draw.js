var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var margin = {top: 30, right: 50, bottom: 30, left: 90},
    width = 600,
    height = 600;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var svg = d3.select("#plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " +(height + margin.top + margin.bottom))
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

var getMinutesZeroed = function(dt) {
  return (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
}

var getSecondsZeroed = function(dt) {
  return (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();
}

//put a border around the chart
svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("stroke-width", 1)
      .attr("stroke", "white")
      .attr("stroke-opacity", 0.3)
      .attr("fill", "none");

d3.tsv("light_times.tsv", function(error, data) {
    var firstDate = new Date(data[0].Time);
    var lastDate = new Date(data[data.length-1].Time);
    var numDaysRecorded = date_diff_indays(firstDate, lastDate);
    var markHeight = height*1.0/(numDaysRecorded+1);

  if (error) throw error;


  // // Add the points!
  svg.selectAll(".lightline")
      .data(data)
      .enter().append("line")
      .attr("class", "lightline")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 1)
      .attr("stroke", "#a3fca2")
      .attr("x1", function(d) {
          //Gotta coerce from string (in "Time column") to actual Date object
          temp_date = new Date(d.Time);
          //Hilarious formula for a 0–1 decimal of the time as a percentage of the day. Acts as the x coordinate when multiplied by the chart's width.
          var frac_of_day = (temp_date.getHours()/24.0) + (temp_date.getMinutes()/1440.0) + (temp_date.getSeconds()/86400.0);
          frac_of_day = frac_of_day*(24/7.5); //stretch first 7.5 hour period to whole 0–1
          return (frac_of_day*width);
      })
      //Would be nice if I could set x2=x1 for vertical line, but gotta repeat
      .attr("x2", function(d) {
          // This just repeats the function console.logged above
          temp_date = new Date(d.Time);
          //Hilarious formula for a 0–1 decimal of the timestamp as a percentage of the day. Acts as the x coordinate when multiplied by the chart's width.
          var frac_of_day = (temp_date.getHours()/24.0) + (temp_date.getMinutes()/1440.0) + (temp_date.getSeconds()/86400.0);
          frac_of_day = frac_of_day*(24/7.5); //stretch first 7.5 hour period to whole 0–1
          return (frac_of_day*width);
      })
      .attr("y1",  function(d) {
          //the lines evenly space the chart by stacking days
          //find y-start by multiplying the number of days since the start by the fraction each day should take of the vertical space
          return markHeight*(date_diff_indays(firstDate, d.Time));
      } )
      .attr("y2",   function(d) {
          return (markHeight*(date_diff_indays(firstDate, d.Time))+markHeight);
      })
      .on("mouseover", function(d) {
            temp_date = new Date(d.Time);
            div.transition()
                .duration(50)
                .style("opacity", .9);
            div	.html(temp_date.getHours() + ":" + getMinutesZeroed(temp_date) + ":" + getSecondsZeroed(temp_date))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY-30) + "px");
                // this.parentNode.parentNode.appendChild(this.parentNode);//the path group is on the top with in its parent group
                // this.parentNode.parentNode.parentNode.appendChild(this.parentNode.parentNode);//the parent group is on the top with in its parent group
                d3.select(this).style('stroke', 'white');
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(50)
                .style("opacity", 0);
                d3.select(this).style('stroke', '#a3fca2');

        });

      //x-axis (times)
      var x_axisData = [
          { "cx": 0, "cy": -10, "displayText":"12am"},
          { "cx": (2/7.5)*width, "cy": -10, "displayText":"2am"},
          { "cx": (4/7.5)*width, "cy": -10, "displayText":"4am"},
          { "cx": (6/7.5)*width, "cy": -10, "displayText":"6am"},
          { "cx": width, "cy": -10, "displayText":"7:30am"}];


      var x_axis_text = svg.selectAll("text")
                              .data(x_axisData)
                              .enter()
                              .append("text");

      var x_axis_textLabels = x_axis_text
                       .attr("x", function(d) { return d.cx; })
                       .attr("y", function(d) { return d.cy; })
                       .text( function (d) { return d.displayText; })
                       .attr("text-anchor", "middle")
                       .attr("alignment-baseline", "bottom")
                       .attr("font-family", "sans-serif")
                       .attr("font-size", "16px")
                       .attr("fill", "#bbb");
      //y-axis (day names)
      var y_axis_text = svg.selectAll("text")
                               .data(data)
                               .enter()
                               .append("text");

      var y_axis_textLabels = y_axis_text
                        .attr("x", -10)
                        .attr("y", function (d) {
                            return (markHeight*(date_diff_indays(firstDate, d.Time))+(0.5*markHeight));
                        })
                        .text( function (d) {
                            //TODO: parse day of the week, month name, from MM/DD/YYYY
                            temp_date = new Date(d.Time);
                            return (dayNames[temp_date.getDay()]+ " " + (temp_date.getMonth()+1) + " / " + temp_date.getDate());
                        })
                        .attr("text-anchor", "end")
                        .attr("alignment-baseline", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "16px")
                        .attr("fill", "#bbb")
                        .attr("stroke", "#47140f")
                        .attr("stroke-width", "10px");


        });
