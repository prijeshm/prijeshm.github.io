async function drawVerticalBars() {
    
    // Data
    const data = await d3.json('data.json');
    const dataset = data.Value;
    dataset.sort((a,b) => b.TIV - a.TIV)
    console.log('dataset', dataset);

    const xAccessor = d => d.Country.code;
    const xAccessorDisplay = d => d.Country.displayName;
    const yAccessor = d => d.TIV;

    const formatSpecifier = d3.formatSpecifier("s");
    formatSpecifier.precision = 2;
    console.log(formatSpecifier)

    // Dimensions
    const dimensions = {
        width: 1000,
        height: 450,
        margins: 30,
        legendWidth: 150,
        legendHeight: 450
    };

    dimensions.containerWidth = dimensions.width - (dimensions.margins * 2) ;
    dimensions.containerHeight = dimensions.height - (dimensions.margins * 2);

    // Draw SVG
    const svg = d3.select('.chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);

    // Tooltip
    const tooltip = d3.select('.chart').select('.tooltip')
        .style('pointer-events', 'none');
    const tooltipTitle = tooltip.select('.title');
    const tooltipDescription = tooltip.select('.description');

    // Scales
    const xScale = d3.scaleBand()
        .domain(dataset.map(xAccessor))
        .range([0, dimensions.containerWidth])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        //.domain(d3.extent(dataset, yAccessor))
        .domain([0, d3.max(dataset, d => yAccessor(d))])
        .range([dimensions.containerHeight, dimensions.margins]);

    const len = dataset.length;

    const colorScale = d3.scaleOrdinal()
        .domain(dataset.map(xAccessor))
        .range(d3.schemeDark2)
        .unknown('#ccc');

    // Transitions 
    const exitTransition = d3.transition().duration(500);
    const updateTransition = d3.transition(exitTransition).duration(500);

    // Draw Bars
    container.selectAll('rect')
        .data(dataset)
        .join(
            enter => enter.append('rect')
                .attr('x', d => xScale(xAccessor(d)))
                .attr('y', d => yScale(0))
                .attr('width', xScale.bandwidth())
                .attr('height', 0),
            update => update,
            exit => exit.transition(exitTransition)
                .remove()
        )
        .transition(updateTransition)
        .attr('y', d => yScale(yAccessor(d)))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(0) - yScale(yAccessor(d)))
        .attr('fill', d => colorScale(xAccessor(d)));
    
    container.selectAll('rect')
        .on('mouseover', function(event, datum) {
            const pointer = d3.pointer(event, container);
            // console.log('event', event, 'datum', datum, pointer, this);
            tooltip.style('display', 'block')
                .style('left', `${pointer[0]}px`)
                .style('top', `${pointer[1] - 10}px`);

            d3.select(this).attr('opacity', 0.8);
            console.log('datum', datum)
            tooltipTitle.text(datum.Country.displayName);

            tooltipDescription.text(d3.format(formatSpecifier)(datum.TIV));
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none');
            d3.select(this).attr('opacity', 1);
        });

    // Axis
    const xAxisGroup = container.append('g')
        .style('transform', `translateY(${dimensions.containerHeight}px)`)
        .classed('x-axis', true);
    const xAxis = d3.axisBottom(xScale);

    xAxisGroup.call(xAxis);

    const yAxisGroup = container.append('g');
    const yAxis = d3.axisLeft(yScale)
        .ticks(5, 's');;

    yAxisGroup.call(yAxis);

    // Legend
    // const legendGroup = svg.append('g')
    //     .attr('transform', `translate(${(dimensions.margins)}, ${dimensions.margins})`);

    // legendGroup.selectAll('rect')
    //     .data(dataset.map(xAccessor))
    //     .join('rect')
    //     .attr('x', dimensions.containerWidth - 10)
    //     .attr('y', (d, i) => i * 13)
    //     .attr('width', 10)
    //     .attr('height', 10)
    //     .attr('fill', colorScale);

    // legendGroup.selectAll('text')
    //     .data(dataset.map(xAccessorDisplay))
    //     .join('text')
    //     .text(d => d)
    //     .attr('x', dimensions.containerWidth)
    //     .attr('y', (d, i) => i * 13 + 10);
    // console.error('drawVerticalBars');
}

