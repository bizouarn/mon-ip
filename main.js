let root = document.documentElement;

update('init');
document.getElementById('colorV').addEventListener('click', () => {
  document.getElementById('colorP').focus();
  document.getElementById('colorP').value = document.getElementById('hexa').value;
  document.getElementById('colorP').click();
});

document.getElementById('colorP').addEventListener('input', () => {
  document.getElementById('hexa').value = document.getElementById('colorP').value;
  changeHexa();
});

[document.getElementById('hexa')].forEach(e => {
  e.addEventListener('input', changeHexa);
});

[document.getElementById('R'), document.getElementById('G'), document.getElementById('B')].forEach((e) => {
  e.addEventListener('input', changeRGB);
});

[document.getElementById('H1'), document.getElementById('S1'), document.getElementById('V')].forEach((e) => {
  e.addEventListener('input', changeHSV);
});

[document.getElementById('H2'), document.getElementById('S2'), document.getElementById('L')].forEach((e) => {
  e.addEventListener('input', changeHSL);
});

[document.getElementById('C'), document.getElementById('M'), document.getElementById('Y'), document.getElementById('K')].forEach((e) => {
  e.addEventListener('input', changeCMYK);
});

function changeHexa() {
  const hexa = document.getElementById('hexa').value;
  document.getElementById('R').value = parseInt(hexa.substring(1, 3), 16);
  document.getElementById('G').value = parseInt(hexa.substring(3, 5), 16);
  document.getElementById('B').value = parseInt(hexa.substring(5, 7), 16);
  update('hexa');
}

function changeRGB() {
  update('RGB');
}

function HS(h, c, x, m) {
  let rbis = 0, gbis = 0, bbis = 0;
  if (0 <= h && h < 60) {
    rbis = c;
    gbis = x;
  } else if (60 <= h && h < 120) {
    rbis = x;
    gbis = c;
  } else if (120 <= h && h < 180) {
    gbis = c;
    bbis = x;
  } else if (180 <= h && h < 240) {
    gbis = x;
    bbis = c;
  } else if (240 <= h && h < 300) {
    rbis = x;
    bbis = c;
  } else if (300 <= h && h < 360) {
    rbis = c;
    gbis = 0;
    bbis = x;
  } else if (h === 360) {
    rbis = 1;
    gbis = 1;
    bbis = 1;
    m = 0;
  }

  document.getElementById('R').value = Math.round((rbis + m) * 255);
  document.getElementById('G').value = Math.round((gbis + m) * 255);
  document.getElementById('B').value = Math.round((bbis + m) * 255);
}

function changeHSV() {
  let h = document.getElementById('H1').value;
  let s = document.getElementById('S1').value;
  let v = document.getElementById('V').value;
  let c = v * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = v - c;

  HS(h, c, x, m);

  update('HSV');
}

function changeHSL() {
  let h = document.getElementById('H2').value;
  let s = document.getElementById('S2').value;
  let l = document.getElementById('L').value;
  let c = ((1 - Math.abs((2 * l) - 1)) * s);
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;

  HS(h, c, x, m);

  update('HSL');
}

function changeCMYK() {
  let c = document.getElementById('C').value;
  let y = document.getElementById('Y').value;
  let m = document.getElementById('M').value;
  let k = document.getElementById('K').value;
  document.getElementById('R').value = Math.round(255 * (1 - c) * (1 - k));
  document.getElementById('G').value = Math.round(255 * (1 - m) * (1 - k));
  document.getElementById('B').value = Math.round(255 * (1 - y) * (1 - k));
  update('CMYK');
}

