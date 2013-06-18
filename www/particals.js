
var particleObj;


// Set the event listener to run 
// when the device is ready
document.addEventListener("deviceready", onDeviceReady, false);

// The device is ready so let's 
// obtain the current accelerometer data
function onDeviceReady() {
    particleObj = new particleTest();
}



particleTest = function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    //Make the canvas occupy the full page
    var W = window.innerWidth, H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    var particles = [];
    var mouse = {};

    //set default values
    var intXRange, intYRange, intRadius, intLife, intColorR, intColorG, intColorB, intSpeed, intDrawOption;
    //set the default range
    setRangeInt("0");
    //set the default radius
    intRadius = 10;
    //set the default radius
    intLife = 20;
    //buildParticals particles
    buildParticles(100);
    //set speed
    intSpeed = 33;
    var nowPlaying;

    //set intDrawOption
    intDrawOption = "source-over";

    var playing = "fire";

    var base_image;
    make_base();

    function make_base() {
        base_image = new Image();
        base_image.src = 'splash.png';
        base_image.onload = function () {
            ctx.drawImage(base_image, 0, 0, W, H);
            nowPlaying = setInterval(draw, intSpeed);
        }
    }

    this.rebuildParticles = function(particle_count) {
        buildParticles(particle_count);
    }

    function buildParticles(particle_count) {
        particles.length = 0;
        //Lets create some particles now
        for(var i = 0; i < particle_count; i++) {
            particles.push(new particle());
        }
    }

    
    // Start watching the acceleration
    //
    function startWatch() {
        // Update acceleration every 3 seconds
        var options = { frequency: 100 };
        watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    }

    // Stop watching the acceleration
    //
    function stopWatch() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }
    // onError: Failed to get the acceleration
    //
    function onError() {
        //
    }

    canvas.addEventListener("touchstart", touchStart, false);
    //canvas.addEventListener("touchmove", touchMove, false);
    canvas.addEventListener("touchend", touchEnd, false); //test

    var touchLength = 0;
    var touchStart = new Date();
    var touching = false;
    function touchStart(event) {
        touching = true;
        touchStart = new Date();
        mouse.x = event.touches[0].pageX;
        mouse.y = event.touches[0].pageY;
    }

    function touchEnd(event) {
        touching = false;
        touchLength = (new Date() - touchStart);
        if (touchLength > 1000) {
            clearInterval(nowPlaying);
            if (playing === "fire") {
                playing = "sphere";
                nowPlaying = setInterval(render, 1000 / 30);
            } else {
                playing = "fire";
                nowPlaying = setInterval(draw, intSpeed);
            }
        }
    }

    function touchMove(event) {
        if (!e)
            var e = event;
        //e.preventDefault();
        mouse.x = event.targetTouches[0].pageX - canvas.offsetWidth;
        mouse.y = event.targetTouches[0].pageY - canvas.offsetTop;
    }

    // onSuccess: Get a snapshot of the current acceleration
    //
    function onSuccess(acceleration) {
        if (mouse.lastX != acceleration.x.toFixed(2)) {
            mouse.x += ((W / 40) * acceleration.x);
            mouse.lastX = acceleration.x.toFixed(2)
        }
        if (mouse.lastY != acceleration.x.toFixed(2)) {
            mouse.y += ((H / 40) * acceleration.y);
            mouse.lastY = acceleration.y.toFixed(2)
        }
        //mouse.y -= ((H / 40) * acceleration.y);
        //if (mouse.x < 0) mouse.x = 0;
        //if (mouse.x > W) mouse.x = W;
        //if (mouse.y < 0) mouse.y = 0;
        //if (mouse.y > H) mouse.y = H;
        //mouse.y = (H / 2) + ((H / 20) * acceleration.y) + mouse.offsetY;;
    }

    this.setRange = function(direction) {
        setRangeInt(direction);
    }

    function setRangeInt(direction) {
        switch(direction) {
            case "350":
                intXRange = 1.5 - Math.random() * 5;
                intYRange = -15 + Math.random() * 10;
                break;
            case "0":
                intXRange = 0;
                intYRange = -15 + Math.random() * 10;
                break;
            case "10":
                intXRange = -2.5 + Math.random() * 5;
                intYRange = -15 + Math.random() * 10;
                break;
            case "80":
                intXRange = 5 + Math.random() * 10;
                intYRange = -2.5 + Math.random() * 5;
                break;
            case "90":
                intXRange = 5 + Math.random() * 10;
                intYRange = 0;
                break;
            case "100":
                intXRange = 5 + Math.random() * 10;
                intYRange = 1.5 - Math.random() * 5;
                break;
            case "170":
                intXRange = -2.5 + Math.random() * 5;
                intYRange = 5 + Math.random() * 10;
                break;
            case "180":
                intXRange = 0;
                intYRange = 5 + Math.random() * 10;
                break;
            case "190":
                intXRange = 1.5 - Math.random() * 5;
                intYRange = 5 + Math.random() * 10;
                break;
            case "260":
                intXRange = -15 + Math.random() * 10;
                intYRange = -2.5 + Math.random() * 5;
                break;
            case "270":
                intXRange = -15 + Math.random() * 10;
                intYRange = 0;
                break;
            case "280":
                intXRange = -15 + Math.random() * 10;
                intYRange = 1.5 - Math.random() * 5;
                break;
        }
        ///document.getElementById("xRangeDisplay").innerText = intXRange;
        //document.getElementById("yRangeDisplay").innerText = intYRange;
    }

    this.setRadius = function(r) {
        intRadius = Number(r);
    }

    this.setLife = function(l) {
        intLife = Number(l);
    }

    this.drawOption = function(v) {
        intDrawOption = v;
    }

    this.setSpeed = function(s) {
        intSpeed = Number(s);
        clearInterval(nowPlaying);
        nowPlaying = setInterval(draw, intSpeed);
    }
    function particle() {
        //speed, life, location, life, colors
        this.speed = { x: intXRange, y: intYRange };
        //location = mouse coordinates
        //Now the flame follows the mouse coordinates
        if(mouse.x && mouse.y) {
            this.location = { x: mouse.x, y: mouse.y };
        }
        else {
            this.location = { x: ((W / 4) * 3), y: ((H / 4)) };
            mouse.x = this.location.x;
            mouse.y = this.location.y;
            mouse.lastX =  0;
            mouse.lastY = 0;
        }

        //make sure it stays on screen
        if (this.location.x < 0) this.location.x = 0;
        if (this.location.x > W) this.location.x = W;
        if (this.location.y < 0) this.location.y = 0;
        if (this.location.y > H) this.location.y = H;

        //radius range = 10-30
        this.radius = intRadius + Math.random() * 20;
        //life range = 20-30
        this.life = intLife + Math.random() * 10;
        this.remaining_life = this.life;
        //colors
        this.r = Math.round(Math.random() * 255);
        this.g = Math.round(Math.random() * 255);
        this.b = Math.round(Math.random() * 255);
    }

    function draw() {
        //Painting the canvas black
        //Time for lighting magic
        //particles are painted with "lighter"
        //In the next frame the background is painted normally without blending to the 
        //previous frame
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(base_image, 0, 0, W, H);
        ctx.fillStyle = 'black';
        ctx.font = "18px Arial";
        ctx.strokeText("Touch or tilt to move flame", 10, (H - 40));
        ctx.font = "18px Arial";
        ctx.strokeText("Touch for 1 second to change animation", 10, (H - 20));

        //ctx.fillStyle = "black";
        //ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = intDrawOption;

        for(var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.beginPath();
            //changing opacity according to the life.
            //opacity goes to 0 at the end of life of a particle
            p.opacity = Math.round(p.remaining_life / p.life * 100) / 100
            //a gradient instead of white fill
            var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
            gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
            gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
            ctx.fillStyle = gradient;
            ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
            ctx.fill();

            //lets move the particles
            p.remaining_life--;
            p.radius--;
            p.location.x += p.speed.x;
            p.location.y += p.speed.y;

            //regenerate particles
            if(p.remaining_life < 0 || p.radius < 0) {
                //a brand new particle replacing the dead one
                particles[i] = new particle();
            }
        }
    }

    var sphere = new Sphere3D();
    var rotation = 0;
    var distance = 0;

    function Point3D() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.selected = false;
        this.color = function () { var c = (this.selected) ? "rgba(100, 100, 100, 0.6)" : "rgba(200, 200, 200, 0.6)"; return c; }
        this.gradient = function () { var c = (this.selected) ? "rgb(200,0,0)" : "rgb(0,200,0)"; return c; }
    }

    function Sphere3D(radius) {
        this.point = new Array();
        this.color = "rgb(100,0,255)"
        this.radius = (typeof (radius) == "undefined") ? 20.0 : radius;
        this.radius = (typeof (radius) != "number") ? 20.0 : radius;
        this.numberOfVertexes = 0;

        // Ciclo da 0ø a 360ø con passo di 10ø...calcola la circonf. di mezzo
        for (alpha = 0; alpha <= 6.28; alpha += 0.17) {
            p = this.point[this.numberOfVertexes] = new Point3D();

            p.x = Math.cos(alpha) * this.radius;
            p.y = 0;
            p.z = Math.sin(alpha) * this.radius;

            this.numberOfVertexes++;
        }

        // Ciclo da 0ø a 90ø con passo di 10ø...calcola la prima semisfera (direction = 1)
        // Ciclo da 0ø a 90ø con passo di 10ø...calcola la seconda semisfera (direction = -1)

        for (var direction = 1; direction >= -1; direction -= 2) {
            for (var beta = 0.17; beta < 1.445; beta += 0.17) {
                var radius = Math.cos(beta) * this.radius;
                var fixedY = Math.sin(beta) * this.radius * direction;

                for (var alpha = 0; alpha < 6.28; alpha += 0.17) {
                    p = this.point[this.numberOfVertexes] = new Point3D();

                    p.x = Math.cos(alpha) * radius;
                    p.y = fixedY;
                    p.z = Math.sin(alpha) * radius;

                    this.numberOfVertexes++;
                }
            }
        }

    }

    function rotateX(point, radians) {
        var y = point.y;
        point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
        point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
    }

    function rotateY(point, radians) {
        var x = point.x;
        point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
        point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
    }

    function rotateZ(point, radians) {
        var x = point.x;
        point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
        point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
    }

    function projection(xy, z, xyOffset, zOffset, distance) {
        return ((distance * xy) / (z - zOffset)) + xyOffset;
    }

    function render() {
        var width = W;
        var height = H;
        var x, y;

        var p = new Point3D();

        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = "lighter";

        for (i = 0; i < sphere.numberOfVertexes; i++) {

            p.x = sphere.point[i].x;
            p.y = sphere.point[i].y;
            p.z = sphere.point[i].z;


            rotateX(p, rotation);
            rotateY(p, rotation);
            rotateZ(p, rotation);

            x = projection(p.x, p.z, width / 2.0, 100.0, distance);
            y = projection(p.y, p.z, height / 2.0, 100.0, distance);

            if ((x >= 0) && (x < width)) {
                if ((y >= 0) && (y < height)) {
                    if (touching && x.toFixed(0) > mouse.x && x.toFixed(0) < mouse.x + 20 && y.toFixed(0) > mouse.y && y.toFixed(0) < mouse.y + 20) {
                        sphere.point[i].selected = !sphere.point[i].selected;
                    }
                    if (p.z < 0) {
                        drawPoint(ctx, x, y, 4, sphere.point[i].color());
                    } else {
                        drawPointWithGradient(ctx, x, y, 10, sphere.point[i].gradient(), 0.8);
                    }
                }
            }
        }
        ctx.restore();
        ctx.fillStyle = "rgb(150,150,150)";
        ctx.fillText("Touch balls to change their colour", 10, (H - 40));
        ctx.fillText("Touch for 1 second to change animation", 10, (H - 20));
        rotation += Math.PI / 90.0;

        if (distance < 700) {
            distance += 10;
        }
    }

    function drawPoint(ctx, x, y, size, color) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, size, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.restore();
    }

    function drawPointWithGradient(ctx, x, y, size, color, gradient) {
        var reflection;

        reflection = size / 4;

        ctx.save();
        ctx.translate(x, y);
        var radgrad = ctx.createRadialGradient(-reflection, -reflection, reflection, 0, 0, size);

        radgrad.addColorStop(0, '#FFFFFF');
        radgrad.addColorStop(gradient, color);
        radgrad.addColorStop(1, 'rgba(1,159,98,0)');

        ctx.fillStyle = radgrad;
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.restore();
    }
    
    function drawHalo(ctx, x, y, size, color, gradient) {
        var reflection;

        reflection = size / 4;

        ctx.save();
        ctx.translate(x, y);
        var radgrad = ctx.createRadialGradient(0, 0, reflection, 0, 0, size);

        radgrad.addColorStop(0, '#FFFFFF');
        radgrad.addColorStop(gradient, color);
        radgrad.addColorStop(1, 'rgba(1,159,98,0)');

        ctx.fillStyle = radgrad;
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.restore();
    }

    startWatch();


}