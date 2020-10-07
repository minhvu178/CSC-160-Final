var drawBarPotential = function(potential, potentColumns, potentStack, target_potential, xScale, yScale, color) {
    
    var mouseover = function(d) {
        var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
      
        d3.select("#tooltip")
            .classed("hidden",false)
            .style("top",yPos+"px")
            .style("left",xPos+"px")
        
        var subgroupColor = color(d.key)
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName];
        console.log(subgroupName)
        d3.select("#potentialType")
            .text(subgroupName +"(GWh): " + subgroupValue)
        
        d3.selectAll(".myRect").style("opacity", 0.1)
        d3.selectAll("."+subgroupName)
            .style("opacity", 1)
    }

    var mouseleave = function(d) {
        d3.select("#tooltip")    
        .classed("hidden",true)
        .selectAll(".text")
        .text(null)
        
        d3.selectAll(".myRect")
            .style("opacity",0.8)
    }

    target_potential.append("g")
        .selectAll("g")
        .data(potentStack)
        .enter()
        .append("g")
          .attr("fill", function(d) { return color(d.key); })
          .attr("class", function(d){ return "myRect " + d.key })
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("x", function(d) { return xScale(d.data.State); })
            .attr("y", function(d) { return yScale(d[1]); })
            .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width",xScale.bandwidth())
            .attr("stroke", "grey")
          .on("mouseover", mouseover)
          .on("mouseleave", mouseleave)
    
}

var drawLegendsPotential = function(potentStack, potentColumns, target_potential, graph, margin, color) {
    
    var highlight = function(d){
        console.log(d)
        d3.selectAll(".myRect").style("opacity", .1)
        d3.select("."+d).style("opacity", 1)
        }
    var noHighlight = function(d){
        d3.selectAll(".myRect").style("opacity",0.8)
        }
    
    var size = 11
    target_potential.selectAll("myLegends")
      .data(potentColumns)
      .enter()
      .append("rect")
        .attr("x", 50)
        .attr("y", function(d,i){ return 10 + i*(size+5)})
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    target_potential.selectAll("mylabels")
      .data(potentColumns)
      .enter()
      .append("text")
        .attr("x", 50 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)})
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("font-size", 14)
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
    
}

var drawAxesPotential = function(graph,margin,xScale,yScale) {
    
    var xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
    
    var new_margin_top = graph.height + margin.top
    
    d3.select("#us-potential").append('g').attr('class', 'axisXpotential').attr("transform", "translate("+margin.left+", "+new_margin_top+")").call(xAxis)
    
    d3.select('.axisXpotential')
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    
    var yAxis = d3.axisLeft(yScale)
    
    d3.select("#us-potential").append('g').attr('class', 'axis-y').attr("transform", "translate("+margin.left+", "+margin.top+")").call(yAxis)
    
} 

var drawLabelsPotential = function(target_potential, graph, margin) {
    target_potential.append("text")
        .text("US Renewable Technical Potential")
        .classed("title",true)
        .attr("text-anchor","middle")
        .style("font-size", 22)
        .style("fill", "#808080")
        .attr("x",(graph.width/2))
        .attr("y",-25)
    
    target_potential.append("text")
      .attr("text-anchor", "end")
      .attr("x", graph.width)
      .attr("y", graph.height+70 )
      .text("States");

    target_potential.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -5 )
      .text("Technical Potential(Gigawatt-hours)")
      .attr("text-anchor", "start")
}

var initGraphRenewPotential = function(potential) {
    
    var screen = {width: 700, height: 350}
    var margin = {left: 60,right: 20,top: 50,bottom: 40}
    
    var graph = {
        width:screen.width-margin.left-margin.right,
        height:screen.height - margin.top-margin.bottom}
    
    potentColumns = potential.columns.slice(1)
    
    var states = d3.map(potential, function(d){return(d.State)}).keys()
    
    var xScale = d3.scaleBand()
        .domain(states)
        .range([0, graph.width])
        .padding([0.2])
    
    var yScale = d3.scaleLinear()
        .domain([0, 80000000])
        .range([ graph.height, 0 ]);
    
    var color = d3.scaleOrdinal()
        .domain(potentColumns)
        .range(d3.schemeSet3);
    
    var target_potential = d3.select("#us-potential")
        .append("g")
        .attr("transform",
              "translate("+margin.left+","+
                            margin.top+")");

    var potentStack = d3.stack()
        .keys(potentColumns)
        (potential)
    
    
    drawAxesPotential(graph,margin,xScale,yScale)
    drawBarPotential(potential, potentColumns, potentStack, target_potential, xScale, yScale, color)
    drawLegendsPotential(potentStack, potentColumns, target_potential, graph, margin, color)
    drawLabelsPotential(target_potential, graph, margin)
}

var successFCN = function(potential)
{
    console.log("potential",potential);
    initGraphRenewPotential(potential);
}

var failFCN = function(error)
{
    console.log("error",error);
}

var potentialPromise = d3.csv("data/US-potential.csv")
potentialPromise.then(successFCN,failFCN);