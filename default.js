var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var previousX = 0;
var currentX = 0;
var previousY = 0;
var currentY = 0;
var flag = false;
var dotFlag = false;
var radius = (canvas.height/2) - 10;
var center = {x: canvas.width/2, y: canvas.height/2};
var drawColor = '#acacff';
var drawLineWidth = 1;
var lineColorTransparent = 'rgba(120, 120, 120, 0.3)'
var slices = 36;
var angle = 360/slices;
var start = 0;

canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);

function findxy (res, e) {
    if (res == 'down') {
        previousX = currentX;
        previousY = currentY;
        currentX = e.clientX - canvas.offsetLeft;
        currentY = e.clientY - canvas.offsetTop;

        flag = true;
        dotFlag = true;
        if (dotFlag) {
            drawDot();
            dotFlag = false;
        }
    }

    if (res == 'up' || res == "out") {
        flag = false;
    }

    if (res == 'move') {
        if (flag) {
            previousX = currentX;
            previousY = currentY;
            currentX = e.clientX - canvas.offsetLeft;
            currentY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

function getPointOnCircle (deg, center, radius) {
    var rad = d2r(deg);
    var x = center.x + radius * Math.cos(rad);
    var y = center.y + radius * Math.sin(rad);

    return {x: x, y: y};
}

function lineStroke (start, end, width, color) {
    context.lineWidth = width;
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
}

function d2r (deg) {
    return deg * Math.PI/180;
}

function color (obj) {
    drawColor = obj.id;
};

function rotate (p1, p2, a) {
    a = d2r(a);
    var xr = (p1.x - p2.x) * Math.cos(a) - (p1.y - p2.y) * Math.sin(a) + p2.x;
    var yr = (p1.x - p2.x) * Math.sin(a) + (p1.y - p2.y) * Math.cos(a) + p2.y;

    return {x:xr, y:yr};
}

function draw () {
    //draw main line
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.strokeStyle = drawColor;
    context.lineWidth = drawLineWidth;
    context.stroke();
    context.closePath();

    start = 0;
    //draw copies
    for (var i = 0; i < slices - 1; i++) {
        start += angle;
        var rP = rotate({x: previousX, y: previousY}, center, start);
        var rC = rotate({x: currentX, y: currentY}, center, start);

        lineStroke(rP, rC, drawLineWidth, drawColor);
    }
}

function drawDot () {
    context.beginPath();
    context.fillStyle = drawColor;
    context.fillRect(currentX, currentY, drawLineWidth, drawLineWidth);
    context.closePath();

    start = 0;
    for (var i = 0; i < slices - 1; i++) {
        start += angle;
        var rotated = rotate({x: currentX, y: currentY}, center, start);
        context.beginPath();
        context.fillStyle = drawColor;
        context.fillRect(rotated.x, rotated.y, drawLineWidth, drawLineWidth);
        context.closePath();
    }
}

function init () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#212121';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = lineColorTransparent;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    context.stroke();
    context.closePath();
    start = 0;

    for (var i = 0; i < slices; i++ ) {
        lineStroke(center, getPointOnCircle(start, center, radius), 1, lineColorTransparent);
        start += angle;
    }
}

init();