# Graphic Differentiation Calculator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-%23323330.svg?logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)

## Introduction

Welcome to the **Graphic Differentiation Calculator**! This web-based application allows users to visualize mathematical equations, interact with their graphs, and explore their derivatives seamlessly. Whether you're a student, educator, or math enthusiast, this tool provides an intuitive platform to deepen your understanding of mathematical functions and their behaviors.

## Features

- **Equation Input & Graph Plotting**
  - Enter any mathematical equation in terms of `x` (e.g., `x^2 + 3*x + 2`) and instantly visualize its graph.

- **Interactive Graph Canvas**
  - **Zooming & Panning:** Navigate through different sections of the graph with ease using mouse wheel zoom and click-and-drag panning.
  - **Gridlines & Axes:** Dynamically generated gridlines and axes adjust based on the current view for optimal visualization.

- **Derivative Calculation**
  - Automatically compute and display the derivative (gradient) of the entered equation.

- **Hover Functionality**
  - Hover over the graph to view precise coordinates and the gradient at that specific point.
  - Visualize the tangent line corresponding to the gradient at the hovered point.

- **Value Calculator**
  - Input a specific `x` value to calculate and display the corresponding `y` value and gradient.
  - The graph recenters on the calculated point, highlighting it with a tangent line for better insight.

- **Responsive & Intuitive UI**
  - Dark-themed interface with clear visual feedback for an enhanced user experience.

## Demo

[calculator-ten-tau-70.vercel.app](https://calculator-ten-tau-70.vercel.app)

## Installation

To run the **Graphic Differentiation Calculator** locally on your machine, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/graphic-differentiation-calculator.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd graphic-differentiation-calculator
   ```

3. **Open the Application**

   Open the `index.html` file in your preferred web browser. You can do this by double-clicking the file or using the command line:

   ```bash
   open index.html
   ```

   *Alternatively, you can use a live server extension in VS Code or any other IDE for a better development experience.*

## Usage

1. **Enter an Equation**

   - Input your desired mathematical equation in terms of `x` in the provided input field. For example:
     ```
     x^2 + 3*x + 2
     ```

2. **Plot the Graph**

   - Click the **"Plot Graph"** button to visualize the equation on the graph canvas. The derivative of the equation will be calculated and displayed automatically.

3. **Interact with the Graph**

   - **Zoom:** Use your mouse wheel to zoom in and out of the graph. The zoom centers around the cursor's position.
   - **Pan:** Click and drag the graph to navigate different sections.
   - **Hover:** Move your mouse over the graph to view the nearest point's coordinates and gradient. A tangent line will appear at that point for visual reference.

4. **Calculate Specific Values**

   - Enter a specific `x` value in the **"Enter x value"** field.
   - Click the **"Calculate Y"** button to compute the corresponding `y` value and gradient.
   - The graph will recenter on the calculated point, displaying a tangent line to illustrate the gradient.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6)
  
- **Libraries & Tools**:
  - [Math.js](https://mathjs.org/) for parsing, compiling, and evaluating mathematical expressions and their derivatives.

## Project Structure

```
GraphicDifferentiationCalculator/

│
├── styles.css
├── index.html
├── script.js
├── README.md

```

- **styles.css**: Main stylesheet for the application's layout and design.
- **index.html**: The main entry point of the application where users can input equations and interact with the graph.
- **script.js**: JavaScript file handling graph plotting, derivative calculations, and interactive features.
- **README.md**: This documentation file.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software as per the terms of the license.

---

*Happy Calculating!*
```
