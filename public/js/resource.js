const CROUCH = 0;
const DEATH = 1;
const IDLE = 2;
const JUMP = 3;
const RUN = 4;

// This is a class for holding sprite and json resources for animations of players.
class Resource {
  constructor(name) {
    this.name = name;
    this.spriteSheets = [];
    this.spriteDatas = [];
  }
}
// Defining the certain types of players and their animation types.
let typeArr = ["Crouch", "Death", "Idle", "Jump", "Run"];
let clrArr = ["Black", "Yellow", "Red", "Blue"];

let currSheets = [];
let currDatas = [];
let currShadow;

let platformSprite1;
let platformSprite2;

let IDjson;

// preload is a reserved function to upload the resources for the project, in advance.
function preload() {
  for (let i = 0; i < clrArr.length; i++) {
    for (let j = 0; j < typeArr.length; j++) {
      let source =
        "res/character_sprites/" +
        clrArr[i] +
        "/Gunner_" +
        clrArr[i] +
        "_" +
        typeArr[j] +
        ".png";
      spriteSheet = loadImage(source);
      currSheets.push(spriteSheet);
    }
  }

  for (let i = 0; i < typeArr.length; i++) {
    let source = "res/json_files/Character_" + typeArr[i] + ".json";
    spriteData = loadJSON(source);
    currDatas.push(spriteData);
  }

  currShadow = loadImage("res/extras/Shadow.png");
  platformSprite1 = loadImage("res/extras/Platform.png");
  platformSprite2 = loadImage("res/extras/Platform2.png");

  IDjson = loadJSON("res/levels/id.json");
}

let resources = [];
function loadResources() {
  resources = {
    black: new Resource("black"),
    yellow: new Resource("yellow"),
    red: new Resource("yellow"),
    blue: new Resource("blue")
  };

  let keys = Object.keys(resources);

  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < typeArr.length; j++) {
      resources[keys[i]].spriteSheets.push(currSheets[i * typeArr.length + j]);
    }
    resources[keys[i]].spriteDatas = currDatas;
    resources[keys[i]].shadow = currShadow;
  }
}

function resourceToAnimations(resource) {
  let res = resource;
  animations = {
    crouch: new Animation(
      res.spriteSheets[CROUCH],
      res.spriteDatas[CROUCH],
      true
    ),
    death: new Animation(res.spriteSheets[DEATH], res.spriteDatas[DEATH], true),
    idle: new Animation(res.spriteSheets[IDLE], res.spriteDatas[IDLE], false),
    jump: new Animation(res.spriteSheets[JUMP], res.spriteDatas[JUMP], true),
    run: new Animation(res.spriteSheets[RUN], res.spriteDatas[RUN], false)
  };

  return animations;
}