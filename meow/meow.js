//THREEJS RELATED VARIABLES

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  gobalLight, shadowLight, backLight,
  renderer,
  container,
  controls;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  },
  oldMousePos = {
    x: 0,
    y: 0
  },
  ballWallDepth = 28;

//3D OBJECTS VARIABLES

var hero;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 250;
  camera.lookAt(new THREE.Vector3(0, 60, 0));

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  /*
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = -Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.noZoom = true;
  controls.noPan = true;
  //*/

}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
  mousePos = {
    x: event.clientX,
    y: event.clientY
  };
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mousePos = {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY
    };
  }
}

function createLights() {
  globalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;
  shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 100, 100);
  backLight.castShadow = true;
  backLight.shadowDarkness = .1;
  backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;

  scene.add(globalLight);
  scene.add(shadowLight);
  scene.add(backLight);
}

function createFloor() {
  floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({
    color: 0x6ecccc
  }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);
}

function createHero() {
  hero = new Cat();
  scene.add(hero.threeGroup);
}

function createBall() {
  ball = new Ball();
  scene.add(ball.threeGroup);
}

// BALL RELATED CODE

var woolNodes = 10,
  woolSegLength = 2,
  gravity = -.8,
  accuracy = 1;

Ball = function() {

  var redMat = new THREE.MeshLambertMaterial({
    color: 0x630d15,
    shading: THREE.FlatShading
  });

  var stringMat = new THREE.LineBasicMaterial({
    color: 0x630d15,
    linewidth: 3
  });

  this.threeGroup = new THREE.Group();
  this.ballRay = 8;

  this.verts = [];

  // string
  var stringGeom = new THREE.Geometry();

  for (var i = 0; i < woolNodes; i++) {
    var v = new THREE.Vector3(0, -i * woolSegLength, 0);
    stringGeom.vertices.push(v);

    var woolV = new WoolVert();
    woolV.x = woolV.oldx = v.x;
    woolV.y = woolV.oldy = v.y;
    woolV.z = 0;
    woolV.fx = woolV.fy = 0;
    woolV.isRootNode = (i == 0);
    woolV.vertex = v;
    if (i > 0) woolV.attach(this.verts[(i - 1)]);
    this.verts.push(woolV);

  }
  this.string = new THREE.Line(stringGeom, stringMat);

  // body
  var bodyGeom = new THREE.SphereGeometry(this.ballRay, 5, 4);
  this.body = new THREE.Mesh(bodyGeom, redMat);
  this.body.position.y = -woolSegLength * woolNodes;

  var wireGeom = new THREE.TorusGeometry(this.ballRay, .5, 3, 10, Math.PI * 2);
  this.wire1 = new THREE.Mesh(wireGeom, redMat);
  this.wire1.position.x = 1;
  this.wire1.rotation.x = -Math.PI / 4;

  this.wire2 = this.wire1.clone();
  this.wire2.position.y = 1;
  this.wire2.position.x = -1;
  this.wire1.rotation.x = -Math.PI / 4 + .5;
  this.wire1.rotation.y = -Math.PI / 6;

  this.wire3 = this.wire1.clone();
  this.wire3.rotation.x = -Math.PI / 2 + .3;

  this.wire4 = this.wire1.clone();
  this.wire4.position.x = -1;
  this.wire4.rotation.x = -Math.PI / 2 + .7;

  this.wire5 = this.wire1.clone();
  this.wire5.position.x = 2;
  this.wire5.rotation.x = -Math.PI / 2 + 1;

  this.wire6 = this.wire1.clone();
  this.wire6.position.x = 2;
  this.wire6.position.z = 1;
  this.wire6.rotation.x = 1;

  this.wire7 = this.wire1.clone();
  this.wire7.position.x = 1.5;
  this.wire7.rotation.x = 1.1;

  this.wire8 = this.wire1.clone();
  this.wire8.position.x = 1;
  this.wire8.rotation.x = 1.3;

  this.wire9 = this.wire1.clone();
  this.wire9.scale.set(1.2, 1.1, 1.1);
  this.wire9.rotation.z = Math.PI / 2;
  this.wire9.rotation.y = Math.PI / 2;
  this.wire9.position.y = 1;

  this.body.add(this.wire1);
  this.body.add(this.wire2);
  this.body.add(this.wire3);
  this.body.add(this.wire4);
  this.body.add(this.wire5);
  this.body.add(this.wire6);
  this.body.add(this.wire7);
  this.body.add(this.wire8);
  this.body.add(this.wire9);

  this.threeGroup.add(this.string);
  this.threeGroup.add(this.body);

  this.threeGroup.traverse(function(object) {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

}

/*
The next part of the code is largely inspired by this codepen :
http://codepen.io/dissimulate/pen/KrAwx?editors=001
thanks to dissimulate for his great work
*/

/*
Copyright (c) 2013 dissimulate at Codepen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

WoolVert = function() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.oldx = 0;
  this.oldy = 0;
  this.fx = 0;
  this.fy = 0;
  this.isRootNode = false;
  this.constraints = [];
  this.vertex = null;
}

WoolVert.prototype.update = function() {
  var wind = 0; //.1+Math.random()*.5;
  this.add_force(wind, gravity);

  nx = this.x + ((this.x - this.oldx) * .9) + this.fx;
  ny = this.y + ((this.y - this.oldy) * .9) + this.fy;
  this.oldx = this.x;
  this.oldy = this.y;
  this.x = nx;
  this.y = ny;

  this.vertex.x = this.x;
  this.vertex.y = this.y;
  this.vertex.z = this.z;

  this.fy = this.fx = 0
}

WoolVert.prototype.attach = function(point) {
  this.constraints.push(new Constraint(this, point));
};

WoolVert.prototype.add_force = function(x, y) {
  this.fx += x;
  this.fy += y;
};

Constraint = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.length = woolSegLength;
};

Ball.prototype.update = function(posX, posY, posZ) {

  var i = accuracy;

  while (i--) {

    var nodesCount = woolNodes;

    while (nodesCount--) {

      var v = this.verts[nodesCount];

      if (v.isRootNode) {
        v.x = posX;
        v.y = posY;
        v.z = posZ;
      } else {

        var constraintsCount = v.constraints.length;

        while (constraintsCount--) {

          var c = v.constraints[constraintsCount];

          var diff_x = c.p1.x - c.p2.x,
            diff_y = c.p1.y - c.p2.y,
            dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
            diff = (c.length - dist) / dist;

          var px = diff_x * diff * .5;
          var py = diff_y * diff * .5;

          c.p1.x += px;
          c.p1.y += py;
          c.p2.x -= px;
          c.p2.y -= py;
          c.p1.z = c.p2.z = posZ;
        }

        if (nodesCount == woolNodes - 1) {
          this.body.position.x = this.verts[nodesCount].x;
          this.body.position.y = this.verts[nodesCount].y;
          this.body.position.z = this.verts[nodesCount].z;

          this.body.rotation.z += (v.y <= this.ballRay) ? (v.oldx - v.x) / 10 : Math.min(Math.max(diff_x / 2, -.1), .1);
        }
      }

      if (v.y < this.ballRay) {
        v.y = this.ballRay;
      }
    }
  }

  nodesCount = woolNodes;
  while (nodesCount--) this.verts[nodesCount].update();

  this.string.geometry.verticesNeedUpdate = true;

}

Ball.prototype.receivePower = function(tp) {
  this.verts[woolNodes - 1].add_force(tp.x, tp.y);
}

// Enf of the code inspired by dissmulate

// Make everything work together :

var t = 0;

function loop() {
  render();

  t += .05;
  hero.updateTail(t);

  var ballPos = getBallPos();
  ball.update(ballPos.x, ballPos.y, ballPos.z);
  ball.receivePower(hero.transferPower);
  hero.interactWithBall(ball.body.position);

  requestAnimationFrame(loop);
}

function getBallPos() {
  var vector = new THREE.Vector3();

  vector.set(
    (mousePos.x / window.innerWidth) * 2 - 1, -(mousePos.y / window.innerHeight) * 2 + 1,
    0.1);

  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = (ballWallDepth - camera.position.z) / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  return pos;
}

function render() {
  if (controls) controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

function init(event) {
  initScreenAnd3D();
  createLights();
  createFloor()
  createHero();
  createBall();
  loop();
}
