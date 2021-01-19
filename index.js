let total_circles = 100
let rings = 3
let circle_diameter = 10
let gap_between_circles = 2
let first_arc_radius = 20   // a guess to start with
let keep_trying = true

// try until we have an answer
while (keep_trying) {
    
    // reset the rows array and the total fit_circle count
    let rows_array = []
    let total_fit_circles = 0
    
    // loop through the rings at the present radius
    for (let i=0; i < rings; i++) {
        
        // calculate the length of each arc, in pixels
        // using c = 2πr ... or half a cicrumference = πr
        let arc = Math.PI * ( first_arc_radius + (i * (circle_diameter+gap_between_circles)) )
        
        // what's the whole number of circles that fit on that arc
        let fit_circles = Math.floor(arc / (circle_diameter+gap_between_circles))
        
        // track the circles so far
        rows_array.push(fit_circles)
        total_fit_circles += fit_circles
        
    }
    
    // have we fit in all the circles?
    if (total_fit_circles < total_circles) {
        // not yet
        // add one to the base radius
        first_arc_radius += 1
    } else {
        // yes!
        keep_trying = false
        console.log(`First ring radius is ${first_arc_radius}`)
        console.log(`Row array is ${rows_array}`)
    }
    
    
}



