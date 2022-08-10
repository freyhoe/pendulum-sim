
var canvas = ctx = false;
let countTime = performance.now()
let dots = []
let lastElapse = 0

let settings = {
    mass: 100,
    length: 500,
    theta: (Math.PI / 4) - 0.05
}
let lastTheta = settings.theta
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var pendulum = { mass: settings.mass, length: settings.length, theta: settings.theta, omega: 0, alpha: 0, J: 0 };
var setup = function () {
    pendulum.J = pendulum.mass * pendulum.length * pendulum.length / 500
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.textAlign = "center"
    ctx.strokeStyle = "black";
    ctx.fillStyle = "gold";
    requestAnimFrame(loop);
}
let lastTime = performance.now()
var loop = function () {
    var width = window.innerWidth; var height = window.innerHeight;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    if (pendulum.theta <= lastTheta) {
        let t = performance.now()
        lastElapse = t - countTime
        countTime = t
    }
    let deltaT = 0.01;


    pendulum.theta += pendulum.omega * deltaT + (0.5 * pendulum.alpha * deltaT * deltaT);
    var T = pendulum.mass * 9.81 * Math.cos(pendulum.theta) * pendulum.length;

    var alpha = T / pendulum.J;
    pendulum.omega += 0.5 * (alpha + pendulum.alpha) * deltaT;

    pendulum.alpha = alpha;

    var px = width / 2 + pendulum.length * Math.cos(pendulum.theta);
    var py = 50 + pendulum.length * Math.sin(pendulum.theta);

    ctx.clearRect(0, 0, width, height);
    dots.push({ x: px, y: py })
    if (dots.length > 100) {
        dots.shift()
    }
    for (let i in dots) {
        let dot = dots[i]
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgb(
            ${Math.floor(255 - i * 255 / 100)},
            ${Math.floor(255 - i * 255 / 100)},
            ${Math.floor(255 - i * 255 / 100)})`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.stroke();
        ctx.fill();
    }
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(width / 2, 50);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#AFBFC0';
    ctx.beginPath();
    ctx.arc(px, py, 30, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = '#AFBFC0';
    ctx.beginPath();
    ctx.arc(width / 2, 50, 80, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();


    ctx.textAlign = "center"

    ctx.font = '20px serif';
    let elapsed = performance.now() - countTime
    ctx.fillStyle = 'gold';
    ctx.fillText(`${Math.round(lastElapse / 1e1) / 1e2}`, width / 2, 20);
    ctx.fillStyle = 'black';
    ctx.fillText(`${Math.round(elapsed / 1e2) / 1e1}`, width / 2, 50);
    ctx.fillText(`secs elapsed`, width / 2, 80);
    requestAnimFrame(loop);

}

setup();

var FizzyText = function () {
    this.angle = 30;
    this.mass = 100
    this.length = 400;
};
var gui = new dat.GUI();
var text = new FizzyText();
var slider1 = gui.add(text, 'angle', 0, 90);
var slider2 = gui.add(text, 'length', 100, 500);
var slider3 = gui.add(text, 'mass', 1, 1000);
var obj = {
    set: function () {
        dots = []
        lastTheta = settings.theta
        pendulum = { mass: settings.mass, length: settings.length, theta: settings.theta, omega: 0, alpha: 0, J: 0 };
        pendulum.J = pendulum.mass * pendulum.length * pendulum.length / 500;
    }
};

gui.add(obj, 'set');
/* Here is the update */
var resetSliders = function (name) {
    for (var i = 0; i < gui.__controllers.length; i++) {
        if (!gui.__controllers.property == name)
            gui.__controllers[i].setValue(0);
    }
};

slider1.onChange(function (value) {

    settings.theta = value / 180 * Math.PI
    resetSliders('angle');
});

slider2.onChange(function (value) {

    settings.length = value
    resetSliders('length');
});

slider3.onChange(val => {
    settings.mass = val
    resetSliders('mass');
})
