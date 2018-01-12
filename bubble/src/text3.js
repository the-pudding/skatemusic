/*

Code to create genre bubble chart

TODO

*/


function bubbleChart() {
  var margin = {top: 20, bottom: 20, left: 20, right: 20};
  var width = 1100 - margin.left - margin.right;
  var height = 650 - margin.top - margin.bottom;

  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('bubble_tooltip', 240);

  // DEFINE CENTERS FOR TOGGLE OPTIONS
  var center = { x: width / 2, y: height / 2 };

  var useCenters = {
    'high': { x: 285 + 30, y: height / 2 },
    'medium': { x: 470 + 30, y: height / 2 },
    'low': { x: 660 + 30, y: height / 2 }
  };

  var useTitleX = {
    'High': 200 + 30,
    'Medium': 480 + 30,
    'Low': 780 + 30
  };

  var genreCenters = {
    'Classic Rock': { x: width/7 + 80 + 30, y: height / 2 - 50},
    'Indie/Alternative': { x: width/7 + 80 + 30, y: 450 },
    'Hip Hop': { x: width/7*2.8 - 60 + 30, y: height / 2 - 50},
    'Electronic': { x: width/7*2.8 - 60 + 30, y: 450 },
    'Punk': { x: width/7*4 - 30, y: height / 2 - 50},
    'Metal': { x: width/7*4 - 90 + 30, y: 450 },
    'Other': { x: width/7*5 - 75 + 30, y: height / 2 - 75},
    'Jazz/Soul': { x: width/7*5 - 75 + 30, y: 450},
    'Rock': { x: width/7*5 - 75 + 50, y: height / 2 - 75}
  };

  var genreTitleX = {
    'Classic Rock': width/7 - 30 + 30,
    'Indie/Alternative': width/7 - 30 + 30,
    'Hip Hop': width/7*2.5 + 30,
    'Electronic': width/7 * 2.5 + 30,
    'Punk': width/7*4 + 10,
    'Metal': width/7 * 4 + 10,
    'Other': width/7 * 5.1 + 50,
    'Jazz/Soul': width/7 * 5.1 + 50,
    // 'Rock': width/7 * 5.1 + 70,

  };

  var genreTitleY = {
    'Classic Rock': 55,
    'Indie/Alternative': 430,
    'Hip Hop': 55,
    'Electronic': 430,
    'Punk': 55,
    'Metal': 430,
    'Other': 55,
    'Jazz/Soul': 430,
    // 'Rock': 55

  };

  // Used when setting up force and
  // moving around nodes
  var damper = 0.102;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Function to repel nodes
  function charge(d) {
    return -Math.pow(d.radius, 2) / 8;
  }

  // Initialize and configure force layout
  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);

  // Scale for node colors
  var bubbleColor = d3.scale.ordinal()
    .domain(['Classic Rock', 'Punk', 'Indie/Alternative', 'Metal', 'Hip Hop', 'Electronic', 'Jazz/Soul', 'Rock'])
    .range(['#fbb4ae', '#fddaec', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc','#b3cde3', 'red', '#f2f2f2']);

  // Scale for node sizes
  var radiusScale = d3.scale.pow()
    .exponent(1.8)  // exponent makes the graph 'tighter'
    .range([3.5, 70]);

  
   // Functiont to convert csv data to array of node objects
  function createNodes(rawData) {

    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.artist_total),
        value: d.artist_total,
        name: d.artist,
        group: d.group,
        genre: d.genre,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    // sort nodes prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

   // Function to prepare the rawData for visualization and add an svg element
   // to the provided selector and starts the visualization creation process.
  var chart = function chart(selector, rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number by converting it
    // with `+`.
    var maxAmount = d3.max(rawData, function (d) { return +d.artist_total; });
    radiusScale.domain([0, maxAmount]);

    nodes = createNodes(rawData);
    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles= svg.selectAll('bubble')
      .data(nodes, function (d) { return d.id; })
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('r', 0)
      .attr('fill', function (d) { return bubbleColor(d.genre); })
      .attr('stroke', function (d) { return d3.rgb(bubbleColor(d.genre)).darker(); })
      .attr('stroke-width', 5)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail)
      .call(force.drag);

    text = svg.selectAll("text.label")    
     .data(nodes, function (d) { return d.id; })
        .enter()
        .append("text")
        .attr("class", "label")
        // .text(function(d) { return d.name; });
        .text(function(d) {
          if (d.group == 'low') {
            return "";
          } else {
            return d.name;
          }
        });



    // Transition to fill bubblenodes
    bubbles.transition()
      .duration(4000)
      .attr('r', function (d) {return d.radius; });

    // Set initial layout to genre group.
    splitBubblesGenre();
  };


  function splitBubblesUse() {
    hideGenre();
    showUse();

    force.on('tick', function (e) {
      bubbles.each(moveToUse(e.alpha))
        .attr('cx', function (d) {return d.x; })
        .attr('cy', function (d) {return d.y; });

      text.attr("transform", function(d){ return "translate("+d.x+","+d.y+")"; });

    });

    force.start();
  };

  function splitBubblesGenre() {
    hideUse();
    showGenre();

    force.on('tick', function (e) {
      bubbles.each(moveToGenre(e.alpha))
        .attr('cx', function (d) {return d.x; })
        .attr('cy', function (d) {return d.y; });

    text.attr("transform", function(d){ return "translate("+d.x+","+d.y+")"; });

    });

    force.start();
  };


  function moveToUse(alpha) {
    return function (d) {
      var target = useCenters[d.group];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  };

  /*
   * Hides Year title displays.
   */
  function hideUse() {
    svg.selectAll('.title').remove();
  };

  /*
   * Shows Year title displays.
   */
  function showUse() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var useData = d3.keys(useTitleX);
    var use = svg.selectAll('.group')
      .data(useData);

    use.enter().append('text')
      .attr('class', 'title')
      .attr('x', function (d) { return useTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  function moveToGenre(alpha) {
    return function (d) {
      var target = genreCenters[d.genre];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  /*
   * Hides Year title displays.
   */
  function hideGenre() {
    svg.selectAll('.title').remove();
  }

  /*
   * Shows Year title displays.
   */
  function showGenre() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var genreData = d3.keys(genreTitleX);
    var genre = svg.selectAll('.genre')
      .data(genreData);

    genre.enter().append('text')
      .attr('class', 'title')
      .attr('x', function (d) { return genreTitleX[d]; })
      .attr('y', function (d) { return genreTitleY[d]; })
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black')
                    .attr('stroke-width', 2.4)
                    .attr('r', function (d) { return d.radius + 5; });

    var content = '<span class="name">Artist: </span><span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">Number of Times Used: </span><span class="value">' +
                  d.value +
                  '</span><br/>' +
                  '<span class="name">Genre: </span><span class="value">' +
                  d.genre +
                  '</span><br/>';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(bubbleColor(d.genre)).darker())
      .attr('stroke-width', 5)
      .attr('fill', function (d) { return bubbleColor(d.genre); })
      .attr('r', function (d) { return d.radius; });

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by year" modes.
   *
   * displayName is expected to be a string and either 'year' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName == 'use') {
      splitBubblesUse();
    } else {
      splitBubblesGenre();
    };
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {

      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

// Load the data.
d3.csv('data/new_small.csv', display);

// setup the buttons.
setupButtons();
