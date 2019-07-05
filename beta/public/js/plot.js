// https://www.d3-graph-gallery.com/graph/density_slider.html

function returnCurrAlpha(data, curr_eps) {
  var curr_data = new Array();
  var ll = data[curr_eps].store['x'].length;
  var i;
  for (i=0; i<ll; i++) {
    curr_data.push({
      x: data[curr_eps].store['x'][i],
      alphaPI: data[curr_eps].store['alphaPI'][i],
      gt: data[curr_eps].store['gt'][i],
      mu: data[curr_eps].store['mu'][i],
      sig: data[curr_eps].store['sig'][i],
      mu_plus: data[curr_eps].store['mu_plus']
    });
  }
  return curr_data;
}

function returnPoints(data, curr_eps) {
  var pts = data[curr_eps].store.points;
  var mu_plus = data[curr_eps].store['mu_plus'];
  var num_pts = pts.length;
  var combination = new Array();
  for (var i = 0; i < num_pts; i++) {
    var ll = pts[i]['x_linspace'].length;
    var gaus_plots = new Array;
    for (var j = 0; j < ll; j++) {
      gaus_plots.push({
        x_linspace: pts[i]['x_linspace'][j],
        y_linspace: pts[i]['y_linspace'][j],
      });
    }
    var end = pts[i]['x_linspace'].length;
    var start = pts[i]['mu_plus_ix'];
    var pi_areas = new Array;
    for (var j = start; j < end; j++) {
      pi_areas.push({
        x_linspace: pts[i]['x_linspace'][j],
        y_linspace: pts[i]['y_linspace'][j],
        mu_line_part: mu_plus,
      });
    }
    combination.push( {
      gaus_plots: gaus_plots,
      pi_areas: pi_areas,
    });
  }
  return combination;
}


