
function makeTable(data, columns) {
	// columns MUST be the same length as the number of features in the dataset
	var searchBar = d3.select('body').append("div").attr("class", "SearchBar")
	var table = d3.select('body').append('div').attr('class', 'table');
	var thead = table.append('div').attr('class', 'tr th');
	var	tbody = table.append('div').attr('class', 'tbody');

	// Save column names for column creation
	var dataFeatures = d3.keys(data[0]);

	// Create dictionary to track true column names for sorting later
	// i.e.; {'columns[i] : dataFeatures[i]}
	var colDict = {};
	for (var i=0; i<columns.length; i++) {
	    colDict[columns[i]] = dataFeatures[i];
	};
	// keep track of sort order
	var sortAscending = true;

	var barScalePercent = d3.scale.linear()
		.domain([0,.20])
		.range([5,100]);
	var barScaleGenre = d3.scale.linear()
		.domain([10,2060])
		.range([5,100]);
	var barScaleArtist = d3.scale.linear()
		.domain([0,70])
		.range([5,100]);

	// append the header row
	thead.selectAll('div')
	  .data(columns).enter()
	  .append('div')
	  .attr('class', 'td')
	  .attr('style', 'justify-content: left;')
	  .attr('featureName', function (column) { return column; })
	  .text(function (column) { return column; });

	// create a row for each object in the data
	var rows = tbody.selectAll('div')
	  .data(data)
	  .enter()
	  .append('div')
	  .attr('class', 'tr');

	// create a cell in each row for each column
	var cells = rows.selectAll('div')
	  .data(function (row) {
	    return dataFeatures.map(function (columnName) {
	      return {col: columnName, value: row[columnName]};
	    });
	  })
	  .enter()
	  .append('div')
	  .attr('class', 'td')
	  .attr('style', 'justify-content: left;')
	  .text(function (d) { return d.value; })
	  .append('svg')
	  .attr('height', 10)
	  .attr('width', 100)
	  .append("rect")
      .attr("height", 8)
      .attr('width', function(d) {
      	if (isNaN(d.value)) {
      		return 0;
      	} else {
      		if (d.col == 'percent'){ 
      			return barScalePercent(d.value);
      		} else if (d.col == 'art_count'){
      			return barScaleArtist(d.value);
      		} else if (d.col == 'count') {
      			return barScaleGenre(d.value);
      		} else {
      			return 0;
      		};
      	};
      })
      .attr('fill', 'coral');

     // Search
	searchBar.append("p")
	    .attr("class", "SearchBar")
	    .text("Search By Title:");

	d3.select(".SearchBar")
	  .append("input")
	    .attr("class", "SearchBar")
	    .attr("id", "search")
	    .attr("type", "text")
	    .attr("placeholder", "Search...");

	d3.select("#search")
      .on("keyup", function() { // filter according to key pressed 
        var searched_data = data,
            text = this.value.trim();
            console.log(text);

        var searchResults = searched_data.map(function(r) {
          var regex = new RegExp("^" + text + ".*", "i");
          if (regex.test(r.artist)) { // if there are any results
            return regex.exec(r.artist)[0]; // return them to searchResults
          } ;
        });

        // filter blank entries from searchResults
        searchResults = searchResults.filter(function(r){ 
          return r != undefined;
        });

        // filter dataset with searchResults
        searched_data = searchResults.map(function(r) {
           return data.filter(function(p) {
            return p.artist.indexOf(r) != -1;
          });
        });

        // flatten array 
		searched_data = [].concat.apply([], searched_data);
		console.log(searched_data);

		// data bind with new data
		rows = rows.data(searched_data, function(d){ return d.genre2});
		console.log(rows);

		
        // enter the rows
        rows.enter()
         .append('div')
	  	 .attr('class', 'tr');


        // enter td's in each row
        var cells = rows.selectAll('div')
		  .data(function (row) {
		    return dataFeatures.map(function (columnName) {
		      return {col: columnName, value: row[columnName]};
		    });
		  })
		  .enter()
		  .append('div')
		  .attr('class', 'td')
		  .attr('style', 'justify-content: left;')
		  .text(function (d) { return d.value; })
		  .append('svg')
		  .attr('height', 10)
		  .attr('width', 100)
		  .append("rect")
	      .attr("height", 8)
	      .attr('width', function(d) {
	      	if (isNaN(d.value)) {
	      		return 0;
	      	} else {
	      		if (d.col == 'percent'){ 
	      			return barScalePercent(d.value);
	      		} else if (d.col == 'art_count'){
	      			return barScaleArtist(d.value);
	      		} else if (d.col == 'count') {
	      			return barScaleGenre(d.value);
	      		} else {
	      			return 0;
	      		};
	      	};
	      })
	      .attr('fill', 'coral');
        
        // exit
        rows.exit().remove();
      // })

        });


	// highlight rows on hover
	d3.selectAll('.tbody .tr')
		.on('mouseover', function() {
			d3.select(this)
		      // .style('background-color', '#e8eff9');
		      .style('background-color', '#f1eef6');
			})
		.on('mouseout', function() {
			d3.select(this)
			  .style('background-color', '#ffffff');
		});

	// Sort columns on click
	d3.selectAll('.th .td')
	  .on("click", function() {
	  	// Identify column header's true name
	  	var colName = d3.select(this)[0][0]['__data__'];
	  	var dataName = colDict[colName];
	  	if (sortAscending) {
	  		rows.sort(function(a, b) { 
	  			if (!isNaN(a[dataName])) { // sort numeric columns
		    		return b[dataName] - a[dataName];
			    } else { // sort text columns
			    	return d3.ascending(b[dataName], a[dataName]);
			    };
		    });
		    sortAscending = !sortAscending;
	  	} else {
	  		rows.sort(function(a, b) { 
		    	if (!isNaN(a[dataName])) { // sort numeric columns
		    		return a[dataName] - b[dataName];
			    } else { // sort text columns
			    	return d3.ascending(a[dataName], b[dataName]);
			    }; 
		    });
		    sortAscending = !sortAscending;
	  	};
    
  });

  return table;
}

// Throw data into function and create table
d3.json('genre_table_data.json', function (error,data) {
	// create table
	makeTable(data, ['Genre', 'Top Artist', 'Artist Count', 'Frequency']);

});

