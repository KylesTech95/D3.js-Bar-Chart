$(document).ready(() => {
    //declarations
    let svg = d3.select('#svg')
    let bod = d3.select('body')
    let size = () => 700;
    let margin = 75
    //Array containing objects of names & weight
    let people = [
        { name: 'Kelly', weight: 90 },
        { name: 'Jacob', weight: 120 },
        { name: 'Stan', weight: 192 },
        { name: 'Charlie', weight: 75 },
        { name: 'Jack', weight: 89 },
        { name: 'Mark', weight: 97 },
        { name: 'Barbie', weight: 300 },
        { name: 'John', weight: 229 },
        { name: 'Sally', weight: 210 },
        { name: 'Ken', weight: 132 },
        { name: 'Bob', weight: 167 },
        { name: 'Cyan', weight: 102 },
        { name: 'Shaun', weight: 183 }
]
    //Create sorting toggle button
    let toggle = d3.select('.container')
        .append('div')
        .classed('toggleDiv', true)
        .text('Orig')
    let tog = document.querySelector('.toggleDiv');
    //Event listener to change the inner html

/*---------------------------------------------------------------------*/
    //give attributes to the svg
    svg.attr('height', size())
        .attr('width', size())

    people.sort((a,b) => a.weight - b.weight)

    //xScale & xAxis
    let x = d3.scaleBand()
        .domain(people.map((d, i) => d.name))
        .range([margin, size() - margin])
    let xAxis = d3.axisBottom(x).tickSize(0)/*.tickFormat(i => people[i].name)*/

    //yScale & yAxis
    let y = d3.scaleLinear()
        .domain([0, d3.max(people.map(w => w.weight + 20))])
        .range([size() - margin, margin])
    let yAxis = d3.axisLeft(y)

    //Call xAxis
    let xGroup = svg.append('g')
        .attr('transform', `translate(0,${size() - margin})`)
        .call(xAxis)
    let names = xGroup.selectAll('.tick')

    //Call yAxis
    let yGroup = svg.append('g')
        .attr('transform', `translate(${margin},0)`)
        .call(yAxis)
/*---------------------------------------------------------------------*/
    //crete rectangles
    let recsAll = svg.append('g')
        .attr('class', 'recs') //targeting for timeout
        .attr('fill', 'violet')
        .selectAll('rect')
        .data(people)
        .join('rect')
        .attr('x', (d, i) => x(d.name))
        .attr('y', (d) => y(d.weight))
        .attr('height', d => y(0) - y(d.weight))
        .attr('width', x.bandwidth() - 3)
        .attr('class', 'rectangle')
        .attr('style', `transform:scale(${x(1.10)})`)


    //Append text on top of rectangles
    let txtNodes = svg.append('g')
        .selectAll('text')
        .data(people)
        .enter()
        .append('text')
        .classed('weights',true)
        .attr('x', d => x(d.name)+10)
        .attr('y', d => y(d.weight / 2))
        .html(d => d.weight)
        .attr('style','opacity:0;transition:.3s ease;')

    //append caption xAxis
    let rightPos = svg.node().getBoundingClientRect().left + (size() / 2)
    let xTxt = svg.append('text')
        .attr('x', (svg.node().getBoundingClientRect().width / 2.5))
        .attr('y', size() - 20)
        .text('Participants')
        .classed('bottomTxt', true)

        console.log(xTxt)

    //append caption yAxis
    let yTxt = svg.append('text')
        .text('weight (lbs)')
        .classed('sideText',true)

    let ticks = document.querySelectorAll('.tick')
    //If the ticks do NOT include numbers then add class
    ticks.forEach(tick => {
        if (/[^\d]/.test(tick.children[1].innerHTML)) {
            tick.children[1].classList.add('grow')
        }
    })
    //Target an array of rectangles & iterate
    let rectArr = document.querySelectorAll('.rectangle')
    rectArr.forEach((rect,index) => {
        let newrec = d3.select(rect);
        let nameData = newrec.data()[0].name
        let weightData = newrec.data()[0].weight
        //Have the participant names appear at their weight level
    let txtAppear = svg.append('g')
        .selectAll('text')
        .data(people)
        .enter()
        .append('text')
        .classed('txtTop',true)
        .attr('x', d => x(d.name)+10)
        .attr('y', d => y(d.weight))
        .html(d => d.name)
        .attr('style','opacity:0;transition:.3s ease;')

        //onmouseover
        newrec.on('mouseover', () => {
            /*Animate bars here*/
            newrec
                .transition()
                .duration(500)
                .attr('y', (d) => {
                    return y(d.weight * 0)
                })
            //on mouseover, each label(name) will shrink
            ticks.forEach(tick => {
                let node = tick.childNodes[1]
                if (node.innerHTML == nameData) {
                    node.classList.toggle('shrink')
                }
            })
            //on mouseover, each weight label will appear after a quarter-second
             document.querySelectorAll('.weights').forEach((query,index) =>{
                    setTimeout(() =>{
                        if( query.innerHTML == weightData){
                            tog.innerHTML == 'Diff' ? query.style='opacity:1;transition:.3s ease;fill:#fff' : query.style='opacity:1;transition:.3s ease;fill:#000'
                        }                               
                        
                    },250)   
             })
           
        })
        //onmouseout
        newrec.on('mouseout', () => {
            /*Animate bars here*/
            newrec
                .transition()
                .duration(750)
                .attr('y', (d) => {
                    return y(d.weight)
                })

            ticks.forEach(tick => {
                let node = tick.childNodes[1]
                if (node.innerHTML == nameData) {
                    node.classList.toggle('shrink')
                }
            })
            //access weights array and change the style of both the weighs & rectangles onmouseover
            document.querySelectorAll('.weights').forEach((query,index) =>{
                // query.innerHTML == weightData ? query.style='opacity:1;transition:.3s ease;' : query.style='opacity:0; transition: .3s ease;'
                // if( query.innerHTML == weightData){
                    setTimeout(() =>{
                        rectArr[index].style = 'opacity:1;transition: .5s ease;'
                        if( query.innerHTML == weightData){
                            tog.innerHTML == 'Diff' ? query.style='opacity:0;transition:.3s ease;fill:#fff' : query.style='opacity:0;transition:.3s ease;fill:#000'
                        }
                            
                    },500)                  
                 })
        })
    })

    //toggleDiv Eventlistener
    tog.addEventListener('click',(e)=>{
    let weights = document.querySelectorAll('.weights')

    if(e.target.textContent=='Orig'){
    //Change background
    //Change Toggle backgroun color
    e.target.style = 'background-color:#fff; color: #000;box-shadow: 0 0 8px .25px #fff;'
    d3.select('.sideText')
    .attr('style','fill:#fff;transition: .3s ease;')
    d3.select('.bottomTxt')
    .attr('style','fill:#fff;transition: .3s ease;')
    //Change Body background color
    bod.attr('style','background-color:#000;transition: .3s ease;')
    //Change text color
    e.target.textContent = 'Diff'
    weights.forEach(weight =>{
    yGroup.classed('original',false)
    yGroup.classed('axisChange',true)
    xGroup.classed('axisChange',true)
    xGroup.classed('original',false)
    weights.forEach(w=>{
        w.style='fill:white;opacity:0';
    })
    })
    //Once the button is pressed, different style properties change. View the css file.
    rectArr.forEach(rec=>{
        rec.classList.remove('rectangle')
        rec.classList.add('rectangleDiff')
    })

}
else{
    
    e.target.style = 'background-color:#000; color: #fff;box-shadow: 0 0 8px .25px #333;'
    d3.select('.sideText').attr('style','fill:navy;transition: .3s ease;')
    d3.select('.bottomTxt').attr('style','fill:navy;transition: .3s ease;')
    e.target.textContent = 'Orig'
    bod.attr('style','background-color:#fff;transition: .3s ease;')

    document.querySelectorAll('.weights').forEach(query =>{
        let newrec = d3.select(query);
        let weightData = newrec.data()[0].weight
               if(query.innerHTML == weightData){
                query.style='opacity:0;fill:#fff;transition:3s ease;'
               }
             })
             rectArr.forEach(rec=>{
        rec.classList.remove('rectangleDiff')
        rec.classList.add('rectangle')
    })
    weights.forEach(weight =>{
    yGroup.classed('axisChange',false)
    yGroup.classed('original',true)
    xGroup.classed('axisChange',false)
    xGroup.classed('original',true)
    })

}
    })
})