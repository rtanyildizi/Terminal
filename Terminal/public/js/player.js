// defining animation enums
const CROUCH = 0;
const DEATH = 1;
const IDLE = 2;
const JUMP = 3;
const RUN = 4;

const SPACE = 32;
const CRCH = 67;

class Player {
  constructor(name, resource, x, y) {
    this.name = name;
    this.resource = resource;

    this.speed = 7;
    this.direction = 1;

    this.health = 100.0;
    this.armor = 0.0;

    this.animations = [];
    this.currentAnimation;
    this.sounds = [];

    this.pos = createVector(x, y);

    this.rigidBody;
    this.rbw = 10;
    this.rbh = 60;
    this.rby = 0;
    this.gun;
    this.UI;
  }

  setup() {
    this.resourceToAnimations();
    this.rigidBody = new RigidBody(this.pos, this.rbw, this.rbh);
  }

  show() {
    let shadowx;
    let shadowy;

    if (this.direction == 1) {
      shadowx = this.pos.x - 20;
      shadowy = this.pos.y + 12;
    } else {
      shadowx = this.pos.x - 12;
      shadowy = this.pos.y + 12;
    }

    image(
      this.resource.shadow,
      shadowx,
      shadowy,
      this.resource.shadow.width * 2,
      this.resource.shadow.height * 2
    ); // shadow

    this.currentAnimation.play(this.pos.x, this.pos.y, this.direction, 0.2, 2); // player
    // this.rigidBody.draw(this.pos.x, this.pos.y + this.rby); // rigidbody
  }

  update() {
    if (!keyIsPressed) {
      this.currentAnimation = this.animations["idle"];
    }
    if (!(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW))) {
      this.rigidBody.vel.set(0, this.rigidBody.vel.y);
    }
    if (
      (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) &&
      !keyIsDown(DOWN_ARROW)
    ) {
      this.move();
      if (this.rigidBody.collides)
        this.currentAnimation = this.animations["run"];
    }
    if (keyIsDown(UP_ARROW) && this.rigidBody.collides) {
      this.keyPressed();
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.crouch();
      this.currentAnimation = this.animations["crouch"];
      // this.rigidBody.h = this.rbh - 20;
    } else {
      this.rigidBody.h = this.rbh;
    }
    if (keyIsDown(SPACE)) {
      this.die();
      this.currentAnimation = this.animations["death"];
    }

    this.rigidBody.acc.add(this.rigidBody.gravity);
    this.rigidBody.vel.add(this.rigidBody.acc);
    this.rigidBody.pos.add(this.rigidBody.vel);

    this.rigidBody.acc.set(0, 0);

    /*
        if(this.pos.y > height / 2 + 5) {
            this.pos.y = height / 2 + 5;
            this.vel.set(this.vel.x, 0);
        }*/

    this.collidesPlatforms();

    this.pos = this.rigidBody.pos;
  }

  keyPressed() {
    if (keyCode == UP_ARROW) {
      this.jump();
      this.currentAnimation = this.animations["jump"];
      keyCode = 0;
    }
  }

  move() {
    if (keyIsDown(RIGHT_ARROW)) this.direction = 1;

    if (keyIsDown(LEFT_ARROW)) this.direction = -1;

    this.rigidBody.vel.set(this.speed * this.direction, this.rigidBody.vel.y);

    function keyReleased() {
      if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) {
        this.rigidBody.vel.set(0, this.rigidBody.vel.y);
      }
    }
  }

  jump() {
    let jumpPower = -12.0;
    this.rigidBody.acc.add(0, jumpPower);
  }

  crouch() {
    if (keyIsDown(DOWN_ARROW)) {
      if (this.rigidBody.vel.x > 0) this.rigidBody.vel.x -= 0.2;
      if (this.rigidBody.vel.x < 0) {
        this.rigidBody.vel.x += 0.2;
      }
      if (this.rigidBody.vel.x <= 0.2 && this.rigidBody.vel.x >= -0.2)
        this.rigidBody.vel.x = 0.0;
    }
  }

  die() {}

  collidesPlatforms() {
    this.rigidBody.collides = false;
    for (let i = 0; i < platforms.length; i++)
      this.rigidBody.collides |=
        this.rigidBody.collidesPlatform(platforms[i]) ||
        this.rigidBody.collides;

    /*for (let i = 0; i < platforms.length; i++)
      if (this.rigidBody.collidesPlatform(platforms[i])) {
        this.rigidBody.collides = true;
        return;
      } else {
        this.rigidBody.collides = false;
      }*/
    return;
  }

  resourceToAnimations() {
    let res = this.resource;
    this.animations = {
      crouch: new Animation(
        res.spriteSheets[CROUCH],
        res.spriteDatas[CROUCH],
        true
      ),
      death: new Animation(
        res.spriteSheets[DEATH],
        res.spriteDatas[DEATH],
        true
      ),
      idle: new Animation(res.spriteSheets[IDLE], res.spriteDatas[IDLE], false),
      jump: new Animation(res.spriteSheets[JUMP], res.spriteDatas[JUMP], true),
      run: new Animation(res.spriteSheets[RUN], res.spriteDatas[RUN], false)
    };
  }
}

function _keyIsPressed(key) {
  function keyPressed() {
    return key == keyCode;
  }
}