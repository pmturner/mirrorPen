var canvas = document.getElementById('canvas');
var contex = canvas.getContext('2d');

var previousX = 0;
var currentX = 0;
var previousY = 0;
var currentY = 0;
var flag = false;
var dot_flag = false;
var width = window.innerWidth;
var height = window.innerHeight;
var center = {x: width/2 , y: height/2};
var radius = (width/2) - 10;
var drawColor = '#acacff';
var drawLineWidth = 1;
var lineColorTransparent = 'rgba(120, 120, 120, 0.3)'
var slices = 24;
var _angle = 360 / slices;
var _start = 0;

canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);

var getPointOnCircle = function (deg, center, radius) {
    var rad = d2r(deg);
    var x = center.x + radius * Math.cos(rad);
    var y = center.y + radius * Math.sin(rad);
    return { x: x, y: y};
}

var lineStroke = function(start, end, width, color) {
    contex.lineWidth = width;
    contex.beginPath();
    contex.strokeStyle = color;
    contex.moveTo(start.x, start.y);
    contex.lineTo(end.x, end.y);
    contex.stroke();
}

var d2r = function (deg) {
    return deg * Math.PI/180;
}

var color = function (obj) {
    drawColor = obj.id;
};

function rotate(p1, p2, a) {
    a = d2r(a);
    var xr = (p1.x - p2.x) * Math.cos(a) - (p1.y - p2.y) * Math.sin(a) + p2.x;
    var yr = (p1.x - p2.x) * Math.sin(a) + (p1.y - p2.y) * Math.cos(a) + p2.y;
    return {x:xr, y:yr};
}

function draw() {
    //draw main line
    contex.beginPath();
    contex.moveTo(previousX, previousY);
    contex.lineTo(currentX, currentY);
    contex.strokeStyle = drawColor;
    contex.lineWidth = drawLineWidth;
    contex.stroke();
    contex.closePath();

    _start = 0;
    //draw copies
    for(var i = 0; i < slices - 1; i++) {
        _start += _angle;
        var rP = rotate({x: previousX, y: previousY}, center, _start);
        var rC = rotate({x: currentX, y: currentY}, center, _start);
        lineStroke(rP, rC, drawLineWidth, drawColor);

    }
}

var drawDot = function () {
    contex.beginPath();
    contex.fillStyle = drawColor;
    contex.fillRect(currentX, currentY, drawLineWidth, drawLineWidth);
    contex.closePath();

    _start = 0;
    for(var i = 0; i < slices - 1; i++) {
        _start += _angle;
        var rotated = rotate({x: currentX, y: currentY}, center, _start);
        contex.beginPath();
        contex.fillStyle = drawColor;
        contex.fillRect(rotated.x, rotated.y, drawLineWidth, drawLineWidth);
        contex.closePath();
    }
}

function findxy(res, e) {
    if (res == 'down') {
        previousX = currentX;
        previousY = currentY;
        currentX = e.clientX - canvas.offsetLeft;
        currentY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            drawDot();
            dot_flag = false;
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


//start everything, empty circle
var init = function () {

    contex.clearRect(0,0, width, height);
    contex.fillStyle = '#212121';
    contex.fillRect(0,0,width,height);
    contex.strokeStyle = lineColorTransparent;
    contex.beginPath();
    contex.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
    contex.stroke();
    contex.closePath();
    _start = 0;

    for(var i = 0; i < slices; i++ ) {
        lineStroke(center, getPointOnCircle(_start, center, radius), 1, lineColorTransparent);
        _start += _angle;
    }
}

init();