//Cursor

//look at fixes in the Pen https://codepen.io/ghaste/pen/OJqLbvg
//for adding mouse trail to a page that scrolls beyond the viewport, as would be the case with most websites - lol
let x1 = 0,
  y1 = 0;
window.client;
const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  ),
  dist_to_draw = 50,
  delay = 1000,
  fsize = ["1.1rem", "1.4rem", ".8rem", "1.7rem"],
  colors = ["#E23636", "#F9F3EE", "#E1F8DC", "#B8AFE6", "#AEE1CD", "#5EB0E5"],
  rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  selRand = (o) => o[rand(0, o.length - 1)],
  distanceTo = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
  shouldDraw = (x, y) => distanceTo(x1, y1, x, y) >= dist_to_draw,
  addStr = (x, y) => {
    const str = document.createElement("div");
    str.innerHTML = "&#10022;";
    str.className = "star";
    str.style.top = `${y + rand(-20, 20)}px`;
    str.style.left = `${x}px`;
    str.style.color = selRand(colors);
    str.style.fontSize = selRand(fsize);
    document.body.appendChild(str);
    //console.log(rand(0, 3));
    const fs = 10 + 5 * parseFloat(getComputedStyle(str).fontSize);
    //console.log(vh, y, fs);
    //console.log((y+fs)>vh?vh-y:fs);
    str.animate(
      {
        translate: `0 ${y + fs > vh ? vh - y : fs}px`,
        opacity: 0,
        transform: `rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`,
      },
      {
        duration: delay,
        fill: "forwards",
      }
    );
    //could add a animation terminate listener, but why add the additional load
    setTimeout(() => {
      str.remove();
    }, delay);
  };

addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  if (shouldDraw(clientX, clientY)) {
    addStr(clientX, clientY);
    x1 = clientX;
    y1 = clientY;
  }
});

//KALP
e = []; // trails
h = []; // heart path
O = c.width = innerWidth;
Q = c.height = innerHeight;

v = 32; // num trails, num particles per trail & num nodes in heart path
M = Math;
R = M.random;
C = M.cos;
Y = 6.3; // close to 44/7 or Math.PI * 2 - 6.3 seems is close enough.
for (i = 0; i < Y; i += 0.2) {
  // calculate heart nodes, from http://mathworld.wolfram.com/HeartCurve.html
  h.push([
    O / 2 + 180 * M.pow(M.sin(i), 3),
    Q / 2 + 10 * -(15 * C(i) - 5 * C(2 * i) - 2 * C(3 * i) - C(4 * i)),
  ]);
}

i = 0;
while (i < v) {
  x = R() * O;
  y = R() * Q;
  //r = R() * 50 + 200;
  //b = R() * r;
  //g = R() * b;

  H = (i / v) * 80 + 280;
  S = R() * 40 + 60;
  B = R() * 60 + 20;

  f = []; // create new trail

  k = 0;
  while (k < v) {
    f[k++] = {
      // create new particle
      x: x, // position
      y: y,
      X: 0, // velocity
      Y: 0,
      R: 1 - k / v + 1, // radius
      S: R() + 1, // acceleration
      q: ~~(R() * v), // target node on heart path
      //D : R()>.5?1:-1,
      D: (i % 2) * 2 - 1, // direction around heart path
      F: R() * 0.2 + 0.7, // friction
      //f : "rgba(" + ~~r + "," + ~~g + "," + ~~b + ",.1)"
      f: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)", // colour
    };
  }

  e[i++] = f; // dots are a 2d array of trails x particles
}

function render(_) {
  // draw particle
  a.fillStyle = _.f;
  a.beginPath();
  a.arc(_.x, _.y, _.R, 0, Y, 1);
  a.closePath();
  a.fill();
}

function loop() {
  a.fillStyle = "rgba(0,0,0,.2)"; // clear screen
  a.fillRect(0, 0, O, Q);

  i = v;
  while (i--) {
    f = e[i]; // get worm
    u = f[0]; // get 1st particle of worm
    q = h[u.q]; // get current node on heart path
    D = u.x - q[0]; // calc distance
    E = u.y - q[1];
    G = M.sqrt(D * D + E * E);

    if (G < 10) {
      // has trail reached target node?
      if (R() > 0.95) {
        // randomly send a trail elsewhere
        u.q = ~~(R() * v);
      } else {
        if (R() > 0.99) u.D *= -1; // randomly change direction
        u.q += u.D;
        u.q %= v;
        if (u.q < 0) u.q += v;
      }
    }

    u.X += (-D / G) * u.S; // calculate velocity
    u.Y += (-E / G) * u.S;

    u.x += u.X; // apply velocity
    u.y += u.Y;

    render(u); // draw the first particle

    u.X *= u.F; // apply friction
    u.Y *= u.F;

    k = 0;
    while (k < v - 1) {
      // loop through remaining dots

      T = f[k]; // this particle
      N = f[++k]; // next particle

      N.x -= (N.x - T.x) * 0.7; // use zenos paradox to create trail
      N.y -= (N.y - T.y) * 0.7;

      render(N);
    }
  }
} // eo loop()

(function doit() {
  requestAnimationFrame(doit);
  loop();
})();
