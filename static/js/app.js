d3.json('samples.json').then(function (data) {
  console.log(data)
  // data.metadata has demographic information
  // data.names has the subject id no
  // data.samples have the sample values, otu_id, otu_output and subject id

  //   Now, we add the subject id to the dropdown for the user to select from
  var dropdown = d3.select('select')
  data.names.forEach(id => {
    dropdown.append('option').text(id)
  })

  // capture the dropdown change
  dropdown.on('change', showData)

  // We need to add demographic info , plotly graphs on changing the Input in the dropdown
  // Formulating a function for it to be done at once
  function showData () {
    d3.event.preventDefault()
    // get value of the option selected in the dropdown
    var id = dropdown.property('value')
    // now we add meta data or demographic data to the panel body
    var demo_data = data.metadata
    var panel_body = d3.select('#sample-metadata')
    demo_data.forEach(function (demo_item) {
      if (demo_item.id === parseInt(id)) {
        // console.log('here!!')
        panel_body.html('')
        panel_body.append('p').text(`Id : ${demo_item.id}`)
        panel_body.append('p').text(`Age : ${demo_item.age}`)
        panel_body.append('p').text(`BBType : ${demo_item.bbtype}`)
        panel_body.append('p').text(`Ethnicity : ${demo_item.ethnicity}`)
        panel_body.append('p').text(`Gender : ${demo_item.gender}`)
        panel_body.append('p').text(`Location : ${demo_item.location}`)
        panel_body.append('p').text(`WFreq : ${demo_item.wfreq}`)
      }
    })

    // now let's plot bar and bubble charts
    var sample_data = data.samples
    sample_data.forEach(function (sample_item) {
      if (sample_item.id === id) {
        // Get only top 10 (array is already in descending order by sample values )
        var otu_ids_10 = sample_item.otu_ids.slice(0, 10)
        // add OTU string infront of each id
        otu_ids_array_10 = otu_ids_10.map(id => 'OTU ' + id)
        console.log(otu_ids_array_10)
        // get related sample values
        var sample_values_10 = sample_item.sample_values.slice(0, 10)

        // Bar chart
        var bar_trace = {
          x: sample_values_10,
          y: otu_ids_array_10,
          type: 'bar',
          orientation: 'h'
        }

        var bar_layout = {
          title: 'Top 10 Bacteria Cultures Found',
          xaxis: { title: 'Sample Value' },
          yaxis: { title: 'OTU ID' }
        }

        Plotly.newPlot('bar', [bar_trace], bar_layout)

        // Bubble chart

        var otu_ids = sample_item.otu_ids
        // get related sample values
        var sample_values = sample_item.sample_values
        // get related otu labels
        var otu_labels = sample_item.otu_labels

        // setup data for bubble chart
        var bubble_trace = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            size: sample_values,
            color: otu_ids,
            sizemode: 'area',
            sizeref: 0.15
          }
        }
        var bubble_layout = {
          title: 'Bacteria Cultures per Sample',
          xaxis: { title: 'OTU ID' },
          yaxis: { title: 'Sample Value' },
          height: 500,
          width: 600
        }

        Plotly.newPlot('bubble', [bubble_trace], bubble_layout)
      }
    })
  }
})
