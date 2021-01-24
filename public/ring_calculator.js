/*global d3*/

async function calculateRings(total_circles, rings, circle_diameter, gap_between_circles) {

  let first_arc_radius = 2 * circle_diameter; // a guess to start with
  let keep_trying = true;

  // try until we have an answer
  while (keep_trying) {
    // reset the rows array and the total fit_circle count
    let rows_array = [];
    let total_fit_circles = 0;

    // loop through the rings at the present radius
    for (let i = 0; i < rings; i++) {
      // calculate the length of each arc, in pixels
      // using c = 2πr ... or half a cicrumference = πr
      let arc =
        Math.PI *
        (first_arc_radius + i * (circle_diameter + gap_between_circles));

      // what's the whole number of circles that fit on that arc
      let fit_circles = Math.floor(
        arc / (circle_diameter + gap_between_circles)
      );

      // track the circles so far
      rows_array.push(fit_circles);
      total_fit_circles += fit_circles;
    }

    // have we fit in all the circles?
    if (total_fit_circles < total_circles) {
      // not yet
      // add one to the base radius
      first_arc_radius += 1;
    } else {
      // yes!
      keep_trying = false;
      console.log(`\nTotal requested circles: ${total_circles}`);
      console.log(`Total fit circles ${total_fit_circles}`);
      console.log(`Row array is ${rows_array}`);

      // check for too many circles in the chart
      if (total_fit_circles > total_circles) {
        let difference = total_fit_circles - total_circles;
        rows_array[rows_array.length - 1] =
          rows_array[rows_array.length - 1] - difference;
        console.log(
          "\nNOTE! The number of circles that fit nicely in the outermost ring\nputs you over the total number of circles you seek.\n"
        );
        console.log(
          `So, I'm subtracting the difference from the last ring,\nwhich gives you: ${rows_array}`
        );
      }
      
      d3.select("#answer")
      .html(`Ring array is: [${rows_array}]`)
      
      return rows_array
      
    }
  }
}
