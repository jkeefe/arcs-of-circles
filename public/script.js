// client-side js, loaded by index.html
// run by the browser each time the page is loaded

/*global d3, _, calculateRings*/

async function main() {

  let total_circles = document.getElementById("form_circles").value
  let rings = document.getElementById("form_rings").value
  
  let circle_radius = 10
  ; // for each circle in pixels
  let circle_border_width = 1; // this will be the width of circle rule
  const gap = 2; // gap between circles, in pixels

  const circle_diameter = circle_radius * 2;
  
  const arc_counts = await calculateRings(total_circles, rings, circle_diameter, gap);
  // const arc_counts = [28,31,34,37,40,43,46,50,53,56,59,61] // 538

  //// prep the positioning data ////
  
  const first_ring_radius =
    ( (circle_diameter + gap) * (arc_counts[1]) ) / Math.PI; // 1/2 circumference / pi (c=2πr)
  let circle_positions = [];
  
  // this steps through each ring
  arc_counts.forEach((arc_max, i) => {
    // calculate the angle increments for this arc/ring
    let arc_angle_increment = Math.PI / (arc_max - 1);

    // for each circle in the ring ...
    for (var a = 0; a < arc_max; a++) {
      let radius = first_ring_radius + i * (gap + circle_diameter);
      let angle = a * arc_angle_increment;

      let item = {
        angle: angle,
        ring: i,
        radius: radius,
        relative_y: radius * Math.sin(angle),
        relative_x: -1 * radius * Math.cos(angle) // flip sign to go left to right (clockwise)
      };

      circle_positions.push(item);
    }
  });

  //// sort the positioning data by your fave value ////

  // I like to sort by the angle & radius
  // so then my data will flow into sections of the semicircle
  const sorted_circle_positions = _.orderBy(
    circle_positions,
    ["angle", "radius"],
    ["asc", "desc"]
  );
  
  //// prep the content data ////

  // presumably, we have the same number of data points to chart as we do
  // positions for circles. Here, I'm making a dummy set of data just saying "Cirle 1" "Circle 2" etc.

  const number_of_data_points = _.sum(arc_counts);
  console.log("Number of data points:", number_of_data_points);
  let data_set = [];
  for (let j = 0; j < number_of_data_points; j++) {
    data_set.push(`Circle No. ${j + 1}`);
  }

  //// set up the width and height ////

  const margin = { top: 0, left: 0, right: 0, bottom: 0 };
  const last_ring_radius =
    first_ring_radius + arc_counts.length * (gap + circle_diameter);

  let width = 2 * last_ring_radius - margin.right - margin.left;
  let height = last_ring_radius + circle_radius - margin.top - margin.bottom;

  //// drawing functions ////

  function x(i) {
    return width / 2 + sorted_circle_positions[i].relative_x;
  }

  function y(i) {
    return height - circle_radius - sorted_circle_positions[i].relative_y;
  }

  const color = d => {
    return "#336b42" // just return green
  };

  function interiorFill(d) {
    if (d < 0) {   // this never happens as written, but I can tinker with the logic to display solid colors
      return "rgba(255, 255, 255, 0.0)";
    } else {
      return "rgba(255, 255, 255, 0.9)"; // 90% opacity
    }
  }

  //// draw the circles ////

  let chart = d3
    .select("#anchor-point")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .attr("class", "arcs-svg");

  chart
    .append("defs")
    .append("clipPath")
    .attr("id", "clip-circle")
    .append("circle")
    .attr("cx", circle_radius)
    .attr("cy", circle_radius)
    .attr("r", circle_radius);

  const seats = chart
    .selectAll(".spot")
    .data(data_set)
    .enter()
    .append("g")
    .attr("class", "spot")
    .attr("transform", (d, i) => `translate(${x(i)}, ${y(i)})`);

  seats
    .append("circle")
    .attr("r", circle_radius)
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill", d => color(1));

  // 80% opacity
  seats
    .append("circle")
    .attr("r", circle_radius - circle_border_width)
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("fill", (d, i) => interiorFill(i)) // this could remove the opaque circle based on data
    .append("svg:title")
    .text(d => d);
}

main()

const button = d3.select('#calculate')
button.on('click', function() {
  d3.selectAll("#anchor-point")
  .html("")
  main();
})
