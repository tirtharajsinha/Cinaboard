setTimeout(function() {
    document.getElementById("animate").style.display = "none";
    document.getElementById("brand").style.display = "block";
    document.getElementById("nev").style.display = "block";
    document.getElementById("field").style.display = "inherit";
}, 5000);

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// var BB = canvas.getBoundingClientRect();

setTimeout(function() {
    ribbon(true);
}, 7000);
setTimeout(function() {
    ribbon(false);
}, 11000);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let start_bg_color = "white";
let restore_array = [];
let index = -1;
let hidden_board = false;

let context = canvas.getContext("2d");
context.fillStyle = start_bg_color;
context.fillRect(0, 0, canvas.width, canvas.height);
// console.log(canvas.width + "," + str);

canvas.addEventListener("touchstart", touchstart, false);
canvas.addEventListener("touchmove", touchdraw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function touchstart(event) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(
        event.touches[0].pageX - canvas.offsetLeft,
        event.touches[0].pageY - canvas.offsetTop
    );
    event.preventDefault();
}

function touchdraw(event) {
    if (is_drawing) {
        context.lineTo(
            event.touches[0].pageX - canvas.offsetLeft,
            event.touches[0].pageY - canvas.offsetTop
        );
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        document.title = "Cinaboard - writting...";
    }
    event.preventDefault();
}

function start(event) {
    is_drawing = true;

    context.beginPath();
    var BB = canvas.getBoundingClientRect();
    context.moveTo(event.clientX - BB.left, event.clientY - BB.top);
}

function draw(event) {
    if (is_drawing) {
        var BB = canvas.getBoundingClientRect();
        context.lineTo(event.clientX - BB.left, event.clientY - BB.top);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
        document.title = "Cinaboard - writting...";
    }
}

function stop(event) {
    if (is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();
    document.title = "Cinaboard";
    if (event.type != "mouseout") {
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
}

function change_color(element) {
    draw_color = element.style.background;
    default_dot();
    element.getElementsByClassName("selector")[0].style.background = "white";
}

function change_color_gradient(element) {
    var gradient = context.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
    );
    gradient.addColorStop("0", "#33ccff");
    gradient.addColorStop("0.2", "#ff99cc");
    gradient.addColorStop("0.4", "#0066ff");
    gradient.addColorStop("0.5", "#00ff00");
    gradient.addColorStop("0.7", "#ff9966");
    gradient.addColorStop("1.0", "#cc00cc");

    draw_color = gradient;
    default_dot();
    element.getElementsByClassName("selector")[0].style.background = "white";
}

function clear_canvas() {
    context.fillStyle = start_bg_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    restore_array = [];
    index = -1;
}

function eraser() {
    default_dot();
    draw_color = start_bg_color;
    document.getElementsByClassName("eraser")[0].style.background = "orange";
}

function undo_last() {
    if (index <= 0) {
        clear_canvas();
    } else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}

function default_dot() {
    var x = document.getElementsByClassName("selector");
    document.getElementsByClassName("eraser")[0].style.background = "transparent";
    var i = 0;
    for (i = 0; i < x.length; i++) {
        x[i].style.background = "transparent";
    }
}

function hide_board() {
    let board = document.getElementById("field");
    board.style.transition = "all 1s ease";
    board.style.position = "relative";
    board.style.left = "-90%";
    board.style.transition = "all 1s ease";
    document.getElementById("toggle").innerHTML = '<i class="fa fa-arrow-right">';
    hidden_board = true;
    document.getElementById("content").style.display = "block";
}

function unhide_board() {
    let board = document.getElementById("field");
    board.style.transition = "all 1s linear";
    board.style.position = "inherit";
    board.style.left = "0%";

    document.getElementById("toggle").innerHTML = '<i class="fa fa-arrow-left">';
    hidden_board = false;
    document.getElementById("content").style.display = "none";
}

function toggle_board() {
    if (hidden_board) {
        unhide_board();
    } else {
        hide_board();
    }
}

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

function wave_animation(element) {
    var dock = document.getElementsByClassName("color-field");
    var index = indexInClass(element, dock);
    element.style.top = "-10px";
    try {
        dock[index - 1].style.top = "-5px";
    } catch (err) {}
    try {
        dock[index + 1].style.top = "-5px";
    } catch (err) {}
}

function wave_animation_stop(event) {
    var dock = document.getElementsByClassName("color-field");
    for (var i = 0; i < dock.length; i++) {
        dock[i].style.top = "0px";
    }
}

function indexInClass(node, myClass) {
    var className = node.className;
    var num = 0;
    for (var i = 0; i < myClass.length; i++) {
        if (myClass[i] === node) {
            return num;
        }
        num++;
    }
    return -1;
}

function ribbon(action) {
    if (action) {
        document.getElementById("ribbon").style.left = "0px";
    } else {
        document.getElementById("ribbon").style.left = "-200px";
    }
}

function store_embeded(value) {
    if (value != "") {
        document.getElementById("content").innerHTML = value;
        let frame = document
            .getElementById("content")
            .getElementsByTagName("iframe")[0];
        frame.style.width = "100%";
        frame.style.height = "100%";
    }
}

function move_tools() {
    let field = document.getElementsByClassName("color-field");
    let picker = document.getElementById("color-picker");
    let range = document.getElementById("pen-range");
}