function update(type) {
  let r = document.getElementById('R').value;
  let g = document.getElementById('G').value;
  let b = document.getElementById('B').value;
  if (type === 'init') {
    if (r === '') document.getElementById('R').value = 255;
    if (g === '') document.getElementById('G').value = 255;
    if (b === '') document.getElementById('B').value = 255;
  } else if (type !== 'RGB') {
    if (r === '') document.getElementById('R').value = 0;
    if (g === '') document.getElementById('G').value = 0;
    if (b === '') document.getElementById('B').value = 0;
  }
  r = document.getElementById('R').value;
  g = document.getElementById('G').value;
  b = document.getElementById('B').value;
  let pr = 100000;
  let rbis = Math.round(r / 255 * pr) / pr;
  let gbis = Math.round(g / 255 * pr) / pr;
  let bbis = Math.round(b / 255 * pr) / pr;
  if (type !== 'hexa') {
    updateHexa(r, g, b);
  }
  if (type !== 'CMYK') {
    updateCMYK(rbis, gbis, bbis, pr);
  }
  if (type !== 'HSV' || type !== 'HSL') {
    updateHS(type, rbis, gbis, bbis);
  }
  root.style.setProperty('--r', r);
  root.style.setProperty('--g', g);
  root.style.setProperty('--b', b);
}

function updateHexa(r, g, b) {
  let hr = Number(r).toString(16);
  let hg = Number(g).toString(16);
  let hb = Number(b).toString(16);
  if (hr.length === 1) {
    hr = '0' + hr;
  }
  if (hg.length === 1) {
    hg = '0' + hg;
  }
  if (hb.length === 1) {
    hb = '0' + hb;
  }
  document.getElementById('hexa').value = '#' + hr + hg + hb;
}

function updateCMYK(rbis, gbis, bbis, pr) {
  let k = Math.round((1 - max([rbis, gbis, bbis])) * pr) / pr;
  document.getElementById('C').value = Math.round((1 - rbis - k) / (1 - k) * 100) / 100;
  document.getElementById('M').value = Math.round((1 - gbis - k) / (1 - k) * 100) / 100;
  document.getElementById('Y').value = Math.round((1 - bbis - k) / (1 - k) * 100) / 100;
  document.getElementById('K').value = Math.round(k * 100) / 100;
  if (document.getElementById('C').value === '') document.getElementById('C').value = 0;
  if (document.getElementById('M').value === '') document.getElementById('M').value = 0;
  if (document.getElementById('Y').value === '') document.getElementById('Y').value = 0;
  if (document.getElementById('K').value === '') document.getElementById('K').value = 0;
}

function updateHS(type, rbis, gbis, bbis) {
  let cmax = max([rbis, gbis, bbis]);
  let cmin = min([rbis, gbis, bbis]);
  let delta = cmax - cmin;
  let l = (cmax + cmin) / 2;
  let h = 0;
  if (cmax === rbis) {
    h = Math.round(60 * (((gbis - bbis) % 6) / delta));
  } else if (cmax === gbis) {
    h = Math.round(60 * (2 + (bbis - rbis) / delta));
  } else if (cmax === bbis) {
    h = Math.round(60 * (4 + (rbis - gbis) / delta));
  }
  if (h < 0) {
    h += 360;
  }
  if (isNaN(h)) h = 0;
  if (type !== 'HSV') {
    document.getElementById('H1').value = h;
    document.getElementById('S1').value = delta === 0 ? 0 : Math.round(delta / (1 - Math.abs(2 * l - 1)) * 100) / 100;
    document.getElementById('V').value = Math.round(cmax * 100) / 100;
  }
  if (type !== 'HSL') {
    document.getElementById('H2').value = h;
    document.getElementById('S2').value = delta === 0 ? 0 : Math.round(delta / (1 - Math.abs(2 * ((cmax + cmin) / 2) - 1)) * 100) / 100;
    document.getElementById('L').value = Math.round((cmax + cmin) / 2 * 100) / 100;
  }
}

function max(tableau) {
  let ret = 0;
  tableau.forEach(element => {
    if (element > ret) {
      ret = element;
    }
  });
  return ret;
}

function min(tableau) {
  let ret = 255;
  tableau.forEach(element => {
    if (element < ret) {
      ret = element;
    }
  });
  return ret;
}
