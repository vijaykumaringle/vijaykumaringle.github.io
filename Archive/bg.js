let ctx = document.body
  .appendChild(document.createElement("canvas"))
  .getContext("2d");
let xdata = document.getElementById("x");
let ydata = document.getElementById("y");

fullScreen();
function fullScreen() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}
addEventListener("resize", () => {
  fullScreen();
});
let mouse = {
  x: undefined,
  y: undefined,
  clicked: false,
};
let randVel = {
  x: Math.random() * 5 - 2.5,
  y: Math.random() * 5 - 2.5,
};
window.addEventListener("click", () => {
  mouse.clicked = !mouse.clicked;
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
class Star {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius * 2;
    this.color = color;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  update() {
    let { x, y } = randVel;
    this.draw();
    let velX = (mouse.x - ctx.canvas.width / 2) * this.radius * 0.01;
    let velY = (mouse.y - ctx.canvas.height / 2) * this.radius * 0.01;
    if (mouse.x || mouse.y) {
      this.x += velX;
      this.y += velY;
    } else {
      this.x += x;
      this.y += y;
    }

    if (this.x - this.radius > ctx.canvas.width) {
      this.x = -this.radius;
    }
    if (this.y - this.radius > ctx.canvas.height) {
      this.y = -this.radius;
    }
    if (this.x + this.radius < 0) {
      this.x = ctx.canvas.width + this.radius;
    }
    if (this.y + this.radius < 0) {
      this.y = ctx.canvas.height + this.radius;
    }
  }
}

function background() {
  ctx.fillStyle = "hsl(266,76%,8%)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

async function InstantiateStars(count) {
  let stars = [];
  return new Promise((resolve) => {
    for (let i = 0; i < count; i++) {
      let rndX = Math.round(Math.random() * ctx.canvas.width);
      let rndY = Math.round(Math.random() * ctx.canvas.height);
      let radius = Math.random();
      let rndC = `hsl(266,76%, ${Math.trunc(Math.round(radius * 100))}%)`;
      stars.push(new Star(rndX, rndY, radius, rndC));
    }

    resolve(stars.sort((a, b) => a.radius - b.radius));
  });
}
let doneStars;
async function sort() {
  doneStars = await InstantiateStars(100);
}
sort();
let line = {
  x: ctx.canvas.width / 2,
  y: ctx.canvas.height / 2,
  draw() {
    if (mouse.clicked) {
      ctx.strokeStyle = "hsl(100,100%,50%)";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      // ctx.stroke();
    }
  },
};

let loop = setInterval(() => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  background();
  for (let i = 0; i < doneStars.length; i++) {
    doneStars[i].update();
  }
  line.draw();
}, 1000 / 60);
