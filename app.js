// Create the URL 
const stocksurl = "./Stocks_clean.csv";
const gdpurl = "./GDP_clean.csv";

// Create a function to contain all the code that will need to happen each time the dropdown changes. 
function createChart(id, type){
    if(type == 1){
        d3.csv(stocksurl).then(function(data){
            // Filter the data for only the selected ID
            const filteredData = data.map(function(d) {
                return {
                "Date": d['date'],
                "Value": d[id]
                };
            });

            // Create the trace for the line chart
            var trace = {
                x: filteredData.map(function(d) { return d.Date; }),
                y: filteredData.map(function(d) { return d.Value; }),
                type: 'line',
                line: {
                    color: getRandomColor()
                }
            };

            // Create the data array for the plot
            var data1 = [trace];

            // Configuring the layout of the line chart
            var layout = {
                title: id+ " Stock Price",
                xaxis: { title: "Date" },
                yaxis: { title: "Price" },
                width: 900,
                height: 600
            };

            // Plotting the line chart
            Plotly.newPlot("line", data1, layout);

    });} else if(type == 3) {
        d3.csv(gdpurl).then(function(data){
          // get the x-axis limits using d3.extent
        var xLimits = d3.extent(data, function(d) { return d.date; });

        // create a Plotly trace for the GDP data
        var trace1 = {
            x: data.map(function(d) { return d.date; }),
            y: data.map(function(d) { return d.GDP; }),
            mode: 'lines',
            name: 'GDP'
        };

        // create a Plotly layout with x-axis range set to the date extent
        var layout = {
            xaxis: {
            range: xLimits
            },
            yaxis: {
            title: 'GDP'
            },
            width: 900,
            height: 600
        };

        // create the Plotly chart
        Plotly.newPlot('gdp', [trace1], layout);

    })}else if(type == 2){
        d3.csv(stocksurl).then(function(stocks) {
            const companies = ["Microsoft", "Apple", "Amazon", "IBM", "Nike"];
            const traces = [];
          
            companies.forEach(function(company) {
              const trace = {
                x: stocks.map(function(d) { return d.date; }),
                y: stocks.map(function(d) { return d[company]; }),
                type: "scatter",
                mode: "lines",
                name: company
              };
              traces.push(trace);
            });
          
            d3.csv(gdpurl).then(function(gdp) {
                var validGdpDates = new Set(stocks.map(function(d) { return d.date; }));
                gdp = gdp.filter(function(d) { return validGdpDates.has(d.date); });
              const gdpTrace = {
                x: gdp.map(function(d) { return d.date; }),
                y: gdp.map(function(d) { return d.GDP; }),
                type: "scatter",
                mode: "lines",
                name: "GDP",
                yaxis: 'y2'
              };
              const layout = {
                updatemenus: [
                  {
                    buttons: [
                      {
                        method: 'update',
                        args: [{'visible': [true, false, false, false, false, false]}, {'title': 'Microsoft'}],
                        label: 'Microsoft'
                      },
                      {
                        method: 'update',
                        args: [{'visible': [false, true, false, false, false, false]}, {'title': 'Apple'}],
                        label: 'Apple'
                      },
                      {
                        method: 'update',
                        args: [{'visible': [false, false, true, false, false, false]}, {'title': 'Amazon'}],
                        label: 'Amazon'
                      },
                      {
                        method: 'update',
                        args: [{'visible': [false, false, false, true, false, false]}, {'title': 'IBM'}],
                        label: 'IBM'
                      },
                      {
                        method: 'update',
                        args: [{'visible': [false, false, false, false, true, false]}, {'title': 'Nike'}],
                        label: 'Nike'
                      },
                      {
                        method: 'update',
                        args: [{'visible': [false, false, false, false, false, true]}, {'title': 'GDP'}],
                        label: 'GDP'
                      },
                      {
                        method: 'update',
                        args: [{'visible': [true, true, true, true, true, true]}, {'title': 'All lines'}],
                        label: 'All'
                      },
                    ],
                    direction: 'down',
                    showactive: true,
                    x: 0.05,
                    y: 1.2
                  }
                ],
                title: "Stocks and GDP",
                xaxis: {
                  title: "Date"
                },
                yaxis: {
                  title: "Stock Price",
                  side: "left"
                },
                yaxis2: {
                  title: "GDP",
                  side: "right",
                  overlaying: "y"
                },
                width: 900,
                height: 600
              };
              Plotly.newPlot("chart", traces.concat(gdpTrace), layout);
            });
          });
    };
};


// Function called when changing dropdown menu
function optionChanged(id, value){

    // Call the createChart function to create the new charts with the new ID
    createChart(id, value);
}

function getRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
};