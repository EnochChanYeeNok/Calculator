// Global variables for zoom and pan
let xMin = -10;
let xMax = 10;
let yMin = -10;
let yMax = 10;

let isPanning = false;
let startPan = { x: 0, y: 0 };

// Reference to the canvas element
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

let equation;
let derivativeEquation; // Added to hold the derivative

function drawGraph() {
    // Get the user-entered equation
    const equationInput = document.getElementById('equation').value;

    // Compile the equation and its derivative
    try {
        equation = math.compile(equationInput);
        const derivative = math.derivative(equationInput, 'x');
        derivativeEquation = derivative.compile(); // Compile derivative

        // Extract the derivative expression as a string
        const derivativeExpr = derivative.toString();

        // Display the gradient equation
        const gradientEquationDisplay = document.getElementById('gradientEquationDisplay');
        gradientEquationDisplay.textContent = `Gradient Equation: ${derivativeExpr}`;
    } catch (error) {
        alert('Invalid equation. Please check your input.');
        return;
    }

    // Clear the previous graph
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factors
    const scaleX = canvas.width / (xMax - xMin);
    const scaleY = canvas.height / (yMax - yMin);

    // Increase the number of samples
    const steps = canvas.width * 10; // You can adjust the multiplier
    const dx = (xMax - xMin) / steps;

    // Draw gridlines and axes
    drawGridlines(ctx, scaleX, scaleY);
    drawAxes(ctx, scaleX, scaleY);

    // Plot the equation
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    let firstPoint = true;
    for (let pixelX = 0; pixelX <= canvas.width; pixelX += dx) {
        // Convert pixel x-coordinate to mathematical x-coordinate
        const x = xMin + (pixelX / canvas.width) * (xMax - xMin);

        // Evaluate the equation at x
        let y;
        try {
            y = equation.evaluate({ x: x });
        } catch (error) {
            firstPoint = true;
            continue;
        }

        // Skip if y is not finite
        if (!isFinite(y)) {
            firstPoint = true;
            continue;
        }

        // Convert mathematical y-coordinate to pixel y-coordinate
        const pixelY = canvas.height - ((y - yMin) * scaleY);

        // If the point is outside the canvas, skip drawing it
        if (pixelY < 0 || pixelY > canvas.height) {
            firstPoint = true;
            continue;
        }

        // Draw the point
        if (firstPoint) {
            ctx.moveTo(pixelX, pixelY);
            firstPoint = false;
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }
    ctx.stroke();
}

function calculateYValue() {
    // Get the user-entered x value
    const xInput = document.getElementById('xValue').value;
    const x = parseFloat(xInput);

    // Check if x is a valid number
    if (isNaN(x)) {
        alert('Please enter a valid number for x.');
        return;
    }

    // Check if the equation has been defined
    if (!equation || !derivativeEquation) { // Updated check
        alert('Please enter an equation and plot the graph first.');
        return;
    }

    // Evaluate the equation at x
    let y;
    try {
        y = equation.evaluate({ x: x });
    } catch (error) {
        alert('Error evaluating the equation at x = ' + x);
        return;
    }

    // Evaluate the derivative at x
    let dy;
    try {
        dy = derivativeEquation.evaluate({ x: x });
    } catch (error) {
        alert('Error evaluating the derivative at x = ' + x);
        return;
    }

    // Handle undefined or infinite y-values
    if (!isFinite(y) || isNaN(y)) {
        alert('The equation is undefined at x = ' + x);
        return;
    }

    // Handle undefined or infinite derivative values
    if (!isFinite(dy) || isNaN(dy)) {
        alert('The derivative is undefined at x = ' + x);
        return;
    }

    // Display the y value with two decimal places
    const yDisplay = document.getElementById('yValueDisplay');
    yDisplay.textContent = `When x = ${x.toFixed(2)}, y = ${y.toFixed(2)}`;

    // Display the gradient value with two decimal places
    const gradientDisplay = document.getElementById('gradientDisplay');
    gradientDisplay.textContent = `Gradient (dy/dx) at x = ${x.toFixed(2)} is ${dy.toFixed(2)}`;

    // Adjust the graph view to center on (x, y)
    const rangeX = xMax - xMin;
    const rangeY = yMax - yMin;

    xMin = x - rangeX / 2;
    xMax = x + rangeX / 2;
    yMin = y - rangeY / 2;
    yMax = y + rangeY / 2;

    // Redraw the graph
    drawGraph();

    // Draw the tangent line
    drawTangentLine(x, y, dy);
}

function drawTangentLine(x, y, dy) {
    const scaleX = canvas.width / (xMax - xMin);
    const scaleY = canvas.height / (yMax - yMin);

    // Define the length of the tangent line in the graph's coordinate system
    const tangentLength = (xMax - xMin) / 4;

    // Calculate two points on the tangent line
    const x1 = x - tangentLength;
    const y1 = dy * (x1 - x) + y;

    const x2 = x + tangentLength;
    const y2 = dy * (x2 - x) + y;

    // Convert mathematical coordinates to pixel coordinates
    const pixelX1 = ((x1 - xMin) / (xMax - xMin)) * canvas.width;
    const pixelY1 = canvas.height - ((y1 - yMin) / (yMax - yMin)) * canvas.height;

    const pixelX2 = ((x2 - xMin) / (xMax - xMin)) * canvas.width;
    const pixelY2 = canvas.height - ((y2 - yMin) / (yMax - yMin)) * canvas.height;

    // Draw the tangent line
    ctx.beginPath();
    ctx.strokeStyle = 'green'; // Changed to green for better visibility
    ctx.lineWidth = 2;
    ctx.moveTo(pixelX1, pixelY1);
    ctx.lineTo(pixelX2, pixelY2);
    ctx.stroke();

    // Optionally, add arrowheads or labels to the tangent line
}

// Event listeners for zoom and pan

// Zooming
canvas.addEventListener('wheel', function (event) {
    event.preventDefault();

    const zoomFactor = 1.1;
    const { offsetX, offsetY, deltaY } = event;

    // Get mouse position in terms of coordinate system
    const mouseX = xMin + (offsetX / canvas.width) * (xMax - xMin);
    const mouseY = yMin + ((canvas.height - offsetY) / canvas.height) * (yMax - yMin);

    if (deltaY < 0) {
        // Zoom in
        xMin = mouseX + (xMin - mouseX) / zoomFactor;
        xMax = mouseX + (xMax - mouseX) / zoomFactor;
        yMin = mouseY + (yMin - mouseY) / zoomFactor;
        yMax = mouseY + (yMax - mouseY) / zoomFactor;
    } else {
        // Zoom out
        xMin = mouseX + (xMin - mouseX) * zoomFactor;
        xMax = mouseX + (xMax - mouseX) * zoomFactor;
        yMin = mouseY + (yMin - mouseY) * zoomFactor;
        yMax = mouseY + (yMax - mouseY) * zoomFactor;
    }
    drawGraph();
});

// Panning
canvas.addEventListener('mousedown', function (event) {
    isPanning = true;
    startPan = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', function (event) {
    if (isPanning) {
        const dx = event.clientX - startPan.x;
        const dy = event.clientY - startPan.y;
        const scaleX = (xMax - xMin) / canvas.width;
        const scaleY = (yMax - yMin) / canvas.height;

        xMin -= dx * scaleX;
        xMax -= dx * scaleX;
        yMin += dy * scaleY;
        yMax += dy * scaleY;

        startPan = { x: event.clientX, y: event.clientY };
        drawGraph();
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', function () {
    isPanning = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mousemove', showCoordinates);

function showCoordinates(event) {
    // Get mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const pixelX = event.clientX - rect.left;
    const pixelY = event.clientY - rect.top;

    // Convert pixel coordinates to mathematical coordinates
    const xMouse = xMin + (pixelX / canvas.width) * (xMax - xMin);
    const yMouse = yMax - (pixelY / canvas.height) * (yMax - yMin);

    // Define a range around the mouse position to search for the closest point on the graph
    const xRange = (xMax - xMin) * 0.01; // Adjust the multiplier for a wider or narrower search range
    const numSamples = 50; // Number of points to sample within the range

    let closestDistance = Infinity;
    let closestPoint = null;

    // Sample points around the mouse position
    for (let i = 0; i <= numSamples; i++) {
        // Calculate the x-value for this sample
        const x = xMouse - xRange / 2 + (i / numSamples) * xRange;

        // Evaluate the equation at x to get y
        let yOnGraph;
        try {
            yOnGraph = equation.evaluate({ x: x });
        } catch (error) {
            continue; // Skip if the equation cannot be evaluated at this x
        }

        // Convert the point to pixel coordinates
        const pixelXGraph = ((x - xMin) / (xMax - xMin)) * canvas.width;
        const pixelYGraph = canvas.height - ((yOnGraph - yMin) / (yMax - yMin)) * canvas.height;

        // Calculate the distance between the mouse position and this point on the graph
        const dx = pixelX - pixelXGraph;
        const dyDist = pixelY - pixelYGraph;
        const distance = Math.sqrt(dx * dx + dyDist * dyDist);

        // Update the closest point if this one is closer
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPoint = {
                x: x,
                y: yOnGraph,
                pixelX: pixelXGraph,
                pixelY: pixelYGraph
            };
        }
    }

    // Define a threshold in pixels for how close the mouse must be to the graph to display the coordinates
    const threshold = 10; // You can adjust this value

    if (closestDistance < threshold) {
        // Clear and redraw the graph
        drawGraph();

        // Draw a small circle at the closest point on the graph
        ctx.beginPath();
        ctx.arc(closestPoint.pixelX, closestPoint.pixelY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();

        // Display the coordinates near the point
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        const coordText = `(${closestPoint.x.toFixed(2)}, ${closestPoint.y.toFixed(2)})`;
        ctx.fillText(coordText, closestPoint.pixelX + 10, closestPoint.pixelY - 10);

        // Evaluate the derivative at the closest point
        let dy;
        if (derivativeEquation) {
            try {
                dy = derivativeEquation.evaluate({ x: closestPoint.x });
            } catch (error) {
                dy = 'N/A';
            }
            const gradientText = `Gradient: ${typeof dy === 'number' ? dy.toFixed(2) : dy}`;
            ctx.fillText(gradientText, closestPoint.pixelX + 10, closestPoint.pixelY + 10);
        }

        // Draw the tangent line at this point
        if (derivativeEquation && typeof dy === 'number') {
            drawTangentLine(closestPoint.x, closestPoint.y, dy);
        }
    } else {
        // Redraw the graph without the point and tangent if the mouse is not close
        drawGraph();
    }
}

function calculateGridSpacing(min, max) {
    const range = max - min;
    const roughGridSize = range / 10;
    const exponent = Math.floor(Math.log10(roughGridSize));
    const fraction = roughGridSize / Math.pow(10, exponent);
    let niceFraction;

    if (fraction <= 1) {
        niceFraction = 1;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}

function drawGridlines(ctx, scaleX, scaleY) {
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Determine grid spacing
    const xGridSpacing = calculateGridSpacing(xMin, xMax);
    const yGridSpacing = calculateGridSpacing(yMin, yMax);

    // Vertical gridlines
    for (let x = Math.ceil(xMin / xGridSpacing) * xGridSpacing; x <= xMax; x += xGridSpacing) {
        const pixelX = (x - xMin) * scaleX;
        ctx.moveTo(pixelX, 0);
        ctx.lineTo(pixelX, canvas.height);
    }

    // Horizontal gridlines
    for (let y = Math.ceil(yMin / yGridSpacing) * yGridSpacing; y <= yMax; y += yGridSpacing) {
        const pixelY = canvas.height - (y - yMin) * scaleY;
        ctx.moveTo(0, pixelY);
        ctx.lineTo(canvas.width, pixelY);
    }

    ctx.stroke();
}

function drawAxes(ctx, scaleX, scaleY) {
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // X-axis
    const yZero = canvas.height - (-yMin) * scaleY;
    ctx.moveTo(0, yZero);
    ctx.lineTo(canvas.width, yZero);

    // Y-axis
    const xZero = (-xMin) * scaleX;
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, canvas.height);

    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';

    // X-axis labels
    const xGridSpacing = calculateGridSpacing(xMin, xMax);
    for (let x = Math.ceil(xMin / xGridSpacing) * xGridSpacing; x <= xMax; x += xGridSpacing) {
        const pixelX = (x - xMin) * scaleX;
        ctx.fillText(x.toFixed(2), pixelX + 2, yZero - 2);
    }

    // Y-axis labels
    const yGridSpacing = calculateGridSpacing(yMin, yMax);
    for (let y = Math.ceil(yMin / yGridSpacing) * yGridSpacing; y <= yMax; y += yGridSpacing) {
        const pixelY = canvas.height - (y - yMin) * scaleY;
        ctx.fillText(y.toFixed(2), xZero + 2, pixelY - 2);
    }
}

function calculateGridSpacing(min, max) {
    const range = max - min;
    const roughGridSize = range / 10;
    const exponent = Math.floor(Math.log10(roughGridSize));
    const fraction = roughGridSize / Math.pow(10, exponent);
    let niceFraction;

    if (fraction <= 1) {
        niceFraction = 1;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}