drawVerticalBars();

async function drawHorizontalBars() {
    console.log('drawHorizontalBars');
    // Data
    const data = await d3.json('data.json');
    const dataset = data.Value;
    dataset.sort((a,b) => b.TIV - a.TIV)
    console.log('dataset', dataset);

    const xAccessor = d => d.TIV;
    const yAccessor = d => d.Country.code;

    // Dimensions
    const dimensions = {
        width: 1000,
        height: 450,
        margins: 25,
        legendWidth: 150,
        legendHeight: 450
    };

    dimensions.containerWidth = dimensions.width - (dimensions.margins * 2) - dimensions.legendWidth;
    dimensions.containerHeight = dimensions.height - (dimensions.margins * 2);

    // Draw SVG
    const svg = d3.select('.horizontal-chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);

    // Tooltip
    const tooltip = d3.select('.horizontal-chart').select('.tooltip')
        .style('pointer-events', 'none');
    const tooltipTitle = tooltip.select('.title');
    const tooltipDescription = tooltip.select('description');

    // Scales
    // const xScale = d3.scaleBand()
    //     .domain(dataset.map(xAccessor))
    //     .range([0, dimensions.containerWidth])
    //     .padding(0.2);

    // const yScale = d3.scaleLinear()
    //     .domain(d3.extent(dataset, yAccessor))
    //     .range([dimensions.containerHeight, 0]);
    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.containerWidth]);

    const yScale = d3.scaleBand()
        .domain(dataset.map(yAccessor))
        .range([0, dimensions.containerHeight])
        .padding(0.1)

    const len = dataset.length;

    const colorScale = d3.scaleOrdinal()
        .domain(dataset.map(yAccessor))
        .range(d3.schemeSet2)
        .unknown('#ccc');

    // Draw Bars
    container.selectAll('rect')
        .data(dataset)
        .join('rect')
        .attr('x', d => xScale(xAccessor(0)))
        .attr('y', d => yScale(yAccessor(d)))
        .attr('width', d => xScale(xAccessor(d)))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => colorScale(yAccessor(d)))
        .on('mouseover', function(event, datum) {
            const pointer = d3.pointer(event, container);
            tooltip.style('display', 'block')
                .style('left', `${pointer[0] + 10}px`)
                .style('top', `${pointer[1]}px`);

            d3.select(this).attr('opacity', 0.8);

            tooltipTitle.text(datum.Country.displayName);

            tooltipDescription.text(datum.TIV);
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none');
            d3.select(this).attr('opacity', 1);
        });

    // Axis
    const xAxisGroup = container.append('g')
        .style('transform', `translateY(${dimensions.containerHeight}px)`);
    const xAxis = d3.axisBottom(xScale)
        .ticks(null, 's');

    xAxisGroup.call(xAxis);

    const yAxisGroup = container.append('g');
    const yAxis = d3.axisLeft(yScale);

    yAxisGroup.call(yAxis);

    // Legend
    const legendGroup = svg.append('g')
        .attr('transform', `translate(${dimensions.margins}, ${dimensions.margins})`);
    

    legendGroup.selectAll('rect')
        .data(dataset.map(yAccessor))
        .join('rect')
        .attr('x', dimensions.containerWidth - 10)
        .attr('y', (d, i) => i * 13)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale);

    legendGroup.selectAll('text')
        .data(dataset.map(yAccessor))
        .join('text')
        .text(d => d)
        .attr('x', dimensions.containerWidth)
        .attr('y', (d, i) => i * 13 + 10);

}

drawHorizontalBars();