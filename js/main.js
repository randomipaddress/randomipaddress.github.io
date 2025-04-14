class Graph {
    constructor(equation, canvas) {
        this.equation = equation;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.xMin = -10;
        this.xMax = 10; 
        this.yMin = -10;
        this.yMax = 10; 
        this.xScale = this.width / (this.xMax - this.xMin);
        this.yScale = this.height / (this.yMax - this.yMin);
        this.drawAxes();
    }

    evaluateEquation(x) {
        try {
            const processedEquation = this.equation
                .replace(/([a-zA-Z0-9])\(/g, '$1*(')
                .replace(/\)([a-zA-Z0-9])/g, ')*$1')
                .replace(/\^/g, '**')
                .replace(/([0-9])([a-zA-Z])/g, '$1*$2')
                .replace(/([a-zA-Z])([0-9])/g, '$1*$2')
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/sqrt/g, 'Math.sqrt')
                .replace(/log/g, 'Math.log');

            const func = new Function('x', `return ${processedEquation};`);
            return func(x);
        } catch (error) {
            console.error('Error evaluating equation:', error);
            return NaN;
        }
    }

    setEquation(equation) {
        this.equation = equation;
        this.drawGraph();
    }

    setRange(xMin, xMax, yMin, yMax) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.xScale = this.width / (this.xMax - this.xMin);
        this.yScale = this.height / (this.yMax - this.yMin);
        this.drawGraph();
    }

    drawAxes() {
        this.ctx.beginPath();

        const xAxisY = this.height - ((0 - this.yMin) * this.yScale);
        if (xAxisY >= 0 && xAxisY <= this.height) {
            this.ctx.moveTo(0, xAxisY);
            this.ctx.lineTo(this.width, xAxisY);
        }

        const yAxisX = (0 - this.xMin) * this.xScale;
        if (yAxisX >= 0 && yAxisX <= this.width) {
            this.ctx.moveTo(yAxisX, 0);
            this.ctx.lineTo(yAxisX, this.height);
        }

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.stroke();
    }

    drawEquation() {
        this.ctx.beginPath();
        for (let x = this.xMin; x <= this.xMax; x += 0.1) {
            const y = this.evaluateEquation(x);
            const canvasX = (x - this.xMin) * this.xScale;
            const canvasY = this.height - (y - this.yMin) * this.yScale;
            if (x === this.xMin) {
                this.ctx.moveTo(canvasX, canvasY);
            } else {
                this.ctx.lineTo(canvasX, canvasY);
            }
        }
        this.ctx.strokeStyle = '#f00';
        this.ctx.stroke();
    }

    drawGraph() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawAxes();
        this.drawEquation();
    }
}

let graph;

function updateGraph() {
    const equation = document.getElementById('equation').value;
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    const canvas = document.getElementById('graphCanvas');

    if (!graph) {
        graph = new Graph(equation, canvas);
    }

    graph.setEquation(equation);
    graph.setRange(xMin, xMax, yMin, yMax);
}

window.onload = function () {
    const canvas = document.getElementById('graphCanvas');
    graph = new Graph('', canvas);
};