// get the data
d3.json("data/pi_cdf.json", function(data) {
  console.log('Logging json read!')
  console.log(data);

  var curr_eps = "0";
  var curr_data = returnCurrAlpha(data, curr_eps);

  // ---------------------------

  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 30, left: 50},
  width = 460 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;
  // append the svg object to the body of the page
  var svg = d3.select("#Teaser1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  // add the x Axis
  var x = d3.scaleLinear()
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.x;
            })])
            .range([0, width]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  // add the y Axis
  var y = d3.scaleLinear()
            .domain([1e-100, d3.max(curr_data, function(d, i) {
              return d.alphaPI;
            })])
            .range([height, 0]);
  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
  // Textual Content
  svg.append("text")
    .attr("id", "plot1title")
    .attr("class", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text("$$\\alpha_{PI} for \\epsilon = " + data[curr_eps].eps + "$$");
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("Alpha PI");
  svg.append("text") // text label for the x axis
    .attr("class", "label")
    .attr("x", width / 2 )
    .attr("y", height + margin.bottom )
    .text("X");
  // Plot the area
  var curve = svg
    .append('g')
    .append("path")
      .attr("class", "pi")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d['x']); })
          .y(function(d) { return y(d['alphaPI']); })
      );
  var curve_1 = svg
    .append('g')
    .append("path")
      .attr("class", "pi_fill")
      .datum(curr_data)
      .attr("d",  d3.area()
        .x(function(d) { return x(d['x']); })
        .y1(function(d) { return y(d['alphaPI']); })
        .y0(function(d) { return y(0.0); })
      );

  // A function that update the chart when slider is moved?
  function updateChart1(curr_eps) {
    // recompute density estimation
    console.log("Graph1 Eps Selected: "+ data[curr_eps].eps);
    var curr_data = returnCurrAlpha(data, curr_eps);
    // update title
    var xx = document.getElementById("plot1title");
    xx.text = "$$\\alpha_{PI} for \\epsilon = " + data[curr_eps].eps + "$$";
    y.domain([1e-100, d3.max(curr_data, 
      function(d, i) {
        return d.alphaPI;
      })]
    );
    // update the chart  
    // update y scale
    var svvg = d3.select("#Teaser1").transition();
    console.log(svvg);
    // Make the changes
    svvg.select(".y.axis") // change the y axis
        .duration(750)
        .call(y);
    curve
      .datum(curr_data)
      .transition()
      .duration(1000)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d['x']); })
          .y(function(d) { return y(d['alphaPI']); })
      );

    curve_1
      .datum(curr_data)
      .transition()
      .duration(1000)
      .attr("d",  d3.area()
        .x(function(d) { return x(d['x']); })
        .y1(function(d) { return y(d['alphaPI']); })
        .y0(function(d) { return y(0.0); })
      );  
  }

  // ------------------------------


  // Same margins
  // append the svg object to the body of the page
  var svg2 = d3.select("#Teaser2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  // add the x Axis
  var x2 = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.x;
            })]);
  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));
  // add the y Axis
  var y2 = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(curr_data, function(d, i) {
              return d.gt;
            })]);
  svg2.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
  // Textual Content
  svg2.append("text")
    .attr("id", "plot2title")
    .attr("class", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text("Compare");
  svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "label")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("$f(x) // 2 axis$");
  svg2.append("text") // text label for the x axis
    .attr("class", "label")
    .attr("x", width / 2 )
    .attr("y", height + margin.bottom )
    .text("X");
  // Plot the gt/////
  var curve2 = svg2
    .append('g')
    .append("path")
      .attr("class", "unfilled")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['gt']); })
      );

  // Plot the gp
  var curve3 = svg2
    .append('g')
    .append("path")
      .attr("class", "unfilledgt")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['mu']); })
      );
  var curve4 = svg2
    .append('g')
    .append("path")
      .attr("class", "filledgt")
      .datum(curr_data)
      .attr("d",  d3.area()
          .x(function(d) { return x2(d['x']); })
          .y1(function(d) { return y2(d['mu'] + d['sig']); })
          .y0(function(d) { return y2(d['mu'] - d['sig']); })
      );

  // Plotting the mu_plus or f(x^+) line
  var curve5 = svg2
    .append('g')
    .append("path")
      .attr("id", "mu_plus")
      .datum(curr_data)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['mu_plus']); })
      );

  // plotting the points
  var combination = returnPoints(data, curr_eps);
  var len = combination.length;
  // setting color
  var color = d3.scaleOrdinal()
    .domain([...Array(len).keys()])
    .range(d3.schemeDark2);
  // actually ploytting
  var arrp = new Array;
  var arrg = new Array;
  for (var i = 0; i < len; i++) {
    var pi_areas = combination[i].pi_areas;
    var gaus_plots = combination[i].gaus_plots;
    // plotting the areas
    arrp.push (
      svg2
        .append('g')
        .append("path")
          .attr("class", "pi_areas")
          .attr("stroke", color(i))
          .attr("fill", color(i))
          .datum(pi_areas)
          .attr("d",  d3.area()
            .x(function(d) { return x2(d.x_linspace); })
            .y1(function(d) { return y2(d.y_linspace); })
            .y0(function(d) { return y2(d.mu_line_part); })
          )
    );
    // plotting the gaussi
    arrg.push (
      svg2
        .append('g')
        .append("path")
          .attr("class", "gaus_plots")
          .attr("stroke", color(i))
          .datum(gaus_plots)
          .attr("d",  d3.line()
            .x(function(d) { return x2(d.x_linspace); })
            .y(function(d) { return y2(d.y_linspace); })
          )
    );
  }


  // A function that update the chart when slider is moved?
  function updateChart2(curr_eps) {
    // recompute density estimation
    var curr_data = returnCurrAlpha(data, curr_eps);
    curve5
      .datum(curr_data)
      .transition()
      .duration(1000)
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x2(d['x']); })
          .y(function(d) { return y2(d['mu_plus']); })
      );

      // plotting the points
      var combination = returnPoints(data, curr_eps);
      var len = combination.length;
      // setting color
      var color = d3.scaleOrdinal()
        .domain([...Array(len).keys()])
        .range(d3.schemeDark2);
      // actually ploytting
      var arr = new Array;
      for (var i = 0; i < len; i++) {
        var pi_areas = combination[i].pi_areas;
        // plotting the areas
        arrp[i]
          .datum(pi_areas)
          .transition()
          .duration(1000)
              .attr("d",  d3.area()
                .x(function(d) { return x2(d.x_linspace); })
                .y1(function(d) { return y2(d.y_linspace); })
                .y0(function(d) { return y2(d.mu_line_part); })
          );
      }
  }

  d3.select("#slider").on("change", function(d){
    selectedValue = this.value
    updateChart1(selectedValue);
    updateChart2(selectedValue);
  })
});
    