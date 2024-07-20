const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

class Sakura {
  constructor(img, direction) {
    this.active = false;
    this.img = img;
    this.direction = direction;
    this.x = 0;
    this.y = 0;
    this.s = 0;
    this.r = 0;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.rSpeed = 0;
    this.scale = 0;
  }

  init() {
    this.active = true;
    let random = Math.random() > 0.5;
    const directions = {
      TopRight: () => {
        this.x = random ? getRandom("x") : window.innerWidth;
        this.y = random ? 0 : getRandom("y");
        this.xSpeed = -Math.abs(getRandom("fnx"));
        this.ySpeed = Math.abs(getRandom("fny"));
      },
      TopLeft: () => {
        this.x = random ? getRandom("x") : 0;
        this.y = random ? 0 : getRandom("y");
        this.xSpeed = Math.abs(getRandom("fnx"));
        this.ySpeed = Math.abs(getRandom("fny"));
      },
      BottomRight: () => {
        this.x = random ? getRandom("x") : window.innerWidth;
        this.y = random ? window.innerHeight : getRandom("y");
        this.xSpeed = -Math.abs(getRandom("fnx"));
        this.ySpeed = -Math.abs(getRandom("fny"));
      },
      BottomLeft: () => {
        this.x = random ? getRandom("x") : 0;
        this.y = random ? window.innerHeight : getRandom("y");
        this.xSpeed = Math.abs(getRandom("fnx"));
        this.ySpeed = -Math.abs(getRandom("fny"));
      },
    };

    (this.direction in directions
      ? directions[this.direction]
      : directions.TopRight)();

    this.s = getRandom("s");
    this.r = getRandom("r");
    this.rSpeed = getRandom("fnr");
    this.scale = Math.random() * 0.4 + 0.6;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.r += this.rSpeed;
    if (
      this.x > window.innerWidth ||
      this.x < 0 ||
      this.y > window.innerHeight ||
      this.y < 0
    ) {
      this.active = false;
    }
  }

  draw(cxt) {
    const size = 30 * this.s * this.scale;
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.rotate(this.r);
    cxt.drawImage(this.img, 0, 0, size, size);
    cxt.restore();
  }
}

class SakuraPool {
  constructor(size, img, direction) {
    this.pool = [];
    this.img = img;
    this.direction = direction;
    this.init(size);
  }

  init(size) {
    for (let i = 0; i < size; i++) {
      this.pool.push(new Sakura(this.img, this.direction));
    }
  }

  get() {
    let sakura =
      this.pool.length > 0
        ? this.pool.shift()
        : new Sakura(this.img, this.direction);
    sakura.init();
    return sakura;
  }

  recycle(sakura) {
    sakura.active = false;
    this.pool.push(sakura);
  }
}

class SakuraList {
  constructor(pool) {
    this.list = [];
    this.pool = pool;
  }
  push(sakura) {
    this.list.push(sakura);
  }

  update() {
    for (let i = 0; i < this.list.length; i++) {
      const sakura = this.list[i];
      if (sakura.active) {
        sakura.update();
      } else {
        this.pool.recycle(sakura);
        this.list.splice(i, 1);
        i--;
      }
    }
  }

  draw(cxt) {
    this.list.forEach((sakura) => sakura.draw(cxt));
  }
}

function startSakura(maxSakura, direction, zIndex) {
  const img = new Image();
  img.src = "https://raw.githubusercontent.com/minz71/sakura-rain/main/sakura.png";
  const canvas = document.createElement("canvas");
  const cxt = canvas.getContext("2d");
  if (isMobile) maxSakura = Math.floor(maxSakura * 0.5);
  const sakuraPool = new SakuraPool(maxSakura, img, direction);
  const sakuraList = new SakuraList(sakuraPool);

  setupCanvas(canvas, zIndex);

  img.onload = () => {
    initializeSakura(sakuraList, maxSakura);
    requestAnimationFrame(() => animate(cxt, sakuraList, canvas, maxSakura));
  };

  img.onerror = () => {
    console.error("Failed to load sakura image");
  };

  window.onresize = () => resizeCanvas(canvas);
}

function setupCanvas(canvas, zIndex) {
  resizeCanvas(canvas);
  Object.assign(canvas.style, {
    position: "fixed",
    left: "0",
    top: "0",
    pointerEvents: "none",
    zIndex: zIndex.toString(),
  });
  canvas.id = "canvas_sakura";
  if (!document.getElementById("canvas_sakura")) {
    document.body.appendChild(canvas);
  }
}
function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initializeSakura(sakuraList, maxSakura) {
  for (let i = 0; i < maxSakura; i++) {
    const sakura = sakuraList.pool.get();
    sakura.init();
    sakuraList.push(sakura);
  }
}
function animate(cxt, sakuraList, canvas, maxSakura) {
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  sakuraList.update();
  sakuraList.draw(cxt);

  while (sakuraList.list.length < maxSakura) {
    const sakura = sakuraList.pool.get();
    sakura.init();
    sakuraList.push(sakura);
  }

  requestAnimationFrame(() => animate(cxt, sakuraList, canvas, maxSakura));
}

function getRandom(option) {
  const options = {
    x: () => Math.random() * window.innerWidth,
    y: () => Math.random() * window.innerHeight,
    s: () => Math.random(),
    r: () => Math.random() * 6,
    fnx: () => -Math.random() * xSpeed,
    fny: () => Math.random() * ySpeed,
    fnr: () => Math.random() * rSpeed,
    default: () => 0,
  };
  return (options[option] || options.default)();
}

function useDefault(value, defaultValue) {
  return value !== undefined ? value : defaultValue;
}

const config = window.sakuraConfig || {};
const maxSakura = useDefault(parseInt(config.sakura), 30);
const xSpeed = useDefault(parseFloat(config.xSpeed), 0.5);
const ySpeed = useDefault(parseFloat(config.ySpeed), 0.5);
const rSpeed = useDefault(parseFloat(config.rSpeed), 0.025);
const direction = useDefault(config.direction, "TopRight");
const zIndex = useDefault(parseInt(config.zIndex), -1);

startSakura(maxSakura, direction, zIndex);
