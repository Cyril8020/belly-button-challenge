// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id === parseInt(sample));
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use .html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var resultArray = samples.filter(sampleObj => sampleObj.id === sample);
    var result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      showlegend: false
    };

    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Sample Value" },
      yaxis: { title: "OTU ID", tickmode: "array", tickvals: [] }
    };

    // Slice and reverse the data to get the top 10 values for the bar chart
    var topSampleValues = sample_values.slice(0, 10).reverse();
    var topOtuIds = otu_ids.slice(0, 10).reverse().map(otuId => `OTU ${otuId}`);
    var topOtuLabels = otu_labels.slice(0, 10).reverse();

    var barData = [{
      type: "bar",
      x: topSampleValues,
      y: topOtuIds,
      text: topOtuLabels,
      orientation: "h"
    }];

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  // Fetch the data from the provided URL
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field (sample names)
    var sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sample) => {
      dropdownMenu.append("option")
                  .text(sample)  // Set the option text to the sample name
                  .property("value", sample);  // Set the option value to the sample name
    });

    // Get the first sample from the list
    var firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Call the init function to initialize the page
init();

// Function to handle a change in the dropdown selection
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);  // Rebuild the charts for the selected sample
  buildMetadata(newSample); // Rebuild the metadata panel for the selected sample
}


