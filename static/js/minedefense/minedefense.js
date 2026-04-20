/*-------------------------------------------------------------------------------------------------
 All code is copyright Keilan, 2014.
 http://scholtek.com
 Feel free to use the code for learning purposes or adapt sections for building
 your own stuff, but do not claim it as your own.
 /------------------------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------------
 GENERAL HELPER FUNCTIONS
 /------------------------------------------------------------------------------------------------*/
function get(item) {
    return document.getElementById(item);
}

//Converts numbers followed by an SI suffix K,M,G,T,P,E,Z,Y or the unofficial Jim Blowers extensions X, W, V, U, D (Trenda), S, R, Q (10^48)
//Also works on unprefixed numbers
var SI_SUFFIXES = ["K","M","G","T","P", "E", "Z", "Y", "X", "W", "V", "U",   "D",   "S",   "R",   "Q",   "KQ",  "MQ",  "GQ",  "TQ",  "PQ","EQ",  "ZQ",  "YQ",  "XQ",  "WQ",  "VQ",  "UQ",  "DQ",  "SQ",  "RQ", "QQ","KQQ","MQQ"];
var SS_SUFFIXES = ["K","M","B","T","Qa","Qi","Sx","Sp","Oc","No","De","UnDe","DuDe","TrDe","QaDe","QiDe","SxDe","SpDe","OcDe","NoDe","Vi","UnVi","DuVi","TrVi","QaVi","QiVi","SxVi","SpVi","OcVi","NoVi","Tri","UnTri","DuTri","TrTri"];
var SI_VALUES = [1e3,1e6,1e9,1e12,1e15,1e18,1e21,1e24,1e27,1e30,1e33,1e36,1e39,1e42,1e45,1e48,1e51,1e54,1e57,1e60,1e63,1e66,1e69,1e72,1e75,1e78,1e81,1e84,1e87,1e90,1e93,1e96,1e99,1e102];
function n(str_number){
    str_number = (typeof(str_number) == "number" ? str_number.toString() : str_number);
    var suffix = str_number[str_number.length-1];

    //Check for longer suffixes
    var sufIndex = 0;
    for(sufIndex=0; sufIndex < str_number.length; sufIndex++){
        //Find the start of the suffix
        if(!$.isNumeric(str_number[sufIndex]) && str_number[sufIndex] != "." && str_number[sufIndex] != "-")
            break;
    }
    var num = str_number.substring(0,sufIndex);
    var suf = str_number.substring(sufIndex);

    var pos = SI_SUFFIXES.indexOf(suf);
    if (pos != -1){
        return  Number(num)*SI_VALUES[pos]
    }
    else {
        return Number(num)
    }
}

//The reverse of n above
//Note that the scientific notation version uses <sup> tags, which don't work in some places
//so we allow plain=True to be passed in, replacing those with ^ notation for exponents
//Also note that to pass in a value for highprecision, we must also set plain
function s(number,plain,highprecision){
    if (number === Infinity)
        return "&infin;";

    if(number >= SI_VALUES[SI_VALUES.length-1]*1000){
        return String(number.toPrecision(3));
    }

    setDefault(highprecision,false);

    if(MD.NUMBER_SYSTEM == "SI")
        return s_siunits(number,highprecision);
    else if(MD.NUMBER_SYSTEM == "SS")
        return s_shortscale(number,highprecision);
    else
        return s_scinotation(number,plain,highprecision);
}

function s_siunits(number,highprecision){
    var DECIMAL_PRECISION = (highprecision ? 6 : 3); //How many digits to round numbers to
    var suffix = 0;
    for (;suffix < SI_VALUES.length;suffix++){
        if (Math.abs(number) < SI_VALUES[suffix]){
            break
        }
    }
    suffix--;
    var val;
    if (suffix == -1){
        val = Math.round(number * Math.pow(10,DECIMAL_PRECISION)) / Math.pow(10,DECIMAL_PRECISION);
        if (val == 1000){
            return "1" + SI_SUFFIXES[0]
        }
        return  val.toString()
    }
    else{
        val = number/SI_VALUES[suffix];
        val = Math.round(val * Math.pow(10,DECIMAL_PRECISION)) / Math.pow(10,DECIMAL_PRECISION);
        if (val == 1000 && suffix+1 < SI_VALUES.length){
            return "1" + SI_SUFFIXES[suffix+1]
        }
        return val.toString() + SI_SUFFIXES[suffix]
    }
}

function s_shortscale(number,highprecision){
    var DECIMAL_PRECISION = (highprecision ? 6 : 3); //How many digits to round numbers to
    var suffix = 0;
    for (;suffix < SI_VALUES.length;suffix++){
        if (Math.abs(number) < SI_VALUES[suffix]){
            break
        }
    }
    suffix--;
    if (suffix == -1){
        val = Math.round(number * Math.pow(10,DECIMAL_PRECISION)) / Math.pow(10,DECIMAL_PRECISION);
        if (val == 1000){
            return "1" + SI_SUFFIXES[0]
        }
        return  val.toString()
    }
    else{
        var val = number/SI_VALUES[suffix];
        val = Math.round(val * Math.pow(10,DECIMAL_PRECISION)) / Math.pow(10,DECIMAL_PRECISION);
        if (val == 1000 && suffix+1 < SI_VALUES.length){
            return "1" + SS_SUFFIXES[suffix+1]
        }
        return val.toString() + SS_SUFFIXES[suffix]
    }
}

function s_scinotation(number,plain,highprecision){
    plain = setDefault(plain,false);

    var DECIMAL_PRECISION = (highprecision ? 6 : 3); //How many digits to round numbers to
    var suffix = 0;
    for (;suffix < SI_VALUES.length;suffix++){
        if (Math.abs(number) < SI_VALUES[suffix]){
            break
        }
    }
    suffix--;
    if (suffix == -1){
        val = Math.round(number * Math.pow(10,DECIMAL_PRECISION)) / Math.pow(10,DECIMAL_PRECISION);
        if (val == 1000){
            if(plain)
                return "1e+3";
            else
                return "1 x 10<sup>3</sup>";
        }
        return  val.toString()
    }
    else{
        var val = number/SI_VALUES[suffix];
        val = Math.round(val * Math.pow(10,DECIMAL_PRECISION)) / Math.pow(10,DECIMAL_PRECISION);
        if (val == 1000 && suffix+1 < SI_VALUES.length){
            if(plain)
                return "1e+" + (suffix+2)*3;
            else
                return "1 x 10<sup>" + (suffix+2)*3 + "</sup>";
        }
        if(plain)
            return val.toString() +  "e+" + (suffix+1)*3;
        else
            return val.toString() +  " x 10<sup>" + (suffix+1)*3 + "</sup>";
    } 
}

//Rounds to the tenth
function roundTenth(x){
    return Math.round(10*x)/10;
}

//Gets a random integer between min and max
function getRandom(min, max){
    return Math.floor(Math.random() * (max-min+1)) + min;
}

//Given a percentage, returns True that percentage fo the time, and False otherwise
function tryPercentChance(p){
    return ((p/100) > Math.random())
}

function sumArray(a,lb){
    lb = setDefault(lb,0)
    var count=0;
    for (var i = a.length-1; i>=lb; i--){
        count += a[i]
    }
    return count
}

function swapArray(a,i,j){
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

//Counts the elements in a equaling v
function countElements(a,v){
    var count=0;
    for (var i = a.length; i--;){
        if(a[i] == v)
            count += 1;
    }
    return count
}

//Used to calculate the cost of buying n things with a starting cost of s and an increment exponent of e
//noinspection JSUnusedGlobalSymbols
function getTotalCost(s,n,r){
    return s*((1-Math.pow(r,n))/(1-r))
}

function clearSelectBox(selectbox){
    var i;
    for(i=selectbox.options.length-1;i>=0;i--){
        selectbox.remove(i);
    }
}

//Normal Distribution functions approximated by adding 3 random numbers and a function for testing them
function snd(){
    return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function gaussianRandom(mean,stdev){
    return (snd()*stdev)+mean
}

function testRandomDist(m,s){
    var x = [0,0,0,0,0,0,0,0,0,0]
    for(var i = 0; i < 10000; i++){
        var r = gaussianRandom(m,s);
        if(r > 0){
            r = Math.round(r);
            r = Math.max(Math.min(9,r),0);
            x[r]++;
        }
    }
    
    for(var i = 0; i < x.length; i++){
        console.log(i + " " + x[i]/100 + "%");
    }
}

//Given two numbers, returns a char indicating the relation (>,<, or =)
function getComparisonSymbol(first,second){
    if(first > second){
        return ">";
    }
    else if(first < second){
        return "<";
    }
    else{
        return "=";
    }
}

//Used to set a variable to default if it's undefined
function setDefault(v,def){
    return typeof v !== 'undefined' ? v : def; 
}

//Given 4 points representing two line segments, checks if they intersect
function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return true;
}

//Given a point p and the 4 points of the rectangle, uses the ray-casting algorithm to determine if the point
//is in the quadrilateral
function pointInQuad(p,quad){
    //Find a suitable ray
    var max = 0;
    for(var i = 0; i < quad.length; i++){
        if(quad[i][0] > max)
            max = quad[i][0];
    }
    max *= 10; //If x is greater than the greater x value, we know it is outside the figure

    //See how many lines intersect the ray
    sum = 0; 
    for(i = 0; i < quad.length; i++){

        if(lineIntersect(p[0],p[1],max,0, quad[i][0],quad[i][1],quad[(i+1)%4][0],quad[(i+1)%4][1])){
            sum++;
        }
    }
    
    return (sum%2 != 0); //If the sum is odd, it is in the quadrilateral
}

//Allow title case
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

/*-------------------------------------------------------------------------------------------------
 DRAWING HELPER FUNCTIONS
 /------------------------------------------------------------------------------------------------*/
/**
 * Draws a rounded rectangle using the current state of the canvas. 
 * If you omit the last three params, it will draw a rectangle 
 * outline with a 5 pixel border radius 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate 
 * @param {Number} width The width of the rectangle 
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }        
}

/*-------------------------------------------------------------------------------------------------
 CONSTANTS - Effect the flow and progression of the game
 /------------------------------------------------------------------------------------------------*/
MD = {}; //This is the main object that contains all the game related code

//Meta
MD.VERSION = "1.032";
MD.HTML5_LOCAL_STORAGE_NAME = "SCHOLTEK-MINEDEFENSE-SAVEOBJECT";

//Progression
MD.PRICE_MULTIPLIER = 1.2; //How much the hireling price goes up with every purchase
MD.ALCH_MULTIPLIER = 1.15;
MD.WYVERN_MULTIPLIER = 1.18;
MD.HIVE_QUEEN_MULTIPLIER = 1.19;
MD.IMBUE_MULTIPLIER = 1.3;

//Enemies
MD.GOBLIN_TIME = 35; //How often Goblins appear (avg)
MD.GOBLIN_TIME_VARIATION = 10; //The variation in goblin appearance time
MD.GOBLIN_LEVEL_VARIATION = 2; //Maximum distance from the current level that goblins can spawn
MD.GOBLIN_KILLS_PER_LEVEL = 8; //The number of goblins you have to kill before they level up
MD.GOBLIN_REWARD = 4000; //The reward (per level) for killing a goblin
MD.GOBLIN_REWARD_VARIATION = 50; //Percent variation

MD.SPIDER_TIME = 105;
MD.SPIDER_TIME_VARIATION = 30;
MD.SPIDER_LEVEL_VARIATION = 10;
MD.SPIDER_KILLS_PER_LEVEL = 15;
MD.SPIDER_REWARD = n("8T");
MD.SPIDER_REWARD_VARIATION = 80;

//Used for the oracle timer - this is not saved but simply set when the game is loaded
MD.MAX_GOBLIN_TIME = -1;
MD.MAX_SPIDER_TIME = -1;
MD.FAST_TICK_COUNT = 0;

MD.FORTIFICATION_VALUE = n("2.5G"); //Durability increase with each fortification level
MD.FORTIFICATION_COST = n("1P"); //Increases at the same rate as price multiplier
MD.MASON_START_COST = n("1M");
MD.MASON_REPAIR_RATE = 5; //Rate repaired per mason per tick
MD.MAGE_START_COST = n("10M");
MD.MAGE_DAMAGE = 10;
MD.QUEEN_BASE = 50;
MD.NEURO_BASE = n("30G");

MD.ALCHEMIST_START_COST = {gold:n("10E"),perfect:1};

//Goblin positions
MD.GOBLIN_ROW_1_X = 0;
MD.GOBLIN_ROW_2_X = 480;
MD.GOBLIN_START_Y = 50;
MD.GOBLIN_INCREMENT_Y = 100;

//Spider positions
MD.SPIDER_ROW_1_Y = 0;
MD.SPIDER_ROW_2_Y = 435;
MD.SPIDER_START_X = 105;
MD.SPIDER_INCREMENT_X = 140;

//MAGE_POSITIONS
MD.MAGE_ROW_1_X = 120;
MD.MAGE_ROW_2_X = 360;
MD.MAGE_START_Y = 80;
MD.MAGE_INCREMENT_Y = 110;
MD.AVAILABLE_MAGE_UPGRADES = [];

MD.CURRENT_SCREEN = "canvas-container";

//Display
MD.SPRITE_N = 7;
MD.SPRITE_POS = 0;
MD.ORACLE_CLICK_GUIDE = false;
MD.MOVE_SPRITE = true; //We only change the sprite every second update

//Click Effects
MD.CLICK_EFFECTS = new Array(10);
MD.CLICK_EFFECT_POSITION = 0;
MD.CLICK_EFFECT_LIFE = 18;
MD.CLICK_EFFECT_Y = 2;

//Other
MD.MASON_UNLOCK_GOLD = MD.MASON_START_COST/2;
MD.MAGE_UNLOCK_GOLD = MD.MAGE_START_COST/2;

//Auras
MD.MAX_MAGE_AURA = 10;
MD.MAX_AURA_MULT = 50;
MD.AURA_DURATION = 360; //How many ticks pass before auras are decremented

//Imbuement
MD.IMBUEMENT_BUY_MODE = 0;
MD.IMBUEMENT_BUY_MODES = [1,5,10,25,"Max"];

//Keyboard State
MD.CTRL_DOWN = false;
MD.FORCE_CONTROL = false; //Not stored, resets to false every time the game is reloaded

//Industry
MD.INDUSTRY_WORKING = false;
MD.COST_PER_PIXEL = {dirt:n("100K")}
MD.PIT_BASE = 1;
MD.MARKET_DIALOG_OPEN = false;

//Move Building Status
MD.MOVE_DIALOG_OPEN = false;
MD.MOVE_BUILDING_1 = null;
MD.MOVE_BUILDING_2 = null;

//Upgrade Cache
//Determining if we have an upgrade is fairly expensive - this function is used to cache the results
//of that function to speed things up, particularly later in the game
MD.UPGRADE_CACHE = {};
MD.UPGRADE_ID_LOOKUP = {};

//Used to check if a new construct was unlocked in order to highlight the tab
MD.CONSTRUCT_UNLOCKED = new Array(25);

//Used to know if we're doing the inital game setup
MD.INITIALIZING_GAME = true;

/*-------------------------------------------------------------------------------------------------
 GLOBAL VARIABLES - Indicate where the player is at
 /------------------------------------------------------------------------------------------------*/
//Preferences
MD.NUMBER_SYSTEM = "SS";

MD.setVariablesToDefault = function(){
    MD.GOLD = 0;
    MD.TOTAL_GOLD = 0;
    MD.PICK_LEVEL = 0;
    MD.PICK_SOCKETS = [];
    MD.WALL_LEVEL = 0;
    MD.WALL_STRENGTH = 0;
    MD.MAX_WALL_STRENGTH = 0; //Used to avoid repairing your wall beyond the max
    MD.FORTIFICATION_LEVEL = 0; //Allows increases in durability once maximum level is reached
    MD.MASONS = 0;
    MD.HIRELINGS_OWNED = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Needs one element for each hireling
    MD.IMBUEMENT_LEVEL = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Needs one element for each hireling
    MD.UNLOCKED_UPGRADES = [];
    MD.AVAILABLE_UPGRADES = []; //By ID number (position in upgrade array)
    MD.ACTIVE_UPGRADES = [];
    MD.DIRT = 0;
    MD.TOTAL_DIRT = 0;
    MD.STONE = 0;
    MD.TOTAL_STONE = 0;
    MD.COAL = 0;
    MD.TOTAL_COAL = 0;
    MD.IRON = 0;
    MD.TOTAL_IRON = 0;
    MD.STEEL = 0;
    MD.TOTAL_STEEL = 0;
    MD.ADAMANTIUM = 0;
    MD.TOTAL_ADAMANTIUM = 0;
    MD.DRAGONSCALE = 0;
    MD.TOTAL_DRAGONSCALE = 0;
    MD.FLAX = 0;
    MD.TOTAL_FLAX = 0;
    MD.FOOD = 0;
    MD.TOTAL_FOOD = 0;
    MD.POPULATION = 0;
    MD.TOTAL_POPULATION  = 0;

    //Enemies
    MD.GOBLIN_PRESENT = [false,false,false,false,false,false,false,false]; //One space for every possible goblin (currently max is 8)
    MD.GOBLIN_OBJECT = [null,null,null,null,null,null,null,null];
    MD.GOBLIN_TIMER = -1; //-1 indicates not started
    MD.GOBLIN_LURE_TIMER = -1; //-1 indicates that no lure is present
    MD.GOBLIN_LEVEL = 1;

    MD.SPIDER_PRESENT = [false,false,false,false,false,false];
    MD.SPIDER_OBJECT = [null,null,null,null,null,null];
    MD.SPIDER_TIMER = -1;
    MD.SPIDER_LEVEL = 1;

    MD.TRAPS_BOUGHT = [0,0,0,0,0];
    MD.LURES_BOUGHT = [0];

    //Statistics
    MD.GOLD_PER_SECOND = 0;
    MD.UPGRADES_BOUGHT = 0;
    MD.GOBLINS_KILLED = 0;
    MD.GOBLINS_KILLED_BY_MAGES = 0;
    MD.SPIDERS_KILLED = 0;
    MD.SPIDERS_KILLED_BY_MAGES = 0;
    MD.MANUAL_CLICKS = 0;
    MD.AUTO_CLICKS = 0;
    MD.TICKS = 0;
    MD.TREASURES_FOUND = 0;
    MD.TOTAL_GEMS = 0;
    MD.CAMPAIGNS_WON = 0;
    MD.SOLDIERS_LOST = 0;

    //MD.MAGES
    MD.MAGES = 0;
    MD.MAGES_FIGHTING = 0;
    MD.MAGES_MEDITATING = 0;
    MD.MAGES_DELVING = 0;
    MD.MANA = 0;
    MD.TOTAL_MANA = 0;
    MD.MAGE_MAX_TIME = 0; //The total time in which your mages have been at maximum strength
    MD.ACTIVE_MAGE_UPGRADES = [];

    MD.BUILDINGS_ACTIVE = [];
    MD.GEMS = [0,0,0,0,0,0,0,0,0,0];
    MD.GEMS_SOLD = 0;

    //Alchemy
    MD.ALCHEMISTS = 0;
    MD.ALCH_ARRAY = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //One for each recipe (I have some extra for expansions sake)

    //Industry
    MD.CONSTRUCT_LOCATIONS = new Array(25); //Indicates which construct is present at a given location
    MD.CONSTRUCTION_STATUS = new Array(25); //Indicates progress of construction (undefined = not started, 0-MDART.PIXELS_PER_PLOT = percent dirt, 101-200 = percent built)
    MD.CONSTRUCT_LEVELS = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Some of the constructs have different levels of effectiveness, they are stored here

    MD.AUTO_SMITH_GEM = 0;
    MD.AUTO_SMITH_LIMIT = null;
    MD.MAGE_TOWER_RESEARCH = 0;

    MD.GEM_COMBINE_LIMIT = 9; //Default to combining to the maximum
    MD.SHOW_NOTIFICATIONS = true;
    MD.SHOW_CLICK_EFFECTS = true;
    MD.PIT_SMELTING = true;
    MD.BLIND_REVENGE = false;
    MD.AUTO_RIFT = false;
    MD.CURRENT_RATES = [];

    MD.QUARRY_TIMEOUT = null; //Allows us to clear timeouts if discoveries come too quickly

    MD.GOBLINS_SACRIFIED = 0;
    MD.MACHINIST_AUTO = [false,false,false]; //For each of the 3 units, are they being auto-made

    //ADMIN_BUILDING
    MD.ADMIN_RANGE = 10; //The time in seconds that we measure before refilling the array
    MD.DISPLAYED_TIME = 10; //We divide or multiply to put the array in units of this many seconds
    MD.ADMIN_TIME = 0; //How many seconds have elapsed since the admin array was last reset (not saved)

    //Stretch Upgrades
    MD.ANTS_EATEN = 0;
    MD.TIMES_FORTIFIED = 0;
    MD.GOBLIN_DAMAGE = 0;
    MD.DIRT_TO_MANA = 0;
    MD.MARKET_TRADES = 0;

    //Essence
    MD.FIRE_ESSENCE = 0;
    MD.TOTAL_FIRE_ESSENCE = 0;
    MD.WATER_ESSENCE = 0;
    MD.TOTAL_WATER_ESSENCE = 0;
    MD.EARTH_ESSENCE = 0;
    MD.TOTAL_EARTH_ESSENCE = 0;
    MD.LIGHTNING_ESSENCE = 0;
    MD.TOTAL_LIGHTNING_ESSENCE = 0;
    MD.SPIRIT_ESSENCE = 0;
    MD.TOTAL_SPIRIT_ESSENCE = 0;

    //Dragons
    MD.CURRENT_DRAGON = -1;
    MD.DRAGON_LEVEL = 0;
    MD.MAX_DRAGON_LEVEL = 0;
    MD.DRAGONS_OWNED = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    MD.MASTER_DRAGON_PRICE = null; //Null means none has been chosen
    MD.DRAGONS_SACRIFICED = 0;

    //Arcaneum
    MD.ARCH_ARRAY = [0,0,0,0,0,0];

    //Future use
    MD.WOOD = 0;
    MD.BUILDINGS_UNLOCKED = [];
    MD.BUILDINGS_AVAILABLE = [];

    //Not in save file
    MD.MAGE_AURA_LEVEL = [0,0,0,0,0,0]; //A value from 1 to 20 indicating the intensity of the mage aura
    MD.MARKET_TIMER = -1;
    MD.MARKET_RATE = 1;
    MD.MARKET_HALVED = false; //Prevents us from halving the market time twice in a row
    MD.CLICKS_THIS_TICK = 0;
    MD.ADMIN_ARRAY = [];

    //Resource things, because I didn't plan ahead and used different terms in different places
    MD.RESOURCE_SECTION_NAMES = ["basic","gem","raw","rare","hireling","essence","other"];
    MD.RESOURCE_SECTION_TITLES = ["Basic Resources","Gems","Raw Materials","Rare Materials","Hirelings","Essence","Other"];
    MD.RESOURCE_MULT_LABELS = ["Basic","Gems","Raw Materials","Rare Materials","Hirelings","Essence"];
};

/*-------------------------------------------------------------------------------------------------
 CLASSES
 /------------------------------------------------------------------------------------------------*/
MD.Pick = function(name,cost,strength,description,unlock_function,gem_mean,gem_std){
    this.name = name;

    //Number assumes gold, otherwise we use a resource string
    if(typeof(cost) == "number"){
        cost = {"gold":cost};
    }
    this.cost = cost;

    this.strength = strength;
    this.description = description;
    this.unlock_function = unlock_function

    //If the mean and std are not defined, default to -1,0 (never find gems this way)
    this.gem_mean = typeof gem_mean !== 'undefined' ? gem_mean : -1;
    this.gem_std = typeof gem_std !== 'undefined' ? gem_std : 0;
};

MD.PICKS = [
    new MD.Pick("Stick",0,1,"You're like a kid playing in a sandbox. Have some pride.",function(){return true}),
    new MD.Pick("Tin",10,2,"Tin. Like what they cover food with. In large quantities it can also chip rock.",function(){return true}),
    new MD.Pick("Copper", 100, 3, "Used by some of the oldest civilizations known - and by you. Feeling old?",function(){return MD.TOTAL_GOLD > 50}),
    new MD.Pick("Bronze", 250, 4, "Mixing copper with tin proves that mixing two sucky things can make a below-average thing.",function(){return MD.TOTAL_GOLD > 125}),
    new MD.Pick("Iron", n("1K"), 6, "From the Latin ferrum, meaning, corrodes easily but at least it isn't tin.",function(){return MD.TOTAL_GOLD > 500}),
    new MD.Pick("Steel", n("2.5K"), 10, "Now we're getting somewhere - heated iron is less wimpy.", function(){return MD.TOTAL_GOLD > n("1.2K")}),
    new MD.Pick("Mythril", n("5K"), 15, "A most desirable and fictional metal - ideal for hitting goblins.", function(){return MD.TOTAL_GOLD > n("2.5K")}),
    new MD.Pick("Diamond", n("10K"), 50, "What is it with computer games and diamond stuff? Diamond is not a building material.", function(){return MD.TOTAL_GOLD > n("5K")}),
    new MD.Pick("Uranium",  n("100K"), 800, "Heavy, expensive, poisononous, and not very good at chipping rocks. What a bargain!", function(){return MD.TOTAL_GOLD > n("50K")}),
    new MD.Pick("Obsidian", n("2.5M"), 15000, "Never dig straight down, and this goes double when you're standing on Obsidian!", function(){return MD.TOTAL_GOLD > n("1.2M")}), //Color:black (0,0,0)
    new MD.Pick("Dragon", n("25M"), n("150K"), "Forged from the scales of a fallen dragon - we're not sure how useful this is, but it sure sounds cool.", function(){return MD.TOTAL_GOLD > n("12.5M")}), //Color darkred (139.0,0)
    new MD.Pick("Scholtium", n("200M"), n("1M"), "Said to only exist in small pockets located directly beneath a particular web server hosting a particular website, who knows what this can do?", function(){return MD.TOTAL_GOLD > n("50M")}),
    new MD.Pick("Rhenium", n("1T"), n("10M"), "A rare element, typically used in jet engines. You are just that hardcore.", function(){return MD.TOTAL_GOLD > n("500G")}),
    new MD.Pick("Swarm",n("1P"),n("25M"),"You don't really want to know what this pick is made of...",function(){return MD.HIRELINGS_OWNED[0] > n("100K")}),
    new MD.Pick("Gleaming",{gold:n("100Z"),mana:n("100G")},n("15T"),"This pick is almost blinding to look at, but if you manage, it seems to dig up a lot of gems.",function(){return MD.TOTAL_MANA > n("1T")},-1,3),
    new MD.Pick("Radiant",{gold:n("5X"),majestic:25},n("10P"),"You look down. Nothing. You hit the ground... and suddenly gems everywhere. It doesn't make sense.",function(){return MD.TOTAL_GEMS >= n("750K")},2,3),
    new MD.Pick("Steel Tipped",{gold:n("5W"),majestic:n("250K"),steel:n("10K")},n("50P"),"It seems like capping a legendary holy metal in steel would be detrimental... but whatever.",function(){return MD.TOTAL_GEMS >= n("5M") && MD.TOTAL_STEEL >= n("5K")},6,3),
    new MD.Pick("Adamantium",{gold:n("5U"),majestic:n("1M"),adamantium:n("1M"),earth:10},n("250P"),"Your new knowledge of earth essence has finally allowed you to forge a pick of mighty adamantium.",function(){return MD.hasConstruct("Earth Shrine")},8,3),
    new MD.Pick("Earthen",{gold:n("50U"),majestic:n("1G"),adamantium:n("10M"),earth:50},n("2.5E"),"The very energy of the earth flows through this pickaxe, and the ground gives way almost of it's own accord.",function(){return MD.hasConstruct("Earth Shrine") && MD.TOTAL_EARTH_ESSENCE >= 10 && MD.totalClicks() >= n("50K")},9,2),
    new MD.Pick("Seismic",{gold:n("500U"),majestic:n("1T"),adamantium:n("1G"),earth:100},n("25E"),"The power of earthquakes that shake the very mountains now waits at your fingertips.",function(){return MD.hasConstruct("Earth Shrine") && MD.TOTAL_EARTH_ESSENCE >= 50 && MD.totalClicks() >= n("100K")},9,0),
];

MD.Wall = function(name,cost,durability,color){
    this.name = name;
    this.cost = cost;
    this.durability = durability;
    this.color = color
};

MD.WALLS = [
    new MD.Wall("None",0,0,null),
    new MD.Wall("Stick",n("100K"),n("1K"),"sienna"),
    new MD.Wall("Tin",n("500K"),n("2.5K"),"lightgray"),
    new MD.Wall("Copper",n("1M"),n("5K"),"sandybrown"),
    new MD.Wall("Bronze",n("2.5M"),n("10K"),"chocolate"),
    new MD.Wall("Iron",n("5M"),n("20K"),"slategray"),
    new MD.Wall("Steel",n("10M"), n("40K"), "dimgray"),
    new MD.Wall("Mythril",n("50M"), n("150K"), "cornflowerblue"),
    new MD.Wall("Diamond",n("250M"),n("500K"),"mediumturquoise"),
    new MD.Wall("Uranium",n("1G"),n("1M"),"lime"),
    new MD.Wall("Scholtium",n("10G"),n("5M"),"mediumblue"),
    new MD.Wall("Rhenium",n("10T"),n("800M"),"white"),
    new MD.Wall("Bioalloy",n("10P"),n("10G"),"indigo")
];

MD.Gem = function(name,value,combine_requirement,pick_increase,gps_increase){
    this.name = name;
    this.value = value; //Sell price
    this.combine_requirement = combine_requirement; //How many of the previous level gems are needed to form this
    this.pick_increase = pick_increase;
    this.gps_increase = gps_increase
};

MD.GEM_OBJECTS = [
    new MD.Gem("Dreary", n("10K"), -1,100,0),
    new MD.Gem("Murky",n("20K"), 2,1000,0),
    new MD.Gem("Cracked",n("40K"), 2,5000,0),
    new MD.Gem("Flawed",n("200K"), 2,10000,0),
    new MD.Gem("Normal",n("500K"), 2,n("20K"),1),
    new MD.Gem("Great",n("2M"), 3,n("50K"),3),
    new MD.Gem("Flawless",n("25M"), 3,n("100K"),5),
    new MD.Gem("Exceptional",n("200M"), 3,n("250K"),10),
    new MD.Gem("Perfect",n("5G"), 5,n("1M"),20),
    new MD.Gem("Majestic",n("100G"), 8,n("5M"),30)
];

//Defines a resource type where type indicates if the change and check functions need any extra parameters
MD.Resource = function(print_name,change_function,check_function,amount_function,type){
    this.print_name = print_name;
    this.change_function = change_function;
    this.check_function = check_function;
    this.amount_function = amount_function;
    this.type = type;
    // this.parameters = parameters;
};

//This must be called as a function or else the access functions won't be defined
MD.createResourceObjects = function(){
    MD.RESOURCES = [];
    MD.RESOURCES["gold"] = new MD.Resource("Gold",MD.changeGold,MD.hasGold,MD.getGold,"basic");
    MD.RESOURCES["mana"] = new MD.Resource("Mana",MD.changeMana,MD.hasMana,MD.getMana,"basic");
    MD.RESOURCES["dirt"] = new MD.Resource("Dirt",MD.changeDirt,MD.hasDirt,MD.getDirt,"raw");
    MD.RESOURCES["stone"] = new MD.Resource("Stone",MD.changeStone,MD.hasStone,MD.getStone,"raw");
    MD.RESOURCES["coal"] = new MD.Resource("Coal",MD.changeCoal,MD.hasCoal,MD.getCoal,"raw");
    MD.RESOURCES["iron"] = new MD.Resource("Iron",MD.changeIron,MD.hasIron,MD.getIron,"raw");
    MD.RESOURCES["steel"] = new MD.Resource("Steel",MD.changeSteel,MD.hasSteel,MD.getSteel,"rare");
    MD.RESOURCES["food"] = new MD.Resource("Food",MD.changeFood,MD.hasFood,MD.getFood,"raw");
    MD.RESOURCES["adamantium"] = new MD.Resource("Adamantium",MD.changeAdamantium,MD.hasAdamantium,MD.getAdamantium,"rare");
    MD.RESOURCES["population"] = new MD.Resource("Population",MD.changePopulation,MD.hasPopulation,MD.getPopulation,"other");
    MD.RESOURCES["dragonscale"] = new MD.Resource("Dragonscale",MD.changeDragonscale,MD.hasDragonscale,MD.getDragonscale,"rare");
    MD.RESOURCES["flax"] = new MD.Resource("Flax",MD.changeFlax,MD.hasFlax,MD.getFlax,"rare");
    MD.RESOURCES["fire"] = new MD.Resource("Fire Essence",MD.changeFireEssence,MD.hasFireEssence,MD.getFireEssence,"essence");
    MD.RESOURCES["water"] = new MD.Resource("Water Essence",MD.changeWaterEssence,MD.hasWaterEssence,MD.getWaterEssence,"essence");
    MD.RESOURCES["earth"] = new MD.Resource("Earth Essence",MD.changeEarthEssence,MD.hasEarthEssence,MD.getEarthEssence,"essence");
    MD.RESOURCES["lightning"] = new MD.Resource("Lightning Essence",MD.changeLightningEssence,MD.hasLightningEssence,MD.getLightningEssence,"essence");
    MD.RESOURCES["spirit"] = new MD.Resource("Spirit Essence",MD.changeSpiritEssence,MD.hasSpiritEssence,MD.getSpiritEssence,"essence");
    
    //Add gems
    for(var i = 0; i < MD.GEM_OBJECTS.length; i++){
        MD.RESOURCES[MD.GEM_OBJECTS[i].name.toLowerCase()] = new MD.Resource(MD.GEM_OBJECTS[i].name + " Gems",(function(num){return function(amt,nomult){return(MD.changeGems(num,amt,nomult))}})(i),(function(num){return function(amt){return(MD.hasGems(num,amt))}})(i),(function(num){return function(){return(MD.getGems(num))}})(i),"gem");
    }

    //Add hirelings
    for(var i = 0; i < MD.HIRELINGS.length; i++){
        MD.RESOURCES[MD.HIRELINGS[i].name.toLowerCase()] = new MD.Resource(MD.HIRELINGS[i].plural,(function(num){return function(amt){return(MD.changeHirelings(num,amt))}})(i),(function(num){return function(amt){return(MD.hasHirelings(num,amt))}})(i),(function(num){return function(amt){return(MD.getHirelings(num))}})(i),"hireling");
    }
};

//Traps and Lures
MD.Trap = function(name,description,time,base_cost,exponent,unlock){
    this.name = name;
    this.description = description;
    this.time = time;
    this.base_cost = base_cost;
    this.exponent = exponent;
    this.unlock_function = unlock
};

MD.TRAPS = [
    new MD.Trap("Bear Trap","Goblins won't attack for 10 minutes - they'll be occupied with other things, like reattaching their legs.",600,n("10K"),1.2,function(){return MD.hasUpgrade("Delve Greedily")}),
    new MD.Trap("Death Ward","Goblins won't attack for 2 hours, on account of being dead.",7200,n("10G"),1.2,function(){return MD.hasUpgrade("Delve Greedily") && MD.MAGES >= 2}),
    new MD.Trap("Night Terrors","Goblins will huddle around their camp fires for the next 10 hours, twitching at shadows and sounds in the night.",36000,n("1T"),1.15,function(){return MD.hasUpgrade("Delve Greedily") && MD.MAGES >= 25}),
    new MD.Trap("Kill It With Fire","Setting the world on fire is a small price to pay to keep the spiders out for a few hours.",7200,n("100T"),1.15,function(){return MD.hasUpgrade("Embrace The Swarm")}),
    new MD.Trap("Anti-Nightmare Apparatus","Cannons blaze in the night to a steady beat, and in the distance, massive shapes scream and writhe. That should hold them for 10 hours or so.",36000,n("1X"),1.2,function(){return MD.hasUpgrade("Trap Master")})
];

MD.Lure = function(name,description,time,mult,base_cost,exponent,unlock){
    this.name = name;
    this.description = description;
    this.time = time;
    this.mult = mult;
    this.base_cost = base_cost;
    this.exponent = exponent;
    this.unlock_function = unlock;
};

MD.LURES = [
    new MD.Lure("Raw Meat","Goblins like their steak VERY rare - this should keep them coming for a while.",1800,4,n("1T"),1.2,function(){return MD.hasUpgrade("Delve Greedily")})
];

MD.Hireling = function(name,plural,base_cost,output,description,unlock_function,imbue_cost){
    this.name = name;
    this.plural = plural;

    //Number assumes gold, otherwise we use a resource string
    if(typeof(base_cost) == "number"){
        base_cost = {"gold":base_cost};
    }
    this.base_cost = base_cost;

    this.output = output;
    this.description = description;
    this.unlock_function = unlock_function;
    this.imbue_cost = imbue_cost;
};

MD.HIRELINGS = [
    new MD.Hireling("Large Ant","Large Ants", 10, 0.2, "An ant, to... pitifully pick at the ground for you.",function(){return true},10000),
    new MD.Hireling("Woodpecker","Woodpeckers", 150, 1, "A woodpecker to chip, chip, chip, with a beak that can somehow dent rock.",function(){return MD.TOTAL_GOLD > n("75")},3000),
    new MD.Hireling("Bloodhound","Bloodhounds", n("1K"), 5, "A bloodhound to dig up the ground and sniff things.",function(){return MD.TOTAL_GOLD > n("500")},200),
    new MD.Hireling("Sandshrew","Sandshrew", n("7.5K"), 50, "A sandshrew, because pokemon are adorable, and this one can dig!",function(){return MD.TOTAL_GOLD > n("5K")},500),
    new MD.Hireling("Goblin", "Goblins", n("50K"), 250, "A tame goblin who will help you, if only to briefly touch the gold it so loves.",function(){return MD.TOTAL_GOLD > n("25K")},1000),
    new MD.Hireling("Miner","Miners", n("200K"), 1000, "A fellow miner, and harder worker than you I might add.",function(){return MD.TOTAL_GOLD > n("100K")},1500),
    new MD.Hireling("Rock Golem","Rock Golems", n("1M"), 5000, "A mighty statue of twisted stone, to hit the ground and yell loudly.", function(){return MD.TOTAL_GOLD > n("500K")},2000),
    new MD.Hireling("Bagger 288","Baggers", n("15M"), 50000, "An unnecessarily large piece of German mining equipment", function(){return MD.TOTAL_GOLD > n("7.5M")},2500),
    new MD.Hireling("Titan of Earth","Titans of Earth", n("1G"), n("2.5M"), "When it steps, deep chasms spread from the place where its feet touch down.", function(){return MD.TOTAL_GOLD > n("500M")},5000),
    new MD.Hireling("World Eater","World Eaters", n("750G"), n("1G"),"A massive serpent of earth and flesh - best to keep your distance.",function(){return MD.TOTAL_GOLD > n("300G")},10000),
    new MD.Hireling("Hive Queen","Hive Queens",n("100T"),0,"A terrifying insect lifted straight from a nightmare, constantly dropping sacs of vile eggs.",function(){return (MD.TOTAL_GOLD > n("50T") && MD.HIRELINGS_OWNED[0] >= 80)},20000),
    new MD.Hireling("Wyvern","Wyverns",{"mana":n("2.5G")},n("10P"),"A legendary beast summoned from the darkest corners of the earth.",function(){return (MD.TOTAL_MANA >= n("1G"))},n("1G")),
    new MD.Hireling("Neurochrysalis","Neurochrysalises",{"large ant":n("500M")},0,"A terrifying species that lives and feeds deep within the brains of other organisms.",function(){return (MD.ALCHEMISTS >= 30 && MD.TOTAL_MANA >= n("20T"))},n("10T")),
    new MD.Hireling("Dragon Hunter","Dragon Hunters",{flax:100,adamantium:n("1K"),gold:n("25V")},0,"The most elite soldiers in your kingdom can be trained to hunt the mighty dragons of Mineria.",function(){return MD.hasConstruct("Fletcher")},n("1Y")),
];

MD.Upgrade = function(id,name,effect,description,cost,unlock_function,type){
    this.id = id;
    this.name = name;
    this.effect = effect;
    this.description = description;

    //Adjust to the price object format
    if(typeof(cost) == "number"){
        cost = {"gold":cost};
    }
    this.cost = cost;

    this.unlock_function = unlock_function;
    this.unlocked = false;

    //Default values
    this.type = typeof type !== 'undefined' ? type : "normal";
};

MD.uv = { //Stores values used by the upgrades (to avoid needing to change multiple things at once)
    delvegreedilymult :1.5,
    embranceswarmmult: 2,
    darkportentsmult: 2,
    pioneerspiritmult : 1.5,
    miningmasterymult : 2,
    terrasmightmult : 2,

    lootingproficiencymult: 3,
    goblinsbanemult: 3,
    goblinsscourgemult: 3,
    goblinsterrormult: 4,

    spidermult1: 2,
    spidermult2: 3,
    spidermult3: 3,
    spidermult4: 4,

    antpersandshrew: 0.05,
    sandshrewperminer: 4,
    woodpeckerpertitan: 3500,
    antperrockgolem: 3,
    antperbagger: 5000,
    minerperbagger: 1000,
    minerperwyvern: n("500G"),
    sandshrewpergolem: n("25G"),
    worldperant: n("25K"),
    houndpercraftexponent: 4, //The number of craftsmen is multiplied by this
    goblinpertrap1: n("10K"),
    goblinpertrap2: n("1G"),

    level1mult: 1.5,
    level2mult: 2,
    level3mult: 3,
    level4mult: 2,
    level5mult: 2,
    level6mult: 2,
    level7mult: 2,

    timeupgrade1: 1.05,
    timeupgrade2: 1.1,
    timeupgrade3: 1.5,
    timeupgrade4: 3,

    queenupgrade1: 25,
    queenupgrade2: 50,
    queenupgrade3: 50,
    queenupgrade4: 50,

    pickgainperant: 250,
    pickgainperant2: 750,

    upgradereduction: 15,
    pickgainperhireling: n("1G"),

    manamult: 2,
    manamult2: 2,

    goldforevermult: 5,

    masonPercent1: 0.0005,
    masonPercent2: 0.001,
    masonPercent3: 0.002,

    neuropermage1: 1,
    neuropermage2: 2,
    neuropermage3: 3,

    gpsperupgrade: 0.5,
    overloadmult1: 10,
    overloadmult2: 20,
    sandperfort: n("1G"),
    titanperpop: n("1G"),
    dirtpereater: n("8K"),

    alchemistyieldmult: function(){return Math.log(MD.ANTS_EATEN)/20}, //Doubled if the second upgrade is owned
    quarryrewardmult: function(){return Math.log(MD.HIRELINGS_OWNED[5])/4},
    hivequeenantincrease: function(){return Math.pow(MD.HIRELINGS_OWNED[0],1/5)},
    marketscholarincrease: function(){return Math.min(200,Math.pow(MD.CONSTRUCT_LEVELS[10],1/7))},

    //For mage upgrades
    gemFindPerMage1: 0.01,
    gemFindPerMage2: 0.02,
    gemFindPerMage3: 0.04,
    gemFindPerMage4: 0.08,
    gemFindPerMage5: 0.16,
    gemMult1: 2,
    gemMult2: 5,
    meditatelevel1: 1.5,
    meditatelevel2: 2,
    meditatelevel3: 2,
    meditatelevel4: 3,
    neuropercent1: 3,
    neuropercent2: 7,
    elementalpick: 1100,
    numPerDouble: 13,
};

MD.convals = { //Store values used by the constructs
    dragonmount_levels: [0,1,20,50],
    dragonmount_text: ["A large mound of rock sits plainly in a fenced compound. Have you considered adding some gold?","The mound of rock begins to sparkle, and your wyverns seem to work a bit harder.","Your treasure heap rivals that of the kings of old, there are those who call you wyvern-tamer.","The gleaming of your golden mountain is visible for miles around, and legends are told across the earth of your wealth and power."],
    dragonmount_function: function(x){return 1 + (x+1) + Math.pow((x+1)/3,2)},
    magetower_gain: 0.001, //The gain per mage to magetower research
    quarryFindChance: 0.15,
    pitPrice: {goblin:1,coal:2,iron:100},
    habLevels: [10,500,10000],
    farmtime1: 60,
    farmrate1: 120,
    farmrate2: 360,
    farmrate3: 1080,
    barracks_formula: function(g,s){return Math.max(25,(g+s)/n("10K"))},
    blacksmith_formula: function(g,s){return {mana:Math.max(n("10E"),(g+s)*n("100T"))/(MD.hasUpgrade("Overwhelming Might") ? 10 : 1)}},
    smeltAddyChance: 0.75,
    smeltAddyCost: {goblin:100},
    goblinSacrificedFormula: function(gs){return Math.pow((gs/777),(MD.hasMageUpgrade("Diamond Affinity") ? 1.14 : 1.09))},
    mechmagecost: {adamantium:n("50K"),majestic:n("1G"),water:10,fire:10},
    mechmasoncost: {adamantium:n("50K"),majestic:n("500M"),water:5,fire:5,earth:5},
    mechalchcost: {adamantium:n("50K"),majestic:n("1G"),water:10,fire:10,earth:10,lightning:10},
    graveyardbonus: function(){return Math.pow(Math.log(Math.max(1,MD.SOLDIERS_LOST)),1.9)},
    archspiriteffect: function(){return 10 + Math.sqrt(MD.CONSTRUCT_LEVELS[24])/1.5},
}

MD.UPGRADES = [
    //Special
    new MD.Upgrade(0,"Delve Greedily", "Multiplies your gold per second by " + MD.uv.delvegreedilymult + "... but be warned - the goblins may notice.", "The dwarves of Moria delved too greedily and too deeply. Will you?", n("100K"),function(){return MD.TOTAL_GOLD >= n("75K")},"nightmare"),
    new MD.Upgrade(1,"Oracle", "Allows you to see when the next goblin will arrive.",  "The goblins will come. The question left to answer is... when?", n("200K"),function(){return MD.hasUpgrade("Delve Greedily")}),
    new MD.Upgrade(62,"Embrace The Swarm", "Multiplies your gold per second by " + MD.uv.embranceswarmmult + "... but it feels a little wrong.", "What would you give for a bit more gold?", n("6P"),function(){return MD.HIRELINGS_OWNED[0] >= n("3M") && MD.hasUpgrade("Delve Greedily") && MD.hasUpgrade("Goblin's Bane")},"nightmare"),
    new MD.Upgrade(69, "Dark Portents", "Multiplies mage aura power by " + MD.uv.darkportentsmult + "...", "Great men are almost always bad men.",n("10P"),function(){return MD.MAGE_MAX_TIME >= 1800 && MD.MAGES >= 10 && MD.TOTAL_GOLD >= n("5P")},"nightmare"),
    new MD.Upgrade(262,"The Golden Well", "Allows you to increase spirit essence efficiency by spending vast amounts of gold.","We're not sure where it goes, or how it never fills up, but it makes us feel GREAT!",n("5QQ"),function(){return MD.TOTAL_GOLD >= n("5SQ")},"progress"),

    new MD.Upgrade(150, "Precious Resources", "Baggers now produce 1 dirt per second. This is good.", "All men rejoice, when after a hard day of sifting through gold, they finally strike dirt. And having half a bagger's weight in baggers is a good way to get there.",n("1X"),function(){return MD.HIRELINGS_OWNED[7] >= n("6.75K")},"progress"),
    new MD.Upgrade(155, "The Wheel Turns", "Unlocks the quarry, which allows rock golems to dig up more than just gold.", "It's taken some time, but you are beginning to realize that you can't build everything out of gold.",{gold:n("100X"),dirt:n("50M")},function(){return MD.HIRELINGS_OWNED[6] >= n("12.34K")},"progress"),
    new MD.Upgrade(157, "Deep Mining","Rock golems now produce iron and coal, albeit at a much slower rate than stone.","Your rock golems have learned much, and can now find more valuable resources in the depths.",{gold:n("1W"),stone:n("100M")},function(){return MD.hasConstruct("Quarry") && MD.TOTAL_STONE >= n("50M")},"progress"),
    new MD.Upgrade(164, "Secret of Barad-dur","Unlock the ability to forge steel from coal and iron.","Your mages have stumbled upon a great secret - which will further your empire in grand ways.",{gold:n("10W"),coal:n("10K"),iron:n("100K"),stone:n("100M")},function(){return MD.MAGE_TOWER_RESEARCH >= 15000 && MD.CONSTRUCT_LEVELS[4] >= 5},"progress"),

    //Manual Mining
    new MD.Upgrade(2,"Pioneer Spirit", "Multiplies your mining efficiency by " + MD.uv.pioneerspiritmult + ".",  "The gold might just be sitting there, but that doesn't mean you don't have to work for it.", 1000,function(){return MD.totalClicks() >= 100}),
    new MD.Upgrade(3,"Mining Mastery","Multiplies your mining efficiency by " + MD.uv.miningmasterymult + ".", "A journey of a thousand miles begins with 1 step, and you've taken at least 4.",n("100K"),function(){return MD.totalClicks() >= 1000 }),
    new MD.Upgrade(4,"Terra's Might","Multiplies your mining efficiency by " + MD.uv.terrasmightmult + ".", "The earth trembles at the fall of your pick. Actually, I guess the earth trembles at the fall of any pick.",n("1M"),function(){return MD.totalClicks() >= 10000}),

    //Goblin Rewards
    new MD.Upgrade(5,"Looting Proficiency","Multiplies goblin reward and spawn rate by " + MD.uv.lootingproficiencymult + ".", "You're getting pretty good at this, aren't you?", n("750K"),function(){return MD.GOBLINS_KILLED >= 100}),
    new MD.Upgrade(6,"Goblin's Bane","Multiplies goblin reward and spawn rate by " + MD.uv.goblinsbanemult + ".", "After awhile, you learn where they hide the good stuff.", n("7.5M"),function(){return MD.GOBLINS_KILLED >= n("1K")}),
    new MD.Upgrade(7,"Goblin's Scourge","Multiplies goblin reward and spawn rate by " + MD.uv.goblinsscourgemult + ".", "Goblins tremble at the sight of you, and flee for cover when you draw your... pick.", n("75M"),function(){return MD.GOBLINS_KILLED >= n("10K")}),
    new MD.Upgrade(8,"Goblin's Terror","Multiplies goblin reward and spawn rate by " + MD.uv.goblinsterrormult + ".", "Your name appears frequently in bedtime stories told to Goblin children.", n("750M"),function(){return MD.GOBLINS_KILLED >= n("100K")}),

    //Spider Rewards
    new MD.Upgrade(63,"Covered in Web","Multiplies spider reward and spawn rate by " + MD.uv.spidermult1 + ".", "Why does it always have to be spiders?", n("5P"),function(){return MD.SPIDERS_KILLED >= 50}),
    new MD.Upgrade(64,"Eww Eww Eww","Multiplies spider reward and spawn rate by " + MD.uv.spidermult2 + ".", "Creatures like this just shouldn't exist :(.", n("50P"),function(){return MD.SPIDERS_KILLED >= n(200)}),
    new MD.Upgrade(65,"Arachnid Mangler","Multiplies spider reward and spawn rate by " + MD.uv.spidermult3 + ".", "Fashion experts have described your style as spider entrail sheik.", n("100P"),function(){return MD.SPIDERS_KILLED >= n(1000)}),
    new MD.Upgrade(66,"Shelob Slasher","Multiplies spider reward and spawn rate by " + MD.uv.spidermult4 + ".", "After hours and hours you have attained the status of... Samwise Gamgee.", n("200P"),function(){return MD.SPIDERS_KILLED >= n("10K")}),

    //Hireling Upgrades
    new MD.Upgrade(9,"Enlarged Pincers","Multiplies ant dig rate by " + MD.uv.level1mult + ".","Makes ants a little less pathetic.", n("250"),function(){return MD.HIRELINGS_OWNED[0] >= 10}),
    new MD.Upgrade(10,"Fire Ants","Multiplies ant dig rate by " + MD.uv.level2mult + ".","Only pathetic until you see them sting.", n("100K"),function(){return MD.HIRELINGS_OWNED[0] >= 50}),
    new MD.Upgrade(11,"For The Queen","Multiplies ant dig rate by " + MD.uv.level3mult + ".","Strength in numbers.", n("500M"),function(){return MD.HIRELINGS_OWNED[0] >= 100}),
    new MD.Upgrade(55,"Colonization","Multiplies ant dig rate by " + MD.uv.level4mult + ".","A little bit ominous.", n("500T"),function(){return MD.HIRELINGS_OWNED[0] >= n("10K")}),
    new MD.Upgrade(56,"Who's Pathetic Now?","Multiplies ant dig rate by " + MD.uv.level5mult + ".","The swarm is rising.", n("2P"),function(){return MD.HIRELINGS_OWNED[0] >= n("1M")}),

    new MD.Upgrade(12,"Feeding Frenzy","Multiplies woodpecker dig rate by " + MD.uv.level1mult + ".","Fear is a great motivator - but birds are always scared, so let's try hunger.", n("2K"),function(){return MD.HIRELINGS_OWNED[1] >= 10}),
    new MD.Upgrade(13,"Curved Beaks","Multiplies woodpecker dig rate by " + MD.uv.level2mult + ".","They look a little bit less cute with sharp hooks on their faces.", n("1M"),function(){return MD.HIRELINGS_OWNED[1] >= 50}),
    new MD.Upgrade(14,"Nature's Power Drill","Multiplies woodpecker dig rate by " + MD.uv.level3mult + ".","Technology is overrated.", n("10G"),function(){return MD.HIRELINGS_OWNED[1] >= 100}),
    new MD.Upgrade(96,"Ironbeaks","Multiplies woodpecker dig rate by " + MD.uv.level4mult + ".","At this point they're hardly feathered, winged, two-legged, warm-blooded, egg-laying vertebrates.", n("50T"),function(){return MD.HIRELINGS_OWNED[1] >= 150}),
    new MD.Upgrade(130, "Jeweled Beak", "Allows alchemical transmutation of woodpeckers.","We haven't quite figured out the biology on this.",{normal:300},function(){return MD.HIRELINGS_OWNED[1] >= 200}),
    new MD.Upgrade(195, "Woody See, Woody Do", "For each billion woodpeckers, one will click the mine each second (up to 20 clicks).","You'd think they'd have tried this before now.",{normal:n("1M")},function(){return MD.HIRELINGS_OWNED[1] >= n("1G")}),
    new MD.Upgrade(196, "Putting in Work", "Each woodpecker contributes 1 million times as much to the pick boost from Communal Effort.","Putting all the others to shame.",{normal:n("1G")},function(){return MD.HIRELINGS_OWNED[1] >= n("1T") && MD.hasUpgrade("Communal Effort")}),

    new MD.Upgrade(15,"Sharpened Senses","Multiplies bloodhound dig rate by " + MD.uv.level1mult + ".","These bloodhounds smell gold... or something.", n("7.5K"),function(){return MD.HIRELINGS_OWNED[2] >= 10}),
    new MD.Upgrade(16,"Reduced Slobber","Multiplies bloodhound dig rate by " + MD.uv.level2mult + ".","Why am I always sticky?.", n("8M"),function(){return MD.HIRELINGS_OWNED[2] >= 50}),
    new MD.Upgrade(17,"Nightmare Hounds","Multiplies bloodhound dig rate by " + MD.uv.level3mult + ".","The dig site just got haunteder.", n("50G"),function(){return MD.HIRELINGS_OWNED[2] >= 100}),
    new MD.Upgrade(97,"Cerberus","Multiplies bloodhound dig rate by " + MD.uv.level4mult + ".","I really think you should stop hiring these...", n("150T"),function(){return MD.HIRELINGS_OWNED[2] >= 150}),
    new MD.Upgrade(131, "Jeweled Eyes", "Allows alchemical transmutation of bloodhounds.","Now with 23% more natural bloodhound DNA.",{normal:1000},function(){return MD.HIRELINGS_OWNED[2] >= 200}),
    new MD.Upgrade(198, "Getting Hungry", "Each bloodhound eats an ant each tick, and the number of ants eaten increase alchemical yield.","We're not really sure how this works.",{normal:n("4M")},function(){return MD.HIRELINGS_OWNED[2] >= n("1G")}),
    new MD.Upgrade(199, "Hound's Best Friend", "Ants eaten increases your alchemical yield by a greater amount.","Mmm... ants. Someone get the magnifying glass.",{normal:n("4G")},function(){return MD.HIRELINGS_OWNED[2] >= n("1T")}),

    new MD.Upgrade(18,"Cute Overload","Multiplies sandshrew dig rate by " + MD.uv.level1mult + ".","Dawwwww.", n("25K"),function(){return MD.HIRELINGS_OWNED[3] >= 10}),
    new MD.Upgrade(19,"Fury Swipes","Multiplies sandshrew dig rate by " + MD.uv.level2mult + ".","Woah.... looks like the little guy is mad.", n("10M"),function(){return MD.HIRELINGS_OWNED[3] >= 50}),
    new MD.Upgrade(20,"Sandslash","Multiplies sandshrew dig rate by " + MD.uv.level3mult + ".","Level 22 baby!", n("50G"),function(){return MD.HIRELINGS_OWNED[3] >= 100}),
    new MD.Upgrade(98,"Earthquake","Multiplies sandshrew dig rate by " + MD.uv.level4mult + ".","I can't possibly make this as overpowered as the pokemon move.", n("3P"),function(){return MD.HIRELINGS_OWNED[3] >= 150}),
    new MD.Upgrade(132, "Bedazzled Pokeballs", "Allows alchemical transmutation of sandshrew.","Hanging out in the lap of luxury.",{great:500},function(){return MD.HIRELINGS_OWNED[3] >= 200}),
    new MD.Upgrade(200, "Armor Sharing", "Every wall fortification increases sandshrew earning by " + s(MD.uv.sandperfort) + ".","About time this wall was good for something.",{great:n("1M")},function(){return MD.HIRELINGS_OWNED[3] >= n("1G")}),
    new MD.Upgrade(201, "Amplificatory Armor", "Every wall fortification increases mage damage by 2%.","Let them kill us... to kill them? Someone get the magnifying glass.",{great:n("1G")},function(){return MD.HIRELINGS_OWNED[3] >= n("1T")}),

    new MD.Upgrade(21,"Midas Touch","Multiplies goblin dig rate by " + MD.uv.level1mult + ".","For those who dream of gold.", n("200K"),function(){return MD.HIRELINGS_OWNED[4] >= 10}),
    new MD.Upgrade(22,"Gringotts Employee","Multiplies goblin dig rate by " + MD.uv.level2mult + ".","Not just selfish, but greedy too.", n("15M"),function(){return MD.HIRELINGS_OWNED[4] >= 50}),
    new MD.Upgrade(23,"Azog","Multiplies goblin dig rate by " + MD.uv.level3mult + ".","Curse his name.", n("500G"),function(){return MD.HIRELINGS_OWNED[4] >= 100}),
    new MD.Upgrade(99,"Blinding Greed","Multiplies goblin dig rate by " + MD.uv.level4mult + ".","Failing the pre-employment screening is actually a requirement.", n("10P"),function(){return MD.HIRELINGS_OWNED[4] >= 150}),
    new MD.Upgrade(133, "Gleaming Eyes", "Allows alchemical transmutation of goblins.","Oh... how they hunger.",{great:1500},function(){return MD.HIRELINGS_OWNED[4] >= 200}),
    new MD.Upgrade(172, "Dirty Hands", "Multiplies coal production by " + MD.uv.level1mult + ".","Sometimes there's nothing for it but rolling up your sleeves and digging in.",{steel:n("10K"),iron:n("250K")},function(){return MD.HIRELINGS_OWNED[4] >= n("1M") && MD.TOTAL_STEEL > 0}),
    new MD.Upgrade(202, "Seed of Rebellion", "Your goblins earn more gold per second for every point of damage done to the wall by attacking goblins.","Should we be concerned about this?",{great:n("3M")},function(){return MD.HIRELINGS_OWNED[4] >= n("1G")}),
    new MD.Upgrade(203, "Traitorous Goblins", "Your goblins may not be as loyal as we'd hoped.","It was only a matter of time...",{great:n("3G")},function(){return MD.HIRELINGS_OWNED[4] >= n("1T")},"nightmare"),

    new MD.Upgrade(24,"Overtime","Multiplies miner dig rate by " + MD.uv.level1mult + ".","I'm not sure what country we're in, but apparently there are no labor laws.", n("1M"),function(){return MD.HIRELINGS_OWNED[5] >= 10}),
    new MD.Upgrade(25,"Dual Pickaxes","Multiplies miner dig rate by " + MD.uv.level2mult + ".","This is probably less efficient, but it looks hardcore.", n("100M"),function(){return MD.HIRELINGS_OWNED[5] >= 50}),
    new MD.Upgrade(26,"Herobrine","Multiplies miner dig rate by " + MD.uv.level3mult + ".","White eyes in the darkness.", n("1T"),function(){return MD.HIRELINGS_OWNED[5] >= 100}),
    new MD.Upgrade(100,"Blur of Picks","Multiplies miner dig rate by " + MD.uv.level4mult + ".","The tazmanian devil of miners, they begin to look like blurred outlines flashing with steel.", n("30P"),function(){return MD.HIRELINGS_OWNED[5] >= 150}),
    new MD.Upgrade(134, "Crystal Axes", "Allows alchemical transmutation of miners.","Maximum power.",{flawless:100},function(){return MD.HIRELINGS_OWNED[5] >= 200}),
    new MD.Upgrade(204, "Miner Blindness Reduction", "Miners have a small chance of finding gems.","How did they miss them all this time?",{flawless:n("1M")},function(){return MD.HIRELINGS_OWNED[5] >= n("1G")}),
    new MD.Upgrade(205, "Expert Consulting", "Quarry findings are improved for every miner you have.","Where is the quarry? Why is it different from the mine? I'm confused.",{flawless:n("1G")},function(){return MD.HIRELINGS_OWNED[5] >= n("1T")}),
    
    new MD.Upgrade(27,"Runite Ore Drop","Multiplies rock golem dig rate by " + MD.uv.level1mult + ".","Which game is this again?.", n("2M"),function(){return MD.HIRELINGS_OWNED[6] >= 10}),
    new MD.Upgrade(28,"Extra Pointy","Multiplies rock golem dig rate by " + MD.uv.level2mult + ".","Don't work too close, you don't want to get crushed.", n("250M"),function(){return MD.HIRELINGS_OWNED[6] >= 50}),
    new MD.Upgrade(29,"Mountain Men","Multiplies rock golem dig rate by " + MD.uv.level3mult + ".","Note the emphasis - not mountain-like men, but men-like mountains.", n("3T"),function(){return MD.HIRELINGS_OWNED[6] >= 100}),
    new MD.Upgrade(101,"Carbonado Cores","Multiplies rock golem dig rate by " + MD.uv.level4mult + ".","Giant rocks filled with more better rocks.", n("100P"),function(){return MD.HIRELINGS_OWNED[6] >= 150}),
    new MD.Upgrade(135, "Crystalline Hands", "Allows alchemical transmutation of rock golems.","At least it will be bright when they crush you.",{flawless:400},function(){return MD.HIRELINGS_OWNED[6] >= 200}),
    new MD.Upgrade(206, "Strange Transformation", "There is a now a tiny chance of a rock golem being converted to a mage each tick.","To be fair... we don't really know anything about rock golems.",{flawless:n("1M")},function(){return MD.HIRELINGS_OWNED[6] >= n("1G")}),
    new MD.Upgrade(207, "Myth and Machine", "Baggers now produce more dirt for every rock golem hired.","Teamwork is beautiful.",{flawless:n("1G")},function(){return MD.HIRELINGS_OWNED[6] >= n("1T")}),

    new MD.Upgrade(30,"13500","Multiplies bagger 288 dig rate by " + MD.uv.level1mult + ".","Why does this exist?.", n("20M"),function(){return MD.HIRELINGS_OWNED[7] >= 10}),
    new MD.Upgrade(31,"Sehr gut!","Multiplies bagger 288 dig rate by " + MD.uv.level2mult + ".","Es ist wunderschoen!.", n("10G"),function(){return MD.HIRELINGS_OWNED[7] >= 50}),
    new MD.Upgrade(32,"German Engineering","Multiplies bagger 288 dig rate by " + MD.uv.level3mult + ".","Oh those Germans...", n("100T"),function(){return MD.HIRELINGS_OWNED[7] >= 100}),
    new MD.Upgrade(102,"Unreasonable Force","Multiplies bagger 288 dig rate by " + MD.uv.level4mult + ".","Sometimes you have to wonder why anyone would want to dig this much.", n("1E"),function(){return MD.HIRELINGS_OWNED[7] >= 150}),
    new MD.Upgrade(136, "Diamond-Studded Treads", "Allows alchemical transmutation of baggers.","The biggest thing in useless bling technology.",{exceptional:500},function(){return MD.HIRELINGS_OWNED[7] >= 200}),
    new MD.Upgrade(169, "Diesel Engines", "Baggers produce " + MD.uv.level1mult + " times as much dirt.","You can smell the fumes for miles.",{coal:n("10K")},function(){return MD.HIRELINGS_OWNED[7] >= n("1M")}),
    new MD.Upgrade(208, "Dig Smarter, Not Harder", "Baggers now produce a small amount of coal each tick.","Yay! More coal!",{flawless:n("1M")},function(){return MD.HIRELINGS_OWNED[7] >= n("1G")}),
    new MD.Upgrade(209, "Machine and Myth", "Rock golems now produce more stone for every bagger hired.","We shall strip the earth to the core!",{flawless:n("1G")},function(){return MD.HIRELINGS_OWNED[7] >= n("1T")}),

    new MD.Upgrade(33,"Gaia's Training","Multiplies earth titan dig rate by " + MD.uv.level1mult + ".","Study hard my friends.", n("8G"),function(){return MD.HIRELINGS_OWNED[8] >= 10}),
    new MD.Upgrade(34,"Hyperion","Multiplies earth titan dig rate by " + MD.uv.level2mult + ".","Applied mythology.", n("100G"),function(){return MD.HIRELINGS_OWNED[8] >= 50}),
    new MD.Upgrade(35,"Commander Kronus","Multiplies earth titan dig rate by " + MD.uv.level3mult + ".","The master of time - as opposed to you, who has spent ages on this game.", n("10P"),function(){return MD.HIRELINGS_OWNED[8] >= 100}),
    new MD.Upgrade(103,"Masters of Old","Multiplies earth titan dig rate by " + MD.uv.level4mult + ".","You sometimes wonder why they choose to help you.", n("80E"),function(){return MD.HIRELINGS_OWNED[8] >= 150}),
    new MD.Upgrade(137, "Diamond Hearts", "Allows alchemical transmutation of earth titans.","They seem to be growing warmer.",{perfect:300},function(){return MD.HIRELINGS_OWNED[8] >= 200}),
    new MD.Upgrade(170, "Rock Out","Multiplies stone production by " + MD.uv.level2mult + ".","About time these things started carrying their weight.",{steel:500,stone:n("1M")},function(){return MD.TOTAL_STEEL >= 0 && MD.HIRELINGS_OWNED[8] >= n("1M")}),
    new MD.Upgrade(210, "Symbiosis", "Your earth titans produce " + s(MD.uv.titanperpop) + " more gold for each population in your habitation.","Yay for gold!",{perfect:n("1M")},function(){return MD.HIRELINGS_OWNED[8] >= n("1G")}),
    new MD.Upgrade(211, "Academic Symbiosis", "Your earth titans produce " + s(100*MD.uv.titanperpop) + " more gold for each scholar in your university.","I was wondering what scholars were good for...",{perfect:n("1G")},function(){return MD.HIRELINGS_OWNED[8] >= n("1T")}),

    new MD.Upgrade(52,"Rotating Jaw","Multiplies world eater dig rate by " + MD.uv.level1mult + ".","If you thought they were scary before, try filling their mouths with saw blades.", n("1T"),function(){return MD.HIRELINGS_OWNED[9] >= 10}),
    new MD.Upgrade(53,"Aerodynamic Plating","Multiplies world eater dig rate by " + MD.uv.level2mult + ".","Picture an eel, but weighing five hundred tons and gliding through solid rock.", n("1P"),function(){return MD.HIRELINGS_OWNED[9] >= 50}),
    new MD.Upgrade(54,"Diamond Enforced Teeth","Multiplies world eater dig rate by " + MD.uv.level3mult + ".","A bright blue sparkle is the last thing you'll ever see.", n("1E"),function(){return MD.HIRELINGS_OWNED[9] >= 100}),
    new MD.Upgrade(104,"Apophis","Multiplies world eater dig rate by " + MD.uv.level4mult + ".","Eaters of worlds... perhaps this is overkill?", n("1Z"),function(){return MD.HIRELINGS_OWNED[9] >= 150}),
    new MD.Upgrade(138, "Crystal Shard Eyes", "Allows alchemical transmutation of world eaters.","They see all.",{majestic:10},function(){return MD.HIRELINGS_OWNED[9] >= 200}),
    new MD.Upgrade(212, "Makes Sense", "World eaters now produce dirt.", "I guess all the stuff they dig through has to go somewhere.",{majestic:n("250K")},function(){return MD.HIRELINGS_OWNED[9] >= n("1G")}),
    new MD.Upgrade(213, "Energy of Earth", "The amount of adamantium found in the smelting pit increases for each dirt converted to mana by your alchemists.","We're not sure how this is related to world eaters.",{majestic:n("250M")},function(){return MD.HIRELINGS_OWNED[9] >= n("1T")}),

    new MD.Upgrade(57,"Ventral Sacs","Increases queen spawn rate by " + MD.uv.queenupgrade1 + ".","Overlords gain the ability to transport... what game is this again?.", n("500T"),function(){return MD.HIRELINGS_OWNED[10] >= 10}),
    new MD.Upgrade(81,"Bulbosity Enhancement","Increases queen spawn rate by " + MD.uv.queenupgrade2 + ".","This doesn't really seem like a good thing.", n("5P"),function(){return MD.HIRELINGS_OWNED[10] >= 25}),
    new MD.Upgrade(58,"Larval Acceleration","Increases queen spawn rate by " + MD.uv.queenupgrade2 + ".","The mine has become significantly more... writhy.", n("1E"),function(){return MD.HIRELINGS_OWNED[10] >= 50}),
    new MD.Upgrade(59,"Unnatural Virility","Increases queen spawn rate by " + MD.uv.queenupgrade3 + ".","This is becoming a problem....", n("1Z"),function(){return MD.HIRELINGS_OWNED[10] >= 100}),
    new MD.Upgrade(105,"Hive Mentality","Increases queen spawn rate by " + MD.uv.queenupgrade4 + ".","The ground is alive.", n("1Y"),function(){return MD.HIRELINGS_OWNED[10] >= 150}),
    new MD.Upgrade(139, "Diamond-Spiked Eggs", "Allows alchemical transmutation of hive queens.","Just try to get near these suckers.",{majestic:100},function(){return MD.HIRELINGS_OWNED[10] >= 200}),
    new MD.Upgrade(214, "Ever Advancing", "Queen spawn rate increases based on the number of ants you have.","This... could be a problem.",{majestic:n("1M")},function(){return MD.HIRELINGS_OWNED[10] >= n("1G")}),
    new MD.Upgrade(215, "Extreme Mutation", "Hive Queens occasionally produce a small number of non-ant hirelings.","A sac of world eater eggs is about the scariest thing on earth.",{majestic:n("1G")},function(){return MD.HIRELINGS_OWNED[10] >= n("1T")}),

    new MD.Upgrade(106, "Reinforced Claws", "Increases wyvern dig rate by " + MD.uv.level1mult + ".","They tear through stone like its made of paper.", n("1E"),function(){return MD.HIRELINGS_OWNED[11] >= 10}),
    new MD.Upgrade(107, "Crystal Vision", "Increases wyvern dig rate by " + MD.uv.level2mult + ".","It feels like they're looking through you... or trying to decide what the iron in your blood is worth.", n("2Z"),function(){return MD.HIRELINGS_OWNED[11] >= 50}),
    new MD.Upgrade(108, "Rhenium Heart", "Increases wyvern dig rate by " + MD.uv.level3mult + " and allows alchemical transmutation of wyverns.","This makes them dig faster, and definitely does not lead to immediate cardiac arrest.", n("2Y"),function(){return MD.HIRELINGS_OWNED[11] >= 100}),
    new MD.Upgrade(109, "Truth Exceeding Legend", "Increases wyvern dig rate by " + MD.uv.level4mult + ".","Right out of a storybook used to scare children.", n("800Y"),function(){return MD.HIRELINGS_OWNED[11] >= 150}),
    new MD.Upgrade(153, "Mythical Power", "Increases wyvern dig rate by " + MD.uv.level5mult + ".","All men tremble when the blue terror blots out the sun.", n("250X"),function(){return MD.HIRELINGS_OWNED[11] >= 200}),
    new MD.Upgrade(171, "Iron Affinity", "Multiplies iron production by " + MD.uv.level1mult + ".","Turns out they're good for more than just digging.", {steel:n("5K"),coal:n("50K")},function(){return MD.HIRELINGS_OWNED[11] >= n("1M") && MD.TOTAL_STEEL > 0}),
    new MD.Upgrade(189, "Adamantium Affinity", "You now produce 1 adamantium per second for every ten million Wyverns hired.","Now and then they find something useful.",{adamantium:n("75")},function(){return MD.HIRELINGS_OWNED[11] >= n("1M") && MD.TOTAL_ADAMANTIUM > 0}),
    new MD.Upgrade(216, "Ten Thousand Foot View", "Buried treasure becomes much more common.","How does this work? X-ray vision!",{majestic:n("4M")},function(){return MD.HIRELINGS_OWNED[11] >= n("1G")}),
    new MD.Upgrade(217, "Big Cousins", "Dragon level up cost is reduced by 2%.","This will save you more than you'd think.",{majestic:n("4G")},function(){return MD.HIRELINGS_OWNED[11] >= n("1T")}),

    new MD.Upgrade(147, "Neurological Compounding", "Increases neurochrysalis generation rate by " + MD.uv.level1mult + ".","Combining the neurological centers of entire colonies of ants has yielded unforeseen advances in mana technology.", {mana:n("3P")},function(){return MD.HIRELINGS_OWNED[12] >= 10}),
    new MD.Upgrade(148, "Full Assimilation", "Increases neurochrysalis generation rate by " + MD.uv.level2mult + ".","Far greater mana gain can be achieved when removing chyrsalis constraints on drawing irrecoverably from the host.", {mana:n("20P")},function(){return MD.HIRELINGS_OWNED[12] >= 50}),
    new MD.Upgrade(167, "Metamorphosis", "Increases neurochrysalis generation rate by " + MD.uv.level3mult + ".","Growing and morphing... what will come of this?", {mana:n("750P")},function(){return MD.HIRELINGS_OWNED[12] >= 100}),
    new MD.Upgrade(181, "Neurological Enlightenment", "Allows alchemical transmutation of neurochrysalis.","About time we figured this out.", {"large ant":n("1P")},function(){return MD.HIRELINGS_OWNED[12] >= 100 && MD.MAGE_TOWER_RESEARCH >= n("100K")}),
    new MD.Upgrade(251, "Flax Affinity", "You now produce 1 flax per second for every twenty million neurochrysalises hired.","Do not try to bend the flax, only realize the truth. There is no flax.",{flax:n("10K")},function(){return MD.HIRELINGS_OWNED[12] >= n("100M") && MD.TOTAL_FLAX > 0}),
    new MD.Upgrade(218, "Mental Energies", "Your alchemists can convert dirt to mana 15 times as efficiently.","I'm a little bit worried about what these neurothingies are doing.",{majestic:n("250M")},function(){return MD.HIRELINGS_OWNED[12] >= n("1G")}),
    new MD.Upgrade(219, "Collective Knowledge", "Scholars increase essence gain by a tiny amount.","If you're a student, then what are you still doing here? Don't you have homework?",{majestic:n("250G")},function(){return MD.HIRELINGS_OWNED[12] >= n("1T")}),
    new MD.Upgrade(253, "Mana Man", "Neurochrysalises produce twice as much mana and slightly more flax.","Never give up - eventually things will work out.",{mana:n("1X"),gold:n("100KQ")},function(){return sumArray(MD.IMBUEMENT_LEVEL) >= 2500}),

    new MD.Upgrade(244, "Archery Courses", "Increases dragon hunter hunt rate by " + MD.uv.level1mult + ".","It's about time they stopped flinging arrows about willy nilly.", {dragonscale:100},function(){return MD.HIRELINGS_OWNED[13] >= 10}),
    new MD.Upgrade(245, "Adamantium Tipped Arrows", "Increases dragon hunter hunt rate by " + MD.uv.level2mult + ".","Why were we making our arrows out of gold again?", {dragonscale:n("1K")},function(){return MD.HIRELINGS_OWNED[13] >= 50}),
    new MD.Upgrade(246, "Homing Darts", "Increases dragon hunter hunt rate by " + MD.uv.level3mult + ".","No skill required.", {dragonscale:n("10K")},function(){return MD.HIRELINGS_OWNED[13] >= 100}),
    new MD.Upgrade(247, "Human Fusion", "Allows alchemical transmutation of dragon hunters.","How is this different than a miner with a bow? We don't know.", {dragonscale:n("100K"),fire:25},function(){return MD.HIRELINGS_OWNED[13] >= 100 && MD.hasDragon("Youngling")}),
    new MD.Upgrade(259, "Draconic Knowledge", "Dragon level up cost is reduced by 3%.","Who'd have thunk it... they're good for more than just killing.", {dragonscale:n("10G"),fire:n("25K")},function(){return MD.HIRELINGS_OWNED[13] >= n("1G") && MD.hasDragon("Youngling") && MD.hasUpgrade("Big Cousins")}),

    //Mage upgrades
    new MD.Upgrade(36,"Magic!","Multiplies mage damage by " + MD.uv.level1mult + ".","Magic, magic, magic!", n("10M"),function(){return MD.MAGES >= 10}),
    new MD.Upgrade(37,"Dumbledore's Finest","Multiplies mage damage by " + MD.uv.level2mult + ".","Only Hogwarts trained wizards need apply!", n("100G"),function(){return MD.MAGES >= 50}),
    new MD.Upgrade(38,"Merlin","Multiplies mage damage by " + MD.uv.level3mult + ".","Wrapped in mystery, none dare to question the wizards of the mine!", n("100T"),function(){return MD.MAGES >= 100}),
    new MD.Upgrade(112,"Deity-ish","Multiplies mage damage by " + MD.uv.level4mult + ".","They are like gods... if gods were limited to 3 very specific tasks!", {gold:n("100P"),mana:n("100M")},function(){return MD.MAGES >= 150}),

    new MD.Upgrade(140, "Durable Mana Channels", "Mages remain charged up for twice as long.", "It just keeps going.",n("10T"),function(){return MD.MAGE_MAX_TIME >= 3600 && MD.MAGES >= 35}),
    new MD.Upgrade(141, "Eternal Energy", "Mages remain charged up for twice as long.", "They become like the surrounding environment. Tranquil. Unmoving.",{exceptional:1},function(){return MD.MAGE_MAX_TIME >= 7200 && MD.MAGES >= 50}),
    new MD.Upgrade(142, "Mana Overcharge", "Mages require fewer clicks to charge up.", "New and improved, now with faster boot times!.",n("10T"),function(){return MD.MAGE_MAX_TIME >= 10800 && MD.MAGES >= 75}),
    new MD.Upgrade(193, "Instant Power", "Mages charge up in a single click and remain that way for longer.", "With this upgrade, 1 click is the equivalent of 38 episodes of Dragonball Z.",n("10W"),function(){return MD.MAGE_MAX_TIME >= 43200 && MD.MAGES >= 300}),

    //Mason upgrades
    new MD.Upgrade(39,"Elbow Grease","Multiplies craftsman repair rate by " + MD.uv.level1mult + ".","Sometimes you just have to get er done.", n("5M"),function(){return MD.MASONS >= 10}),
    new MD.Upgrade(40,"Takin Care of Business","Multiplies craftsman repair rate by " + MD.uv.level2mult + " plus " + MD.uv.masonPercent1 +"% of wall durability.","Every day! Each and every way!", n("10G"),function(){return MD.MASONS >= 50}),
    new MD.Upgrade(41,"Overall-Clad Blurs","Multiplies craftsman repair rate by " + MD.uv.level3mult + " plus " + MD.uv.masonPercent2 +"% of wall durability.","We're not even sure how they move that fast...", n("50T"),function(){return MD.MASONS >= 100}),
    new MD.Upgrade(113,"Alchemical Repair Rates","Multiplies craftsman repair rate by " + MD.uv.level4mult + " plus " + MD.uv.masonPercent3 +"% of wall durability.","They just sort of clap, some sparks fly and things get fixed.", n("50P"),function(){return MD.MASONS >= 150}),

    //Alchemist Upgrades
    new MD.Upgrade(144,"Alchemical Furor","Multiplies alchemical speed by " + MD.uv.level1mult + ".","Not everything is as it seems.", {gold:n("5Y"),normal:2000},function(){return MD.ALCHEMISTS >= 10}),
    new MD.Upgrade(145,"Philosopher's Stone","Multiplies alchemical speed by " + MD.uv.level2mult + ".","This is the law of equivalence exchange, but it can be avoided.", {gold:n("5X"),normal:5000},function(){return MD.ALCHEMISTS >= 50}),
    new MD.Upgrade(146,"The Elric Brothers","Multiplies alchemical speed by " + MD.uv.level3mult + ".","Experts from a foreign land have come to share their trade.", {gold:n("50X"),normal:10000},function(){return MD.ALCHEMISTS >= 100}),
    new MD.Upgrade(248,"Flying Sparks","Multiplies alchemical speed by " + MD.uv.level4mult + ".","Armies rise out of the dust of a thousand shattered gems.", {gold:n("25D"),majestic:n("250M")},function(){return MD.ALCHEMISTS >= 150}),
    new MD.Upgrade(180,"Higher Learning","Multiplies alchemical speed by " + MD.uv.level5mult + " and farms produce " + MD.uv.level3mult + " more food.","Stay in school, so you can make bread from gold. Wait... what?", {gold:n("10S")},function(){return MD.ALCHEMISTS >= 200 && MD.getEducationLevel() >= 50000}),

    new MD.Upgrade(151,"Increased Yields","Alchemical recipes produce " + MD.uv.level1mult + " times as much at no additional cost.","It takes some time to get these things right.",{majestic:100,mana:n("1P")},function(){return MD.ALCHEMISTS >= 10 && MD.TOTAL_GEMS >= n("1M")}),
    new MD.Upgrade(152,"Unequivalent Exchange","Alchemical recipes produce " + MD.uv.level2mult + " times as much at no additional cost.","Sometimes you really do get something for nothing.",{majestic:400,mana:n("10P")},function(){return MD.ALCHEMISTS >= 25 && MD.TOTAL_GEMS >= n("2.5M")}),    
    new MD.Upgrade(156,"Desert Bloom","Alchemical recipes produce " + MD.uv.level3mult + " times as much at no additional cost.","You've done great things with the place.",{majestic:5000,mana:n("250P")},function(){return MD.ALCHEMISTS >= 75 && MD.TOTAL_GEMS >= n("75M")}),

    //Cross Upgrades
    new MD.Upgrade(42, "Existing Tunnel Systems", "Ants gain " + MD.uv.antpersandshrew + " base gold per second for every sandshrew hired.","Hmm, maybe those ants are good for more than just eating my lunches.", n("50K"),function(){return (MD.HIRELINGS_OWNED[0] >= 10 && MD.HIRELINGS_OWNED[3] >= 10)}),
    new MD.Upgrade(43, "Friends With Rare Candies", "Sandshrews gain " + MD.uv.sandshrewperminer + " base gold per second for every miner hired.", "It is inconclusive whether these effect IV spread, but the little critters sure seem to love them.",n("1M"),function(){return (MD.HIRELINGS_OWNED[3] >= 20 && MD.HIRELINGS_OWNED[5] >= 15)}),
    new MD.Upgrade(44, "Affinity With Nature", "Woodpeckers gain " + MD.uv.woodpeckerpertitan + " base gold per second for every earth titan owned.","The forests are beautiful again...",n("10G"),function(){return (MD.HIRELINGS_OWNED[1] >= 50 && MD.HIRELINGS_OWNED[8] >= 10)}),
    new MD.Upgrade(50, "Gentle Giants", "Ants gain " + MD.uv.antperrockgolem + " base gold per second for every rock golem hired.","Harmony between the most simple and the most terrifying is elegant indeed.",n("100G"),function(){return (MD.HIRELINGS_OWNED[0] >= 80 && MD.HIRELINGS_OWNED[6] >= 50)}),
    new MD.Upgrade(51, "Mechanized Industry", "Miners gain " + MD.uv.minerperbagger + " base gold per second for every bagger 288 hired.","Replenish the earth, and subdue it.",n("1G"),function(){return (MD.HIRELINGS_OWNED[5] >= 25 && MD.HIRELINGS_OWNED[7] >= 25)}),
    new MD.Upgrade(114, "Dragonborn", "Miners gain " + s(MD.uv.minerperwyvern) + " base gold per second for every wyvern hired.","I just bought Skyrim during the steam sale and haven't played it, so I don't know what to write here.",{perfect:1},function(){return(MD.HIRELINGS_OWNED[5] >= 80 && MD.HIRELINGS_OWNED[11] >= 10)}),
    new MD.Upgrade(115, "Internal Army", "World eaters gain " + s(MD.uv.worldperant) + " base gold per second for every ant hired.","Crawling in my skin. These wounds, they will not heal.",{exceptional:6,gold:n("100P")},function(){return(MD.HIRELINGS_OWNED[9] >= 60 && MD.HIRELINGS_OWNED[0] >= n("25M"))}),
    new MD.Upgrade(117, "Man's Best Friend", "Bloodhounds gain gold per second equal to the number of craftsmen to the power of " + MD.uv.houndpercraftexponent + ".","Bloodhounds don't suck.",{normal:4},function(){return(MD.MASONS >= 25 && MD.HIRELINGS_OWNED[2] >= 60)}),
    new MD.Upgrade(149, "Everything is Tunnels","Ants gain " + s(MD.uv.antperbagger) + " base gold per second for every bagger 288 hired.","It makes you wonder if the ants are really necessary... your GPS suggests yes.",{"bagger 288":50},function(){return MD.HIRELINGS_OWNED[7] >= n("1K")}),
    new MD.Upgrade(154, "Not Just A Boulder","Sandshrew gain " + s(MD.uv.sandshrewpergolem) + " base gold per second for every rock golem hired.","The pioneers used to ride these babies for miles!",{"sandshrew":n("5K")},function(){return MD.HIRELINGS_OWNED[6] >= n("3K")}),
    new MD.Upgrade(173, "Underdogs","Goblin gold production is multiplied by the number of bloodhounds and bloodhound gold production is multiplied by the number of goblins.","Teamwork is a good thing.",{"world eater":n("10K")},function(){return (MD.HIRELINGS_OWNED[2] * MD.HIRELINGS_OWNED[4]) > n("10G")}),

    //Other
    new MD.Upgrade(45, "Pirate's Luck", "Treasures appear twice as often", "Arr!",n("1G"),function(){return MD.TREASURES_FOUND >= 50}),
    new MD.Upgrade(94, "Gleaming Treasure", "Buried treasures now contain gems.", "It just adds some color to your run of the mill buried riches.",n("1T"),function(){return MD.TREASURES_FOUND >= 200}),
    new MD.Upgrade(95, "Gold Forever", "The maximum treasure amount is multiplied by " + MD.uv.goldforevermult + ".", "They just keep making these bigger and bigger.",n("1P"),function(){return MD.TREASURES_FOUND >= 500}),
    new MD.Upgrade(60, "A Little Bugged", "Pick efficiency is increased by " + MD.uv.pickgainperant + " per ant.","It is said that a man surrounded by insects starts to become one himself.",n("3P"),function(){return MD.PICK_LEVEL >= MD.getPickID("Swarm") && MD.HIRELINGS_OWNED[0] > n("500K")}),
    new MD.Upgrade(61, "Mantis Extension", "Pick efficiency is increased by " + MD.uv.pickgainperant2 + " per ant.","The miner is beginning to look a little... twisted.",n("10P"),function(){return MD.PICK_LEVEL >= MD.getPickID("Swarm") && MD.HIRELINGS_OWNED[0] > n("5M")}),
    new MD.Upgrade(67, "A Fan of Upgrades", "Upgrades cost " + MD.uv.upgradereduction + "% less.","I'm beginning to think this game is just about collecting stuff.",n("3P"),function(){return MD.UPGRADES_BOUGHT >= 50}),
    new MD.Upgrade(143, "Encouraging Achievements", "Each upgrade purchased boosts gold per second by " + MD.uv.gpsperupgrade + "%.","It just gives you a good feeling to see those trophies up there.",n("25M"),function(){return MD.UPGRADES_BOUGHT >= 20}),
    new MD.Upgrade(68, "Bigshot Manager", "Hirelings cost " + MD.uv.upgradereduction + "% less.","It is an army bred for a single purpose: to dig up the world of gold.",n("3P"),function(){return (sumArray(MD.HIRELINGS_OWNED)-MD.HIRELINGS_OWNED[0]) >= 500}),
    new MD.Upgrade(93, "Communal Effort", "Pick efficiency is increased by " + s(MD.uv.pickgainperhireling) + " for each non-ant hireling.","Take a load off.",n("10P"),function(){return (sumArray(MD.HIRELINGS_OWNED)-MD.HIRELINGS_OWNED[0]) >= 800}),
    new MD.Upgrade(116, "Advanced Magick","Pick efficiency is increased by an amount that your mages can't quite specify.", "Your mages were sitting around, drank a little bit too much, and fired off this spell by accident.",{majestic:3,gold:n("800Y"),mana:n("100G")},function(){return (MD.hasMageUpgrade("HEART!") && MD.hasUpgrade("Dark Portents") && MD.MAGES >= 260)}),
    new MD.Upgrade(165, "Trap Aficionado","Goblin gold per second is increased by " + s(MD.uv.goblinpertrap1) + " for each trap purchased.","You scared of a little fight?",n("5G"),function(){return sumArray(MD.TRAPS_BOUGHT) >= 100}),
    new MD.Upgrade(166, "Trap Master","Goblin gold per second is increased by " + s(MD.uv.goblinpertrap2) + " for each trap purchased.","There are people at your camp who have never even seen a goblin.",n("5T"),function(){return sumArray(MD.TRAPS_BOUGHT) >= 250 && MD.hasUpgrade("Trap Aficionado")}),
    new MD.Upgrade(197, "Team Rocket Buyer","Alchemists can now transform sandshrews into gold","They say we're selling them... but they never leave the alchemist's lair.",{"sandshrew":50},function(){return MD.HIRELINGS_OWNED[3] >= 1000}),

    //Industry
    new MD.Upgrade(162, "Studiosity","Mage research accumulates " + MD.uv.level1mult + " times as quickly.","It helps to bury your head in books from time to time.",{mana:n("50P")},function(){return MD.MAGE_TOWER_RESEARCH >= n("5K")}),
    new MD.Upgrade(163, "Age of Wonders","Mage research accumulates " + MD.uv.level2mult + " times as quickly.","Greatness ebbs and flows, and you are going to help it on it's way.",{mana:n("200P")},function(){return MD.MAGE_TOWER_RESEARCH >= n("25K")}),
    new MD.Upgrade(168, "Mechanical Overload","Your auto-smithy combines gems " + MD.uv.overloadmult1 + " times as quickly.","Turn this screw just so, and hit it with a wrench right in the widget.",{steel:n("1K"),coal:n("2.5K")},function(){return MD.hasConstruct("Smelting Pit") && MD.CONSTRUCT_LEVELS[0] >= 10}),
    new MD.Upgrade(249, "Mechanical Supercharge","Your auto-smithy combines gems " + MD.uv.overloadmult2 + " times as quickly.","Wow! Such gem! Much shiny!.",{steel:n("1M"),coal:n("2.5M")},function(){return MD.hasConstruct("Smelting Pit") && MD.CONSTRUCT_LEVELS[0] >= 40 && MD.hasUpgrade("Industrial Brakes")}),
    new MD.Upgrade(174, "Rush Job", "Multiplies land preparation speed by the number of craftsmen hired divided by 100.","Git-R-Done.",{steel:n("2.5K")},function(){return countElements(MD.CONSTRUCT_LOCATIONS,null) < 20 && MD.TOTAL_STEEL > 0}),
    new MD.Upgrade(175, "Agriculture", "Farms now produce " + MD.convals.farmrate2 + " food every harvest.","The bloom of civilization is upon us.",{adamantium:1,steel:n("25K")},function(){return MD.getEducationLevel() >= 50}),
    new MD.Upgrade(176, "Industrial Brakes", "Allows you to set a minimum gem amount for the auto-smithy.","Woah there. Let's stop and look around.",{adamantium:1,steel:n("25K")},function(){return MD.getEducationLevel() >= 100}),
    new MD.Upgrade(177, "Steel Affinity", "Multiplies smelting pit steel production by " + MD.uv.level1mult + ".","About time you kicked things up.",{adamantium:3,steel:n("75K")},function(){return MD.getEducationLevel() >= 250}),
    new MD.Upgrade(178, "War Vultures", "The chance of finding adamantium after a campaign is multiplied by " + MD.uv.level3mult + ".","All that work of a campaign... and they hardly even search the loot.",{adamantium:5,coal:n("100K")},function(){return MD.getEducationLevel() >= 750}),
    new MD.Upgrade(179, "Irrigation", "Farms now produce " + MD.convals.farmrate3 + " food every harvest.","Viva la revolucion agricola!.",{adamantium:10,steel:n("100K")},function(){return MD.getEducationLevel() >= 2000}),
    new MD.Upgrade(182, "Peer Pressure", "The smelting pit now produces " + MD.uv.level1mult + " times as much.","So many goblins!",{steel:n("5K")},function(){return MD.TOTAL_STEEL > 0 && MD.HIRELINGS_OWNED[4] >= n("100K")}),
    new MD.Upgrade(183, "Enter the Horde", "The smelting pit now produces " + MD.uv.level2mult + " times as much.","Only the best may smelt.",{steel:n("50K")},function(){return MD.TOTAL_STEEL >= n("250K") && MD.HIRELINGS_OWNED[4] >= n("1M")}),
    new MD.Upgrade(184, "Waste Not", "The smelting pit's coal and iron cost per steel is cut in half.","Workplace safety is kind of a concern around here...",{"goblin":n("50K")},function(){return MD.TOTAL_STEEL >= 0 && MD.CONSTRUCT_LEVELS[5] >= 10}),
    new MD.Upgrade(185, "Want Not", "The smelting pit's coal and iron cost per steel is cut in half.","Seriously... why are all these goblins dying?",{"goblin":n("500K")},function(){return MD.TOTAL_STEEL >= 0 && MD.CONSTRUCT_LEVELS[5] >= 20}),
    new MD.Upgrade(186, "Heavy Smelting", "The smelting pit now has a small chance of producing Adamantium at the cost of 100 goblins.","That's right - I dare you to turn it off now!",{adamantium:10},function(){return MD.TOTAL_ADAMANTIUM >= 100}),
    new MD.Upgrade(187, "Learn from the Fallen", "Delving mages now find more gems for every goblin sacrified to the smelting pit.","About time those mages did their jobs.",{steel:n("5K"),goblin:n("100K")},function(){return MD.GOBLINS_SACRIFIED >= n("100K")}),
    new MD.Upgrade(188, "Miner Productivity", "The chance of a special discovery at the quarry is multiplied by the number of mine clicks in the past second.","How about some motivation?.",{steel:n("1K"),miner:n("50K")},function(){return MD.hasUpgrade("Deep Mining") && MD.hasUpgrade("Terra's Might") && MD.TOTAL_STEEL > 0}),
    new MD.Upgrade(190, "Have Not", "The smelting pit now costs half a goblin for every steel it produces, in addition to the regular price.","But... why?.",{goblin:n("10M")},function(){return MD.hasUpgrade("Want Not") && MD.HIRELINGS_OWNED[4] >= n("25M")}),
    new MD.Upgrade(191, "Builder's Regret", "You now have an option to move buildings on the industry screen.","Don't ask about the logistics here. It's neuro-magic.",{neurochrysalis:50},function(){return MD.hasUpgrade("Neurological Enlightenment") && MD.TOTAL_STEEL > 0}),
    new MD.Upgrade(194, "Obsessive Recordkeeping", "Allows the construction of an administration building, where you can track the growth of your resources over time.","About time somebody knew what was going on around here...",{miner:1000},function(){return MD.hasConstruct("University")}),
    new MD.Upgrade(220, "Blind Revenge", "You can now automatically attack at set intervals from the graveyard.","He who strikes blindly never misses. Except for most of the time.",{population:200,steel:n("5K"),adamantium:n("1K")},function(){return MD.hasConstruct("Graveyard") && MD.SOLDIERS_LOST >= n("10K")}),
    new MD.Upgrade(252, "Strike Blindly", "Whenever blind revenge activates, a bomb is also dropped if you can afford it.","This is a bad idea.",{population:500,steel:n("5M"),adamantium:n("100K")},function(){return MD.hasConstruct("Graveyard") && MD.SOLDIERS_LOST >= n("25K")}),
    new MD.Upgrade(221, "Baby Bonuses","Population recovers twice as quickly.","Making babies, for fun and profit.",{coal:n("2M"),steel:n("1M")},function(){return MD.hasConstruct("Habitation") && MD.getPopulationMax() >= 200}),
    new MD.Upgrade(222, "Green Revolution","Population recovers twice as quickly and eats half as much.","Mmm... manual labor.",{coal:n("5M"),steel:n("10M"),adamantium:10},function(){return MD.hasConstruct("Habitation") && MD.getPopulationMax() >= 500}),
    new MD.Upgrade(256, "Untapped Markets","You now have the option to send out scouts to look for new merchants.","The old merchants won't have a chance to rip us off again...",{flax:100,adamantium:100},function(){return MD.MARKET_TRADES >= 250 && MD.FLAX > 0}),
    
    //Spirit Upgrades
    new MD.Upgrade(254, "Ghosts of Quarry Future","Every 30 seconds, if your quarry has found something, it will be added automatically.","We could just hire a miner... but super expensive ghosts are way cooler.",{spirit:3,woodpecker:n("1G")},function(){return MD.TOTAL_SPIRIT_ESSENCE >= 3 && MD.HIRELINGS_OWNED[1] >= n("20G")}),
    new MD.Upgrade(255, "Ghosts of Economic Prowess","Your average market rate is increased based on the number of scholars you own.","All these academics are finely doing something practical...",{spirit:5,majestic:n("5G")},function(){return MD.TOTAL_SPIRIT_ESSENCE >= 25 && MD.CONSTRUCT_LEVELS[10] >= n("25M")}),
    new MD.Upgrade(257, "Ghosts of Rapid Mechanization","Your machinist builds more each second based on your total essence earned.","Santa has elves? Well we have ghosts. Take that Santa.",{spirit:25,majestic:n("5T")},function(){return MD.TOTAL_SPIRIT_ESSENCE >= 100 && (MD.hasUpgrade("Fury of Flame") || MD.hasUpgrade("One with Nature") || MD.hasUpgrade("Fury of the Sea"))}),
    new MD.Upgrade(258, "Auto-Rift 9000","Your machinist inform you of a strange machine they have built, which feeds, raises, and sacrifices a dragon, all in a single click.","Such mighty beasts reduced to this...",{spirit:1000,majestic:n("500T")},function(){return MD.TOTAL_SPIRIT_ESSENCE >= 1000 && MD.HIRELINGS_OWNED[13] >= n("1T")}),
    new MD.Upgrade(263, "Auto-Auto-Rift 9000","For when automatic sacrifice isn't enough.","This is getting out of hand.",{spirit:n("1M"),majestic:n("500P")},function(){return MD.TOTAL_SPIRIT_ESSENCE >= n("1M") && MD.HIRELINGS_OWNED[13] >= n("1P") && MD.hasUpgrade("Auto-Rift 9000")}),

    //Time Upgrades
    new MD.Upgrade(46, "The First Steps", "Multiplies your gold per second by " + MD.uv.timeupgrade1 + ".", "And so it begins.", n("500"),function(){return MD.TICKS >= 600}),
    new MD.Upgrade(47, "Tick Tock Time", "Multiplies your gold per second by " + MD.uv.timeupgrade2 + ".", "The first of many.", n("500K"),function(){return MD.TICKS >= 3600}),
    new MD.Upgrade(48, "Flowing Like A River", "Multiplies your gold per second by " + MD.uv.timeupgrade3 + ".", "The hours slip by.", n("500M"),function(){return MD.TICKS >= 36000}),
    new MD.Upgrade(49, "Chronological Torrent", "Multiplies your gold per second by " + MD.uv.timeupgrade4 + ".", "Life is but a flash.", n("500T"),function(){return MD.TICKS >= 360000}),
    new MD.Upgrade(158, "Birth of a World","Multiplies stone production by " + MD.uv.level1mult + ".","It's amazing what you can get done in a week.",n("500P"),function(){return MD.TICKS >= 864000 && MD.TOTAL_STONE >= 1}),
    new MD.Upgrade(192, "On and On","Population recovers twice as quickly.","So much time... at least there have been advances in... medicine or something?",{adamantium:100},function(){return MD.hasConstruct("Habitation") && MD.TICKS >= 1209600}),
    new MD.Upgrade(250, "Lotsa Time","All resource gain is multiplied by 2.","20 days of Mine Defense!",{fire:100,water:100},function(){return MD.TICKS >= 1728000}),

    //Mana multipliers
    new MD.Upgrade(70, "Nightmare Ants", "Multiplies mana gain by " + MD.uv.manamult + ".", "Even ants are scarier with red eyes.", n("25P"),function(){return MD.IMBUEMENT_LEVEL[0] >= 5}),
    new MD.Upgrade(71, "Nightmare Woodpeckers", "Multiplies mana gain by " + MD.uv.manamult + ".", "Fun fact - these woodpeckers can punture a human skull. The more you know.", n("20P"),function(){return MD.IMBUEMENT_LEVEL[1] >= 5}),
    new MD.Upgrade(72, "Nightmare Bloodhounds", "Multiplies mana gain by " + MD.uv.manamult + ".", "You can almost feel their breath on your neck as you work.", n("2P"),function(){return MD.IMBUEMENT_LEVEL[2] >= 5}),
    new MD.Upgrade(73, "Nightmare Sandshrew", "Multiplies mana gain by " + MD.uv.manamult + ".", "Remember the dark pokemon from Pokemon XD? They're like that.", n("4P"),function(){return MD.IMBUEMENT_LEVEL[3] >= 5}),
    new MD.Upgrade(74, "Nightmare Goblins", "Multiplies mana gain by " + MD.uv.manamult + ".", "Cackling in the night. Maybe they're not as tame as we though.", n("6P"),function(){return MD.IMBUEMENT_LEVEL[4] >= 5}),
    new MD.Upgrade(75, "Nightmare Miners", "Multiplies mana gain by " + MD.uv.manamult + ".", "Absolute power corrupts absolutely.", n("8P"),function(){return MD.IMBUEMENT_LEVEL[5] >= 5}),
    new MD.Upgrade(76, "Nightmare Rock Golems", "Multiplies mana gain by " + MD.uv.manamult + ".", "Obsidian shadows loom in the night.", n("10P"),function(){return MD.IMBUEMENT_LEVEL[6] >= 5}),
    new MD.Upgrade(77, "Nightmare Baggers", "Multiplies mana gain by " + MD.uv.manamult + ".", "A haunting grind eminates through your camp.", n("12P"),function(){return MD.IMBUEMENT_LEVEL[7] >= 5}),
    new MD.Upgrade(78, "Nightmare Titans", "Multiplies mana gain by " + MD.uv.manamult + ".", "Nature's kiss is a little less green now.", n("14P"),function(){return MD.IMBUEMENT_LEVEL[8] >= 5}),
    new MD.Upgrade(79, "Nightmare World Eaters", "Multiplies mana gain by " + MD.uv.manamult + ".", "Just when you thought these things couldn't get any worse.", n("16P"),function(){return MD.IMBUEMENT_LEVEL[9] >= 5}),
    new MD.Upgrade(80, "Nightmare Hive Queens", "Multiplies mana gain by " + MD.uv.manamult + ".", "Writhing in the night.", n("18P"),function(){return MD.IMBUEMENT_LEVEL[10] >= 5}),
    new MD.Upgrade(110, "Nightmare Wyverns", "Multiplies mana gain by " + MD.uv.manamult + ".", "All is still, until a jagged shadow blots out the moon. And then all is dark.", n("1E"),function(){return MD.IMBUEMENT_LEVEL[11] >= 5}),
    new MD.Upgrade(159, "Nightmare Neurochrysalises", "Neurochrysalis mana production increases by " + MD.uv.neuropermage1 + "% for each mage.", "These things make my skin crawl.", {mana:n("50P")},function(){return MD.IMBUEMENT_LEVEL[12] >= 5}),

    new MD.Upgrade(82, "Arcane Ants", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Your ants are beginning to emit an eerie blue light as they work.", {gold:n("250P"),mana:n("10M")},function(){return MD.IMBUEMENT_LEVEL[0] >= 25}),
    new MD.Upgrade(83, "Arcane Woodpeckers", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Woodpeckers that can pierce through body and mind.", {gold:n("20P"),mana:n("1M")},function(){return MD.IMBUEMENT_LEVEL[1] >= 25}),
    new MD.Upgrade(84, "Arcane Bloodhounds", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Watching. Always watching.", {gold:n("20P"),mana:n("1M")},function(){return MD.IMBUEMENT_LEVEL[2] >= 25}),
    new MD.Upgrade(85, "Arcane Sandshrew", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Sandshrew learned Psychic! Wait... what?.", {gold:n("40P"),mana:n("2M")},function(){return MD.IMBUEMENT_LEVEL[3] >= 25}),
    new MD.Upgrade(86, "Arcane Goblins", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Revenge courses through their mind without ceasing.", {gold:n("60P"),mana:n("3M")},function(){return MD.IMBUEMENT_LEVEL[4] >= 25}),
    new MD.Upgrade(87, "Arcane Miners", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "You are not among equals.", {gold:n("80P"),mana:n("4M")},function(){return MD.IMBUEMENT_LEVEL[5] >= 25}),
    new MD.Upgrade(88, "Arcane Rock Golems", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Those that were since the beginning.", {gold:n("100P"),mana:n("5M")},function(){return MD.IMBUEMENT_LEVEL[6] >= 25}),
    new MD.Upgrade(89, "Arcane Baggers", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "No longer running off gasoline.", {gold:n("120P"),mana:n("6M")},function(){return MD.IMBUEMENT_LEVEL[7] >= 25}),
    new MD.Upgrade(90, "Arcane Titans", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "Silent guardians. Or are they silent threats?.", {gold:n("140P"),mana:n("8M")},function(){return MD.IMBUEMENT_LEVEL[8] >= 25}),
    new MD.Upgrade(91, "Arcane World Eaters", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "World eaters dig through space and time, consuming all.", {gold:n("160P"),mana:n("10M")},function(){return MD.IMBUEMENT_LEVEL[9] >= 25}),
    new MD.Upgrade(92, "Arcane Hive Queens", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "0_0.", {gold:n("180P"),mana:n("12M")},function(){return MD.IMBUEMENT_LEVEL[10] >= 25}),
    new MD.Upgrade(111, "Arcane Wyverns", "Multiplies mana gain by " + MD.uv.manamult2 + ".", "An ominous blue glow is the last thing you'll ever see.", {gold:n("5E"),mana:n("250G")},function(){return MD.IMBUEMENT_LEVEL[11] >= 25}),
    new MD.Upgrade(160, "Arcane Neurochrysalises", "Neurochrysalis mana production increases by " + MD.uv.neuropermage2 + "% for each mage.", "Somethings is crawling in my brain...", {gold:n("5X"),mana:n("500P")},function(){return MD.IMBUEMENT_LEVEL[12] >= 25}),

    new MD.Upgrade(118, "Eldritch Ants", "Unlocks 10% of the alchemists potential.", "It takes a steady hand to harness the power of an army.", {gold:n("250E"),"large ant":n("1G")},function(){return MD.IMBUEMENT_LEVEL[0] >= 55}),
    new MD.Upgrade(119, "Eldritch Woodpeckers", "Unlocks 10% of the alchemists potential.", "Lend me your peck, peck, peck, power.", {gold:n("20E"),"large ant":n("100M")},function(){return MD.IMBUEMENT_LEVEL[1] >= 55}),
    new MD.Upgrade(120, "Eldritch Bloodhounds", "Unlocks 10% of the alchemists potential.", "Lazy mutts.", {gold:n("20E"),"large ant":n("100M")},function(){return MD.IMBUEMENT_LEVEL[2] >= 55}),
    new MD.Upgrade(121, "Eldritch Sandshrew", "Unlocks 10% of the alchemists potential.", "Pokeball go!!!.", {gold:n("40E"),"large ant":n("200M")},function(){return MD.IMBUEMENT_LEVEL[3] >= 55}),
    new MD.Upgrade(122, "Eldritch Goblins", "Unlocks 10% of the alchemists potential.", "Channel their fury.", {gold:n("60E"),"large ant":n("300M")},function(){return MD.IMBUEMENT_LEVEL[4] >= 55}),
    new MD.Upgrade(123, "Eldritch Miners", "Unlocks 10% of the alchemists potential.", "We obey.", {gold:n("80E"),"large ant":n("400M")},function(){return MD.IMBUEMENT_LEVEL[5] >= 55}),
    new MD.Upgrade(124, "Eldritch Rock Golems", "Unlocks 10% of the alchemists potential.", "Power from stone.", {gold:n("100E"),"large ant":n("500M")},function(){return MD.IMBUEMENT_LEVEL[6] >= 55}),
    new MD.Upgrade(125, "Eldritch Baggers", "Unlocks 10% of the alchemists potential.", "Engines of Destruction.", {gold:n("120E"),"large ant":n("600M")},function(){return MD.IMBUEMENT_LEVEL[7] >= 55}),
    new MD.Upgrade(126, "Eldritch Titans", "Unlocks 10% of the alchemists potential.", "Such power.", {gold:n("140E"),"large ant":n("800M")},function(){return MD.IMBUEMENT_LEVEL[8] >= 55}),
    new MD.Upgrade(127, "Eldritch World Eaters", "Unlocks 10% of the alchemists potential.", "Powering the new order.", {gold:n("160E"),"large ant":n("1G")},function(){return MD.IMBUEMENT_LEVEL[9] >= 55}),
    new MD.Upgrade(128, "Eldritch Hive Queens", "Unlocks 10% of the alchemists potential.", "Spawning pure energy.", {gold:n("180E"),"large ant":n("1.2G")},function(){return MD.IMBUEMENT_LEVEL[10] >= 55}),
    new MD.Upgrade(129, "Eldritch Wyverns", "Unlocks 10% of the alchemists potential.", "Overcharged.", {gold:n("5Z"),"large ant":n("10G")},function(){return MD.IMBUEMENT_LEVEL[11] >= 55}),
    new MD.Upgrade(161, "Eldritch Neurochrysalises", "Neurochrysalis mana production increases by " + MD.uv.neuropermage3 + "% for each mage.", "Slither.", {gold:n("5W"),"large ant":n("250G")},function(){return MD.IMBUEMENT_LEVEL[12] >= 55}),

    //Dragon
    new MD.Upgrade(223, "A Whole New World", "Farms produce twice as much food.", "Inspired by your kingdom's new mascot, farmers work extra hard!",{food:n("10M"),dragonscale:250},function(){return MD.hasDragon("Hatchling")},"dragon"),
    new MD.Upgrade(224, "Little Lizard", "Your army strength is multiplied by 1.5.", "Your soldiers have adopted a new hack and slash combat style, to great effect.",{food:n("10M"),dragonscale:1000},function(){return MD.hasDragon("Baby")},"dragon"),
    new MD.Upgrade(225, "First Steps", "Population recovers at 1.5 times the speed.", "Seeing an adorable baby dragon around has inspired your people to... you know.",{earth:n("1K"),dragonscale:2500},function(){return MD.hasDragon("Child")},"dragon"),
    new MD.Upgrade(226, "Teenage Rebellion", "Goblins are much more likely to rebel, and yield greater rewards.", "As if your goblins needed more motivation!",{fire:n("1K"),dragonscale:n("10K")},function(){return MD.hasDragon("Youngling") && MD.hasUpgrade("Traitorous Goblins")},"dragon"),
    new MD.Upgrade(227, "Grasshopper", "Barracks training costs 1/10th as much.", "Let's all fight together!",{lightning:n("1K"),dragonscale:n("25K")},function(){return MD.hasDragon("Novice")},"dragon"),
    new MD.Upgrade(228, "Sensei", "When sending students to the university, you get twice as many scholars.", "We have no idea how this works, but it helps!",{adamantium:n("10M"),dragonscale:n("100K")},function(){return MD.hasDragon("Master")},"dragon"),
    new MD.Upgrade(229, "World of Flame", "Fire essence is produced twice as quickly!", "The fire shrine flares angrily at all times.",{fire:n("2.5K"),dragonscale:n("250K")},function(){return MD.hasDragon("Fire")},"dragon"),
    new MD.Upgrade(230, "Fury of Flame", "The machinist now has an option to try and produce a mage each second.", "About time we automated this sucker.",{fire:n("5K"),dragonscale:n("1M")},function(){return MD.hasDragon("Blazing")},"dragon"),
    new MD.Upgrade(231, "Volcanic Fury", "Mages are twice as efficient at all tasks.", "Your mages have learned the way of flame.",{fire:n("10K"),dragonscale:n("2.5M")},function(){return MD.hasDragon("Inferno")},"dragon"),
    new MD.Upgrade(232, "World of Water", "Water essence is produced twice as quickly!.", "The water shrine's vortex swirls faster and faster.",{water:n("2.5K"),dragonscale:n("250K")},function(){return MD.hasDragon("Water")},"dragon"),
    new MD.Upgrade(233, "Fury of the Sea", "The machinist now has an option to try and produce an alchemist each second.", "Creating creators... creatorception?",{water:n("5K"),dragonscale:n("1M")},function(){return MD.hasDragon("Aquatic")},"dragon"),
    new MD.Upgrade(234, "Eye of the Hurricane", "Alchemist speed is doubled.", "Your alchemists have learned the way of the sea.",{water:n("10K"),dragonscale:n("2.5M")},function(){return MD.hasDragon("Torrential")},"dragon"),
    new MD.Upgrade(235, "World of Earth", "Earth essence is produced twice as quickly!.", "The earth shrine is... particularly earthy.",{earth:n("2.5K"),dragonscale:n("250K")},function(){return MD.hasDragon("Earth")},"dragon"),
    new MD.Upgrade(236, "One with Nature", "The machinist now has an option to try and produce a craftsman each second.", "Crafting craftsmen... craftception?",{earth:n("5K"),dragonscale:n("1M")},function(){return MD.hasDragon("Terrene")},"dragon"),
    new MD.Upgrade(237, "Center of the Quake", "Farms produce 8 times as much food.", "Little known fact - crops grow much better when shaken daily.",{earth:n("10K"),dragonscale:n("2.5M")},function(){return MD.hasDragon("Terrestrial")},"dragon"),
    new MD.Upgrade(238, "World of Lightning", "Lightning essence is produced twice as quickly!.", "The lightning shrine sparks furiously in the night.",{lightning:n("2.5K"),dragonscale:n("250K")},function(){return MD.hasDragon("Lightning")},"dragon"),
    new MD.Upgrade(239, "Electric Current", "Your gold per second is multiplied by 4.", "Let's get charged!",{lightning:n("5K"),dragonscale:n("1M")},function(){return MD.hasDragon("Electric")},"dragon"),
    new MD.Upgrade(240, "Thunder of Death", "Your mages do 8 times as much damage.", "Boom! Boom! Zap! Argggg!",{lightning:n("10K"),dragonscale:n("2.5M")},function(){return MD.hasDragon("Thundering")},"dragon"),
    new MD.Upgrade(241, "King of the Sky", "Rebel goblins give far more essence when killed.", "Why does this thing help us again?",{spirit:1,dragonscale:n("5M")},function(){return MD.hasDragon("Imperial")},"dragon"),
    new MD.Upgrade(242, "Overwhelming Might", "Bombing enemies is much cheaper and your military strength is doubled.", "Let it rain.",{spirit:10,dragonscale:n("25M")},function(){return MD.hasDragon("Majestic")},"dragon"),
    new MD.Upgrade(243, "The Ultimate Prize", "All resource gain is multiplied by 10.", "I'm quickly running out of superlatives.",{spirit:25,dragonscale:n("100M")},function(){return MD.hasDragon("Eternal")},"dragon"),

    //Overkill Dragon
    new MD.Upgrade(260, "Spirit Overcharge", "Spirit essence gain is doubled.", "Well this certainly cost enough.",{spirit:n("25K"),gold:n("1QQ")},function(){return MD.hasDragon("Eternal") && MD.MAX_DRAGON_LEVEL >= n("1Z")},"dragon"),
    new MD.Upgrade(261, "Ancestral Might", "Spirit essence gain is increased based on the highest dragon level achieved.", "We stand on the shoulders of giants.",{spirit:n("1M"),gold:n("100MQQ")},function(){return MD.hasDragon("Eternal") && MD.MAX_DRAGON_LEVEL >= n("1X")},"dragon"),

    //Next Upgrade - 264
];

MD.MageUpgrade = function(id,name,effect,cost,unlock_function){
    this.id = id;
    this.name = name;
    this.effect = effect;

    //Adjust to the price object format
    if(typeof(cost) == "number"){
        cost = {"mana":cost}; //Mage upgrades default to mana
    }
    this.cost = cost;

    this.unlock_function = unlock_function
};

MD.MAGE_UPGRADES = [
    new MD.MageUpgrade(0, "Enhanced Fireballs","Multiplies mage damage by " + MD.uv.level1mult + ".", 10, function(){return (true)}),
    new MD.MageUpgrade(1, "Lightning Torrent","Multiplies mage damage by " + MD.uv.level2mult + ".", 50, function(){return MD.hasMageUpgrade("Enhanced Fireballs")}),
    new MD.MageUpgrade(2, "Heaven's Fury","Multiplies mage damage by " + MD.uv.level3mult + ".", 150, function(){return MD.hasMageUpgrade("Lightning Torrent")}),
    new MD.MageUpgrade(9, "Insecticide","Multiplies mage damage by " + MD.uv.level4mult + ".",500, function(){return MD.hasMageUpgrade("Heaven's Fury") && MD.hasUpgrade("Embrace The Swarm")}),
    new MD.MageUpgrade(12, "Supercharged", "Multiplies mage damage by " + MD.uv.level5mult + ".",n("100K"),function(){return MD.hasMageUpgrade("Insecticide") && MD.TOTAL_MANA >= n("50K")}),
    new MD.MageUpgrade(17, "FIRE!", "Multiplies mage damage by " + MD.uv.level5mult + ".",n("10M"),function(){return MD.hasMageUpgrade("Supercharged")}),
    new MD.MageUpgrade(25, "Secrets of Old", "Multiplies mage damage by " + MD.uv.level6mult + ".",n("50P"),function(){return MD.MAGE_TOWER_RESEARCH >= 100}),
    new MD.MageUpgrade(29, "Ancient Wisdom", "Multiplies mage damage by " + MD.uv.level7mult + ".",n("500P"),function(){return MD.MAGE_TOWER_RESEARCH >= 2500 && MD.hasMageUpgrade("Secrets of Old")}),

    new MD.MageUpgrade(3, "Advanced Delving Techniques","Each delving mage has a " + MD.uv.gemFindPerMage1 + "% chance to find a gem each second.",25,function(){return (true)}),
    new MD.MageUpgrade(4, "Algorithmic Sparkle Isolation","Each deliving mage has a " + MD.uv.gemFindPerMage2 + "% chance to find a gem each second.", 50,function(){return MD.hasMageUpgrade("Advanced Delving Techniques")}),
    new MD.MageUpgrade(8, "Glowing Mind's Eye","Each deliving mage has a " + MD.uv.gemFindPerMage3 + "% chance to find a gem each second.", 150,function(){return MD.hasMageUpgrade("Algorithmic Sparkle Isolation")}),
    new MD.MageUpgrade(13, "Gems For Days!","Each delving mage has a " + MD.uv.gemFindPerMage4 + "% chance to find a gem each second.",n("100K"),function(){return MD.hasMageUpgrade("Glowing Mind's Eye") && MD.TOTAL_MANA >= n("50K")}),
    new MD.MageUpgrade(18, "EARTH!","Each delving mage has a " + MD.uv.gemFindPerMage5 + "% chance to find a gem each second.",n("10M"),function(){return MD.hasMageUpgrade("Gems For Days!")}),
    new MD.MageUpgrade(26, "Crystal Underground","Mages find " + MD.uv.gemMult1 + " gems where they once found just one.",n("100P"),function(){return MD.MAGE_TOWER_RESEARCH >= 250}),
    new MD.MageUpgrade(30, "Penticity","Mages find " + MD.uv.gemMult2 + " gems where they once found just one.",n("600P"),function(){return MD.MAGE_TOWER_RESEARCH >= 5000 && MD.hasMageUpgrade("Crystal Underground")}),

    new MD.MageUpgrade(10, "Delving Mastery","Delving mages find " + MD.uv.level1mult + " times more gold.",200,function(){return MD.TOTAL_GEMS > 100}),
    new MD.MageUpgrade(11, "Power Overwhelming","Delving mages find " + MD.uv.level2mult + " times more gold.",500,function(){return MD.TOTAL_GEMS > 1000}),
    new MD.MageUpgrade(14, "Midas Reborn","Delving mages find " + MD.uv.level3mult + " times more gold.",n("100K"),function(){return MD.hasMageUpgrade("Power Overwhelming") && MD.TOTAL_MANA >= n("50K")}),
    new MD.MageUpgrade(20, "WATER!","Delving mages find " + MD.uv.level4mult + " times more gold.",n("10M"),function(){return MD.hasMageUpgrade("Midas Reborn")}),
    new MD.MageUpgrade(27, "Delving Perfection","Delving mages find " + MD.uv.level5mult + " times more gold.",n("150P"),function(){return MD.MAGE_TOWER_RESEARCH >= 500}),
    new MD.MageUpgrade(31, "Delving Transcendence","Delving mages find " + MD.uv.level6mult + " times more gold.",n("700P"),function(){return MD.MAGE_TOWER_RESEARCH >= 10000 && MD.hasMageUpgrade("Delving Perfection")}),

    new MD.MageUpgrade(21, "Gettin' Lucky","Delving mages find more valuable gems.",n("4P"),function(){return MD.hasMageUpgrade("EARTH!") && MD.ALCHEMISTS >= 10}),
    new MD.MageUpgrade(22, "Lookin' Hard","Delving mages find even more valuable gems.",n("10P"),function(){return MD.hasMageUpgrade("Gettin' Lucky") && MD.ALCHEMISTS >= 25}),
    new MD.MageUpgrade(23, "Bein' Awesome","Delving mages find really valuable gems.",n("25P"),function(){return MD.hasMageUpgrade("Lookin' Hard") && MD.ALCHEMISTS >= 50}),
    new MD.MageUpgrade(24, "Old Pros","Delving mages find really, really valuable gems.",n("200P"),function(){return MD.hasMageUpgrade("Bein' Awesome") && MD.ALCHEMISTS >= 100}),

    new MD.MageUpgrade(5, "Magical Optimization","Each meditating mage is " + MD.uv.meditatelevel1 + " times more efficient.",25, function(){return (true)}),
    new MD.MageUpgrade(6, "Spell of Focus","Each meditating mage is " + MD.uv.meditatelevel2 + " times more efficient.",50,function(){return MD.hasMageUpgrade("Magical Optimization")}),
    new MD.MageUpgrade(15, "Current of Nature","Each meditating mage is " + MD.uv.meditatelevel3 + " times more efficient.",n("100K"),function(){return MD.hasMageUpgrade("Spell of Focus") && MD.TOTAL_MANA >= n("50K")}),
    new MD.MageUpgrade(16, "WIND!","Each meditating mage is " + MD.uv.meditatelevel4 + " times more efficient.",n("10M"),function(){return MD.hasMageUpgrade("Current of Nature")}),
    new MD.MageUpgrade(28, "Neurofeedback","Meditating mages gain " + MD.uv.neuropercent1 + "% of the mana rate of a Neurochrysalis.",n("200P"),function(){return MD.MAGE_TOWER_RESEARCH >= 1000}),
    new MD.MageUpgrade(32, "Neurobacklash","Meditating mages gain " + MD.uv.neuropercent2 + "% of the mana rate of a Neurochrysalis.",n("800P"),function(){return MD.MAGE_TOWER_RESEARCH >= 15000 && MD.hasMageUpgrade("Neurofeedback")}),

    new MD.MageUpgrade(7, "Elemental Pickaxe","Your pickaxe efficiency and damage is multiplied by " + MD.uv.elementalpick + ".",1000,function(){return MD.hasMageUpgrade("Heaven's Fury") && MD.hasMageUpgrade("Glowing Mind's Eye") && MD.hasMageUpgrade("Spell of Focus") && MD.MAGES >= 40}),
    new MD.MageUpgrade(19, "HEART!","By your powers combined, Captain Planet will double your pick efficiency for every " +MD.uv.numPerDouble+" mages (up to " + 20*MD.uv.numPerDouble +").",n("25M"),function(){return MD.hasMageUpgrade("FIRE!") && MD.hasMageUpgrade("WIND!") && MD.hasMageUpgrade("WATER!") &&MD.hasMageUpgrade("EARTH!")}),
    new MD.MageUpgrade(33, "Crystallizing Influence","Your mages have learned to influence the laws of alchemy, allowing ants to be converted into great gems in place of normal.",n("10E"),function(){return MD.MAGE_TOWER_RESEARCH >= 30000}),
    
    new MD.MageUpgrade(34, "Ruby Affinity","Each delving mage is twice as likely to find gems each second.",n("1X"),function(){return MD.hasDragon("Inferno")}),
    new MD.MageUpgrade(35, "Sapphire Affinity","Each delving mage is twice as likely to find gems each second.",n("1X"),function(){return MD.hasDragon("Torrential")}),
    new MD.MageUpgrade(36, "Emerald Affinity","Each delving mage is twice as likely to find gems each second.",n("1X"),function(){return MD.hasDragon("Terrestrial")}),
    new MD.MageUpgrade(37, "Topaz Affinity","Each delving mage is twice as likely to find gems each second.",n("1X"),function(){return MD.hasDragon("Thundering")}),
    new MD.MageUpgrade(38, "Diamond Affinity","Mages now find more gems for each sacrificed goblin.",n("10X"),function(){return MD.hasMageUpgrade("Ruby Affinity") && MD.hasMageUpgrade("Sapphire Affinity") && MD.hasMageUpgrade("Emerald Affinity") && MD.hasMageUpgrade("Topaz Affinity")}),

    //Next 39
];

//Used to store pieces of advice given to the user by the oracle, with test saying if the wisdom is needed or not
MD.OracleTeaching = function(name,text,complete_function){
    this.name = name;
    this.text = text;
    this.complete_function = complete_function;
}

//Note the order is important - these must be carried out in sequence
MD.ORACLE_TEACHINGS = [
    new MD.OracleTeaching("Wisdom of the Magi","It is rumored that mages of great power can be hired... but you lack gold.",function(){return MD.MAGES >= 1}),
    new MD.OracleTeaching("True Potential","Mages are capable of so much more than fighting - but they cannot work alone, consider hiring more.",function(){return MD.MAGES >= 5}),
    new MD.OracleTeaching("Pick Enhancement","You notice your pickaxe has strange slots - perhaps finding more gems will help you learn what they are for.",function(){return MD.craftingAvailable()}),
    new MD.OracleTeaching("Bigger and Better","Greater beasts exist in this world than those you've seen. More gold is the key.",function(){return MD.TOTAL_GOLD > n("300G")}),
    new MD.OracleTeaching("Financing Insects", "Rumor holds that great insects roam distant lands, followed by swarms of ants. Perhaps they would appear if you had more gold.",function(){return MD.TOTAL_GOLD > n("50T")}),
    new MD.OracleTeaching("Infestation","Rumor holds that great insects roam distant lands, followed by swarms of ants. Perhaps hiring more ants would attract some.",function(){return MD.HIRELINGS_OWNED[0] >= 80}),
    new MD.OracleTeaching("Arachnophobia","The goblins seem to be recruiting reinforcements. Perhaps they'll see you as a worthy target once you acquire more ants.",function(){return MD.HIRELINGS_OWNED[0] >= n("3M")}),
    new MD.OracleTeaching("Goblin Overkill","The goblins seem to be recruiting reinforcements. Perhaps they'll see you as a worthy target once you kill more goblins.",function(){return MD.hasUpgrade("Goblin's Bane")}),
    new MD.OracleTeaching("Why?","How do you not have more mages? What are you doing? Buy some!",function(){return MD.MAGES >= 10}),
    new MD.OracleTeaching("Inner Darkness","The mages appear to be growing... darker with each passing moment. Every second they spend fully charged brings them closer to their goal.",function(){return MD.MAGE_MAX_TIME >= 1800}),
    new MD.OracleTeaching("Arcane Magic","All living things can learn to create mana, but only if they're imbued with enough power. Keep going.",function(){return MD.getManaMultiplier() >= n("4M")}),
    new MD.OracleTeaching("From the Depths","It is said that with enough mana, mages can summon powerful creatures to do their bidding.",function(){return MD.MANA >= n("1G")}),
    new MD.OracleTeaching("Physics is Overrated","Mages aren't the only magic users around. Perhaps if you imbue your servants with more power something else will show up.",function(){return MD.getAlchemistPotential() > 0}),
    new MD.OracleTeaching("The Ants Go Marching","You need a few alchemists before they really figure out what's what.",function(){return MD.ALCHEMISTS >= 5}),
    new MD.OracleTeaching("Sandshrew Swarm","Word on the street is that Sandshrews fetch a high price. If you get 1000, maybe you'll attract a buyer.",function(){return MD.hasUpgrade("Team Rocket Buyer")}),
    new MD.OracleTeaching("Hive Expansion","I feel like your 200th Hive Queen will be a real breakthrough.",function(){return MD.HIRELINGS_OWNED[10] >= 200}),
    new MD.OracleTeaching("Strange Compulsion","I have a strange feeling that you'd benefit from far more Bagger 288s.",function(){return MD.HIRELINGS_OWNED[7] >= 6750}),
    new MD.OracleTeaching("Breaking Ground","All champions of industry have to start somewhere. Lay some dirt and see what you can build.",function(){return MD.CONSTRUCT_LOCATIONS.indexOf(0) != -1}),
    new MD.OracleTeaching("Rock Out","The age of the bagger has ended. Turn your attention to golems of rock, and you shall be rewarded... with rock.",function(){return MD.HIRELINGS_OWNED[6] >= n("12.34K")}),
    new MD.OracleTeaching("Wyvern Mount","Great quantities of stone and gold are required to build the next structure.",function(){return MD.TOTAL_GOLD > n("1W") && MD.TOTAL_STONE > n("100M")}),
    new MD.OracleTeaching("Wyvern Mount","Wyverns must fill the sky before one can hope to build them a home.",function(){return MD.HIRELINGS_OWNED[11] >= 200}),
    new MD.OracleTeaching("Tower of the Magi","Your mages wish for a place to call home - but they lack mana.",function(){return MD.TOTAL_MANA > n("1E")}),
    new MD.OracleTeaching("Tower of Stones","Your mages wish for a place to call home - but they lack stone.",function(){return MD.TOTAL_STONE > n("250M")}),
    new MD.OracleTeaching("Full House","Your mages wish for a place to call home - but you need more of them first.",function(){return MD.MAGES >= 280}),
    new MD.OracleTeaching("Kingdom","You wish to build monuments to show the lands your strength... perhaps you need more iron to build them with?.",function(){return MD.TOTAL_IRON > 1000}),
    new MD.OracleTeaching("Steel","You have a feeling that perhaps iron and coal are not the best you can forge, but your mages haven't yet discovered how.",function(){return MD.MAGE_TOWER_RESEARCH >= 15000}),
    new MD.OracleTeaching("More Statues","Your mages have learned much - but you need more statues to implement your findings.",function(){return MD.CONSTRUCT_LEVELS[4] >= 5}),
    new MD.OracleTeaching("Steel For Civilization","You are on the edge of a great civilization, and it will be founded on steel.",function(){return MD.TOTAL_STEEL >= n("2.5K")}),
    new MD.OracleTeaching("Where's the People?","Your kingdom is kind of quiet, given that every living soul is working in the mine.",function(){return MD.POPULATION > 0}),
    new MD.OracleTeaching("To War!","Throughout history, great empires have had one thing in common. Going into other lands and messing people up. Perhaps with a bigger population they would find the courage to fight?",function(){return MD.getPopulationMax() >= 50}),
    new MD.OracleTeaching("Technology","All great armies need weapons, and when your enemies grow too powerful, other strategies might come in handy. Win a few more campaigns and see what you learn.",function(){return MD.CAMPAIGNS_WON >= 5 }),
    new MD.OracleTeaching("Education","A great society needs more than just killing, but learning as well. Perhaps a rare reward from campaigns will get you started.",function(){return MD.TOTAL_ADAMANTIUM > 0}),
    new MD.OracleTeaching("Reverse","You should probably hire a lot more goblins.",function(){return MD.HIRELINGS_OWNED[4] >= n("20M") || MD.hasUpgrade("Have Not")}),
    new MD.OracleTeaching("Reverse 2","Almost there - a few more goblins.",function(){return MD.HIRELINGS_OWNED[4] >= n("25M") || MD.hasUpgrade("Have Not")}),
    new MD.OracleTeaching("Reverse 3","You have enough goblins... you're just not killing them fast enough. Why not level up your smelting pit a bit more?.",function(){return MD.CONSTRUCT_LEVELS[5] >= 20 || MD.hasUpgrade("Have Not")}),
    new MD.OracleTeaching("Adamantium Overload","Your adamantium supplies are a little low. I bet if you had a whole bunch of wyverns, they could find some more.",function(){return MD.hasUpgrade("Adamantium Affinity")}),
    new MD.OracleTeaching("Farm 1","Some days you wake up and just think... I need more land. You can farm it once you've won it.",function(){return MD.CAMPAIGNS_WON >= 100}),
    new MD.OracleTeaching("Farm 2","More land! More!! To grow food for you armies.",function(){return MD.CAMPAIGNS_WON >= 500}),
    new MD.OracleTeaching("Hunting Time","I hear there are some new farmlands around. Maybe you can grow something interesting on them...",function(){return MD.TOTAL_FLAX > 0}),
    new MD.OracleTeaching("Dragons","You've acquired a sudden interest in dragons. If you had more mages, they could teach you about them.",function(){return MD.MAGES >= 400}),
    new MD.OracleTeaching("Dragons 2","Your mages have suggested that you could share in the power of dragons... but until you win more battles, they won't respect you.",function(){return MD.CAMPAIGNS_WON >= 500}),
    new MD.OracleTeaching("Fire Shrine","You've begun to understand to strength of dragons of flame - build their shrine!",function(){return MD.hasConstruct("Fire Shrine")}),
    new MD.OracleTeaching("Dragons 3","You have learned to acquire the power of flame. But that isn't all - you need more alchemists.",function(){return MD.ALCHEMISTS >= 150}),
    new MD.OracleTeaching("Dragons 4","Your mages have suggested that you could learn more of the dragon's power... but until you win more battles, they won't respect you.",function(){return MD.CAMPAIGNS_WON >= 1000}),
    new MD.OracleTeaching("Water Shrine","You've begun to understand to strength of dragons of the sea - build their shrine!",function(){return MD.hasConstruct("Water Shrine")}),
    new MD.OracleTeaching("Machinist","Some of your brightest minds think you could actually build mages... they need some water essence for their experiments.",function(){return MD.TOTAL_WATER_ESSENCE >= 5}),
    new MD.OracleTeaching("Dragons 5","The earthen dragons have much to offer... but you need to do more manual mining. There are also rumors that if you get enough woodpeckers, they'll click for you...",function(){return MD.totalClicks() >= n("25K")}),
    new MD.OracleTeaching("Dragons 6","Your mages have suggested that you could learn more of the dragon's power... but until you win more battles, they won't respect you.",function(){return MD.CAMPAIGNS_WON >= 2000}),
    new MD.OracleTeaching("Earth Shrine","You've begun to understand to strength of dragons of earth - build their shrine!",function(){return MD.hasConstruct("Earth Shrine")}),
    new MD.OracleTeaching("Graveyard","You think you might be able to automate attacking in some way... but you need to lose more men to learn more.",function(){return MD.SOLDIERS_LOST >= 10000}),
    new MD.OracleTeaching("Dragons 7","The most powerful dragons of the sky have taken interest in you... but you are lacking gold.",function(){return MD.TOTAL_GOLD >= n("1R")}),
    new MD.OracleTeaching("Dragons 8","Your mages have suggested that you could learn more of the dragon's power... but until you win more battles, they won't respect you.",function(){return MD.CAMPAIGNS_WON >= 3000}),
    new MD.OracleTeaching("Lightning Shrine","You've begun to understand to strength of dragons of lightning - build their shrine!",function(){return MD.hasConstruct("Lightning Shrine")}),
    new MD.OracleTeaching("Egg","You have finally learned enough to actually raise a dragon. Why not build a nest?",function(){return MD.hasConstruct("Dragon Nest")}),
    new MD.OracleTeaching("Baby","Food makes a dragon grow... but it needs a strong earth shrine to learn to walk.",function(){return MD.CONSTRUCT_LEVELS[19] >= 25}),
    new MD.OracleTeaching("Child","Food makes a dragon grow... but it needs a strong fire shrine to learn to breathe.",function(){return MD.CONSTRUCT_LEVELS[15] >= 25}),
    new MD.OracleTeaching("Youngling","Food makes a dragon grow... but it needs a strong lightning shrine to learn to soar.",function(){return MD.CONSTRUCT_LEVELS[21] >= 25}),
    new MD.OracleTeaching("Novice","Food makes a dragon grow... but it needs many brothers to learn to hunt.",function(){return MD.HIRELINGS_OWNED[11] >= n("100M")}),
    new MD.OracleTeaching("Master","Food makes a dragon grow... but it needs a great deal of essence to understand itself.",function(){return MD.totalEssence() >= n("25K")}),
    new MD.OracleTeaching("Hireling Upgrades","Rumor speaks of great rewards for having one trillion of a hireling. Perhaps it's time to investigate.",function(){return MD.hirelingsGreater(n("1T"))}),
    new MD.OracleTeaching("Split","Your dragon has chosen a path... but it needs a strong shrine to achieve its potential.",function(){return MD.CONSTRUCT_LEVELS[15] >= 100 || MD.CONSTRUCT_LEVELS[17] >= 100 || MD.CONSTRUCT_LEVELS[19] >= 100 || MD.CONSTRUCT_LEVELS[21] >= 100}),
    new MD.OracleTeaching("Imperial","Your dragon is mighty beyond belief... but it seeks the spirit of masters of all the elements.",function(){return MD.totalHirelings() >= n("20T") && MD.TOTAL_SPIRIT_ESSENCE >= 10 && MD.hasUpgrade("Volcanic Fury") && MD.hasUpgrade("Eye of the Hurricane") && MD.hasUpgrade("Center of the Quake") && MD.hasUpgrade("Thunder of Death")}),
    new MD.OracleTeaching("Majestic","Your dragon is mighty beyond belief... but it seeks a great population, military triumph, and great spirit.",function(){return MD.getPopulationMax() >= n("25K") && MD.CAMPAIGNS_WON >= n("10K") && MD.TOTAL_SPIRIT_ESSENCE >= 100}),
    new MD.OracleTeaching("Eternal","Your dragon is mighty beyond belief... but it seeks great essence and powerful buildings.",function(){return MD.totalEssence() >= n("1G") && MD.TOTAL_SPIRIT_ESSENCE >= n("1K") && MD.totalConstructLevel() >= 2500}),
];

//Structures can't have all their properties expressed here, since they are inherantly quite customizable
MD.Structure = function(id,name,desc,cost,multiple_allowed,unlock_function){
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.cost = cost;
    this.multiple_allowed = multiple_allowed;
    this.unlock_function = unlock_function;
};

MD.STRUCTURES = [
    new MD.Structure(0,"Alchemist's Lair","Provides a home for powerful alchemists seeking to further their trade.",{majestic:2,mana:n("100G"),gold:n("10Y")}, false, function(){return MD.getAlchemistPotential() > 0})
];

//Constructs (these are like structures but they are placed in the industry section)
MD.Construct = function(id,name,desc,cost,upgrade_cost,unlock_function,image_path){
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.cost = cost;
    this.upgrade_cost = upgrade_cost;
    this.unlock_function = unlock_function;
    this.image = image_path; //Array of image paths for the construct
};

MD.CONSTRUCTS = [
    new MD.Construct(0,"Auto-Smithy","Allows you to automatically craft gems to a particular level.",{majestic:1000,gold:n("10X")},{stone:n("100M"),coal:0.25},function(){return MD.hasUpgrade("Precious Resources")},["/static/resources/minedefense/autosmith.png"]),
    new MD.Construct(1,"Quarry","Allows you to mine various subterranean substances in addition to gold.",{majestic:2000,gold:n("50X")},{dirt:n("250M")},function(){return MD.hasUpgrade("The Wheel Turns")},["/static/resources/minedefense/quarry.png"]),
    new MD.Construct(2,"Wyvern-Mount","Provides a comforting mountain of gold for your wyverns to rest and grow stronger.",{majestic:2500,gold:n("1W"),stone:n("250M")},{stone:n("100M"),gold:n("1W")},function(){return MD.TOTAL_GOLD > n("1W") && MD.TOTAL_STONE > n("100M") && MD.HIRELINGS_OWNED[11] >= 200},["/static/resources/minedefense/dragonmount0.png","/static/resources/minedefense/dragonmount1.png","/static/resources/minedefense/dragonmount2.png","/static/resources/minedefense/dragonmount3.png"]),
    new MD.Construct(3,"Mage Tower","A great tower where Mages from across the world can hone their art.",{gold:n("1W"),stone:n("500M")},{},function(){return MD.TOTAL_MANA > n("1E") && MD.TOTAL_STONE > n("250M") && MD.MAGES >= 280},["/static/resources/minedefense/magetower.png"]),
    new MD.Construct(4,"Regal Statue","A majestic statue to place throughout the land and remind them of your power.",{gold:n("2.5W"),iron:n("100K")},{iron:n("75K"),miner:50},function(){return MD.TOTAL_IRON >= 1000},["/static/resources/minedefense/regalstatue.png"]),
    new MD.Construct(5,"Smelting Pit","A dark place where nightmarish goblins toil day and night over vats of hot metal.",{stone:n("1G"),goblin:n("50K")},{stone:n("1G"),goblin:n("50K")},function(){return MD.hasUpgrade("Secret of Barad-dur")},["/static/resources/minedefense/smeltingpit.png"]),
    new MD.Construct(6,"Exchange Market","A bustling market filled with exotic food and rare minerals.",{steel:n("1K"),gold:n("50W")},{},function(){return MD.TOTAL_STEEL > 0},["/static/resources/minedefense/exchangehouse.png"]),
    new MD.Construct(7,"Habitation","A few crude huts sitting in a field. For now.",{steel:n("5K"),gold:n("100W")},{steel:n("1K")},function(){return MD.TOTAL_STEEL >= n("2.5K")},["/static/resources/minedefense/habitation0.png","/static/resources/minedefense/habitation1.png","/static/resources/minedefense/habitation2.png","/static/resources/minedefense/habitation3.png"]),
    new MD.Construct(8,"Farm","A lush field of... something.",{steel:n("2K"),gold:n("10W")},{steel:10,stone:n("1K"),coal:100},function(){return MD.TOTAL_STEEL >= n("2.5K")},["/static/resources/minedefense/farm0.png","/static/resources/minedefense/farm1.png","/static/resources/minedefense/farm2.png"]),
    new MD.Construct(9,"Barracks","Time for war.",{steel:n("5K"),food:n("25K")},{steel:n("5K"),food:n("1K"),gold:n("1V")},function(){return MD.getPopulationMax() >= 50},["/static/resources/minedefense/barracks.png"]),
    new MD.Construct(10,"University","Build the World.",{steel:n("25K"),adamantium:1},{},function(){return MD.TOTAL_ADAMANTIUM > 0},["/static/resources/minedefense/university.png"]),
    new MD.Construct(11,"Blacksmith","Fight!",{steel:n("250K"),adamantium:3},{adamantium:0.3,steel:n("25K")},function(){return MD.CAMPAIGNS_WON >= 5},["/static/resources/minedefense/blacksmith.png"]),
    new MD.Construct(12,"Expanded Farm","A lush field of... something.",{steel:n("1M"),adamantium:10},{steel:10,stone:n("1K"),coal:100},function(){return MD.CAMPAIGNS_WON >= 100},["/static/resources/minedefense/farm0.png","/static/resources/minedefense/farm1.png","/static/resources/minedefense/farm2.png"]),
    new MD.Construct(13,"Vast Farm","A lush field of... something.",{steel:n("5M"),adamantium:25},{steel:10,stone:n("1K"),coal:100},function(){return MD.CAMPAIGNS_WON >= 500},["/static/resources/minedefense/farm0.png","/static/resources/minedefense/farm1.png","/static/resources/minedefense/farm2.png"]),
    new MD.Construct(14,"Fletcher","Allows you to train dragonhunters.",{flax:100},{flax:1000},function(){return MD.TOTAL_FLAX > 0 && MD.hasUpgrade("Adamantium Affinity")},["/static/resources/minedefense/fletcher.png"]),
    new MD.Construct(15,"Fire Shrine","Allows you to receive the gifts of fire.",{dragonscale:1000,adamantium:n("25K"),gold:n("1V")},{dragonscale:50,gold:n("10V")},function(){return MD.CAMPAIGNS_WON >= 500 && MD.MAGES >= 400},["/static/resources/minedefense/fireshrine.png"]),
    new MD.Construct(16,"Administration Building","For every resource in your kingdom, provides a sense of whether it is increasing or decreasing.",{gold:n("100W"),stone:n("10G")},{},function(){return MD.hasUpgrade("Obsessive Recordkeeping")},["/static/resources/minedefense/administration.png"]),
    new MD.Construct(17,"Water Shrine","Allows you to receive the gifts of water.",{dragonscale:2500,adamantium:n("50K"),gold:n("50V"),fire:100},{dragonscale:125,gold:n("500V")},function(){return MD.CAMPAIGNS_WON >= 1000 && MD.ALCHEMISTS >= 150 && MD.TOTAL_FIRE_ESSENCE > 0},["/static/resources/minedefense/watershrine.png"]),
    new MD.Construct(18,"Machinist","Allows you to construct various things from rare resources.",{dragonscale:5000,fire:10,water:10},{},function(){return MD.hasConstruct("Water Shrine") && MD.TOTAL_WATER_ESSENCE >= 5},["/static/resources/minedefense/machinist.png"]),
    new MD.Construct(19,"Earth Shrine","Allows you to receive the gifts of earth.",{dragonscale:5000,adamantium:n("100K"),gold:n("1U"),water:100},{dragonscale:250,gold:n("10U")},function(){return MD.CAMPAIGNS_WON >= 2000 && MD.totalClicks() >= n("25K") && MD.TOTAL_WATER_ESSENCE > 0},["/static/resources/minedefense/earthshrine.png"]),
    new MD.Construct(20,"Graveyard","A resting place for those who fall in your campaigns.",{population:100,adamantium:500,stone:n("10G")},{},function(){return MD.CAMPAIGNS_WON >= 100 && MD.SOLDIERS_LOST >= n("5K")},["/static/resources/minedefense/graveyard.png"]),
    new MD.Construct(21,"Lightning Shrine","Allows you to receive the gifts of lightning.",{dragonscale:n("10K"),adamantium:n("250K"),gold:n("10U"),earth:100},{dragonscale:500,gold:n("100U")},function(){return MD.CAMPAIGNS_WON >= 3000 && MD.TOTAL_GOLD >= n("1R") && MD.TOTAL_EARTH_ESSENCE > 0},["/static/resources/minedefense/lightningshrine.png"]),
    new MD.Construct(22,"Dragon Nest","Allows you to spawn a dragon.",{dragonscale:n("100K"),earth:100,fire:100,water:100,lightning:100},{},function(){return MD.TOTAL_LIGHTNING_ESSENCE > 0},["/static/resources/minedefense/dragonnest.png"]),
    new MD.Construct(23,"Dimensional Rift","Allows you to sacrifice a dragon.",{dragonscale:n("1M"),earth:100,fire:100,water:100,lightning:100},{},function(){return MD.hasDragon("Novice")},["/static/resources/minedefense/dimensionalrift.png"]),
    new MD.Construct(24,"Arcaneum","Allows you to use spirit essence to boost resource gain.",{earth:100,fire:100,water:100,lightning:100},{gold:n("1KQQ")},function(){return MD.TOTAL_SPIRIT_ESSENCE > 0},["/static/resources/minedefense/arcaneum.png"]),
];

//These are conversions that can be carried out by alchemists
MD.AlchRecipe = function(base_res,final_res,cost,yield_amt,amount,unlock_condition){
    this.base_res = base_res; //base_res and final_res both must be in MD.RESOURCES
    this.final_res = final_res;
    this.cost = cost; //How much you spend
    this.yield_amt = yield_amt; //How much you get
    this.amount = amount; //How many can be converted by 1 alchemists at 100%
    this.unlock_condition = unlock_condition;
};

MD.ALCH_RECIPES = [
    new MD.AlchRecipe("gold","mana",n("1M"),1,n("25M"),function(){return true}),
    new MD.AlchRecipe("large ant","normal",n("30K"),1,1,function(){return MD.ALCHEMISTS >= 5}),
    new MD.AlchRecipe("normal","woodpecker",100,1,2,function(){return MD.hasUpgrade("Jeweled Beak")}),
    new MD.AlchRecipe("normal","bloodhound",400,1,2,function(){return MD.hasUpgrade("Jeweled Eyes")}),
    new MD.AlchRecipe("great","sandshrew",80,1,2,function(){return MD.hasUpgrade("Bedazzled Pokeballs")}),
    new MD.AlchRecipe("great","goblin",200,1,2,function(){return MD.hasUpgrade("Gleaming Eyes")}),
    new MD.AlchRecipe("flawless","miner",125,1,2,function(){return MD.hasUpgrade("Crystal Axes")}),
    new MD.AlchRecipe("flawless","rock golem",100,1,2,function(){return MD.hasUpgrade("Crystalline Hands")}),
    new MD.AlchRecipe("flawless","bagger 288",75,1,2,function(){return MD.hasUpgrade("Diamond-Studded Treads")}),
    new MD.AlchRecipe("perfect","titan of earth",20,1,2,function(){return MD.hasUpgrade("Diamond Hearts")}),
    new MD.AlchRecipe("majestic","world eater",7,1,2,function(){return MD.hasUpgrade("Crystal Shard Eyes")}),
    new MD.AlchRecipe("majestic","hive queen",27,1,2,function(){return MD.hasUpgrade("Diamond-Spiked Eggs")}),
    new MD.AlchRecipe("majestic","wyvern",104,1,2,function(){return MD.hasUpgrade("Rhenium Heart")}),
    new MD.AlchRecipe("dirt","mana",n("10M"),n("1P"),1,function(){return MD.TOTAL_DIRT >= n("500M")}),
    new MD.AlchRecipe("majestic","neurochrysalis",10033,1,2,function(){return MD.hasUpgrade("Neurological Enlightenment")}),
    new MD.AlchRecipe("water","dragonscale",0.5,1,1,function(){return MD.hasConstruct("Water Shrine")}),
    new MD.AlchRecipe("sandshrew","gold",0.1,n("0.8Y"),1,function(){return MD.hasUpgrade("Team Rocket Buyer")}),
    new MD.AlchRecipe("majestic","dragon hunter",430077,1,2,function(){return MD.hasUpgrade("Human Fusion")}),
];

//Conversions to be done at the markets - note that these unlock if both resources are present, no further conditions
MD.ExchangeRate = function(base_res,base_amt,final_res,final_amt,unlock_condition){
    this.base_res = base_res;
    this.base_amt = base_amt;
    this.final_res = final_res;
    this.final_amt = final_amt;
    this.unlock_condition = unlock_condition;
};

MD.EXCHANGE_RATES = [
    new MD.ExchangeRate("great",360,"majestic",1,function(){return true}),
    new MD.ExchangeRate("dirt",3,"stone",4,function(){return MD.TOTAL_DIRT > 0 && MD.TOTAL_STONE > 0}),
    new MD.ExchangeRate("stone",1000,"iron",1,function(){return MD.TOTAL_STONE > 0 && MD.TOTAL_IRON > 0}),
    new MD.ExchangeRate("iron",100,"coal",5,function(){return MD.TOTAL_COAL > 0 && MD.TOTAL_IRON > 0}),
    new MD.ExchangeRate("iron",250,"steel",1,function(){return MD.TOTAL_IRON > 0 && MD.TOTAL_STEEL > 0}),
    new MD.ExchangeRate("steel",1,"food",15,function(){return MD.TOTAL_STEEL > 0 && MD.TOTAL_FOOD > 0}),
    new MD.ExchangeRate("flax",50,"adamantium",1,function(){return MD.TOTAL_ADAMANTIUM > 0 && MD.TOTAL_FLAX > 0}),
    new MD.ExchangeRate("adamantium",100,"flax",1,function(){return MD.TOTAL_ADAMANTIUM > 0 && MD.TOTAL_FLAX > 0})
];

MD.Dragon = function(id,name,power,description,progressions,price,base_essence,unlock_condition){
    this.id = id;
    this.name = name;
    this.power = power; //Active effect for having the dragon
    this.description = description;
    this.progressions = progressions; //A list of what it can progress to
    this.price = price; //Price per spirit essence (i.e. 200 adamantium means the base_essence value increases by 1 for every 200 adamantium fed)
    this.base_essence = base_essence; //How much spirit essence they are worth (and also how much you need to progress to this level)
    this.unlock_condition = unlock_condition;
};

MD.DRAGONS = [
    new MD.Dragon(0,"Egg","This dragon doesn't do a whole lot... but you do seem to find more stone.","A large egg sits in a nest of dirt and straw. Perhaps it will hatch if you feed it.",[1],{food:n("1M")},0,function(){return MD.hasConstruct("Dragon Nest")}),
    new MD.Dragon(1,"Hatchling","Food production is slightly increased with this guy around.","A small green dragon has hatched from the egg. It doesn't seem to be good for much, but boy can it eat!",[2],{food:n("1M"),dragonscale:10},1000,function(){return true}), //It is implied that you need Egg as it's a child
    new MD.Dragon(2,"Baby","Damage taken to your wall is reduced with the baby around.","Aww... it's like a sweet little baby lizard... with razor sharp claws and a rock solid carapace.",[3],{food:n("1M"),earth:0.01},n("10K"),function(){return MD.CONSTRUCT_LEVELS[19] >= 25}),
    new MD.Dragon(3,"Child","Regal statue rewards are increased due to dragon scouting.","Your dragon is beginning to stretch its wings. It's now almost as large as the wyverns.",[4],{food:n("1M"),fire:0.001},n("100K"),function(){return MD.CONSTRUCT_LEVELS[15] >= 25}),
    new MD.Dragon(4,"Youngling","The reward for killing goblins is much better with this dragon around.","Ah, the teenage years. Your dragon is a tad rebellious... and who are you to argue with a 20,000 pound dragon?.",[5],{food:n("1M"),lightning:0.0001},n("1M"),function(){return MD.CONSTRUCT_LEVELS[21] >= 25}),
    new MD.Dragon(5,"Novice","Your soldiers fight much better with the novice dragon at their head.","No longer a child, your dragon fights with precision and strength, with claw and flame.",[6],{population:0.01,adamantium:5},n("10M"),function(){return MD.HIRELINGS_OWNED[11] >= n("100M")}),
    new MD.Dragon(6,"Master","Your soldiers fight with great vigor with this mighty beast soaring overhead.","You have learned that a dragon has its own choices to make in life. Choose wisely how you nurture it, for its future is at stake.",[7,10,13,16],{},n("100M"),function(){return MD.totalEssence() >= n("25K")}), //Special resource cost, price will be set to 0.001 of some essence
    new MD.Dragon(7,"Fire","Fire essence gain is increased with this dragon around.","Your dragon begins to take on a distinct red hue, and his flames melts steel instantly.",[8],{mana:n("1G"),fire:0.00005},n("1G"),function(){return MD.MAGES >= 500 && MD.CONSTRUCT_LEVELS[15] >= 50}),
    new MD.Dragon(8,"Blazing","Fire essence gain is greatly increased with this dragon around","Flames ripple up and down the great red dragon, many hirelings have died simply from being nearby.",[9],{mana:n("10G"),fire:0.00001},n("10G"),function(){return MD.MAGES >= 600 && MD.CONSTRUCT_LEVELS[15] >= 75}),
    new MD.Dragon(9,"Inferno","Fire essence gain is supercharged with this dragon around","A nightmarish beast of flames, almost too bright to look upon, your dragon has reached a mastery of flame never before seen.",[19],{mana:n("100G"),fire:0.0000025},n("100G"),function(){return MD.MAGES >= 700 && MD.CONSTRUCT_LEVELS[15] >= 100}),
    new MD.Dragon(10,"Water","Water essence gain is increased with this dragon around.","Your dragon has taken poorly to the transition, cuts appear in its skin, and the flames it spits are damp and weak.",[11],{"hive queen":1,water:0.00005},n("1G"),function(){return MD.ALCHEMISTS >= 200 && MD.CONSTRUCT_LEVELS[17] >= 50}),
    new MD.Dragon(11,"Aquatic","Water essence gain is greatly increased with this dragon around","The cuts have revealed themselves as a functioning set of gills - your dragon sweeps freely through the seas, and breathes boiling hot steam when angered.",[12],{wyvern:1,water:0.00001},n("10G"),function(){return MD.ALCHEMISTS >= 250 && MD.CONSTRUCT_LEVELS[17] >= 75}),
    new MD.Dragon(12,"Torrential","Water essence gain is supercharged with this dragon around","A true master of the storm, your dragon's wings creates small typhoons and its enemies fall as crumpled husks as the water is drained from them.",[19],{neurochrysalis:0.1,water:0.0000025},n("100G"),function(){return MD.ALCHEMISTS >= 300 && MD.CONSTRUCT_LEVELS[17] >= 100}),
    new MD.Dragon(13,"Earth","Earth essence gain is increased with this dragon around.","Breathing fire takes a backseat as your dragon seems to put all of its energy into becoming a stone.",[14],{dirt:n("1M"),stone:n("1M"),earth:0.00005},n("1G"),function(){return MD.totalClicks() >= n("25K") && MD.CONSTRUCT_LEVELS[19] >= 50}),
    new MD.Dragon(14,"Terrene","Earth essence gain is greatly increased with this dragon around","Your dragon is now many times larger than the fiercest earth titan, and crevices snake out from its footfalls.",[15],{iron:n("100K"),steel:n("1K"),earth:0.00001},n("10G"),function(){return MD.totalClicks() >= n("50K") && MD.CONSTRUCT_LEVELS[19] >= 75}),
    new MD.Dragon(15,"Terrestrial","Earth essence gain is supercharged with this dragon around","Your dragon becomes long and narrow like a massive world eater, churning through the earth and leaving trails of molten lave in its wake.",[19],{adamantium:25,earth:0.0000025},n("100G"),function(){return MD.totalClicks() >= n("100K") && MD.CONSTRUCT_LEVELS[19] >= 100}),
    new MD.Dragon(16,"Lightning","Lightning essence gain is increased with this dragon around.","Lightning replaces fire when your dragon roars, and sparks ricochet across the walls when it passes metal buildings.",[17],{gold:n("1X"),lightning:0.00005},n("1G"),function(){return MD.TOTAL_GOLD >= n("1S") && MD.CONSTRUCT_LEVELS[21] >= 50}),
    new MD.Dragon(17,"Electric","Lightning essence gain is greatly increased with this dragon around","In the peak of its rage, your dragon seems to blur and vibrate, as if it is actually formed of lightning.",[18],{gold:n("100W"),lightning:0.00001},n("10G"),function(){return MD.TOTAL_GOLD >= n("1R") && MD.CONSTRUCT_LEVELS[21] >= 75}),
    new MD.Dragon(18,"Thundering","Lightning essence gain is supercharged with this dragon around","Thunder falls continuously for miles around the dragon, and anything standing too close is disintegrated in a flash.",[19],{gold:n("10V"),lightning:0.0000025},n("100G"),function(){return MD.TOTAL_GOLD >= n("1Q") && MD.CONSTRUCT_LEVELS[21] >= 100}),
    new MD.Dragon(19,"Imperial","Your mages find far more gem inspired by this dragon.","A true king of dragons, its voice cracks with thunder and the earth quakes at its steps.",[20],{majestic:n("100K")},n("1T"),function(){return MD.totalHirelings() >= n("20T") && MD.TOTAL_SPIRIT_ESSENCE >= 10 && MD.hasUpgrade("Volcanic Fury") && MD.hasUpgrade("Eye of the Hurricane") && MD.hasUpgrade("Center of the Quake") && MD.hasUpgrade("Thunder of Death")}),
    new MD.Dragon(20,"Majestic","Your soldiers fight with an inhuman fury with this dragon leading the charge","A dark purple dragon, coated in dark molten gems and fatal simply to look upon for all but the strongest warriors.",[21],{dragonscale:100,adamantium:100},n("1P"),function(){return MD.getPopulationMax() >= n("25K") && MD.CAMPAIGNS_WON >= n("10K") && MD.TOTAL_SPIRIT_ESSENCE >= 100}),
    new MD.Dragon(21,"Eternal","The powers of this dragon are far reaching, altering many aspects of your kingdom.","You have done well. Your dragon is the most powerful creature to set face upon the earth. You shall reap rich rewards having such a beast in your care, and your name will be forever remembered as the one who gave rise to the beast king of Mineria. Its sacrifice will release a power never before known.",[],{fire:0.000005,earth:0.000005,water:0.000005,lightning:0.000005,gold:n("1YQ")},n("1E"),function(){return MD.totalEssence() >= n("1G") && MD.TOTAL_SPIRIT_ESSENCE >= n("1K") && MD.totalConstructLevel() >= 2500}),
];

/*-------------------------------------------------------------------------------------------------
RESOURCE OBJECTS
/------------------------------------------------------------------------------------------------*/
//Objects are passed by reference, since this is often undesirable, we clone them
MD.ResClone = function(res){
    return jQuery.extend(true, {}, res);
};

//Returns how many times you can afford cost
MD.ResAffordable = function(cost){
    var res = Infinity;
    for(var p in cost){
        var cur = MD.RESOURCES[p].amount_function()/cost[p];
        if(cur < res)
            res = cur;
    }
    return Math.floor(res);
};

MD.ResMult = function(cost,m){
    cost = MD.ResClone(cost);
    for(var p in cost){
        var amt = cost[p]*m;
        //amt = (amt < 0.5 ? amt : Math.round(amt));
        cost[p] = amt;
    }
    return cost;
};

MD.ResAdd = function(cost,a){
    cost = MD.ResClone(cost);
    for(var p in cost){
        cost[p] = Math.round(cost[p] + a);
    }
    return cost;
};

MD.ResPrint = function(cost,plain,highprecision){
    plain = setDefault(plain,false); //Default to false, meaning we use HTML superscripts
    highprecision = setDefault(highprecision,false);

    var str = "";
    var first = true;
    for(var p in cost){
        if(cost[p] != 0){
            if(!first)
                str += ", ";
            else
                first = !first;
            str += s(cost[p],plain,highprecision) + " " + MD.RESOURCES[p].print_name;
        }
    }
    return str;
};

//Used for sorting prices
MD.ResCompare = function(a,b){
    var compareOrder = ["spirit","lightning","earth","water","fire","dragonscale","adamantium","population","steel","food","iron","coal","stone","dirt","majestic","bagger 288","sandshrew","large ant","perfect","exceptional","mana","flawless","great","normal","gold","flawed","cracked","murky","dreary"];
    for(var i = 0; i < compareOrder.length; i++){
        var first = a[compareOrder[i]];
        var second = b[compareOrder[i]];
        if(Boolean(first) && Boolean(second)){ //If both have the property
            if(first != second)
                return first-second;
        }
        else if(Boolean(first)){ //Next we check if just one of the objects has the property
            return 1;
        }
        else if(Boolean(second)){
            return -1;
        }
    }

    //If nothing has returned yet
    return 0;
};

MD.getResMult = function(type){
    var mult = 1;
    //Apply Arcaneum Boosts
    if(MD.CONSTRUCT_LOCATIONS.indexOf(24) != -1){ //If we have the arcaneum
        var divisor = MD.convals.archspiriteffect();
        if(type == "Basic")
            mult += MD.ARCH_ARRAY[0]/(100/divisor);
        else if(type == "Gems")
            mult += MD.ARCH_ARRAY[1]/(100/divisor);
        else if(type == "Raw Materials")
            mult += MD.ARCH_ARRAY[2]/(100/divisor);
        else if(type == "Rare Materials")
            mult += MD.ARCH_ARRAY[3]/(100/divisor);
        else if(type == "Hirelings")
            mult += MD.ARCH_ARRAY[4]/(100/divisor);
        else if(type == "Essence")
            mult += MD.ARCH_ARRAY[5]/(100/divisor);
    }

    //Other Boosts
    if(type == "Essence" && MD.hasUpgrade("Collective Knowledge")){
        mult *= (1+Math.pow(MD.CONSTRUCT_LEVELS[10],0.33)/200);
    }

    if(type == "Raw Materials" && MD.activeDragon("Eternal")){
        mult *= 10;
    }

    //Overall Boost
    if(MD.hasUpgrade("The Ultimate Prize")){
        mult *= 10;
    }

    if(MD.hasUpgrade("Lotsa Time")){
        mult *= 2;
    }

    return mult;
}

MD.totalEssence = function(){
    return MD.TOTAL_FIRE_ESSENCE + MD.TOTAL_WATER_ESSENCE + MD.TOTAL_EARTH_ESSENCE + MD.TOTAL_LIGHTNING_ESSENCE;
};

MD.totalHirelings = function(includeAnts){
    setDefault(includeAnts,false);

    var sum = sumArray(MD.HIRELINGS_OWNED,1);
    sum += (includeAnts ? MD.HIRELINGS_OWNED[0] : 0);
    return sum;
};

MD.totalClicks = function(){
    return MD.MANUAL_CLICKS + MD.AUTO_CLICKS;
}

//Returns true if at least one hireling (besides ants) has at least amt owned
MD.hirelingsGreater = function(amt){
    for(var i = 1; i < MD.HIRELINGS_OWNED.length; i++){
        if(MD.HIRELINGS_OWNED[i] >= amt)
            return true;
    }
    return false;
}

MD.totalConstructLevel = function(){
    //Exclude the university and habitation
    var sum = 0;
    for(var i = 0; i < MD.CONSTRUCT_LEVELS.length; i++){
        if(i != 7 && i != 10){
            sum += MD.CONSTRUCT_LEVELS[i];
        }
    }
    return sum;
}

/*-------------------------------------------------------------------------------------------------
 HIRELINGS
 /------------------------------------------------------------------------------------------------*/
MD.getPrice = function(hireling,number) {
    //Ants need to be treated separately because they reach such massive numbers and the cost quickly hits infinity
    var price = null;
    if(hireling == 11){
        price = MD.ResMult(MD.HIRELINGS[hireling].base_cost,Math.pow(MD.WYVERN_MULTIPLIER, number));
    }
    else if(hireling == 10){
        price = MD.ResMult(MD.HIRELINGS[hireling].base_cost,Math.pow(MD.HIVE_QUEEN_MULTIPLIER, number));
    }
    else {
        price = MD.ResMult(MD.HIRELINGS[hireling].base_cost,Math.pow(MD.PRICE_MULTIPLIER, number));
    }

    if (MD.hasUpgrade("Bigshot Manager"))
        price = MD.ResMult(price,(100-MD.uv.upgradereduction)/100);

    return price
};

MD.getHirelingByName = function(name){
    for (var i = 0; i < MD.HIRELINGS.length; i++){
        if (MD.HIRELINGS[i].name.toLowerCase() == name.toLowerCase())
            return i
    }
    return -1
};

MD.getProduction = function(hireling){
    var h = MD.HIRELINGS[hireling];
    var val = h.output;
    if (hireling == 0){ //Large Ants
        val = (MD.hasUpgrade("Existing Tunnel Systems") ? (val + (MD.uv.antpersandshrew * MD.HIRELINGS_OWNED[3])) : val);
        val = (MD.hasUpgrade("Gentle Giants") ? (val + (MD.uv.antperrockgolem * MD.HIRELINGS_OWNED[6])) : val);
        val = (MD.hasUpgrade("Everything is Tunnels") ? (val + (MD.uv.antperbagger * MD.HIRELINGS_OWNED[7])) : val);
        val = val * (MD.hasUpgrade("Enlarged Pincers") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Fire Ants") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("For The Queen") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Colonization") ? MD.uv.level4mult : 1) * (MD.hasUpgrade("Who's Pathetic Now?") ? MD.uv.level5mult : 1);
    }
    else if (hireling == 1){
        val = (MD.hasUpgrade("Affinity With Nature") ? (val + (MD.uv.woodpeckerpertitan * MD.HIRELINGS_OWNED[8])) : val);
        val = val * (MD.hasUpgrade("Feeding Frenzy") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Curved Beaks") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Nature's Power Drill") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Ironbeaks") ? MD.uv.level4mult : 1);
    }
    else if (hireling == 2){
        val = (MD.hasUpgrade("Man's Best Friend") ? (val + Math.pow(MD.MASONS,MD.uv.houndpercraftexponent)) : val);
        val = val * (MD.hasUpgrade("Sharpened Senses") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Reduced Slobber") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Nightmare Hounds") ? MD.uv.level3mult : 1)   * (MD.hasUpgrade("Cerberus") ? MD.uv.level4mult : 1);
        val = val * (MD.hasUpgrade("Underdogs") ? MD.HIRELINGS_OWNED[4] : 1);
    }
    else if (hireling == 3){
        val = (MD.hasUpgrade("Friends With Rare Candies") ? (val + (MD.uv.sandshrewperminer * MD.HIRELINGS_OWNED[5])) : val);
        val = (MD.hasUpgrade("Not Just A Boulder") ? (val + (MD.uv.sandshrewpergolem * MD.HIRELINGS_OWNED[6])) : val);
        val = val * (MD.hasUpgrade("Cute Overload") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Fury Swipes") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Sandslash") ? MD.uv.level3mult : 1)  * (MD.hasUpgrade("Earthquake") ? MD.uv.level4mult : 1);
        val = val + (MD.hasUpgrade("Armor Sharing") ? MD.TIMES_FORTIFIED*MD.uv.sandperfort : 0);
    }
    else if (hireling == 4){
        val = val * (MD.hasUpgrade("Seed of Rebellion") ? Math.sqrt(MD.GOBLIN_DAMAGE)/100 : 1);
        val = val * (MD.hasUpgrade("Midas Touch") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Gringotts Employee") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Azog") ? MD.uv.level3mult : 1)  * (MD.hasUpgrade("Blinding Greed") ? MD.uv.level4mult : 1);
        val = (MD.hasUpgrade("Trap Aficionado") ? (val + sumArray(MD.TRAPS_BOUGHT)*(MD.hasUpgrade("Trap Master") ? MD.uv.goblinpertrap2 : MD.uv.goblinpertrap1)) : val);
        val = val * (MD.hasUpgrade("Underdogs") ? MD.HIRELINGS_OWNED[2] : 1);
    }
    else if (hireling == 5){
        val = (MD.hasUpgrade("Mechanized Industry") ? (val + (MD.uv.minerperbagger * MD.HIRELINGS_OWNED[7])) : val);
        val = (MD.hasUpgrade("Dragonborn") ? (val + (MD.uv.minerperwyvern * MD.HIRELINGS_OWNED[11])) : val);
        val = val * (MD.hasUpgrade("Overtime") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Dual Pickaxes") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Herobrine") ? MD.uv.level3mult : 1)  * (MD.hasUpgrade("Blur of Picks") ? MD.uv.level4mult : 1);
    }
    else if (hireling == 6){
        val = h.output * (MD.hasUpgrade("Runite Ore Drop") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Extra Pointy") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Mountain Men") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Carbonado Cores") ? MD.uv.level4mult : 1);
    }
    else if (hireling == 7){
        val = h.output * (MD.hasUpgrade("13500") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Sehr gut!") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("German Engineering") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Unreasonable Force") ? MD.uv.level4mult : 1);
    }
    else if (hireling == 8){
        val = h.output * (MD.hasUpgrade("Gaia's Training") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Hyperion") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Commander Kronus") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Masters of Old") ? MD.uv.level4mult : 1);
        val = val + (MD.hasUpgrade("Symbiosis") ? MD.POPULATION*MD.uv.titanperpop : 0);
        val = val + (MD.hasUpgrade("Academic Symbiosis") ? MD.CONSTRUCT_LEVELS[10]*100*MD.uv.titanperpop : 0);
    }
    else if (hireling == 9){
        val = (MD.hasUpgrade("Internal Army") ? (val + (MD.uv.worldperant * MD.HIRELINGS_OWNED[0])) : val);
        val = val * (MD.hasUpgrade("Rotating Jaw") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Aerodynamic Plating") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Diamond Enforced Teeth") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Apophis") ? MD.uv.level4mult : 1);
    }
    else if (hireling == 11){
        val = h.output * (MD.hasUpgrade("Reinforced Claws") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Crystal Vision") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("Rhenium Heart") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Truth Exceeding Legend") ? MD.uv.level4mult : 1) * (MD.hasUpgrade("Mythical Power") ? MD.uv.level5mult : 1);
        val *= MD.convals.dragonmount_function(MD.CONSTRUCT_LEVELS[2]); //Apply dragonmount bonus
    }

    //Apply imbuement multiplier
    val *= (1 + MD.IMBUEMENT_LEVEL[hireling]*0.2);
    return val;
};

MD.hire = function(number) {
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    while(MD.canAfford(MD.getPrice(number,MD.HIRELINGS_OWNED[number])) && num > 0){
        MD.spend(MD.getPrice(number,MD.HIRELINGS_OWNED[number]));
        MD.HIRELINGS_OWNED[number]++;
        num--;
    }
    MD.setHirelingButtons(); //Update prices
    MD.updateGoldPerSecond();
};

MD.setHirelingButtons = function() {
    for (var i=0; i<MD.HIRELINGS.length; i++){
        get("hireling" + i).innerHTML = MD.HIRELINGS[i].name + " <br>" + MD.ResPrint(MD.getPrice(i,MD.HIRELINGS_OWNED[i])) + "   -   " + s(Math.round(MD.HIRELINGS_OWNED[i])) + " hired";

        //Initialize jquery tooltips
        if(MD.HIRELINGS[i].unlock_function()) {

            if (get("hireling" + i).style.display == 'none')
                MDART.alertTab("hire");

            var tipText;
            var hireling = $("#hireling" + i);
            if (MD.HIRELINGS[i].name == "Hive Queen") {
                tipText = MD.HIRELINGS[i].description + " Spawns " + s(MD.getQueenProduction()*MD.getResMult("Hirelings")) + " ants per second. (" + s(MD.getQueenProduction()*MD.getResMult("Hirelings")*MD.HIRELINGS_OWNED[i]) + " total)";
                MDART.setTooltip(hireling,"",tipText);

                hireling.toggleClass("unaffordable", !MD.canAfford(MD.getPrice(i, MD.HIRELINGS_OWNED[i])));
                get("hireling" + i).style.display = 'inline'
            }
            else if(MD.HIRELINGS[i].name == "Neurochrysalis"){
                tipText = MD.HIRELINGS[i].description + " Generates " + s(MD.getChrysalisProduction()*MD.getResMult("Basic")) + " mana per second. (" + s(MD.getChrysalisProduction()*MD.getResMult("Basic")*MD.HIRELINGS_OWNED[i]) + " total)";
                MDART.setTooltip(hireling,"",tipText);

                hireling.toggleClass("unaffordable", !MD.canAfford(MD.getPrice(i, MD.HIRELINGS_OWNED[i])));
                get("hireling" + i).style.display = 'inline'                
            }
            else if(MD.HIRELINGS[i].name == "Dragon Hunter"){
                tipText = MD.HIRELINGS[i].description + " Finds " + s(MD.getHunterProduction()*MD.getResMult("Rare Materials")) + " dragonscale per second. (" + s(MD.getHunterProduction()*MD.getResMult("Rare Materials")*MD.HIRELINGS_OWNED[i]) + " total)";
                MDART.setTooltip(hireling,"",tipText);

                hireling.toggleClass("unaffordable", !MD.canAfford(MD.getPrice(i, MD.HIRELINGS_OWNED[i])));
                get("hireling" + i).style.display = 'inline'   
            }
            else {
                tipText = MD.HIRELINGS[i].description + " Provides " + s(MD.getProduction(i)*MD.getResMult("Basic")) + " gold per second. (" + s(MD.getProduction(i)*MD.getResMult("Basic")*MD.HIRELINGS_OWNED[i]) + " total)";
                MDART.setTooltip(hireling,"",tipText);
                hireling.toggleClass("unaffordable", !MD.canAfford(MD.getPrice(i, MD.HIRELINGS_OWNED[i])));
                get("hireling" + i).style.display = 'inline'
            }
        }
        else{
            get("hireling" + i).style.display = 'none';
            get("hireling" + i).title = ""
        }
    }
};

//Resource functions
MD.changeHirelings = function(i,amount){
    amount *= ((amount > 0) ? MD.getResMult("Hirelings") : 1);

    MD.HIRELINGS_OWNED[i] += amount;
};

MD.hasHirelings = function(i,amount){
    return MD.HIRELINGS_OWNED[i] >= amount;
};

MD.getHirelings = function(i){
    return MD.HIRELINGS_OWNED[i];
}

//Other
MD.processWyvernAdamantium = function(){
    if(MD.hasUpgrade("Adamantium Affinity")){
        MD.changeAdamantium(MD.HIRELINGS_OWNED[11]/n("10M"));
    }
};

//Handles upgrades that deal with strange affects (this should be updated to include a number of other functions)
MD.processSpecialHirelings = function(){
    if(MD.hasUpgrade("Woody See, Woody Do")){
        var amt = Math.min(20,Math.floor(MD.HIRELINGS_OWNED[1]/n("1G"))); //1/1G of Woodpeckers, up to 20
        if(amt > 0){
            MD.dig(null,null,amt);
        }
    }

    if(MD.hasUpgrade("Getting Hungry")){
        if(MD.HIRELINGS_OWNED[0] > MD.HIRELINGS_OWNED[2]){
            MD.changeHirelings(0,-MD.HIRELINGS_OWNED[2]); //Each bloodhound eats an ant
            MD.ANTS_EATEN += MD.HIRELINGS_OWNED[2];
        }
    }

    if(MD.hasUpgrade("Miner Blindness Reduction")){
        MD.getGaussianGem(4,2,Math.pow(MD.HIRELINGS_OWNED[5],1/5)*748576);
    }

    if(MD.hasUpgrade("Strange Transformation") && tryPercentChance(0.05) && MD.hasHirelings(6,1)){
        MD.changeHirelings(6,-1);
        MD.MAGES++;
    }

    if(MD.hasUpgrade("Dig Smarter, Not Harder")){
        var amt = MD.HIRELINGS_OWNED[7] * (MD.hasUpgrade("Diesel Engines") ? MD.uv.level1mult : 1);
        MD.changeCoal(amt/n("100K"));
    }

    if(MD.hasUpgrade("Flax Affinity")){
        var amt = MD.HIRELINGS_OWNED[12]/n("20M");
        amt *= (MD.hasUpgrade("Mana Man") ? 1.5 : 1);
        MD.changeFlax(amt);
    }
}

/*-------------------------------------------------------------------------------------------------
 QUEENS/ANT RESOURCE
 /------------------------------------------------------------------------------------------------*/
MD.getQueenProduction = function(){
    var val = MD.QUEEN_BASE + (MD.hasUpgrade("Ventral Sacs") ? MD.uv.queenupgrade1 : 0) + (MD.hasUpgrade("Bulbosity Enhancement") ? MD.uv.queenupgrade2 : 0) + (MD.hasUpgrade("Larval Acceleration") ? MD.uv.queenupgrade2 : 0)  + (MD.hasUpgrade("Unnatural Virility") ? MD.uv.queenupgrade3 : 0) + (MD.hasUpgrade("Hive Mentality") ? MD.uv.queenupgrade4 : 0);

    if(MD.hasUpgrade("Ever Advancing")){
        val += MD.uv.hivequeenantincrease();
    }

    //Apply imbuement
    val *= (1 + MD.IMBUEMENT_LEVEL[10]*0.2);
    return val;
};

MD.processQueens = function() {
    MD.changeHirelings(0,MD.HIRELINGS_OWNED[10]*MD.getQueenProduction());

    if(MD.hasUpgrade("Extreme Mutation") && tryPercentChance(10)){
        MD.changeHirelings(getRandom(1,12),Math.sqrt(sumArray(MD.HIRELINGS_OWNED)-MD.HIRELINGS_OWNED[0])*30);
    }
};

/*-------------------------------------------------------------------------------------------------
 NEUROCHRYSALISES
 /------------------------------------------------------------------------------------------------*/
MD.getChrysalisProduction = function(){
    var val = MD.NEURO_BASE * (MD.hasUpgrade("Neurological Compounding") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Full Assimilation") ? MD.uv.level2mult : 1) * (MD.hasUpgrade("Metamorphosis") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Mana Man") ? 2 : 1);

    //Apply imbuement upgrades
    var percent = 0;
    if(MD.hasUpgrade("Nightmare Neurochrysalises"))
        percent++;
    if(MD.hasUpgrade("Arcane Neurochrysalises"))
        percent++;
    if(MD.hasUpgrade("Eldritch Neurochrysalises"))
        percent++;

    val += val * ((percent*MD.MAGES)/100);

    //Apply imbuement
    val *= (1 + MD.IMBUEMENT_LEVEL[12]*0.2);
    return val;
};

MD.processChrysalis = function() {
    MD.changeMana(MD.HIRELINGS_OWNED[12]*MD.getChrysalisProduction());
};

/*-------------------------------------------------------------------------------------------------
DRAGON HUNTERS
/------------------------------------------------------------------------------------------------*/
MD.getHunterProduction = function(){
    var prod = 0.006 * Math.pow(MD.CONSTRUCT_LEVELS[14]+1,1.15);
    prod *= (MD.hasUpgrade("Archery Courses") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Adamantium Tipped Arrows") ? MD.uv.level2mult : 1) * (MD.hasUpgrade("Homing Darts") ? MD.uv.level3mult : 1);
    prod *= (1 + MD.IMBUEMENT_LEVEL[13]*0.2);
    return prod;
};

MD.processHunters = function(){
    MD.changeDragonscale(MD.HIRELINGS_OWNED[13]*MD.getHunterProduction());
};

/*-------------------------------------------------------------------------------------------------
INDUSTRY RESOURCES
/------------------------------------------------------------------------------------------------*/
MD.hasDirt = function(amt){
    return MD.DIRT >= amt;
};

MD.getDirt = function(){
    return MD.DIRT;
};

MD.changeDirt = function(amt){
    amt *= ((amt > 0) ? MD.getResMult("Raw Materials") : 1);

    MD.DIRT += amt;

    if(amt > 0)
        MD.TOTAL_DIRT += amt;

    MD.updateDirtDisplay();
}

MD.updateDirtDisplay = function(){
    if(MD.TOTAL_DIRT > 0){
        get("dirtdisplay").innerHTML = "Dirt: " + s(MD.DIRT);
    }
    else{
        get("dirtdisplay").innerHTML = "";
    }
};

MD.processDirtProduction = function(){
    if(MD.hasUpgrade("Precious Resources")){
        var amt = MD.HIRELINGS_OWNED[7] * (MD.hasUpgrade("Diesel Engines") ? MD.uv.level1mult : 1);
        
        if(MD.hasUpgrade("Myth and Machine")){
            amt *= (Math.pow(MD.HIRELINGS_OWNED[6],0.4)/4);
        }

        MD.changeDirt(amt);
    }

    if(MD.hasUpgrade("Makes Sense")){
        var amt = MD.HIRELINGS_OWNED[9] * MD.uv.dirtpereater;
        MD.changeDirt(amt);
    }
};

MD.hasStone = function(amt){
    return MD.STONE >= amt;
};

MD.getStone = function(){
    return MD.STONE;
};

MD.changeStone = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Raw Materials") : 1);

    MD.STONE += amt;

    if(amt > 0)
        MD.TOTAL_STONE += amt;

    MD.updateStoneDisplay();
};

MD.updateStoneDisplay = function(){
    if(MD.TOTAL_STONE > 0){
        get("stonedisplay").innerHTML = "Stone: " + s(MD.STONE);
    }
    else{
        get("stonedisplay").innerHTML = "";
    }
};

MD.hasCoal = function(amt){
    return MD.COAL >= amt;
};

MD.getCoal = function(){
    return MD.COAL;
}

MD.changeCoal = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Raw Materials") : 1);

    MD.COAL += amt;

    if(amt > 0)
        MD.TOTAL_COAL += amt;

    MD.updateCoalDisplay();
};

MD.updateCoalDisplay = function(){
    if(MD.TOTAL_COAL > 0){
        get("coaldisplay").innerHTML = "Coal: " + s(MD.COAL);
    }
    else{
        get("coaldisplay").innerHTML = "";
    }
};

MD.hasIron = function(amt){
    return MD.IRON >= amt;
};

MD.getIron = function(){
    return MD.IRON;
}

MD.changeIron = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Raw Materials") : 1);

    MD.IRON += amt;

    if(amt > 0)
        MD.TOTAL_IRON += amt;

    MD.updateIronDisplay();
};

MD.updateIronDisplay = function(){
    if(MD.TOTAL_IRON > 0){
        get("irondisplay").innerHTML = "Iron: " + s(MD.IRON);
    }
    else{
        get("irondisplay").innerHTML = "";
    }
};

MD.hasSteel = function(amt){
    return MD.STEEL >= amt;
};

MD.getSteel = function(){
    return MD.STEEL;
}

MD.changeSteel = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Rare Materials") : 1);

    MD.STEEL += amt;

    if(amt > 0)
        MD.TOTAL_STEEL += amt;

    MD.updateSteelDisplay();
};

MD.updateSteelDisplay = function(){
    if(MD.TOTAL_STEEL > 0){
        get("steeldisplay").innerHTML = "Steel: " + s(MD.STEEL);
    }
    else{
        get("steeldisplay").innerHTML = "";
    }

    //Population window
    var pop = get("pop-amt");
    if(!$(pop).is(":focus")){ //When it is in focus, the user is typing in a value, so don't update it
        pop.value = MD.getMaxHabitationIncrease();
        MD.habitationInputChange();
    }
};

MD.hasFood = function(amt){
    return MD.FOOD >= amt;
};

MD.changeFood = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Raw Materials") : 1);

    MD.FOOD += amt;

    if(amt > 0)
        MD.TOTAL_FOOD += amt;

    MD.updateFoodDisplay();
};

MD.getFood = function(){
    return MD.FOOD;
}

MD.updateFoodDisplay = function(){
    if(MD.TOTAL_FOOD > 0){
        get("fooddisplay").innerHTML = "Food: " + s(MD.FOOD);
    }
    else{
        get("fooddisplay").innerHTML = "";
    }
};

MD.hasAdamantium = function(amt){
    return MD.ADAMANTIUM >= amt;
};

MD.changeAdamantium = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Rare Materials") : 1);

    MD.ADAMANTIUM += amt;

    if(amt > 0)
        MD.TOTAL_ADAMANTIUM += amt;

    MD.updateAdamantiumDisplay();
};

MD.getAdamantium = function(){
    return MD.ADAMANTIUM;
};

MD.updateAdamantiumDisplay = function(){
    if(MD.TOTAL_ADAMANTIUM > 0){
        get("adamdisplay").innerHTML = "Adamantium: " + s(MD.ADAMANTIUM);
        get("barrack-adamantium-counter").innerHTML = "Adamantium: " + s(MD.ADAMANTIUM);
    }
    else{
        get("adamdisplay").innerHTML = "";
    }
};

MD.hasPopulation = function(amt){
    return MD.POPULATION >= amt;
};

MD.changePopulation = function(amt){
    MD.POPULATION += amt;

    if(amt > 0)
        MD.TOTAL_POPULATION += amt;

    MD.updatePopulationDisplay();
};

MD.getPopulation = function(){
    return MD.POPULATION;
}

MD.updatePopulationDisplay = function(){
    if(MD.TOTAL_POPULATION > 0){
        get("popdisplay").innerHTML = "Population: " + s(MD.POPULATION);
    }
    else{
        get("popdisplay").innerHTML = "";
    }

    var scholar = get("scholar-amt");
    if(!$(scholar).is(":focus")){ //When it is in focus, the user is typing in a value, so don't update it
        scholar.value = MD.getPopulation();
    }
};

MD.hasFlax = function(amt){
    return MD.FLAX >= amt;
};

MD.changeFlax = function(amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Rare Materials") : 1);

    MD.FLAX += amt;

    if(amt > 0)
        MD.TOTAL_FLAX += amt;

    MD.updateFlaxDisplay();
};

MD.getFlax = function(){
    return MD.FLAX;
};

MD.updateFlaxDisplay = function(){
    if(MD.TOTAL_FLAX > 0){
        get("flaxdisplay").innerHTML = "Flax: " + s(MD.FLAX);
    }
    else{
        get("flaxdisplay").innerHTML = "";
    }
};

MD.hasDragonscale = function(amt){
    return MD.DRAGONSCALE >= amt;
};

MD.changeDragonscale = function(amt){
    amt *= ((amt > 0) ? MD.getResMult("Rare Materials") : 1);

    MD.DRAGONSCALE += amt;

    if(amt > 0)
        MD.TOTAL_DRAGONSCALE += amt;

    MD.updateDragonscaleDisplay();
};

MD.getDragonscale = function(){
    return MD.DRAGONSCALE;
};

MD.updateDragonscaleDisplay = function(){
    if(MD.TOTAL_DRAGONSCALE > 0){
        get("dragdisplay").innerHTML = "Dragonscale: " + s(MD.DRAGONSCALE);
    }
    else{
        get("dragdisplay").innerHTML = "";
    }
};

MD.hasFireEssence = function(amt){
    return MD.FIRE_ESSENCE >= amt;
};

MD.changeFireEssence = function(amt){
    amt *= ((amt > 0) ? MD.getResMult("Essence") : 1);

    MD.FIRE_ESSENCE += amt;

    if(amt > 0)
        MD.TOTAL_FIRE_ESSENCE += amt;

    MD.updateFireEssenceDisplay();
};

MD.getFireEssence = function(){
    return MD.FIRE_ESSENCE;
};

MD.updateFireEssenceDisplay = function(){
    if(MD.TOTAL_FIRE_ESSENCE > 0){
        get("fireessdisplay").innerHTML = "Fire Essence: " + s(MD.FIRE_ESSENCE);
    }
    else{
        get("fireessdisplay").innerHTML = "";
    }
};

MD.hasWaterEssence = function(amt){
    return MD.WATER_ESSENCE >= amt;
};

MD.changeWaterEssence = function(amt){
    amt *= ((amt > 0) ? MD.getResMult("Essence") : 1);

    MD.WATER_ESSENCE += amt;

    if(amt > 0)
        MD.TOTAL_WATER_ESSENCE += amt;

    MD.updateWaterEssenceDisplay();
};

MD.getWaterEssence = function(){
    return MD.WATER_ESSENCE;
};

MD.updateWaterEssenceDisplay = function(){
    if(MD.TOTAL_WATER_ESSENCE > 0){
        get("wateressdisplay").innerHTML = "Water Essence: " + s(MD.WATER_ESSENCE);
    }
    else{
        get("wateressdisplay").innerHTML = "";
    }
};

MD.hasEarthEssence = function(amt){
    return MD.EARTH_ESSENCE >= amt;
};

MD.changeEarthEssence = function(amt){
    amt *= ((amt > 0) ? MD.getResMult("Essence") : 1);

    MD.EARTH_ESSENCE += amt;

    if(amt > 0)
        MD.TOTAL_EARTH_ESSENCE += amt;

    MD.updateEarthEssenceDisplay();
};

MD.getEarthEssence = function(){
    return MD.EARTH_ESSENCE;
};

MD.updateEarthEssenceDisplay = function(){
    if(MD.TOTAL_EARTH_ESSENCE > 0){
        get("earthessdisplay").innerHTML = "Earth Essence: " + s(MD.EARTH_ESSENCE);
    }
    else{
        get("earthessdisplay").innerHTML = "";
    }
};

MD.hasLightningEssence = function(amt){
    return MD.LIGHTNING_ESSENCE >= amt;
};

MD.changeLightningEssence = function(amt){
    amt *= ((amt > 0) ? MD.getResMult("Essence") : 1);

    MD.LIGHTNING_ESSENCE += amt;

    if(amt > 0)
        MD.TOTAL_LIGHTNING_ESSENCE += amt;

    MD.updateLightningEssenceDisplay();
};

MD.getLightningEssence = function(){
    return MD.LIGHTNING_ESSENCE;
};

MD.updateLightningEssenceDisplay = function(){
    if(MD.TOTAL_LIGHTNING_ESSENCE > 0){
        get("lightessdisplay").innerHTML = "Lightning Essence: " + s(MD.LIGHTNING_ESSENCE);
    }
    else{
        get("lightessdisplay").innerHTML = "";
    }
};

MD.hasSpiritEssence = function(amt){
    return MD.SPIRIT_ESSENCE >= amt;
};

MD.changeSpiritEssence = function(amt){
    MD.SPIRIT_ESSENCE += amt;

    if(amt > 0)
        MD.TOTAL_SPIRIT_ESSENCE += amt;

    MD.updateSpiritEssenceDisplay();
};

MD.getSpiritEssence = function(){
    return MD.SPIRIT_ESSENCE;
};

MD.updateSpiritEssenceDisplay = function(){
    if(MD.TOTAL_SPIRIT_ESSENCE > 0){
        get("spiritessdisplay").innerHTML = "Spirit Essence: " + s(Math.floor(MD.SPIRIT_ESSENCE));
    }
    else{
        get("spiritessdisplay").innerHTML = "";
    }
};


/*-------------------------------------------------------------------------------------------------
MILITARY
/------------------------------------------------------------------------------------------------*/
MD.updateMilitaryButton = function(){
    if(MD.hasConstruct("Barracks")){
        get("warButton").style.display = 'inline';
    }
    else{
        get("warButton").style.display = 'none';
    }
};

MD.updateMilitaryPage = function(){
    get("enemy-strength").innerHTML = "Enemy Strength: " + s(MD.getEnemyStrength());
    get("available-troops").innerHTML = "Available Soldiers: " + s(Math.ceil(MD.getPopulation()/2));
    get("effective-troops").innerHTML = "Army Strength: " + s(MD.getMilitaryStrength()); //The army size times the upgrade level
    var upgradeCost = MD.getConstructUpgradeCost(9);
    get("barrack-upgrade-cost").innerHTML = "Training Cost: " + MD.ResPrint(upgradeCost);

    if(upgradeCost.food <= MD.getFood()){
        get("barrack-upgrade-remainder").innerHTML = "Food Remaining After Training: " + s(MD.getFood()-upgradeCost.food) + " Food"
    }
    else{
        get("barrack-upgrade-remainder").innerHTML = ""
    }

    var price = MD.getConstructUpgradeCost(9);
    $("#training-btn").toggleClass("unaffordable",!MD.canAfford(price));

    get("campaignswon2").innerHTML = (MD.CAMPAIGNS_WON > 0) ? "Campaigns Won: " + s(MD.CAMPAIGNS_WON) : "";
};

MD.getEnemyStrength = function(){
    return MD.convals.barracks_formula(MD.GOBLIN_LEVEL,MD.SPIDER_LEVEL);
};

MD.getMilitaryStrength = function(){
    var strength = Math.ceil(MD.getPopulation()/2) * (1+((MD.CONSTRUCT_LEVELS[9])/10)) * (1+((MD.CONSTRUCT_LEVELS[11])/25));

    if(MD.hasConstruct("Graveyard"))
        strength += strength*(MD.convals.graveyardbonus()/100);
    if(MD.hasUpgrade("Little Lizard"))
        strength *= 1.5;
    if(MD.hasUpgrade("Overwhelming Might"))
        strength *= 2;
    if(MD.activeDragon("Novice"))
        strength *= 2;
    if(MD.activeDragon("Master") || MD.activeDragon("Eternal"))
        strength *= 4;
    if(MD.activeDragon("Majestic"))
        strength *= 10;

    return strength;
};

MD.getAdamantiumReward = function(){
    var res = Math.max(1,Math.ceil(Math.pow(Math.min(MD.CAMPAIGNS_WON,50000)/1001,5))); //Quintic up to 50000
    res += (MD.CAMPAIGNS_WON > 50000 ? Math.max(1,Math.ceil(Math.pow((MD.CAMPAIGNS_WON-50000)/253,4))) : 0); //Much slower afterwards
    return res;
};

MD.launchCampaign = function(auto){
    auto = setDefault(auto,false);
    var num = (MD.multibuyActive() && !auto) ? 10 : 1;

    while(num > 0){
        var enemyRoll = gaussianRandom(MD.getEnemyStrength(),MD.getEnemyStrength()/5);
        var troopRoll = gaussianRandom(MD.getMilitaryStrength(),MD.getMilitaryStrength()/5);
        var army = Math.ceil(MD.getPopulation()/2);

        if(troopRoll > enemyRoll){
            var coal = Math.max(0,Math.round(gaussianRandom(enemyRoll,enemyRoll/10))*100);
            var iron = Math.max(0,Math.round(gaussianRandom(enemyRoll,enemyRoll/10)*1000));
            var steel = Math.max(0,Math.round(gaussianRandom(enemyRoll,enemyRoll/10)*50));

            var adam = 0;
            chance = 7 * (MD.hasUpgrade("War Vultures") ? MD.uv.level3mult : 1);
            if(tryPercentChance(chance)){
                adam = MD.getAdamantiumReward();
            }

            var adamText = (adam == 1 ? "You have also found a strange green ore in the ruins. " : " ");
            adamText = (adam > 1 ? "You have found " + s(adam) + " adamantium ore in the wreckage. " : adamText);
            MD.changeAdamantium(adam*MD.getResMult("Rare Materials"));

            var deaths = getRandom(Math.ceil(army/20),Math.ceil(army/10));

            get("military-results").innerHTML = "Victory! You have plundered " + s(iron*MD.getResMult("Raw Materials")) + " iron, " + s(coal*MD.getResMult("Raw Materials")) + " coal, and " + s(steel*MD.getResMult("Rare Materials")) + " steel from the defeated horde." + adamText + s(deaths) + " soldiers were killed in the battle.";

            //Award resources
            MD.changeCoal(coal);
            MD.changeIron(iron);
            MD.changeSteel(steel);

            //Increase enemy strength
            var increase = (troopRoll - enemyRoll)/120;
            MD.GOBLIN_LEVEL += increase*n("8K");
            MD.SPIDER_LEVEL += increase*n("2K");

            //Kill people
            MD.SOLDIERS_LOST += deaths;
            MD.killPopulation(deaths);

            MD.CAMPAIGNS_WON++;

            //Update displays
            get("campaignswon2").innerHTML = (MD.CAMPAIGNS_WON > 0) ? "Campaigns Won: " + s(MD.CAMPAIGNS_WON) : "";
            get("grave-effect").innerHTML = "Your army strength is increased by " + s(MD.convals.graveyardbonus()) + "% by memories of fallen comrades.";

        }
        else{
            var deaths = getRandom(Math.ceil(army/4),Math.ceil(army/2));
            get("military-results").innerHTML = "Defeat! " + s(deaths) + " soldiers were killed in battle!";

            MD.SOLDIERS_LOST += deaths;
            MD.killPopulation(deaths);
        };
        num--;
    };

    MD.updateMilitaryPage();
};

/*-------------------------------------------------------------------------------------------------
MACHINE SHOP
/------------------------------------------------------------------------------------------------*/
MD.updateMechButton = function(){
    if(MD.hasConstruct("Machinist")){
        get("mechButton").style.display = 'inline';
    }
    else{
        get("mechButton").style.display = 'none';
    }
};

MD.getAutoBuildAmount = function(){
    var amt = 1;
    if(MD.hasUpgrade("Ghosts of Rapid Mechanization")){
        amt = Math.max(1,Math.pow(Math.log(MD.totalEssence()),2));
    }
    return Math.round(amt);
};

MD.updateMechPage = function(){
    //Check if divs are available
    $("#mech-craftsman").toggle(MD.hasConstruct("Earth Shrine"));
    $("#mech-alchemist").toggle(MD.hasConstruct("Lightning Shrine"));
    var autoAmt = (MD.hasUpgrade("Fury of Flame") || MD.hasUpgrade("One with Nature") || MD.hasUpgrade("Fury of the Sea") ? "You can automatically build up to " + s(MD.getAutoBuildAmount()) + " mechanical servant each second." : "")
    get("auto-amt").innerHTML = autoAmt;

    //Update Price Buttons
    var mageButton = get("buildMageButton");
    var autoMageButton = get("autoMageButton");
    mageButton.innerHTML = "Build Mage (" + MD.ResPrint(MD.convals.mechmagecost) + ")";
    $(mageButton).toggleClass("unaffordable",!MD.canAfford(MD.convals.mechmagecost));
    autoMageButton.innerHTML = "Try to Auto-Build: " + (MD.MACHINIST_AUTO[0] ? "True" : "False");
    $(autoMageButton).toggle(MD.hasUpgrade("Fury of Flame"));
    get("mech-mage-count").innerHTML = "Total Mages: " + s(MD.MAGES);

    var masonButton = get("buildMasonButton");
    var autoMasonButton = get("autoMasonButton");
    masonButton.innerHTML = "Build Craftsman (" + MD.ResPrint(MD.convals.mechmasoncost) + ")";
    $(masonButton).toggleClass("unaffordable",!MD.canAfford(MD.convals.mechmasoncost));
    autoMasonButton.innerHTML = "Try to Auto-Build: " + (MD.MACHINIST_AUTO[1] ? "True" : "False");
    $(autoMasonButton).toggle(MD.hasUpgrade("One with Nature")); 
    get("mech-mason-count").innerHTML = "Total Craftsmen: " + s(MD.MASONS);

    var alchButton = get("buildAlchButton");
    var autoAlchButton = get("autoAlchButton");
    alchButton.innerHTML = "Build Alchemist (" + MD.ResPrint(MD.convals.mechalchcost) + ")";
    $(alchButton).toggleClass("unaffordable",!MD.canAfford(MD.convals.mechalchcost)); 
    autoAlchButton.innerHTML = "Try to Auto-Build: " + (MD.MACHINIST_AUTO[2] ? "True" : "False");
    $(autoAlchButton).toggle(MD.hasUpgrade("Fury of the Sea")); 
    get("mech-alch-count").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS);
};

MD.buildMage = function(amt){
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    num = ((typeof(amt) == "undefined") ? num : amt) //Overwrite with amount if needed

    var affordable = MD.ResAffordable(MD.convals.mechmagecost); //Get amount we can buy
    num = Math.min(num,affordable);

    var cost = MD.ResMult(MD.convals.mechmagecost,num);
    MD.spend(cost);
    MD.MAGES += num;

    MD.updateMechPage();
};

MD.buildCraftsman = function(amt){
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    num = ((typeof(amt) == "undefined") ? num : amt) //Overwrite with amount if needed

    var affordable = MD.ResAffordable(MD.convals.mechmasoncost); //Get amount we can buy
    num = Math.min(num,affordable);

    var cost = MD.ResMult(MD.convals.mechmasoncost,num);
    MD.spend(cost);
    MD.MASONS += num;

    MD.updateMechPage();
};

MD.buildAlchemist = function(amt){
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    num = ((typeof(amt) == "undefined") ? num : amt) //Overwrite with amount if needed

    var affordable = MD.ResAffordable(MD.convals.mechalchcost); //Get amount we can buy
    num = Math.min(num,affordable);

    var cost = MD.ResMult(MD.convals.mechalchcost,num);
    MD.spend(cost);
    MD.ALCHEMISTS += num;

    MD.updateMechPage();
};

MD.toggleAutoMage = function(){
    MD.MACHINIST_AUTO[0] = !MD.MACHINIST_AUTO[0];
    MD.updateMechPage();
};

MD.toggleAutoMason = function(){
    MD.MACHINIST_AUTO[1] = !MD.MACHINIST_AUTO[1];
    MD.updateMechPage();
};

MD.toggleAutoAlch = function(){
    MD.MACHINIST_AUTO[2] = !MD.MACHINIST_AUTO[2];
    MD.updateMechPage();
};

/*-------------------------------------------------------------------------------------------------
ARCANEUM
/------------------------------------------------------------------------------------------------*/
MD.updateArchButton = function(){
    if(MD.hasConstruct("Arcaneum")){
        get("libButton").style.display = 'inline';
    }
    else{
        get("libButton").style.display = 'none';
    }
};

MD.updateArchPage = function(){
    //Remove spirit if there is negative available
    if(MD.spiritAvailable() < 0){
        for(var i = MD.ARCH_ARRAY.length-1; i >= 0; i--){
            if(MD.ARCH_ARRAY[i] > Math.abs(MD.spiritAvailable())){
                MD.ARCH_ARRAY[i] -= Math.abs(MD.spiritAvailable());
            }
            else{
                MD.ARCH_ARRAY[i] = 0;
            }
        }
    }

    //Update Golden Well
    $("#arc-gold-area").toggle(MD.hasUpgrade("The Golden Well"));
    var cost = MD.getConstructUpgradeCost(24);
    var wishBtn = get("arc-power-btn");
    wishBtn.innerHTML = "Make a Wish! (" + MD.ResPrint(cost) + ")";
    $(wishBtn).toggleClass("unaffordable",!MD.canAfford(cost));
    get("arc-gold-effect").innerHTML = "Your Arcaneum is level " + s(MD.CONSTRUCT_LEVELS[24]) + " so each essence provides a " + s(MD.convals.archspiriteffect()) + "% multiplier.";

    //Update Heading
    get("total-spirit-essence").innerHTML = "Total Spirit Essence: " + s(Math.floor(MD.SPIRIT_ESSENCE)) + " (" + s(MD.spiritAvailable()) + " available)";

    //Update table
    for(var i = 0; i < MD.ARCH_ARRAY.length; i++){
        var text = get("res-text-"+i);
        text.innerHTML = s(MD.ARCH_ARRAY[i]) + " (Boosting resource gain by " + s(MD.ARCH_ARRAY[i]*MD.convals.archspiriteffect()) + "%)";
    }

};

MD.spiritAvailable = function(){
    return Math.floor(MD.SPIRIT_ESSENCE)-sumArray(MD.ARCH_ARRAY);
};

MD.addSpirit = function(i){
    var num = MD.multibuyActive() ? Math.min(10,MD.spiritAvailable()) : 1;
    num = (get("spirit-move-amt").value != "" ? Math.min(Number(get("spirit-move-amt").value),MD.spiritAvailable()) : num);

    if(MD.spiritAvailable() > 0){
        MD.ARCH_ARRAY[i] += num;
        MD.updateArchPage();
    }

    MD.updateArchPage();
};

MD.remSpirit = function(i){
    var num = MD.multibuyActive() ? Math.min(10,MD.ARCH_ARRAY[i]) : 1;
    num = (get("spirit-move-amt").value != "" ? Math.min(Number(get("spirit-move-amt").value),MD.ARCH_ARRAY[i]) : num);

    if(MD.ARCH_ARRAY[i] > 0){
        MD.ARCH_ARRAY[i] -= num;
        MD.updateArchPage();
    }

    MD.updateArchPage();
};

MD.resetSpiritMove = function(){
    get("spirit-move-amt").value = "";
};

/*-------------------------------------------------------------------------------------------------
DRAGONS
/------------------------------------------------------------------------------------------------*/
MD.updateDragonButton = function(){
    if(MD.hasConstruct("Dragon Nest")){
        get("dragonButton").style.display = 'inline';
    }
    else{
        get("dragonButton").style.display = 'none';
    }
};

MD.updateDragonPage = function(){
    if(MD.CURRENT_DRAGON > -1){
        MD.setDragonLevelMessage();
        MD.checkDragonUpdate(MD.DRAGONS[MD.CURRENT_DRAGON]); //Check if the dragon has updated

        var dragon = MD.DRAGONS[MD.CURRENT_DRAGON];

        var total = Math.min(n("1Z"),MD.getDragonUpdateCost(dragon)); //Get feed cost
        var one = Math.floor(0.01*total);
        var ten = Math.floor(0.10*total);
        var hundred = Math.floor(total);
        var silly = Math.floor(MD.MAX_DRAGON_LEVEL * 0.05); //5% of max overall

        get("dragon-name").innerHTML = dragon.name + " Dragon";
        get("dragon-description").innerHTML = dragon.description;
        get("dragon-power").innerHTML = dragon.power;

        var upgradePrice = MD.ResClone(dragon.price);
        if(dragon.name == "Master"){
            if(MD.MASTER_DRAGON_PRICE == null)
                upgradePrice = {};
            else
                upgradePrice = MD.MASTER_DRAGON_PRICE;
        }
        else if(dragon.name == "Eternal" && MD.DRAGON_LEVEL >= n("1Z")){
            upgradePrice.gold *= Math.pow((MD.DRAGON_LEVEL / n("1Z")),5);
        }

        if(MD.hasUpgrade("Big Cousins")){
            if(MD.hasUpgrade("Draconic Knowledge"))
                upgradePrice = MD.ResMult(upgradePrice,0.95);
            else
                upgradePrice = MD.ResMult(upgradePrice,0.98);
        }

        //Food Buttons
        get("dragon-1p").innerHTML = ((dragon.name != "Eternal") ? "Feed 1% (" : "Feed a Little (") + MD.ResPrint(MD.ResMult(upgradePrice,one),false,true) + ")";
        $("#dragon-1p").toggleClass("unaffordable", !MD.canAfford(MD.ResMult(upgradePrice,one)));
        get("dragon-10p").innerHTML = ((dragon.name != "Eternal") ? "Feed 10% (" : "Feed More (") + MD.ResPrint(MD.ResMult(upgradePrice,ten),false,true) + ")";
        $("#dragon-10p").toggleClass("unaffordable", !MD.canAfford(MD.ResMult(upgradePrice,ten)));
        get("dragon-100p").innerHTML = ((dragon.name != "Eternal") ? "Feed 100% (" : "Feed a Lot (") + MD.ResPrint(MD.ResMult(upgradePrice,hundred),false,true) + ")";
        $("#dragon-100p").toggleClass("unaffordable", !MD.canAfford(MD.ResMult(upgradePrice,hundred)));

        var lotsBtn = get("dragon-lots");
        $(lotsBtn).toggle(MD.DRAGON_LEVEL >= n("1Z"));
        lotsBtn.innerHTML = "Feed a Silly Amount (" + MD.ResPrint(MD.ResMult(upgradePrice,silly),false,true) + ")";
        $("#dragon-lots").toggleClass("unaffordable", !MD.canAfford(MD.ResMult(upgradePrice,silly)));

        //Toggle area for master dragon
        $("#essence-dragon-area").toggle(false);
        if(dragon.name == "Master"){
            if(MD.MASTER_DRAGON_PRICE == null){
                //Setup Essence Area
                $("#essence-dragon-area").toggle(true);
                var options = ["Fire","Water","Earth","Lightning"];
                var dd = get("dragon-essence-type");

                if(dd.options.length == 0){ //If the box doesn't exist
                    clearSelectBox(dd);
                    for(var i = 0; i < options.length; i++){
                        var opt = document.createElement('option');
                        opt.innerHTML = options[i];
                        opt.value = options[i].toLowerCase();
                        dd.appendChild(opt);
                    }
                }

                $("#feed-dragon-area").toggle(false);
            }
        }

    }
    else{
        if(MD.hasConstruct("Dragon Nest")){
            MD.CURRENT_DRAGON = 0;
        }
    }
};

MD.feedDragon = function(amt){
    var dragon = MD.DRAGONS[MD.CURRENT_DRAGON];

    //String values can also be sent, convert to numbers first
    var total = Math.min(n("1Z"),MD.getDragonUpdateCost(dragon)); //Update cost is infinity for the last dragon, so use a min

    var remaining = (dragon.name == "Eternal" ? Infinity : total-MD.DRAGON_LEVEL);

    amt = (amt == '1P') ? Math.floor(0.01*total) : amt;
    amt = (amt == '10P') ? Math.floor(0.10*total) : amt;
    amt = (amt == '100P') ? Math.floor(total) : amt;
    amt = (amt == 'silly') ? Math.floor(MD.MAX_DRAGON_LEVEL * 0.05) : amt;

    amt = Math.min(remaining,amt); //Don't feed or charge more than the remaining amount

    var price = MD.ResClone(dragon.price);
    if(dragon.name == "Master"){
        if(MD.MASTER_DRAGON_PRICE == null)
            price = {};
        else
            price = MD.MASTER_DRAGON_PRICE;
    }
    else if(dragon.name == "Eternal" && MD.DRAGON_LEVEL >= n("1Z")){
        price.gold *= Math.pow((MD.DRAGON_LEVEL / n("1Z")),5);
    }

    if(MD.hasUpgrade("Big Cousins")){
        if(MD.hasUpgrade("Draconic Knowledge"))
            price = MD.ResMult(price,0.95);
        else
            price = MD.ResMult(price,0.98);
    }

    price = MD.ResMult(price,amt);

    if(MD.canAfford(price)){
        MD.spend(price);
        MD.DRAGON_LEVEL += amt;

        if(MD.DRAGON_LEVEL > MD.MAX_DRAGON_LEVEL)
            MD.MAX_DRAGON_LEVEL = MD.DRAGON_LEVEL;
    }

    MD.setDragonLevelMessage();

    //Update dragon sacrificed dialog in case it is open
    get("dragonleveldisplay").innerHTML = "Dragon Level: " + s(MD.DRAGON_LEVEL) + " (Worth " + s(MD.getSpiritValue()) + " Spirit Essence)";

    MD.checkDragonUpdate(dragon);

    MD.updateDragonPage();
};

MD.checkDragonUpdate = function(dragon){
    if(dragon.name == "Master" && MD.MASTER_DRAGON_PRICE == null){
        return;
    }

    if(MD.DRAGON_LEVEL >= MD.getDragonUpdateCost(dragon)){
        var newDragon = -1;
        if(dragon.name != "Master"){
            newDragon = dragon.progressions[0];
        }
        else{ //Check price to see which kind of dragon we're dealing with
            if(MD.MASTER_DRAGON_PRICE.fire != undefined)
                newDragon = 7;
            else if(MD.MASTER_DRAGON_PRICE.water != undefined)
                newDragon = 10;
            else if(MD.MASTER_DRAGON_PRICE.earth != undefined)
                newDragon = 13;
            else
                newDragon = 16;
        }

        if(MD.DRAGONS[newDragon].unlock_condition()){
            MD.CURRENT_DRAGON = newDragon;
            MD.MASTER_DRAGON_PRICE = null; //Reset this
            MD.DRAGONS_OWNED[newDragon] = true;
            MD.setDragonLevelMessage();

            $("#sacDragonButton").toggleClass("unaffordable",!MD.hasDragon("Novice"));
        }
        else{
            get("dragon-level").innerHTML = "Your dragon is ready to progress, but you have not fulfilled the requirements for the next dragon!";
            MD.DRAGONS_OWNED[0] = true;
        }

    }
}

MD.setDragonLevelMessage = function(){
    if(MD.CURRENT_DRAGON != -1 && MD.DRAGONS[MD.CURRENT_DRAGON].name == "Eternal")
        get("dragon-level").innerHTML = "Your dragon is level " + s(MD.DRAGON_LEVEL) + ". It has reached the final stage, you can keep feeding it to increase its value however!"
    else
        get("dragon-level").innerHTML = "Your dragon is level " + s(MD.DRAGON_LEVEL) + ". They grow up so fast!"
};

MD.getDragonUpdateCost = function(dragon){
    if(dragon.name == "Eternal"){
        return Infinity; //Max level
    }

    var child = dragon.progressions[0];
    return MD.DRAGONS[child].base_essence;
};

MD.hasDragon = function(name){
    for(var i = 0; i < MD.DRAGONS.length; i++){
        if(MD.DRAGONS[i].name == name){
            return MD.DRAGONS_OWNED[i];
        }
    }
};

MD.activeDragon = function(name){
    if(MD.CURRENT_DRAGON == -1){
        return false;
    }
    return MD.DRAGONS[MD.CURRENT_DRAGON].name == name;
};

//For master dragon
MD.selectEssenceType = function(){
    var type = get("dragon-essence-type").value;

    MD.MASTER_DRAGON_PRICE = {};
    MD.MASTER_DRAGON_PRICE[type] = 0.00005;

    $("#essence-dragon-area").toggle(false);
    $("#feed-dragon-area").toggle(true);

    MD.updateDragonPage();
};

MD.getSpiritValue = function(){
    var val = Math.pow(MD.DRAGON_LEVEL/n("10M"),1/3);
    val *= (MD.hasUpgrade("Spirit Overcharge") ? 2 : 1);
    val *= (MD.hasUpgrade("Ancestral Might") ? Math.max(1,Math.log(MD.MAX_DRAGON_LEVEL / n("100Y"))) : 1);
    return val;
};

//Feeds the dragon as much as possible, and then sacrifices it
MD.autoSacrifice = function(auto){
    auto = setDefault(auto,false);
    if(MD.MAGES < 13){
        return;
    }

    MD.MAGES -= 13;

    var original = MD.CURRENT_DRAGON;
    var dragon = MD.DRAGONS[MD.CURRENT_DRAGON];
    
    //While we can afford to feed the dragon
    while(MD.canAfford(dragon.price)){
        var affordable = MD.ResAffordable(dragon.price);

        //If we are at the eternal dragon, cap it
        if(affordable > n("9E") && dragon.name == "Eternal")
            affordable = n("9E"); //This cap will bring the dragon to the point where sacrifice provides 10K spirit essence

        MD.feedDragon(affordable); //Note that feedDragon will not allow overfeeding, so this call works fine

        //Leave the loop if we didn't reach the next dragon level (not enough food or condition not met)
        if(original == MD.CURRENT_DRAGON){
            break;
        }

        //Get new dragon
        dragon = MD.DRAGONS[MD.CURRENT_DRAGON];
        original = MD.CURRENT_DRAGON;

        //Account for master dragon by selecting a random essence
        if(dragon.name == "Master"){
            var types = ["fire","earth","lightning","water"];
            get("dragon-essence-type").value = types[getRandom(0,3)];
            MD.selectEssenceType();
        }
    }

    MD.sacrificeDragon(true,auto);
    MD.setDragonLevelMessage();
};

MD.toggleAutoSacrifice = function(v){
    MD.AUTO_RIFT = (v == undefined) ? !MD.AUTO_RIFT : v;

    get("auto-auto-btn").innerHTML = "Auto-Auto Rift: " + (MD.AUTO_RIFT ? "On" : "Off");
};

MD.processAutoSacrifice = function(){
    if(MD.AUTO_RIFT){
        MD.autoSacrifice(true);
    }
}

MD.sacrificeDragon = function(auto,auto_auto){
    auto = setDefault(auto,false);
    auto_auto = setDefault(auto_auto,false);
    if(MD.hasDragon("Novice")){ //Requires novice or higher
        var r = (auto ? true : confirm("Are you sure? Your dragon will be converted to spirit essence and you will have to raise it again from an egg. Sacrificing dragons will also cause blind revenge to auto-attack faster."));
        if(r == true){
            MD.DRAGONS_SACRIFICED++;
            MD.changeSpiritEssence(MD.getSpiritValue());
            MD.DRAGON_LEVEL = 0;
            MD.CURRENT_DRAGON = 0;
            MD.DRAGONS_OWNED = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            MD.MASTER_DRAGON_PRICE = null;

            if(!auto_auto){
                MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(23));
            }

            MD.updateDragonPage();

            //Reset essence dragon area
            $("#essence-dragon-area").toggle(false);
            $("#feed-dragon-area").toggle(true);
        }
    }
    else{
        MDART.notify("Your dragon is not old enough to enter the portal!");
    }
}

/*-------------------------------------------------------------------------------------------------
INDUSTRY
/------------------------------------------------------------------------------------------------*/
MD.updateIndustryButton = function(){
    //Display Button
    if(MD.hasUpgrade("Precious Resources")){
        get("indButton").style.display = 'inline';
    }
    else{
        get("indButton").style.display = 'none';
    }

    //Swap button
    if(MD.hasUpgrade("Builder's Regret")){
        get("industry-move-btn").style.display = 'inline';
    }
    else{
        get("industry-move-btn").style.display = 'none';
    }
};

MD.processIndustry = function(){
    //See if there is dirt to be filled
    for(var i = 0; i < MD.CONSTRUCTION_STATUS.length; i++){
        if(MD.CONSTRUCTION_STATUS[i] == null)
            continue;
        if(MD.CONSTRUCTION_STATUS[i] < MDART.PIXELS_PER_PLOT){
            var amt = (MD.hasUpgrade("Rush Job") ? Math.max(1,Math.round(MD.MASONS/100)) : 1)
                while(amt--){
                if(MD.canAfford(MD.COST_PER_PIXEL)){
                    MD.INDUSTRY_WORKING = true;
                    MD.spend(MD.COST_PER_PIXEL);
                    MD.CONSTRUCTION_STATUS[i]++;
                    MDART.drawDirtOnPlot(i,MD.CONSTRUCTION_STATUS[i],false,0);

                    if(MD.CONSTRUCTION_STATUS[i] == MDART.PIXELS_PER_PLOT){
                        MD.INDUSTRY_WORKING = false; //Finished
                        break;
                    }
                }
            }
            continue;
        }
        else if(MD.CONSTRUCTION_STATUS[i] == MDART.PIXELS_PER_PLOT){
            continue;
        }
        else if(MD.CONSTRUCTION_STATUS[i] < MDART.PIXELS_PER_PLOT*2){
            var amt = (MD.hasUpgrade("Rush Job") ? Math.max(1,Math.round(MD.MASONS/100)) : 1);
            while(amt--){
                MD.INDUSTRY_WORKING = true;
                MD.CONSTRUCTION_STATUS[i]++;
                MDART.drawDirtOnPlot(i,MD.CONSTRUCTION_STATUS[i]-MDART.PIXELS_PER_PLOT,false,1);

                if(MD.CONSTRUCTION_STATUS[i] == MDART.PIXELS_PER_PLOT*2){
                    break;
                }
            }
        }
        else if(MD.CONSTRUCTION_STATUS[i] == MDART.PIXELS_PER_PLOT*2){
            MD.INDUSTRY_WORKING = false;
            MD.CONSTRUCTION_STATUS[i]++;
            MDART.drawConstructs();
        }
        else if(MD.CONSTRUCTION_STATUS[i] == MDART.PIXELS_PER_PLOT*2+1){
            MD.performConstructAction(MD.CONSTRUCT_LOCATIONS[i]);
        }
    }
}

MD.performConstructAction = function(p){
    switch(p){
        case 0: //Auto Smithy
            for(var i = 0; i < MD.AUTO_SMITH_GEM; i++){
                var min = (MD.AUTO_SMITH_LIMIT == null ? 0 : MD.AUTO_SMITH_LIMIT);
                MD.combineGem(i,MD.getSmithyPower(),false,min);
            }
            break;
        case 1: //Quarry
            var amt = MD.HIRELINGS_OWNED[6] * (MD.hasUpgrade("Birth of a World") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Rock Out") ? MD.uv.level2mult : 1);
            if(MD.hasUpgrade("Machine and Myth")){
                amt *= (Math.max(4,Math.pow(MD.HIRELINGS_OWNED[7],0.4))/4);
            }
            if(MD.activeDragon("Egg")){
                amt *= 2;
            }
            MD.changeStone(amt);

            if(MD.hasUpgrade("Deep Mining")){

                var ironMult = MD.HIRELINGS_OWNED[6]/2000 * (MD.hasUpgrade("Iron Affinity") ? MD.uv.level1mult : 1);
                MD.changeIron(ironMult);
                if(tryPercentChance(10)){
                    var coalMult = MD.HIRELINGS_OWNED[6]/10000 * (MD.hasUpgrade("Dirty Hands") ? MD.uv.level1mult : 1);
                    MD.changeCoal(coalMult);
                }
            }

            var chance = MD.convals.quarryFindChance * (MD.hasUpgrade("Miner Productivity") ? MD.CLICKS_THIS_TICK+1 : 1);
            if(tryPercentChance(chance)){
                MDART.notify("Something has been discovered in your quarry!")
                get("quarry-discovery").style.display = 'inline';
            }

            //Check for auto-discovery quarry every 30 seconds
            if(MD.hasUpgrade("Ghosts of Quarry Future") && get("quarry-discovery").style.display == 'inline' && MD.TICKS % 30 == 0){
                MD.findQuarryReward();
            }

            break;
        case 3: //Mage Tower
            var mult = (MD.hasUpgrade("Studiosity") ? MD.uv.level1mult : 1)  * (MD.hasUpgrade("Age of Wonders") ? MD.uv.level2mult : 1);
            MD.MAGE_TOWER_RESEARCH += MD.convals.magetower_gain*mult*MD.MAGES;

            get("mage-tower-research").innerHTML = "Mage Wisdom Level: " + s(MD.MAGE_TOWER_RESEARCH);
            get("wisdom-mult").innerHTML = "Meditation Multiplier: " + s(MD.getMageTowerMult());
            break;
        case 4: //Regal Statue
            var remaining = MD.TICKS % 600; //The tax collectors return every 10 minutes
            if(remaining == 0){
                MD.getStatueReward(MD.CONSTRUCT_LEVELS[p]);
            }
            get("statue-return-timer").innerHTML = "Tax collectors return in " + getTime(600-remaining) + ".";
            break;
        case 5: //Smelting Pit
            var amt = MD.getPitProduction();
            var price = MD.getPitPrice();
            if(MD.canAfford(price) && MD.PIT_SMELTING){
                MD.spend(price);
                MD.GOBLINS_SACRIFIED += price.goblin;
                MD.changeSteel(amt);

                //Check for adamantium
                if(MD.hasUpgrade("Heavy Smelting")){
                    var amt = 1 + ((MD.hasUpgrade("Energy of Earth") && MD.DIRT_TO_MANA > 0) ? Math.pow(MD.DIRT_TO_MANA*2,1/2) : 0)
                    get("pit-addy-amt").innerHTML = "Your smelting pit has a chance of producting " + s(amt) + " adamantium.";
                    if(tryPercentChance(MD.convals.smeltAddyChance)){
                        if(MD.canAfford(MD.convals.smeltAddyCost)){
                            MD.changeAdamantium(amt);
                            MD.spend(MD.convals.smeltAddyCost);
                            MD.GOBLINS_SACRIFIED += MD.convals.smeltAddyCost.goblin;
                        }
                    }
                }
            }
            break;
        case 6: //Market
            MD.MARKET_TIMER--;
            if(MD.MARKET_TIMER <= 0){
                //Randomize the amounts
                MD.CURRENT_RATES = [];
                for(var i = 0; i < MD.EXCHANGE_RATES.length; i++){
                    MD.CURRENT_RATES.push(MD.getMarketRate());
                }

                //Restart the timer
                MD.startMarketTimer();
            }

            //Refresh every second if need be
            MD.refreshMarket();
            break;
        case 7: //Habitation
            if(MD.POPULATION <= MD.FOOD){
                var foodcost = MD.POPULATION / (MD.hasUpgrade("Green Revolution") ? 2 : 1);
                MD.changeFood(-foodcost);

                var births = Math.max(1,Math.round(MD.getPopulationMax()/3600)); //Minimum growth rate is 1/3600th of total
                births *= (MD.hasUpgrade("On and On") ? 2 : 1);
                births *= (MD.hasUpgrade("Baby Bonuses") ? 2 : 1);
                births *= (MD.hasUpgrade("Green Revolution") ? 2 : 1);
                births *= (MD.hasUpgrade("First Steps") ? 1.5 : 1);
                var growth = Math.min(births,MD.getPopulationMax()-MD.getPopulation(),MD.FOOD); //See how many people we can add
                MD.changePopulation(growth);
            }
            else{
                MD.changePopulation(-Math.max(1,Math.floor(MD.POPULATION/100))); //Kill citizen
                MD.changeFood(-MD.FOOD)
                get("hab-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getLinearUpgradeCost(p));
                MDART.notify("Some of your citizens have starved to death!");
            }
            get("population-txt").innerHTML = "Population: " + s(MD.getPopulation()) + " out of " + s(MD.getPopulationMax());
            break;
        case 8: //Farm
        case 12:
        case 13:
            if(MD.TICKS % MD.convals.farmtime1 == 0){
                MD.changeFood(MD.getFarmProduction(p));
                if(p == 12)
                    MD.changeFlax(1*Math.ceil((MD.CONSTRUCT_LEVELS[p]+1)/10));
                else if(p == 13)
                    MD.changeFlax(3*Math.ceil((MD.CONSTRUCT_LEVELS[p]+1)/10));
            }
            break;
        case 9: //Barracks
            break;
        case 10: //University
            break;
        case 11: //Blacksmith
            break;
        case 14: //Fletcher
            break;
        case 15: //Fire Shrine
            if(MD.TICKS % (MD.hasUpgrade("World of Flame") ? 30 : 60) == 0){ //Give fire essence every 10 minutes
                var amt = (MD.CONSTRUCT_LEVELS[p]+1)/10;
                amt *= (MD.activeDragon("Fire") ? 2 : 1);
                amt *= (MD.activeDragon("Blazing") || MD.activeDragon("Eternal") ? 4 : 1);
                amt *= (MD.activeDragon("Inferno") ? 8 : 1);
                MD.changeFireEssence(amt);
            };
            break;
        case 16: //Admin building
            MD.ADMIN_TIME++;

            var empty = true;
            for(var r in MD.ADMIN_ARRAY){
                empty = false;
                break; //If we find one element, it isn't empty
            }
            
            if(empty){
                MD.createAdminDialog();
            }
            else if(MD.TICKS % 10 === 0){
                MD.updateAdminDialog();
            }
            break;
        case 17: //Water Shrine
            if(MD.TICKS % (MD.hasUpgrade("World of Water") ? 30 : 60) == 0){ //Give water essence every 10 minutes
                var amt = (MD.CONSTRUCT_LEVELS[p]+1)/10;
                amt *= (MD.activeDragon("Water") ? 2 : 1);
                amt *= (MD.activeDragon("Aquatic") || MD.activeDragon("Eternal") ? 4 : 1);
                amt *= (MD.activeDragon("Torrential") ? 8 : 1);
                MD.changeWaterEssence(amt);
            };
            break;
        case 18: //Machinist
            //Try auto construction
            amt = MD.getAutoBuildAmount();
            if(MD.MACHINIST_AUTO[0])
                MD.buildMage(amt);
            if(MD.MACHINIST_AUTO[1])
                MD.buildCraftsman(amt);
            if(MD.MACHINIST_AUTO[2])
                MD.buildAlchemist(amt);
            break;
        case 19: //Earth Shrine
            if(MD.TICKS % (MD.hasUpgrade("World of Earth") ? 30 : 60) == 0){ //Give earth essence every 10 minutes
                var amt = (MD.CONSTRUCT_LEVELS[p]+1)/10;
                amt *= (MD.activeDragon("Earth") ? 2 : 1);
                amt *= (MD.activeDragon("Terrene") || MD.activeDragon("Eternal") ? 4 : 1);
                amt *= (MD.activeDragon("Terrestrial") ? 8 : 1);
                MD.changeEarthEssence(amt);
            };
            break;
        case 20: //Graveyard
            break;
        case 21: //Lightning Shrine
            if(MD.TICKS % (MD.hasUpgrade("World of Lightning") ? 30 : 60) == 0){ //Give lightning essence every 10 minutes
                var amt = (MD.CONSTRUCT_LEVELS[p]+1)/10;
                amt *= (MD.activeDragon("Lightning") ? 2 : 1);
                amt *= (MD.activeDragon("Electric") || MD.activeDragon("Eternal") ? 4 : 1);
                amt *= (MD.activeDragon("Thundering") ? 8 : 1);
                MD.changeLightningEssence(amt);
            };
            break;
        case 22: //Dragon Nest
            break;
    }
};

MD.clickPlot = function(p){
    //Check if something has been built
    if(MD.CONSTRUCT_LOCATIONS[p] != null && MD.CONSTRUCTION_STATUS[p] == MDART.PIXELS_PER_PLOT*2+1){
        MD.openConstructDialog(p);
        return;
    }

    //Set buttons
    if(MD.INDUSTRY_WORKING){
        $('#busy-dialog').dialog('open');
    }
    else if(MD.CONSTRUCTION_STATUS[p] == undefined || MD.CONSTRUCTION_STATUS[p] < MDART.PIXELS_PER_PLOT){
        var fillBtn = $("#start-prep-land-btn");
        fillBtn.unbind(); //Remove previous click functions
        fillBtn.click(function(i){return function(){MD.startFilling(p)}}(p));
        $('#prep-land-dialog').dialog('open');
    }
    else{
        var startBtn = $("#start-construction-btn");
        startBtn.unbind(); //Remove previous click functions
        startBtn.click(function(i){return function(){MD.startBuilding(p)}}(p));

        var available = [];
        for(var i = 0; i < MD.CONSTRUCTS.length; i++){
            if(MD.CONSTRUCTS[i].unlock_function() && MD.CONSTRUCT_LOCATIONS.indexOf(i) == -1){
                available.push(i);
            }
        }

        var dd = get("construction-select");
        clearSelectBox(dd);
        if(available.length == 0){
            var opt = document.createElement('option');
            opt.innerHTML = "None Available";
            opt.value = "None Available";
            dd.appendChild(opt)
        }

        for(i = 0; i < available.length; i++){
            var opt = document.createElement('option');
            opt.innerHTML = MD.CONSTRUCTS[available[i]].name + " (" + MD.ResPrint(MD.CONSTRUCTS[available[i]].cost,true) + ")";
            opt.value = available[i];
            dd.appendChild(opt)
        }

        $('#start-construction-dialog').dialog('open');
    }
};

MD.openConstructDialog = function(p){
    p = MD.CONSTRUCT_LOCATIONS[p];
    switch(p){
        case 0: //Auto Smithy
            //Fill Dropdown
            var dd = get("auto-smith-select");
            clearSelectBox(dd);

            var opt = document.createElement('option');
            opt.innerHTML = "None";
            opt.value = "None";
            dd.appendChild(opt)
            for(var i = 0; i < MD.GEM_OBJECTS.length; i++){
                var opt = document.createElement('option');
                opt.innerHTML = MD.GEM_OBJECTS[i].name;
                opt.value = i;
                dd.appendChild(opt)            
            }

            dd.value = MD.AUTO_SMITH_GEM;

            //Deal with auto-smithy level
            get("auto-smith-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            get("auto-smith-power").innerHTML = "Smithy Power: " + s(MD.getSmithyPower()) + " gems per second";
            
            if(MD.TOTAL_STONE > 0){
                get("auto-smith-upgrades").style.display = "inline";
            }
            else{
                get("auto-smith-upgrades").style.display = "none";   
            }

            //Deal with limit
            $("#limit-speed").toggle(MD.hasUpgrade("Industrial Brakes")); //Hide if the upgrade isn't owned
            var startVal = (MD.AUTO_SMITH_LIMIT == null || MD.AUTO_SMITH_LIMIT == 0 ? "" : MD.AUTO_SMITH_LIMIT);
            get("auto-smith-limit-amt").value = startVal;
            get("auto-smith-limit").innerHTML = (MD.AUTO_SMITH_LIMIT == null || MD.AUTO_SMITH_LIMIT == 0 ? "Minimum Gem Stockpile: None" : "Minimum Gem Stockpile: " + String(MD.AUTO_SMITH_LIMIT))
            break;
        case 1: //Quarry
            break;
        case 2: //Dragonmount
            get("dragon-mount-desc").innerHTML = MD.convals.dragonmount_text[MD.getDragonmountStage()];
            get("dragon-mount-power").innerHTML = "Wyvern Boost: " + s(MD.convals.dragonmount_function(MD.CONSTRUCT_LEVELS[p])) + " times gold per second.";
            var price = MD.getConstructUpgradeCost(p);
            get("dragon-mount-btn").innerHTML = "Pile it on! (" + MD.ResPrint(price) + ")";
            break;
        case 4: //Regal statue
            get("statue-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            break;
        case 5: //Smelting Pit
            get("pit-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            var amt = MD.getPitProduction();
            if(MD.PIT_SMELTING){
                get("pit-rate").innerHTML = "Smelting " + s(amt) + " steel per second at a cost of " + MD.ResPrint(MD.getPitPrice()) + ".";
                get("pit-toggle-btn").innerHTML = "Stop Smelting!";
            }
            else{
               get("pit-rate").innerHTML = "Not smelting.";
               get("pit-toggle-btn").innerHTML = "Start Smelting!";
            }
        
            break;
        case 6: //Market
            MD.MARKET_DIALOG_OPEN = true;
            MD.refreshMarket();
            break;
        case 7: //Habitation
            get("population-txt").innerHTML = "Population: " + s(MD.getPopulation()) + " out of " + s(MD.getPopulationMax());
            MD.habitationInputChange();
            break;
        case 8: //Farm
        case 12:
        case 13:
            get("farm-txt"+p).innerHTML = "Harvest Data: " + s(MD.getFarmProduction(p)*MD.getResMult("Raw Materials")) + " food every " + MD.convals.farmtime1 + " seconds (" + s((MD.getFarmProduction(p)*MD.getResMult("Raw Materials"))/MD.convals.farmtime1) + " per second)";
            get("farm-upgrade-cost"+p).innerHTML = MD.ResPrint(MD.getConstructUpgradeCost(p));
            break;
        case 9: //Barracks
            break; //Barracks stuff is all handled on the military screen
        case 10: //University
            get("uni-level").innerHTML = "Education Level: " + s(MD.CONSTRUCT_LEVELS[p]);
            get("scholar-amt").value = MD.getPopulation();
            get("uni-market").innerHTML = (MD.hasUpgrade("Ghosts of Economic Prowess") ? "Average Market Boost: " + s(MD.uv.marketscholarincrease()) : "");
            get("uni-essence").innerHTML = (MD.hasUpgrade("Collective Knowledge") ? "Essence Multiplier: " + s(Math.pow(MD.CONSTRUCT_LEVELS[10],0.33)/200) : "");
            break;
        case 11: //Blacksmith
            get("weapon-upgrade-btn").innerHTML = "Hone Weapons (" + MD.ResPrint(MD.getConstructUpgradeCost(p)) + ")";
            get("army-weaken-btn").innerHTML = "Bomb Enemies (" + MD.ResPrint(MD.convals.blacksmith_formula(MD.GOBLIN_LEVEL,MD.SPIDER_LEVEL)) + ")";
            break;
        case 14: //Fletcher
            get("fletcher-upgrade-cost").innerHTML = "Train Hunters (" + MD.ResPrint(MD.getConstructUpgradeCost(p)) + ")";
            break;
        case 15: //Fire Shrine
            get("fireshrine-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            MD.updateFireEssenceDisplay();
            break;
        case 16: //Admin building
            get("admin-range").value = MD.ADMIN_RANGE;
            get("admin-display").value = MD.DISPLAYED_TIME;
            break;
        case 17: //Water Shrine
            get("watershrine-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            MD.updateWaterEssenceDisplay();
            break;
        case 18: //Machinist
            break;
        case 19:
            get("earthshrine-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            MD.updateEarthEssenceDisplay();
            break;
        case 20:
            get("grave-effect").innerHTML = "Your army strength is increased by " + s(MD.convals.graveyardbonus()) + "% by memories of fallen comrades.";
            $("#blind-revenge-btn").toggle(MD.hasUpgrade("Blind Revenge"));
            break;
        case 21:
            get("lightshrine-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(MD.getConstructUpgradeCost(p));
            MD.updateLightningEssenceDisplay();
            break;
        case 22:
            break;
        case 23:
            get("dragonleveldisplay").innerHTML = "Dragon Level: " + s(MD.DRAGON_LEVEL) + " (Worth " + s(MD.getSpiritValue()) + " Spirit Essence)";
            $("#sacDragonButton").toggleClass("unaffordable",!MD.hasDragon("Novice"));

            //Auto-Rift 9000
            var sacButton = $("#auto-sacrifice-btn");
            if(MD.hasUpgrade("Auto-Rift 9000")){
                sacButton.toggle(true);
                sacButton.toggleClass("unaffordable",MD.MAGES < 13);
            }
            else{
                sacButton.toggle(false);
            }

            $("#auto-auto-btn").toggle(MD.hasUpgrade("Auto-Auto-Rift 9000"));

            MD.updateSpiritEssenceDisplay();
            break;
        case 24:
            break;
        }

    $('#construct-dialog-' + p).dialog('open');
    return;
};

MD.increaseConstructLevel = function(p){
    var num = 1; //How many to buy
    var price = MD.getConstructUpgradeCost(p);

    //Spend
    while(MD.canAfford(price) && num > 0){
        MD.spend(price);
        MD.CONSTRUCT_LEVELS[p]++;

        num--;
    }

    //Update the title
    if(p != 7){
        $("#construct-dialog-"+p).dialog("option","title",MD.CONSTRUCTS[p].name + " - Level " + s(MD.CONSTRUCT_LEVELS[p]));
    }

    if(p != 9 && p != 24){ //The barracks is not upgraded from the dialog
        MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(p)); //Refresh the dialog
    }
    else if(p != 24){
        MD.updateMilitaryPage();
    }
    else{
        MD.updateArchPage();
    }

    if(MD.CONSTRUCTS[p].image.length > 1){ //Redraw if there are multiple images
        MDART.drawConstructs();
    }
};

//Returns the total cost in steel to upgrade from a to b
MD.getHabitationSum = function(a,b){
    var price = ((b*b - a*a)+(b-a))*500; //500 = 1000/2
    return {steel:price};
};

MD.addPopulation = function(){
    var val = Number(get("pop-amt").value);
    if(val > 0){
        val = Math.min(val,MD.getMaxHabitationIncrease());
        var price = MD.getHabitationSum(MD.CONSTRUCT_LEVELS[7],MD.CONSTRUCT_LEVELS[7]+val);
        MD.spend(price);

        //Dealing with high values can result in precision problems, make sure steel stays positive
        MD.STEEL = Math.max(0,MD.STEEL);

        MD.CONSTRUCT_LEVELS[7] += val;
        MD.changePopulation(val);
        MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(7));
        $("#construct-dialog-7").dialog("option","title",MD.CONSTRUCTS[7].name + " - Level " + s(MD.CONSTRUCT_LEVELS[7],true));
    }
};

MD.getMaxHabitationIncrease = function(){
    //Get the initial price, and the amount of steel
    var price = MD.getLinearUpgradeCost(7);
    price = price.steel - 1000;
    var steel = MD.RESOURCES["steel"].amount_function();

    //Using the quadratic formula, get the number of upgrades
    var num = Math.floor((-price + Math.sqrt(price*price + 4*500*steel))/(2*500))
    return num;
};

MD.habitationInputChange = function(){
    var val = Number(get("pop-amt").value);
    var price = MD.getHabitationSum(MD.CONSTRUCT_LEVELS[7],MD.CONSTRUCT_LEVELS[7]+val);
    get("hab-upgrade-cost").innerHTML = "Upgrade Cost: " + MD.ResPrint(price);
};

MD.exilePopulation = function(){
    var val = Number(get("exile-amt").value);
    if(val > 0){
        r = confirm("Are you sure you want to exile " + String(val) + " citizens? You will not receive a refund on construction costs!");
        if(r == true){
            val = Math.min(val,MD.CONSTRUCT_LEVELS[7]);
            MD.CONSTRUCT_LEVELS[7] -= val;
            if(MD.POPULATION >= val){
                MD.changePopulation(-val);
            }
            else{
                MD.changePopulation(-MD.POPULATION);
            }

            MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(7));
        }
    }
}

MD.startFilling = function(p){
    MD.CONSTRUCTION_STATUS[p] = 0;
    MD.INDUSTRY_WORKING = true;
    $('#prep-land-dialog').dialog('close');
};

MD.startBuilding = function(p){
    var building = get("construction-select").value;

    if(building == "None Available"){
        $('#start-construction-dialog').dialog('close');
        return;
    }

    building = Number(building);

    //Set that we are building it
    if(MD.canAfford(MD.CONSTRUCTS[building].cost)){
        MD.spend(MD.CONSTRUCTS[building].cost);
        MD.CONSTRUCT_LOCATIONS[p] = building;
        MD.CONSTRUCTION_STATUS[p] = MDART.PIXELS_PER_PLOT+1;
        MD.INDUSTRY_WORKING = true;
    }
    else{
        MDART.notify("Too expensive!")
    }

    $('#start-construction-dialog').dialog('close');
};

//Used to check for new constructs
MD.initializeConstructUnlocked = function(){
    for(var i = 0; i < MD.CONSTRUCTS.length; i++){
        MD.CONSTRUCT_UNLOCKED[i] = MD.CONSTRUCTS[i].unlock_function();
    }
};

MD.checkConstructs = function(){
    for(var i = 0; i < MD.CONSTRUCTS.length; i++){
        if(!MD.CONSTRUCT_UNLOCKED[i] && MD.CONSTRUCTION_STATUS[i] == null && MD.CONSTRUCTS[i].unlock_function()){
            MD.CONSTRUCT_UNLOCKED[i] = true;
            MDART.alertBtn("indButton");
        }
    }
}

MD.openMoveBuildingDialog = function(){
    MD.MOVE_DIALOG_OPEN = true;
    MD.MOVE_BUILDING_1 = null;
    MD.MOVE_BUILDING_2 = null;
    get("swap-building-1").innerHTML = "Building 1: None";
    get("swap-building-2").innerHTML = "Building 2: None";

    var price = {neurochrysalis:5};
    $("#perform-swap").toggleClass("unaffordable",!MD.canAfford(price));

    $('#move-construct-dialog').dialog('open');
};

MD.performBuildingMove = function(){
    //Perform the move
    var first = MD.MOVE_BUILDING_1;
    var second = MD.MOVE_BUILDING_2;
    if(first !== null && second !== null){
        var price = {"neurochrysalis":5};
        if(MD.canAfford(price)){
            MD.spend(price);
            swapArray(MD.CONSTRUCT_LOCATIONS,first,second);
            swapArray(MD.CONSTRUCTION_STATUS,first,second);
            MDART.updateIndustryCanvas();
        }
        else{
            MDART.notify("Too expensive!");
        }
    }

    //Reset variables
    MD.MOVE_DIALOG_OPEN = false;
    MD.MOVE_BUILDING_1 = null;
    MD.MOVE_BUILDING_2 = null;
    get("swap-building-1").innerHTML = "Building 1: None";
    get("swap-building-2").innerHTML = "Building 2: None";

    $('#move-construct-dialog').dialog('close');
};

MD.hasConstruct = function(name){
    for(var i = 0; i < MD.CONSTRUCTS.length; i++){
        if(MD.CONSTRUCTS[i].name === name){
            if(MD.CONSTRUCT_LOCATIONS.indexOf(i) != null){
                if(MD.CONSTRUCTION_STATUS[MD.CONSTRUCT_LOCATIONS.indexOf(i)] == MDART.PIXELS_PER_PLOT*2+1){
                    return true;
                }
            }
        }
    }
    return false;
}

//Used to fill in industry when loading a save
MD.fillExistingIndustry = function(){
    for(var i = 0; i < MD.CONSTRUCTION_STATUS.length; i++){
        if(MD.CONSTRUCTION_STATUS[i] == null)
            continue;
        if(MD.CONSTRUCTION_STATUS[i] != null && MD.CONSTRUCTION_STATUS[i] <= MDART.PIXELS_PER_PLOT){
            MDART.drawDirtOnPlot(i,MD.CONSTRUCTION_STATUS[i],true,0);
        }
        if(MD.CONSTRUCTION_STATUS[i] > MDART.PIXELS_PER_PLOT){
            MDART.drawDirtOnPlot(i,MDART.PIXELS_PER_PLOT,true,0); //Draw dirt
            MDART.drawDirtOnPlot(i,MD.CONSTRUCTION_STATUS[i]-MDART.PIXELS_PER_PLOT,true,1);
        }
    }
    MDART.drawConstructs();
};

MD.getConstructUpgradeCost = function(p){
    var cost = MD.ResMult(MD.CONSTRUCTS[p].upgrade_cost,Math.pow(MD.PRICE_MULTIPLIER,MD.CONSTRUCT_LEVELS[p]));

    if(p==9 && MD.hasUpgrade("Grasshopper")){
        cost = MD.ResMult(cost,0.1);
    }

    return cost;
}

//Some constructs increase cost linearly - this determines their upgrade cost
MD.getLinearUpgradeCost = function(p){
    return MD.ResMult(MD.CONSTRUCTS[p].upgrade_cost,MD.CONSTRUCT_LEVELS[p]+1);
};

//Construct specific
MD.getSmithyPower = function(){
    var lvl = (10+MD.CONSTRUCT_LEVELS[0]*10);
    lvl = lvl * (MD.hasUpgrade("Mechanical Overload") ? MD.uv.overloadmult1 : 1);
    lvl = lvl * (MD.hasUpgrade("Mechanical Supercharge") ? MD.uv.overloadmult2 : 1);
    return lvl;
};

MD.setAutoSmithLimit = function(){
    var amt = get("auto-smith-limit-amt").value;
    if(amt >= 0){
        MD.AUTO_SMITH_LIMIT = Number(amt);
    }
    MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(0));
};

MD.setAutoSmithGem = function(){
    var gem = get("auto-smith-select").value;

    if(gem == "None"){
        MD.AUTO_SMITH_GEM = 0;
    }
    else{
        MD.AUTO_SMITH_GEM = Number(gem);
    }
    $('#construct-dialog-0').dialog('close');
};

//Returns a value indicating which "level" the dragonmount is on, in order to decide which iamge to show
MD.getDragonmountStage = function(){
    for(var i = 1; i < MD.convals.dragonmount_levels.length; i++){
        if(MD.CONSTRUCT_LEVELS[2] < MD.convals.dragonmount_levels[i])
            return i-1;
    }
    return MD.convals.dragonmount_levels.length-1;
};

MD.getMageTowerMult = function(){
    return 1 + Math.pow(MD.MAGE_TOWER_RESEARCH/10000,2.7);
};

MD.findQuarryReward = function(){

    get("quarry-discovery").style.display = 'none';

    var totalGems = Math.round(sumArray(MD.GEMS));
    var gems = Math.min(getRandom(totalGems/200,totalGems/100),MD.getStatueGemAmount(MD.CONSTRUCT_LEVELS[4])); //Don't give more that one statue reward worth
    var chanceReduction = 0; //Expert Consulting improves the chance of better finds
    if(MD.hasUpgrade("Expert Consulting")){
        gems *= MD.uv.quarryrewardmult();
        chanceReduction = Math.min(Math.floor(MD.uv.quarryrewardmult()),15); //Max reduction of 15
    }

    var chance = getRandom(1,100);
    if(chance < 50-chanceReduction){
        MD.changeGems(8,gems);
        get("quarry-discovery-text").innerHTML = "You found " + s(gems) + " perfect gems!"
    }
    else if(chance < 90-chanceReduction && MD.TOTAL_ADAMANTIUM > 0){
        var amt = Math.min(Math.max(1,Math.sqrt(MD.ADAMANTIUM*3)),n("1G"));
        MD.changeAdamantium(amt);
        get("quarry-discovery-text").innerHTML = "You have found " + s(amt) + " pieces of adamantium!" 
    }
    else if(chance < 96-chanceReduction){
        MD.changeGems(9,gems);
        get("quarry-discovery-text").innerHTML = "You found " + s(gems) + " majestic gems!"        
    }
    else{
        MD.ALCHEMISTS++;
        MD.setAlchemistButton();
        get("total-alchemists").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS) + " (" + s(MD.alchemistsAvailable()) + " available)";
        get("quarry-discovery-text").innerHTML = "You found a rare artifact, and an alchemist has come from afar to study it for you, free of charge!";
    }
    clearTimeout(MD.QUARRY_TIMEOUT);
    MD.QUARRY_TIMEOUT = setTimeout(function(){get("quarry-discovery-text").innerHTML = ""},10000); //Hide after 10 seconds
};

MD.getStatueGemAmount = function(lvl){
    return Math.round(Math.pow(2*lvl,1.3) + 30*lvl + 50)*450;
}

MD.getStatueReward = function(lvl){
    var total_gems = MD.getStatueGemAmount(lvl);
    total_gems *= (MD.activeDragon("Child") ? 2 : 1);
    total_gems = getRandom(total_gems-Math.round(total_gems/10),total_gems+Math.round(total_gems/10));
    var gems_earned = [0,0,0,0,0,0,0,0,0,0];

    //Fill gems using 25 samples
    for(var i = 0; i < 25; i++){
        var g = Math.round(gaussianRandom(3.5,3));
        g = Math.max(Math.min(MD.GEM_OBJECTS.length-1,g),0);
        gems_earned[g] += Math.round(total_gems/25);
    }

    for(var i = 0; i < gems_earned.length; i++){
        MD.changeGems(i,gems_earned[i]);
    }

    get("statue-findings").innerHTML = "Your tax collectors have returned bearing " + s(total_gems) + " gems.";
};

MD.getPitProduction = function(){
    var base = MD.PIT_BASE * (MD.hasUpgrade("Steel Affinity") ? MD.uv.level1mult : 1);
    var mult = MD.CONSTRUCT_LEVELS[5]+1;
    mult *= mult;
    var amt = base*mult;
    amt = amt * (MD.hasUpgrade("Peer Pressure") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Enter the Horde") ? MD.uv.level2mult : 1);
    return amt;
};

MD.getPitPrice = function(){
    var divisor = 1;
    divisor *= (MD.hasUpgrade("Waste Not") ? 2 : 1) * (MD.hasUpgrade("Want Not") ? 2 : 1);
    var mult = MD.PIT_BASE*(MD.CONSTRUCT_LEVELS[5]+1)/divisor;
    var price = MD.ResMult(MD.convals.pitPrice,mult);

    price.goblin *= (MD.hasUpgrade("Waste Not") ? 2 : 1) * (MD.hasUpgrade("Want Not") ? 2 : 1);

    if(MD.hasUpgrade("Have Not")){
        price.goblin += MD.getPitProduction()/2;
    }

    return price;
};

MD.togglePit = function(){
    MD.PIT_SMELTING = !MD.PIT_SMELTING;

    if(MD.PIT_SMELTING)
        get("pit-toggle-btn").innerHTML = "Stop Smelting!";
    else
        get("pit-toggle-btn").innerHTML = "Start Smelting!";

    MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(5)); //Refresh the dialog
};

MD.startMarketTimer = function(){
    var time = getRandom(40,80)*60; //Between 40 and 80 minutes

    if(MD.activeDragon("Eternal"))
        time = time/3;

    MD.MARKET_TIMER = time;
    MD.MARKET_HALVED = false; //Reset this
};

//Sets the amount of resources to convert at once
MD.setMarket = function(i){
    MD.MARKET_RATE = i;
    MD.refreshMarket();
};

MD.marketTrade = function(i){
    var er = MD.EXCHANGE_RATES[i];

    //Figure out how much we can afford
    var base = er.base_amt;
    var result = er.final_amt * MD.CURRENT_RATES[i]/100;
    var amt = Math.floor(MD.RESOURCES[er.base_res].amount_function() * (MD.MARKET_RATE/100));
    result = (result*amt)/base;
    base = amt;

    if(MD.RESOURCES[er.base_res].check_function(base)){
        MD.RESOURCES[er.base_res].change_function(-base);
        MD.RESOURCES[er.final_res].change_function(result,true); //Any value as the second parameter prevents applying the spirit multiplier
        MD.MARKET_TRADES++;
    }

    MD.refreshMarket();
};

MD.getMarketRate = function(){
    var mean = 100 + (MD.hasUpgrade("Ghosts of Economic Prowess") ? MD.uv.marketscholarincrease() : 0);
    return Math.max(5,Math.round(gaussianRandom(mean,50)));
}

MD.initializeMarketButtons = function(){
    var div = $("#market-trades");
    div.empty();  // in case this ever needs to be called twice for any reason in the future
    for(var i = 0; i < MD.EXCHANGE_RATES.length; i++){
        div.append("<button id='market-trade-btn-" + i + "' class='btn oval-btn dialog-button' onclick='MD.marketTrade("+i+")' style='display:none;'>Resources Not Available</button>");
    }
};

MD.refreshMarket = function(){
    if(MD.MARKET_DIALOG_OPEN){
        //Fill the array if necessary
        if(MD.CURRENT_RATES.length == 0){
            for(var i = 0; i < MD.EXCHANGE_RATES.length; i++){
                MD.CURRENT_RATES.push(MD.getMarketRate());
            }
        }

        //Display the countdown
        get("market-time-remaining").innerHTML = "New merchants with new prices will arrive in " + getTime(MD.MARKET_TIMER) + "!"

        //Set the scouts button
        var scoutBtn = $("#send-scouts");
        if(MD.hasUpgrade("Untapped Markets")){
            scoutBtn.toggle(true);
            scoutBtn.toggleClass("unaffordable",MD.MARKET_HALVED || MD.MASONS < 5); //Only once per market cycle
        }
        else{
            scoutBtn.toggle(false);
        }

        //Clear the trades div and reload it with the current stats
        var div = $("#market-trades");
        for(var i = 0; i < MD.EXCHANGE_RATES.length; i++){
            var er = MD.EXCHANGE_RATES[i];

            //Figure out how much we can afford
            var base = er.base_amt;
            var result = er.final_amt * MD.CURRENT_RATES[i]/100;
            var amt = Math.floor(MD.RESOURCES[er.base_res].amount_function() * (MD.MARKET_RATE/100));
            result = (result*amt)/base;
            base = amt;

            if(er.unlock_condition()){
                var button = get("market-trade-btn-" + i);

                if(button.style.display == 'none'){
                    button.style.display = 'block';
                }

                if(base >= 1 && amt >= 1){
                    button.innerHTML = s(base) + " " + MD.RESOURCES[er.base_res].print_name + " for " + s(result) + " " + MD.RESOURCES[er.final_res].print_name;
                }
                else{
                    button.innerHTML = "Resources Not Available";
                }
            }

            MDART.setTooltip($("#market-trade-btn-"+i),"","Current Exchange Rate: " + MD.CURRENT_RATES[i])
        }
    }
};

MD.sendMarketScouts = function(){
    if(MD.MASONS >= 5 && !MD.MARKET_HALVED){
        MD.MASONS -= 5;
        MD.MARKET_HALVED = true;
        MD.MARKET_TIMER = Math.ceil(MD.MARKET_TIMER/2);
        MD.refreshMarket();
    }
};

MD.closeMarket = function(){
    $('#construct-dialog-6').dialog('close');
    MD.MARKET_DIALOG_OPEN = false;
};

MD.getPopulationMax = function(){
    return MD.CONSTRUCT_LEVELS[7]+1;
};

MD.killPopulation = function(amt){
    MD.changePopulation(-amt);
};

MD.getHabitationStage = function(){
    var lvl = 0;
    for(var i = 0; i < MD.convals.habLevels.length; i++){
        if(MD.CONSTRUCT_LEVELS[7]+1 >= MD.convals.habLevels[i]){
            lvl++;
        }
    }
    return lvl;
};

//Note that this takes the construct number as a variable, because there are 3 farms
MD.getFarmProduction = function(p){
    var rate = (MD.hasUpgrade("Agriculture") ? MD.convals.farmrate2 : MD.convals.farmrate1);
    rate = (MD.hasUpgrade("Irrigation") ? MD.convals.farmrate3 : rate);
    rate *= (MD.hasUpgrade("Higher Learning") ? MD.uv.level3mult : 1);
    rate *= (MD.hasUpgrade("A Whole New World") ? 2 : 1);
    rate *= (MD.hasUpgrade("Center of the Quake") ? 8 : 1);
    rate *= (MD.activeDragon("Hatchling") || MD.activeDragon("Eternal") ? 1.5 : 1);
    return rate * (MD.CONSTRUCT_LEVELS[p]+1);
};

MD.getFarmStage = function(){
    if(MD.hasUpgrade("Irrigation"))
        return 2;
    else if(MD.hasUpgrade("Agriculture"))
        return 1;
    else
        return 0;
};

MD.addScholars = function(){
    var val = Number(get("scholar-amt").value);
    if(val > 0){
        var price = {population:val,adamantium:1};
        if(MD.canAfford(price)){
            MD.spend(price);
            MD.CONSTRUCT_LEVELS[10] += (val *(MD.hasUpgrade("Sensei") ? 2 : 1));
            MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(10));
            $("#construct-dialog-"+10).dialog("option","title",MD.CONSTRUCTS[10].name + " - Level " + s(MD.CONSTRUCT_LEVELS[10],true)); //Increase level
        }
        else{
            MDART.notify("You can't afford the cost of " + MD.ResPrint(price));
        }
    }
};

MD.getEducationLevel = function(){
    return MD.CONSTRUCT_LEVELS[10];
};

MD.bombEnemies = function(auto){
    auto = setDefault(auto,false);

    var num = (MD.multibuyActive() && !auto) ? 10 : 1; //Get times to bombs
    var price = MD.convals.blacksmith_formula(MD.GOBLIN_LEVEL,MD.SPIDER_LEVEL);
    while(MD.canAfford(price) && num > 0){
        MD.spend(price);
        MD.GOBLIN_LEVEL *= 0.92;
        MD.SPIDER_LEVEL *= 0.92;
        if(!auto)
            MD.openConstructDialog(MD.CONSTRUCT_LOCATIONS.indexOf(11));
        num--;
        price = MD.convals.blacksmith_formula(MD.GOBLIN_LEVEL,MD.SPIDER_LEVEL);
    }
};

MD.createAdminDialog = function(){
    for(var r in MD.RESOURCES){
        var res = MD.RESOURCES[r];
        if(res.amount_function() > 0){
            MD.ADMIN_ARRAY[r] = res.amount_function();
        }
    }
}

MD.updateAdminDialog = function(){
    //Get values
    var ar = get("admin-range");
    var ad = get("admin-display");
    MD.ADMIN_RANGE = Math.floor(Math.max(10,Number(ar.value)));
    ar.value = MD.ADMIN_RANGE;
    MD.DISPLAYED_TIME = Math.floor(Math.max(1,Number(ad.value)));
    ad.value = MD.DISPLAYED_TIME;

    var resources = [];
    var update = false;
    for(var r in MD.RESOURCES){
        if(MD.ADMIN_ARRAY[r] === undefined){ //If not in the array already, put it there
            MD.ADMIN_ARRAY[r] = MD.RESOURCES[r].amount_function();
        }
        else{ //If we have data, add it to the display of resources
            resources.push({name:r,change:MD.RESOURCES[r].amount_function()-MD.ADMIN_ARRAY[r]});

            //Update the array if we have exceeded the data range
            if(MD.ADMIN_TIME >= MD.ADMIN_RANGE){
                MD.ADMIN_ARRAY[r] = MD.RESOURCES[r].amount_function(); //Update the array
                update = true;
            }
        }
    }

    var sections = MD.RESOURCE_SECTION_NAMES;
    var sectionNames = MD.RESOURCE_SECTION_TITLES;

    //Reset sections
    for(var i = 0; i < sections.length; i++){
        var div = get("admin-" + sections[i] + "-section");
        div.innerHTML = "";
    }

    //Compute the ratio to multiply the value by
    var ratio = MD.DISPLAYED_TIME/MD.ADMIN_TIME;

    //Write resource names, colored based on whether or not they are increasing
    for(var i = 0; i < resources.length; i++){
        var color = "black";
        if(resources[i].change > 0)
            color = "green";
        else if(resources[i].change < 0)
            color = "red";

        get("admin-" + MD.RESOURCES[resources[i].name].type + "-section").innerHTML += "<span style='color:" + color + "''>" + resources[i].name.toTitleCase() + ": " + s(resources[i].change*ratio) + " /" + s(MD.DISPLAYED_TIME) + ((MD.DISPLAYED_TIME == 1) ? " second" : " seconds") +"</span><br>";
    }

    //Add titles to the sections
    for(var i = 0; i < sections.length; i++){
        var div = get("admin-" + sections[i] + "-section");
        if(div.innerHTML != ""){
            var newHTML = "<b>" + sectionNames[i] + "</b><br>" + div.innerHTML + "<br>";
            div.innerHTML = newHTML;
        }
    }

    //If we've updated, reset the admin time
    if(update){
        MD.ADMIN_TIME = 0;
    }

};

//How often you attack via blind revenge
MD.getBlindRevengeTime = function(){
    return Math.max(1,Math.ceil(30/(MD.DRAGONS_SACRIFICED==0 ? 1 : MD.DRAGONS_SACRIFICED)));
};

MD.toggleBlindRevenge = function(v){
    MD.BLIND_REVENGE = (v == undefined) ? !MD.BLIND_REVENGE : v;

    get("blind-revenge-btn").innerHTML = (MD.BLIND_REVENGE ? "Disable Blind Revenge" : "Enable Blind Revenge");
    get("blind-revenge-txt").innerHTML = (MD.BLIND_REVENGE ? "Your soldiers attack automatically once every " + MD.getBlindRevengeTime() + " seconds." : "");
};

MD.processBlindRevenge = function(){
    if(MD.BLIND_REVENGE){
        var time = MD.getBlindRevengeTime();
        if(MD.TICKS % time == 0){
            MD.launchCampaign(true);

            //Check if we need to drop a bomb
            if(MD.hasUpgrade("Strike Blindly")){
                MD.bombEnemies(true);
            }
        }
    }
};

/*-------------------------------------------------------------------------------------------------
 TOOLS
 /------------------------------------------------------------------------------------------------*/

MD.buypick = function() {
    var r = true;
    if(MD.pickSocketed()){ //If there are any socketed gems
        r = confirm("Are you sure you want to buy a new pick? Your currently socketed gems will be lost!");
    }
    if(r == true){
        if (MD.PICK_LEVEL+1 < MD.PICKS.length){
            if (MD.canAfford(MD.PICKS[MD.PICK_LEVEL+1].cost)){
                //Pay Gold and Increase Level
                MD.spend(MD.PICKS[MD.PICK_LEVEL+1].cost);
                MD.setPickLevel(MD.PICK_LEVEL+1);
                MD.setSockets(MD.PICK_LEVEL);

                //Update display
                MDART.notify("Bought " + MD.PICKS[MD.PICK_LEVEL].name + " Pick!")
            }
        }
    }
};

MD.rebuypick = function(){
    var r = confirm("Are you sure you want to buy a new pick? You might get more sockets but you will lose your currently socketed gems!");
    if (r==true){
        if (MD.canAfford(MD.PICKS[MD.PICK_LEVEL].cost)){
            //Pay Gold and Increase Level
            MD.spend(MD.PICKS[MD.PICK_LEVEL].cost);
            MD.setPickLevel(MD.PICK_LEVEL);
            MD.setSockets(MD.PICK_LEVEL);

            //Update display
            MDART.notify("Bought " + MD.PICKS[MD.PICK_LEVEL].name + " Pick!")
        }
    }
};

MD.getPickID = function(name){
    for (var i = 0; i < MD.PICKS.length; i++){
        if (MD.PICKS[i].name.toLowerCase() == name.toLowerCase())
            return i
    }
    return -1    
}

MD.setPickLevel = function(lvl){
    MD.PICK_LEVEL = lvl;
    MD.updatePickDisplay();
    MD.setBuyPickMessage(MD.PICK_LEVEL+1)
};

MD.setSockets = function(lvl){
    var roll = getRandom(1,100);
    if (roll <= lvl*2 || lvl >= 16)
        MD.PICK_SOCKETS = [null,null,null];
    else if (roll <= lvl*8)
        MD.PICK_SOCKETS = [null,null];
    else if (roll <= lvl*25)
        MD.PICK_SOCKETS = [null];
    else
        MD.PICK_SOCKETS = [];
    MD.updateCraftingPage();
    MD.updateSocketDropDowns()
};

MD.getPickStrength = function(){
    var str = MD.PICKS[MD.PICK_LEVEL].strength;

    //Check gems
    for(var i = 0; i < MD.PICK_SOCKETS.length; i++){
        if(MD.PICK_SOCKETS[i] != null){
            var eff = MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].pick_increase;
            str += eff;
        }
    }

    if (MD.hasMageUpgrade("Elemental Pickaxe"))
        str *= MD.uv.elementalpick;

    if (MD.hasUpgrade("Pioneer Spirit"))
        str *= MD.uv.pioneerspiritmult;
    if (MD.hasUpgrade("Mining Mastery"))
        str *= MD.uv.miningmasterymult;
    if (MD.hasUpgrade("Terra's Might"))
        str *= MD.uv.terrasmightmult;

    if (MD.hasUpgrade("A Little Bugged"))
        str += MD.uv.pickgainperant * MD.HIRELINGS_OWNED[0];
    if (MD.hasUpgrade("Mantis Extension"))
        str += MD.uv.pickgainperant2 * MD.HIRELINGS_OWNED[0];
    if (MD.hasUpgrade("Communal Effort"))
        str += MD.uv.pickgainperhireling * (sumArray(MD.HIRELINGS_OWNED)-MD.HIRELINGS_OWNED[0]);
    if (MD.hasUpgrade("Putting in Work"))
        str += MD.HIRELINGS_OWNED[1] * (MD.uv.pickgainperhireling*999999); //Woodpeckers contribute 1M times as much

    //Get mult from captain planet
    if (MD.hasMageUpgrade("HEART!")){
        var mages = Math.min(Math.floor(MD.MAGES/MD.uv.numPerDouble),20);
        var mult = Math.pow(2,mages);
        str *= mult;
    }

    //Other
    if (MD.hasUpgrade("Advanced Magick")){
        opt1 = str + (MD.GOLD_PER_SECOND/50 * (MD.MAGES/(MD.TICKS/1800)) + MD.HIRELINGS_OWNED[11]*MD.HIRELINGS_OWNED[0]*987);
        opt2 = str*3;
        str = Math.max(opt1,opt2); //If the other formula isn't larger, just triple the pick power
    }

    //Calculate Earth Shrine Multiplier
    if(MD.hasConstruct("Earth Shrine")){
        str *= Math.pow(MD.CONSTRUCT_LEVELS[19]+1,1.1);
    }   

    return str
};

MD.updatePickDisplay = function(){
    var str = MD.getPickStrength();
    if(MD.PICK_LEVEL > 0)
        get("tooltype").innerHTML = "Tool: " + MD.getPickAdjective() + MD.PICKS[MD.PICK_LEVEL].name + " Pick (" + s(str) + ")";
    else{
        get("tooltype").innerHTML = "Tool: " + MD.getPickAdjective() + MD.PICKS[MD.PICK_LEVEL].name + " (" + s(str) + ")"
    }
};

MD.getPickAdjective = function() {
    var bestGem = -1;
    for (var i = 0; i < MD.PICK_SOCKETS.length; i++) {
        if (MD.PICK_SOCKETS[i] != null && MD.PICK_SOCKETS[i] > bestGem)
            bestGem = MD.PICK_SOCKETS[i]
    }
    if (MD.hasMageUpgrade("HEART!"))
        return "Captain Planet's ";
    else if (bestGem > 7)
        return MD.GEM_OBJECTS[bestGem].name + " ";
    else if (MD.hasMageUpgrade("Elemental Pickaxe"))
        return "Elemental ";
    else if (bestGem > -1)
        return MD.GEM_OBJECTS[bestGem].name + " ";
    else
        return ""
};

MD.setBuyPickMessage = function(lvl){
    //Buy Message
    if (lvl < MD.PICKS.length && MD.PICKS[lvl].unlock_function()){

        if(get("newpickbutton").style.display == 'none'){
            MDART.alertTab("shop");
        }

        get("newpickbutton").style.display = 'inline';
        get("newpickbutton").innerHTML = MD.PICKS[lvl].name + " Pick (" + MD.ResPrint(MD.PICKS[lvl].cost) + ")";
        var tipText = MD.PICKS[lvl].description;
        var pickBtn = $("#newpickbutton");
        MDART.setTooltip(pickBtn,"",tipText);

        pickBtn.toggleClass("unaffordable",!MD.canAfford(MD.PICKS[lvl].cost))
    }
    else{
        get("newpickbutton").style.display = 'none'
    }

    //Rebuy Message
    if (lvl != 1 && MD.craftingAvailable()) {
        get("rebuypickbutton").style.display = 'inline';
        get("rebuypickbutton").innerHTML = "Buy New " + MD.PICKS[lvl-1].name + " Pick (" + MD.ResPrint(MD.PICKS[lvl-1].cost) + ")";

        $("#rebuypickbutton").toggleClass("unaffordable",!MD.canAfford(MD.PICKS[lvl-1].cost))
    }
    else{
        get("rebuypickbutton").style.display = 'none';
    }

};

/*-------------------------------------------------------------------------------------------------
 WALL
 /------------------------------------------------------------------------------------------------*/

MD.buyWall = function() {
    if (MD.WALL_LEVEL+1 < MD.WALLS.length){
        if (MD.GOLD >= MD.WALLS[MD.WALL_LEVEL+1].cost){
            MD.changeGold(-1*MD.WALLS[MD.WALL_LEVEL+1].cost);
            MD.setWall(MD.WALL_LEVEL+1,0)
        }
    }
    else{
        var num = MD.multibuyActive() ? 10 : 1; //Get times to fortify
        while(MD.GOLD >= Math.pow(MD.PRICE_MULTIPLIER,MD.FORTIFICATION_LEVEL)*MD.FORTIFICATION_COST && num > 0){
            MD.changeGold(-1* Math.pow(MD.PRICE_MULTIPLIER,MD.FORTIFICATION_LEVEL)*MD.FORTIFICATION_COST);
            MD.setWall(MD.WALL_LEVEL,MD.FORTIFICATION_LEVEL+1)
            MD.TIMES_FORTIFIED++;
            num--;
        }
    }
};

MD.destroyWall = function(){
    if (MD.WALL_LEVEL > 0)
        MD.setWall(MD.WALL_LEVEL-1,0);
    MD.TIMES_FORTIFIED = 0; //Reset
};

//Sets the wall to a set level and fortification and sets upgrade buttons accordingly
MD.setWall = function(lvl,fort){
    MD.WALL_LEVEL = lvl;
    MD.FORTIFICATION_LEVEL = fort;
    MD.WALL_STRENGTH = MD.WALLS[MD.WALL_LEVEL].durability + MD.FORTIFICATION_VALUE * MD.FORTIFICATION_LEVEL;
    MD.MAX_WALL_STRENGTH = MD.WALL_STRENGTH;
    MD.updateWallMessage();
    MD.setBuildWallMessage(MD.WALL_LEVEL+1);
    MDART.updateBackground()
};

MD.setBuildWallMessage = function(lvl){
    if (lvl < MD.WALLS.length){
        get("buildwallbutton").innerHTML = "Build " + MD.WALLS[lvl].name + " Wall (" + s(MD.WALLS[lvl].cost) + " gold)";
        $("#buildwallbutton").toggleClass("unaffordable",MD.WALLS[lvl].cost > MD.GOLD)
    }
    else {
        get("buildwallbutton").innerHTML = "Fortify " + MD.WALLS[MD.WALLS.length-1].name + " Wall (" + s(Math.pow(MD.PRICE_MULTIPLIER,MD.FORTIFICATION_LEVEL)*MD.FORTIFICATION_COST) + " gold)";
        $("#buildwallbutton").toggleClass("unaffordable",Math.pow(MD.PRICE_MULTIPLIER,MD.FORTIFICATION_LEVEL)*MD.FORTIFICATION_COST > MD.GOLD)
    }
};

MD.updateWallMessage = function(){
    if (MD.WALL_LEVEL > 0){
        get("walltype").innerHTML = "Wall: " + MD.WALLS[MD.WALL_LEVEL].name + " Wall (" + s(MD.WALL_STRENGTH )+ ")"
    }
    else{
        get("walltype").innerHTML = "Wall: None"
    }
};

/*-------------------------------------------------------------------------------------------------
 MD.MASONS
 /------------------------------------------------------------------------------------------------*/
MD.hireMason = function(){
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    var price = MD.MASON_START_COST*Math.pow(MD.PRICE_MULTIPLIER,MD.MASONS);
    while(MD.GOLD >= price && num > 0){
        MD.changeGold(-1*price);
        MD.MASONS++;
        MD.setMasonButton();

        var price = MD.MASON_START_COST*Math.pow(MD.PRICE_MULTIPLIER,MD.MASONS);
        num--;
    }
};

MD.setMasonButton = function(){
    if(MD.TOTAL_GOLD >= MD.MASON_UNLOCK_GOLD){

        if(get("hiremasonbutton").style.display == 'none')
            MDART.alertTab("defense");

        get("hiremasonbutton").style.display = 'inline';
        var price = MD.MASON_START_COST*Math.pow(MD.PRICE_MULTIPLIER,MD.MASONS);
        get("hiremasonbutton").innerHTML = "Hire Craftsman (" + s(price) + " gold)";

        var hireBtn = $("#hiremasonbutton");
        hireBtn.toggleClass("unaffordable",price > MD.GOLD);

        var tipText = "Hire a craftsman to automatically repair your wall over time. (" + s(MD.MASONS) + " hired)";
        MDART.setTooltip(hireBtn,"",tipText);
    }
    else{
        get("hiremasonbutton").style.display = 'none'
    }
};

MD.getMasonRepairRate = function(){

    //Check if they are occupied
    if(MD.INDUSTRY_WORKING){
        return 0;
    }

    var rr = MD.MASON_REPAIR_RATE * (MD.hasUpgrade("Elbow Grease") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Takin Care of Business") ? MD.uv.level2mult : 1) * (MD.hasUpgrade("Overall-Clad Blurs") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Alchemical Repair Rates") ? MD.uv.level4mult : 1);
    
    var percentage = 0;
    percentage = (MD.hasUpgrade("Takin Care of Business") ? MD.uv.masonPercent1 : percentage);
    percentage = (MD.hasUpgrade("Overall-Clad Blurs") ? MD.uv.masonPercent2 : percentage);
    percentage = (MD.hasUpgrade("Alchemical Repair Rates") ? MD.uv.masonPercent3 : percentage);

    rr += (percentage/100) * MD.MAX_WALL_STRENGTH;

    return rr    
};

MD.processMasons = function(){
    if(MD.WALL_LEVEL > 0){
        MD.WALL_STRENGTH = Math.min(MD.WALL_STRENGTH + MD.MASONS*MD.getMasonRepairRate(), MD.MAX_WALL_STRENGTH);
        MD.updateWallMessage()
    }
};

/*-------------------------------------------------------------------------------------------------
 CRAFTING
 /------------------------------------------------------------------------------------------------*/
MD.craftingAvailable = function(){
    return (MD.TOTAL_GEMS >= 4);
};

MD.updateCraftingButtons = function(){
    if(MD.craftingAvailable())
        get("craftingButton").style.display = 'inline';
    else
        get("craftingButton").style.display = 'none'
};

MD.updateCraftingPage = function(){
    var i;
    for (i=0; i<MD.GEM_OBJECTS.length;i++){
        get("gemcount" + i).innerHTML = MD.GEM_OBJECTS[i].name + ": " + s(Math.floor(MD.GEMS[i]),true);
    }

    //Pick crafting section
    var s0 = get("socket0");
    var s1 = get("socket1");
    var s2 = get("socket2");
    if (MD.PICK_SOCKETS.length == 0){
        s0.style.display = 'inline';
        s1.style.display = 'inline';
        s0.innerHTML = "Your pick has no sockets!";
        s1.innerHTML = "Try buying a new one.";
        s2.style.display = 'none';
        for (i=0; i<3; i++){
            get("selectsocket" + i).style.display = 'none';
            get("socketbutton" + i).style.display = 'none'
        }
    }
    else{
        for (i=0; i < 3; i++){
            if(i < MD.PICK_SOCKETS.length){
                get("socket" + i).style.display = 'inline';

                if(MD.PICK_SOCKETS[i] == null){
                    get("socket" + i).innerHTML = "Socket " + (i+1) + ": ";
                    get("selectsocket" + i).style.display = 'inline';
                    get("socketbutton" + i).style.display = 'inline'
                }
                else{
                    //Show what kind of gem is present, and the benefit of it
                    var socketText = "Socket " + (i+1) + ": " + MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].name;
                    var eff = MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].pick_increase;
                    var gps = MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].gps_increase;
                    socketText += " (Pick +" + s(eff);
                    if (gps > 0)
                        socketText += ", GPS +" + s(gps) + "%";
                    socketText += ")";
                    get("socket" + i).innerHTML = socketText;
                    get("selectsocket" + i).style.display = 'none';
                    get("socketbutton" + i).style.display = 'none'
                }
            }
            else{
                get("socket" + i).style.display = 'inline';
                get("socket" + i).innerHTML = "Socket " + (i+1) + ": Unavailable";
                get("selectsocket" + i).style.display = 'none';
                get("socketbutton" + i).style.display = 'none';
            }
        }
    }

    //Pry gems button
    var pryBtn = $("#prygemsbutton");
    var result = MD.getGemPryReturn();
    if(!MD.pickSocketed() || MD.ResPrint(result) === ""){
        pryBtn.css('display','none')
    }
    else {
        var btnText = "Pry Out Gems (Recover " + MD.ResPrint(result) + ")";

        pryBtn.html(btnText);
        pryBtn.css('display','inline')
    }
};

MD.getGemPryReturn = function(){
    var cost = {};
    for(var i = 0; i < 3; i++){
        if(i < MD.PICK_SOCKETS.length){
            if(MD.PICK_SOCKETS[i] != null && MD.PICK_SOCKETS[i] != 0){ //Level 0 gems cannot be pried
                var gem = MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]-1].name.toLowerCase();
                if(cost[gem] === undefined){
                    cost[gem] = MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].combine_requirement - 1;
                }
                else{
                    cost[gem] += MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].combine_requirement - 1;
                }
            }
        }
    }
    return cost;
};

MD.pickSocketed = function(){
    for(var i = 0; i < MD.PICK_SOCKETS.length; i++){
        if(MD.PICK_SOCKETS[i] !== null){
            return true;
        }
    }
    return false;
};

MD.pryGems = function(){
    var result = MD.getGemPryReturn();

    var r = confirm("Are you sure you want to pry out the gems from your pick? This cannot be reversed!.");
    if(r==true){
        MD.earn(result);
        for(i=0; i<MD.PICK_SOCKETS.length; i++){
            MD.PICK_SOCKETS[i] = null;
        }
        MD.updateCraftingPage();
        MD.updateGems();
        MD.updateSocketDropDowns();
    }
};

MD.updateSocketDropDowns = function(){
    //Get available gems
    var gems_available = [];
    var i;
    for(i=0; i < MD.GEM_OBJECTS.length; i++){
        if(MD.GEMS[i] > 0)
            gems_available.push(MD.GEM_OBJECTS[i].name)
    }

    for (i = 0; i<3; i++){
        var dd = get("selectsocket" + i);
        var startValue = dd.value;
        //Create the select box items
        clearSelectBox(dd);

        //None Element
        var opt = document.createElement('option');
        opt.innerHTML = "None";
        opt.value = "None";
        dd.appendChild(opt);

        //Gems
        for(var j = 0; j < gems_available.length; j++){
            var newOpt = document.createElement('option');
            newOpt.innerHTML = gems_available[j];
            newOpt.value = gems_available[j];
            dd.appendChild(newOpt);
        }

        //If we still have the initial gem, reset it
        if(MD.GEMS[MD.getGemByName(startValue)] >= 1){
            dd.value = startValue;
        }
    }
};

//Combines a single level of gems into the next level
//Two optional parameters are given for use with the auto-smith, allowCtrl and number (how many to combine)
MD.combineGem = function(i,number,allowCtrl,min){

    //Defaults
    var allowCtrl = setDefault(allowCtrl,true);
    var number = setDefault(number,1);
    var min = setDefault(min,0); //Sets a value that the gems cannot be lower than (does not apply to holding ctrl)

    if(i != MD.GEM_OBJECTS.length-1){
        if(MD.multibuyActive() && allowCtrl){ //Combine all
            var nextLevel = Math.floor(MD.GEMS[i]/MD.GEM_OBJECTS[i+1].combine_requirement);

            if(get("gem-move-amt").value != ""){
                nextLevel = Math.floor(Math.max(0,Math.min(get("gem-move-amt").value,nextLevel)));
            };

            MD.GEMS[i] -= nextLevel * MD.GEM_OBJECTS[i+1].combine_requirement;
            MD.GEMS[i] = Math.max(MD.GEMS[i],0); //I'm not 100% on why this is needed - I think that the negatives sometimes appear due to imprecise large numbers
            MD.GEMS[i+1] += nextLevel
        }
        else{
            var effectiveAmount = Math.max(MD.GEMS[i]-min,0)
            if(effectiveAmount >= MD.GEM_OBJECTS[i+1].combine_requirement){
                var nextLevel = Math.min(Math.floor(effectiveAmount/MD.GEM_OBJECTS[i+1].combine_requirement),number);
                MD.GEMS[i] -= nextLevel * MD.GEM_OBJECTS[i+1].combine_requirement;
                MD.GEMS[i+1] += nextLevel;
            }
        }

        MD.updateCraftingPage();
        MD.updateSocketDropDowns();
    }
};

//Breaks a single gem into the previous level
MD.breakGem = function(i){
    if(i != 0){
        if(MD.GEMS[i] >= 1){
            if(MD.multibuyActive()){
                var amt = MD.GEMS[i];

                if(get("gem-move-amt").value != ""){
                    amt = Math.floor(Math.max(0,Math.min(get("gem-move-amt").value,amt)));
                };

                MD.GEMS[i] -= amt;
                MD.GEMS[i-1] += (MD.GEM_OBJECTS[i].combine_requirement - 1)*amt; //One gem is lost in the process
            }
            else{
                MD.GEMS[i]--;
                MD.GEMS[i-1] += (MD.GEM_OBJECTS[i].combine_requirement - 1); //One gem is lost in the process
            }

            MD.updateCraftingPage();
            MD.updateSocketDropDowns();
        }
    }
};


//Combines all levels at once
MD.combineGems = function(){

    MD.GEM_COMBINE_LIMIT = Number(get("gem-combine-limit").value);

    for(var i=MD.GEM_COMBINE_LIMIT;i>0;i--){
        var nextLevel = Math.floor(MD.GEMS[i-1]/MD.GEM_OBJECTS[i].combine_requirement);
        MD.GEMS[i-1] -= nextLevel * MD.GEM_OBJECTS[i].combine_requirement;
        MD.GEMS[i-1] = Math.max(MD.GEMS[i-1],0); //I'm not 100% on why this is needed - I think that the negatives sometimes appear due to imprecise large numbers
        MD.GEMS[i] += nextLevel;
    }
    MD.updateCraftingPage();
    MD.updateSocketDropDowns()
};

MD.getGemByName = function(name){
    for(var i=0; i<MD.GEM_OBJECTS.length;i++){
        if(MD.GEM_OBJECTS[i].name == name)
            return i
    }
    return -1
};

MD.setSocket = function(s){
    var choice = get("selectsocket" + s).value;
    if (choice != "None"){
        var gem = MD.getGemByName(choice);
        MD.changeGems(gem,-1);
        MD.PICK_SOCKETS[s] = gem;
        MD.updateCraftingPage();
        MD.updateSocketDropDowns()
    }
};

/*-------------------------------------------------------------------------------------------------
 MAGES
 /------------------------------------------------------------------------------------------------*/
MD.hireMage = function(){
    var price = MD.MAGE_START_COST*Math.pow(MD.PRICE_MULTIPLIER,MD.MAGES);
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    while(MD.GOLD >= price && num > 0){
        MD.changeGold(-1*price);
        MD.MAGES++;
        MD.setMageButton();
        MD.updateAuraDisplay();

        if(MD.hasConstruct("Mage Tower")){
            MD.MAGE_TOWER_RESEARCH += 500;
        }

        var price = MD.MAGE_START_COST*Math.pow(MD.PRICE_MULTIPLIER,MD.MAGES);
        num--;
    }
};

MD.setMageButton = function(){
    if(MD.TOTAL_GOLD >= MD.MAGE_UNLOCK_GOLD){

        if(get("hiremagebutton").style.display == 'none')
            MDART.alertTab("defense");

        get("hiremagebutton").style.display = 'inline';
        var price = MD.MAGE_START_COST*Math.pow(MD.PRICE_MULTIPLIER,MD.MAGES);
        get("hiremagebutton").innerHTML = "Hire Mage (" + s(price) + " gold)";
        var hireBtn = $("#hiremagebutton");
        hireBtn.toggleClass("unaffordable",price > MD.GOLD);

        var tipText = "Hire a mage to BRING THE PAIN!!! (" + s(MD.MAGES) + " hired)";
        MDART.setTooltip(hireBtn,"",tipText);
    }
    else{
        get("hiremagebutton").style.display = 'none'
    }
};

MD.updateMageButtons = function(){
    if(MD.MAGES >= 5)
        get("magesButton").style.display = 'inline';
    else
        get("magesButton").style.display = 'none'
};

MD.getMageDamage = function(){
    var damage = MD.MAGE_DAMAGE;

    //Apply number of mages upgrades
    damage *= (MD.hasUpgrade("Magic!") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Dumbledore's Finest") ? MD.uv.level2mult : 1) * (MD.hasUpgrade("Merlin") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Deity-ish") ? MD.uv.level4mult : 1);

    //Apply mage upgrades
    damage *= (MD.hasMageUpgrade("Enhanced Fireballs") ? MD.uv.level1mult : 1) * (MD.hasMageUpgrade("Lightning Torrent") ? MD.uv.level2mult : 1) * (MD.hasMageUpgrade("Heaven's Fury") ? MD.uv.level3mult : 1) * (MD.hasMageUpgrade("Insecticide") ? MD.uv.level4mult : 1) * (MD.hasMageUpgrade("Supercharged") ? MD.uv.level5mult : 1) * (MD.hasMageUpgrade("FIRE!") ? MD.uv.level5mult : 1) * (MD.hasMageUpgrade("Secrets of Old") ? MD.uv.level6mult : 1) * (MD.hasMageUpgrade("Ancient Wisdom") ? MD.uv.level7mult : 1);

    //Apply aura mult
    damage *= (1+MD.getMageAuraMult());

    //Apply fire shrine bonus
    damage *= Math.pow(MD.CONSTRUCT_LEVELS[15]+1,1.6);

    //Amplification Armor
    damage *= (MD.hasUpgrade("Amplificatory Armor") ? Math.max(1,Math.pow(1.02,MD.TIMES_FORTIFIED)) : 1);

    damage *= (MD.hasUpgrade("Volcanic Fury") ? 2 : 1) * (MD.hasUpgrade("Thunder of Death") ? 8 : 1);

    return damage
};

MD.getMagesMeditating = function(){
    var rate = 0.005;
    if (MD.hasMageUpgrade("Magical Optimization"))
        rate *= MD.uv.meditatelevel1;
    if (MD.hasMageUpgrade("Spell of Focus"))
        rate *= MD.uv.meditatelevel2;
    if (MD.hasMageUpgrade("Current of Nature"))
        rate *= MD.uv.meditatelevel3;
    if (MD.hasMageUpgrade("WIND!"))
        rate *= MD.uv.meditatelevel4;

    //Apply Nightmare Mults
    rate *= MD.getManaMultiplier();

    //Apply Neurochrysalis Boost
    if(MD.hasMageUpgrade("Neurobacklash"))
        rate += (MD.uv.neuropercent2/100)*MD.getChrysalisProduction();
    else if(MD.hasMageUpgrade("Neurofeedback"))
        rate += (MD.uv.neuropercent1/100)*MD.getChrysalisProduction();

    rate *= MD.getMageTowerMult();

    //Apply Aura Mult
    rate *= (1+MD.getMageAuraMult());

    //Apply fire shrine bonus
    rate *= Math.pow(MD.CONSTRUCT_LEVELS[15]+1,1.6);

    if(MD.hasUpgrade("Volcanic Fury"))
        rate *= 2;

    return MD.MAGES_MEDITATING*rate;
};

MD.getMagesDelving = function(){
    var rate = 0.5;
    rate *= (MD.hasMageUpgrade("Delving Mastery") ? MD.uv.level1mult : 1) * (MD.hasMageUpgrade("Power Overwhelming") ? MD.uv.level2mult : 1) * (MD.hasMageUpgrade("Midas Reborn") ? MD.uv.level3mult : 1) * (MD.hasMageUpgrade("WATER!") ? MD.uv.level4mult : 1) * (MD.hasMageUpgrade("Delving Perfection") ? MD.uv.level5mult : 1) * (MD.hasMageUpgrade("Delving Transcendence") ? MD.uv.level6mult : 1);

    //Apply Aura Mult
    rate *= (1+MD.getMageAuraMult());

    //Apply fire shrine bonus
    rate *= Math.pow(MD.CONSTRUCT_LEVELS[15]+1,1.6);

    if(MD.hasUpgrade("Volcanic Fury"))
        rate *= 2;

    return MD.MAGES_DELVING*rate;
};

MD.getMageGemChance = function(){
    var chance = (MD.hasMageUpgrade("Algorithmic Sparkle Isolation") ? MD.uv.gemFindPerMage2 : MD.uv.gemFindPerMage1);
    chance = (MD.hasMageUpgrade("Glowing Mind's Eye") ? MD.uv.gemFindPerMage3 : chance);
    chance = (MD.hasMageUpgrade("Gems For Days!") ? MD.uv.gemFindPerMage4 : chance);
    chance = (MD.hasMageUpgrade("EARTH!") ? MD.uv.gemFindPerMage5 : chance);

    //Affinity
    if(MD.hasMageUpgrade("Ruby Affinity"))
        chance *= 2;
    if(MD.hasMageUpgrade("Sapphire Affinity"))
        chance *= 2;
    if(MD.hasMageUpgrade("Emerald Affinity"))
        chance *= 2;
    if(MD.hasMageUpgrade("Topaz Affinity"))
        chance *= 2;

    chance = MD.MAGES_DELVING*chance;
    return chance;
}

MD.checkMageGems = function(){
    if(MD.hasMageUpgrade("Advanced Delving Techniques")){
        var chance = MD.getMageGemChance();

        var successes = Math.floor(chance/100);
        successes += (tryPercentChance(chance % 100));

        if(successes > 0){

            amt = MD.getMageGemAmount() * successes;

            var distMean = 0;
            if(MD.hasMageUpgrade("Old Pros"))
                distMean = 7;
            else if(MD.hasMageUpgrade("Bein' Awesome"))
                distMean = 5;
            else if(MD.hasMageUpgrade("Lookin' Hard"))
                distMean = 4;
            else if(MD.hasMageUpgrade("Gettin' Lucky"))
                distMean = 2;

            var res = MD.getGaussianGem(distMean,1.5,amt);
            if(res == false){
                MD.findGem(0,amt); //If the gaussian gem didn't give one, ensure a gem is given
            }

            if(chance < 3) //Don't flood the user with messages
                MDART.notify("Your mages have found a gem!")
        }
    }
};

MD.getMageGemAmount = function(){
    var amt = (MD.hasMageUpgrade("Crystal Underground") ? MD.uv.gemMult1 : 1);
    amt = (MD.hasMageUpgrade("Penticity") ? MD.uv.gemMult2 : amt);

    if(MD.hasUpgrade("Learn from the Fallen")){
        amt *= MD.convals.goblinSacrificedFormula(MD.GOBLINS_SACRIFIED);
    }

    if(MD.hasUpgrade("Volcanic Fury")){
        amt *= 2;
    }

    if(MD.activeDragon("Eternal")){
        amt *= 2;
    }

    if(MD.activeDragon("Imperial")){
        amt *= 4;
    }

    return amt;
}

MD.processMages = function(){
    //Find all the possible goblins or spiders to attack
    var locations = [];
    var i;
    for (i = 0; i < MD.GOBLIN_PRESENT.length; i++){
        if(MD.GOBLIN_PRESENT[i] == true)
            locations.push(['G',i])
    }
    for (i = 0; i < MD.SPIDER_PRESENT.length; i++){
        if(MD.SPIDER_PRESENT[i] == true)
            locations.push(['S',i])
    }

    //Go through randomly and kill them until all mage damage has been exhausted
    if (locations.length != 0){ //If we found at least one enemy
        var random_order = locations.sort(function(){return .5 - Math.random()}); //This is not true random, but good enough for this and it's a one liner
        var damageRemaining = MD.MAGES_FIGHTING*MD.getMageDamage();
        for(i = 0; i < random_order.length && damageRemaining > 0; i++) {
            var damage;
            if (random_order[i][0] == 'G') {
                damage = Math.min(damageRemaining, MD.GOBLIN_OBJECT[random_order[i][1]].hp);
                MD.damageGoblin(random_order[i][1], damage, 'mage');
                damageRemaining -= damage;
            }
            else if (random_order[i][0] == 'S') {
                damage = Math.min(damageRemaining, MD.SPIDER_OBJECT[random_order[i][1]].hp);
                MD.damageSpider(random_order[i][1], damage, 'mage');
                damageRemaining -= damage;
            }
        }
    }

    //Handle meditating mages
    var amt = MD.getMagesMeditating();
    MD.changeMana(amt);
};

MD.clickMage = function(mage){

    if(MD.hasUpgrade("Instant Power")){
        var clickValue = MD.MAX_MAGE_AURA;
    }
    else{
        var clickValue = (MD.hasUpgrade("Mana Overcharge") ? 3 : 1);
    }

    MD.MAGE_AURA_LEVEL[mage] = Math.min(MD.MAGE_AURA_LEVEL[mage]+clickValue,MD.MAX_MAGE_AURA);
    MD.updateAuraDisplay();
    MDART.updateUnits();
};

//Uses the number of mages and the aura array to figure out the multiplier which is returned as a percentage
MD.getMageAuraMult = function(){
    //Takes the current sum of aura levels divided by the maximum possible given a number of mages and returns a percent based on the max multiplier
    if(MD.MAGES > 0) {
        var magesShown = Math.min(Math.ceil(MD.MAGES / 5),6);
        var percent = (sumArray(MD.MAGE_AURA_LEVEL) / (magesShown * MD.MAX_MAGE_AURA)) * (MD.hasUpgrade("Dark Portents") ? MD.MAX_AURA_MULT*2 : MD.MAX_AURA_MULT);
        return percent / 100;
    }
    else{
        return 0;
    }
};

MD.updateAuraDisplay = function(){
    var magesShown = Math.min(Math.ceil(MD.MAGES / 5),6);
    var percent = (sumArray(MD.MAGE_AURA_LEVEL) / (magesShown * MD.MAX_MAGE_AURA))*100;
    get("auradisplay").innerHTML = "Current Mage Power: " + Math.round(percent) + "%."
}

MD.updateAuraTime = function(){
    if(MD.MAGES > 0){
        var magesShown = Math.min(Math.ceil(MD.MAGES / 5),6);
        if(sumArray(MD.MAGE_AURA_LEVEL) >= (magesShown * MD.MAX_MAGE_AURA * 0.80)){ //Check if the mage is above 0.80
            MD.MAGE_MAX_TIME++;
        } 
    }
};

MD.decrementAuras = function(){
  for(var i = 0; i < MD.MAGE_AURA_LEVEL.length; i++){
    MD.MAGE_AURA_LEVEL[i] = Math.max(0,MD.MAGE_AURA_LEVEL[i]-1);
  }
  MD.updateAuraDisplay();
};

MD.updateMagePage = function(){
    //Default unused mages to fighting
    MD.MAGES_FIGHTING = MD.MAGES-(MD.MAGES_MEDITATING+MD.MAGES_DELVING);
    MD.checkMageAmounts();

    get("totalmages").innerHTML = "Total Mages: " + s(MD.MAGES);

    get("magesfighting").innerHTML = "Mages Fighting: "+ s(MD.MAGES_FIGHTING);
    get("fightingdesc").innerHTML = s(MD.MAGES_FIGHTING) + ((MD.MAGES_FIGHTING == 1) ? " mage" : " mages") + " dealing " + s(MD.MAGES_FIGHTING*MD.getMageDamage()) + " damage per second.";

    get("magesmeditating").innerHTML = "Mages Meditating: "+ s(MD.MAGES_MEDITATING);
    get("meditatingdesc").innerHTML = s(MD.MAGES_MEDITATING) + ((MD.MAGES_MEDITATING == 1) ? " mage" : " mages") + " meditating to produce " + s(MD.getMagesMeditating()) + " mana per second.";

    get("magesdelving").innerHTML = "Mages Delving: "+ s(MD.MAGES_DELVING);
    get("delvingdesc").innerHTML = s(MD.MAGES_DELVING) + ((MD.MAGES_DELVING == 1) ? " mage" : " mages") + " finding " + s(MD.getMagesDelving()) + "% more gold per second.";

    //Update delvinggemfind
    get("delvinggemfind").innerHTML = "Your delving mages have a " + s(MD.getMageGemChance()) + "% chance of finding " + s(MD.getMageGemAmount()*MD.getResMult("Gems")) + " " + (MD.getMageGemAmount() == 1 ? "gem" : "gems") + " each second.";

    //Figure out experience
    get("mageexp").innerHTML = "Mana: " + s(MD.MANA);
    MD.updateManaCounter();

    //Update upgrades
    MD.updateMageUpgradeButtons();

    //Update imbuement
    MD.updateImbueOptions();
};

MD.updateManaCounter = function(){
    if(MD.TOTAL_MANA > 0){
        get("manadisplay").innerHTML = "Mana: " + s(MD.MANA);
    }
    else{
        get("manadisplay").innerHTML = "";
    }
};

MD.updateImbueOptions = function(){
    $("#imbue-div").toggle(MD.hasUpgrade("Dark Portents")); //Hide the div if Dark Portents isn't owned

    //Set buy mode level
    var mode = MD.IMBUEMENT_BUY_MODES[MD.IMBUEMENT_BUY_MODE];
    var modeText = get("imbue-buy-number");
    modeText.innerHTML = " - " + mode + " levels per click."

    //Fill in buttons
    if(MD.hasUpgrade("Dark Portents")){
        for(var i = 0; i < MD.HIRELINGS.length; i++){

            var btn = get("imbue" + i);
            if(MD.HIRELINGS[i].unlock_function() && MD.HIRELINGS[i].imbue_cost !== 0){
                var cost = MD.getImbueCost(i);
                var text = "Imbue your " + MD.HIRELINGS[i].plural + " with a " + roundTenth(1 + MD.IMBUEMENT_LEVEL[i]*0.2 + 0.2) + " times multiplier. (" + s(cost) + " Mana)";
                btn.innerHTML = text;
                $("#imbue"+i).toggleClass("unaffordable",cost > MD.MANA);
                btn.style.display = 'inline';
            }
            else{
                btn.style.display = 'none';
            }
        }
    }
};

MD.getImbueCost = function(hireling){
    return Math.floor(MD.HIRELINGS[hireling].imbue_cost * Math.pow(MD.IMBUE_MULTIPLIER, MD.IMBUEMENT_LEVEL[hireling]))
};

MD.imbue = function(hireling){
    var mode = MD.IMBUEMENT_BUY_MODES[MD.IMBUEMENT_BUY_MODE]; //Get number to buy at once
    mode = (mode == "Max" ? Infinity : mode); //Set mode to Infinity is needed
    var i = 0;

    while(i < mode && MD.MANA >= MD.getImbueCost(hireling)){
        MD.changeMana(-MD.getImbueCost(hireling))
        MD.IMBUEMENT_LEVEL[hireling]++;
        MD.updateImbueOptions();
        i++;
    }
};

MD.changeImbueBuyMode = function(){
    MD.IMBUEMENT_BUY_MODE = (MD.IMBUEMENT_BUY_MODE+1)%MD.IMBUEMENT_BUY_MODES.length;
    MD.updateImbueOptions();
}

MD.addMage = function(type){
    var MageArray = [MD.MAGES_FIGHTING,MD.MAGES_MEDITATING,MD.MAGES_DELVING];

    if (type == "fighting"){
        MD.increaseMageAmount(0,MageArray)
    }
    else if (type == "meditating"){
        MD.increaseMageAmount(1,MageArray)
    }
    else if (type == "delving"){
        MD.increaseMageAmount(2,MageArray)
    }
    MD.MAGES_FIGHTING = MageArray[0];
    MD.MAGES_MEDITATING = MageArray[1];
    MD.MAGES_DELVING = MageArray[2];
    MD.updateMagePage()
};

MD.removeMage = function(type){
    var MageArray = [MD.MAGES_FIGHTING,MD.MAGES_MEDITATING,MD.MAGES_DELVING];
    if (type == "fighting" && MageArray[0] > 0){
        MD.decreaseMageAmount(0,MageArray)
    }
    else if (type == "meditating" && MageArray[1] > 0){
        MD.decreaseMageAmount(1,MageArray)
    }
    else if (type == "delving" && MageArray[2] > 0){
        MD.decreaseMageAmount(2,MageArray)
    }
    MD.MAGES_FIGHTING = MageArray[0];
    MD.MAGES_MEDITATING = MageArray[1];
    MD.MAGES_DELVING = MageArray[2];
    MD.updateMagePage()
};

MD.resetMageMove = function(){
    get("mage-move-amt").value = "";
};

//Given the array you want to keep constant, try to increase the amount of another
MD.increaseMageAmount = function(constant,array){

    //Decide how many to add
    var num = 1;
    if(MD.multibuyActive()){
        num = 10;
    }
    if(get("mage-move-amt").value != ""){
        num = Math.floor(Math.max(1,Number(get("mage-move-amt").value)));
    }

    for(var i = 0; i < array.length; i++){
        if(i != constant){
            if(array[i] > 0){
                num = Math.min(num,array[i]);
                array[i] -= num;
                array[constant] += num;
                break;
            }
        }
    }
};

MD.decreaseMageAmount = function(constant,array){
    //Decide how many to remove
    var num = 1;
    if(MD.multibuyActive()){
        num = 10;
    }
    if(get("mage-move-amt").value != ""){
        num = Math.floor(Math.max(1,Number(get("mage-move-amt").value)));
    }

    for(var i = 0; i < array.length; i++){
        if(i != constant){
            num = Math.min(num,array[constant]);
            array[i] += num;
            array[constant] -= num;
            break;
        }
    }
};

MD.checkMageAmounts = function(){
    //If mages fighting is negative, try to take from the other two groups
    if(MD.MAGES_FIGHTING < 0){
        num = Math.min(-MD.MAGES_FIGHTING,MD.MAGES_MEDITATING);
        if(num){
            MD.MAGES_FIGHTING += num;
            MD.MAGES_MEDITATING -= num;
        }
    }
    if(MD.MAGES_FIGHTING < 0){
        num = Math.min(-MD.MAGES_FIGHTING,MD.MAGES_DELVING);
        if(num){
            MD.MAGES_FIGHTING += num;
            MD.MAGES_DELVING -= num;
        }
    }
}

MD.getManaMultiplier = function(){
    var mult = 1;
    //First set
    for(var i = 70; i < 81; i++){ //We loop through the 11 upgrades that increase mana gain
        mult *= (MD.hasUpgrade(MD.getUpgradeById(i).name) ? MD.uv.manamult : 1)
    }
    //Second set
    for(var i = 82; i < 93; i++){ //We loop through the 11 upgrades that increase mana gain
        mult *= (MD.hasUpgrade(MD.getUpgradeById(i).name) ? MD.uv.manamult : 1)
    } 
    //Wyverns
    mult *= (MD.hasUpgrade(MD.getUpgradeById(110).name) ? MD.uv.manamult : 1)
    mult *= (MD.hasUpgrade(MD.getUpgradeById(111).name) ? MD.uv.manamult : 1)
    return mult;
};

MD.changeMana = function(amount){
    amount *= ((amount > 0) ? MD.getResMult("Basic") : 1);

    MD.MANA += amount;

    if(amount > 0)
        MD.TOTAL_MANA += amount;

    MD.updateManaCounter();
};

MD.hasMana = function(amount){
    return MD.MANA >= amount;
};

MD.getMana = function(){
    return MD.MANA;
};
/*-------------------------------------------------------------------------------------------------
 MAGE UPGRADES
 /------------------------------------------------------------------------------------------------*/
MD.hasMageUpgrade = function(name){
    for (var i=0; i<MD.ACTIVE_MAGE_UPGRADES.length; i++){
        var upgrade = MD.getMageUpgradeById(MD.ACTIVE_MAGE_UPGRADES[i]);
        if (upgrade.name == name){
            return true;
        }
    }
    return false
};

MD.getMageUpgradeById = function(id){
    for (var i=0; i<MD.MAGE_UPGRADES.length; i++){
        if (MD.MAGE_UPGRADES[i].id == id){
            return MD.MAGE_UPGRADES[i]
        }
    }
    return null
};

MD.mageUpgradeSortFunction = function(a,b){
    var first = MD.getMageUpgradeById(a);
    var second = MD.getMageUpgradeById(b);

    var result = MD.ResCompare(first.cost,second.cost)
    if (result != 0) //If they are different
        return result;
    else
        return first.id - second.id
};

MD.updateMageUpgradeButtons = function(){
    var previousUpgrades = MD.AVAILABLE_MAGE_UPGRADES; //Stores upgrades already available to check for new ones
    MD.AVAILABLE_MAGE_UPGRADES = [];
    var i;
    for(i = 0; i < MD.MAGE_UPGRADES.length; i++){
        if(MD.MAGE_UPGRADES[i].unlock_function() && MD.ACTIVE_MAGE_UPGRADES.indexOf(MD.MAGE_UPGRADES[i].id) == -1){
            MD.AVAILABLE_MAGE_UPGRADES.push(MD.MAGE_UPGRADES[i].id);
            if(previousUpgrades.indexOf(MD.MAGE_UPGRADES[i].id) == -1 && !MD.INITIALIZING_GAME){
                MDART.alertBtn("magesButton");
            }
        }
    }

    MD.AVAILABLE_MAGE_UPGRADES.sort(MD.mageUpgradeSortFunction);

    //Show available upgrades
    var upgrade;
    for(i=0; i < 20; i++){
        if(i<MD.AVAILABLE_MAGE_UPGRADES.length){
            upgrade = MD.getMageUpgradeById(MD.AVAILABLE_MAGE_UPGRADES[i]);
            get("mageupgrade" + i).style.display = 'inline';
            get("mageupgrade" + i).innerHTML =upgrade.name[0];//UPGRADES[MD.AVAILABLE_UPGRADES[i]].name
            var upgradeBtn = $("#mageupgrade"+i);
            upgradeBtn.toggleClass("unaffordable",!MD.canAfford(upgrade.cost));

            //Initialize jquery tooltips to display descriptions
            tipText = upgrade.name + "  -  " + upgrade.effect + " (" + MD.ResPrint(upgrade.cost) + ")";
            MDART.setTooltip(upgradeBtn,"",tipText);
        }
        else{
            get("mageupgrade" + i).style.display = 'none';
            get("mageupgrade" + i).title = ""
        }
    }
};

MD.buyMageUpgrade = function(number){

    var upgrade = MD.getMageUpgradeById(MD.AVAILABLE_MAGE_UPGRADES[number]);
    if (MD.canAfford(upgrade.cost)) {

        MD.spend(upgrade.cost);

        MD.ACTIVE_MAGE_UPGRADES.push(upgrade.id);
        MD.updateMageUpgradeButtons();
        MD.updateUpgradeStats();
    }
};

/*-------------------------------------------------------------------------------------------------
ALCHEMISTS
 /------------------------------------------------------------------------------------------------*/
MD.updateAlchButton = function(){
    if(MD.ALCHEMISTS >= 1)
        get("alchButton").style.display = 'inline';
    else
        get("alchButton").style.display = 'none'
};

MD.updateAlchPage = function(){
    get("alch-potential").innerHTML = "Alchemical Speed: " + MD.getAlchemistPotential() + "%";
    get("total-alchemists").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS);

    //Check for dirt to mana improvement upgrade
    if(MD.hasUpgrade("Mental Energies")){
        MD.ALCH_RECIPES[13].amount = 15;
    }

    //Build the table
    var table = get("alch-table");
    for(var i = 0; i < MD.ALCH_RECIPES.length; i++){ //For each recipe
        var rec = MD.ALCH_RECIPES[i];
        if(rec.unlock_condition() && $("#alch-row"+i).length == 0){ //If it is unlocked and doesn't already exist
            var r = table.insertRow($("#alch-table tr").length); //Insert a recipe at the end of the table
            r.id = "alch-row" + i;

            //Create cells
            var c = r.insertCell(0);
            c.innerHTML = MD.RESOURCES[rec.base_res].print_name;
            c.id = "base-res-text" + i;
            c = r.insertCell(1);
            c.innerHTML = MD.RESOURCES[rec.final_res].print_name;
            c.id = "final-res-text" + i;
            c = r.insertCell(2);
            c.innerHTML = s(rec.cost*rec.amount) + ":" + s(rec.yield_amt*rec.amount);
            c.id = "alch-ratio-text" + i;
            c = r.insertCell(3);

            //Because this cell contains a counter and buttons, we need to put the counter in a span to update it without overwriting the buttons
            var text = document.createElement('span');
            text.innerHTML = "0";
            text.id = "alch-row-counter" + i;
            c.appendChild(text);

            //Create buttons
            var remBtn = document.createElement('button');
            remBtn.innerHTML = "-";
            remBtn.id = "alch-row-rem" + i;
            remBtn.className = "btn mage-button";
            $(remBtn).css("float","right");
            remBtn.onclick = (function(num){return function(){MD.remAlch(num)}})(i); //This closure allows us to use the value of i as a function parameter (otherwise it would change when i updates)
            c.appendChild(remBtn);

            var addBtn = document.createElement('button');
            addBtn.innerHTML = "+";
            addBtn.id = "alch-row-add" + i;
            addBtn.className = "btn mage-button";
            $(addBtn).css("float","right");
            addBtn.onclick = (function(num){return function(){MD.addAlch(num)}})(i); //This closure allows us to use the value of i as a function parameter (otherwise it would change when i updates)
            c.appendChild(addBtn);

            if(!MD.INITIALIZING_GAME){ //Don't highlight on initial build
                MDART.alertBtn("alchButton");
            }
        }
    }
    MD.updateAlchCounts();
};

MD.resetAlchTable = function(){
    get("alch-table").innerHTML = "<thead><tr><th>Reactant</th><th>Product</th><th>Ratio</th><th>Alchemists Working</th></tr>";
}

//Gets the amount gained after upgrades (this does not affect cost)
MD.getAdjustedRecipeAmount = function(i){
    var mult = (MD.hasUpgrade("Increased Yields") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Unequivalent Exchange") ? MD.uv.level2mult : 1) * (MD.hasUpgrade("Desert Bloom") ? MD.uv.level3mult : 1);

    if(MD.hasUpgrade("Getting Hungry") && MD.ANTS_EATEN > 1){
        mult *= MD.uv.alchemistyieldmult() * (MD.hasUpgrade("Hound's Best Friend") ? 2 : 1);    
    }
    
    return MD.ALCH_RECIPES[i].amount * mult * MD.ALCH_RECIPES[i].yield_amt * (MD.CONSTRUCT_LEVELS[17]+1);
};

//Adds resources if possible for each alchemist
MD.processAlchemists = function(){

    var potential = MD.getAlchemistPotential()/100; //Calculate here to avoid repetition

    for(var i = 0; i < MD.ALCH_RECIPES.length; i++){
        var rec = MD.ALCH_RECIPES[i];
        if(rec.unlock_condition() && $("#alch-row"+i).length != 0){
            var minimumSpend = MD.ALCH_ARRAY[i] * rec.amount * rec.cost; //The minimum amount that can be converted at once
            var minimumGain = MD.ALCH_ARRAY[i] * MD.getAdjustedRecipeAmount(i);
            var perTickSpend = MD.ALCH_ARRAY[i] * potential * rec.amount * rec.cost;
            var perTickGain = MD.ALCH_ARRAY[i] * potential * MD.getAdjustedRecipeAmount(i);
            var base_res = MD.RESOURCES[rec.base_res];
            var final_res = MD.RESOURCES[rec.final_res];

            //The Crystallizing Influence upgrade changes a recipe to give great gems instead of normal, we handle this here
            if(MD.hasMageUpgrade("Crystallizing Influence") && rec.base_res == "large ant" && rec.final_res == "normal"){
                get("final-res-text1").innerHTML = "Great Gems";
                final_res = MD.RESOURCES["great"];
                MD.ALCH_RECIPES[i].final_res = "great";
                MD.updateAlchRow(i);
            }

            if(MD.hasUpgrade("Mental Energies") && rec.base_res == "dirt" && rec.final_res == "mana"){
                perTickSpend *= 5;
                perTickGain *= 5;
            }

            if(base_res.check_function(perTickSpend)){ //If we can afford the transfer
                if(rec.base_res == "dirt" && rec.final_res == "mana"){
                    MD.DIRT_TO_MANA += perTickSpend;
                }

                base_res.change_function(-perTickSpend);
                final_res.change_function(perTickGain); //Give the new resource
            }
            else if(base_res.check_function(minimumSpend)){ //If we can't afford the full amount but can afford a single transmutation
                base_res.change_function(-minimumSpend);
                final_res.change_function(minimumGain);

                if(rec.base_res == "dirt" && rec.final_res == "mana"){
                    MD.DIRT_TO_MANA += minimumSpend;
                }
            }
        }
    }
};

//If a parameter is given, updates only that row, otherwise updates all rows
MD.updateAlchCounts = function(i){
    get("total-alchemists").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS) + " (" + s(MD.alchemistsAvailable()) + " available)";
    for(var i = 0; i < MD.ALCH_RECIPES.length; i++){
        if($("#alch-row"+i).length != 0){
            MD.updateAlchRow(i);
        }
    }
};

MD.updateAlchRow = function(row){
    //Get the amount of each resource to calculate
    var rec = MD.ALCH_RECIPES[row];
    var resource = MD.RESOURCES[rec.final_res];

    //Figure out the spirit multiplier
    var resType = MD.RESOURCE_MULT_LABELS[MD.RESOURCE_SECTION_NAMES.indexOf(resource.type)];
    var resMult = MD.getResMult(resType);

    var perTick = MD.ALCH_ARRAY[row] * (MD.getAlchemistPotential()/100) * MD.getAdjustedRecipeAmount(row) * resMult;
    var perTickSpend = MD.ALCH_ARRAY[row] * (MD.getAlchemistPotential()/100) * rec.amount * rec.cost;
    var cost = MD.RESOURCES[MD.ALCH_RECIPES[row].base_res];
    
    get("alch-ratio-text"+row).innerHTML = s(MD.ALCH_RECIPES[row].cost * MD.ALCH_RECIPES[row].amount) + ":" + s(MD.getAdjustedRecipeAmount(row));
    get("alch-row-counter"+row).innerHTML = s(MD.ALCH_ARRAY[row]) + " (Creating " + s(perTick) + " " + resource.print_name + " per second from " + s(perTickSpend) + " " + cost.print_name +")";
};

MD.alchemistsAvailable = function(){
    return MD.ALCHEMISTS-sumArray(MD.ALCH_ARRAY);
};

MD.addAlch = function(i){
    var num = MD.multibuyActive() ? Math.min(10,MD.alchemistsAvailable()) : 1; //How many to add
    num = (get("alch-move-amt").value != "" ? Math.floor(Math.min(Number(get("alch-move-amt").value),MD.alchemistsAvailable())) : num);
    num = Math.max(1,num);    

    if(MD.alchemistsAvailable() > 0){
        MD.ALCH_ARRAY[i] += num;
        MD.updateAlchRow(i);
        get("total-alchemists").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS) + " (" + s(MD.alchemistsAvailable()) + " available)"
    }
};

MD.remAlch = function(i){
    var num = MD.multibuyActive() ? Math.min(10,MD.ALCH_ARRAY[i]) : 1; //How many to add
    num = (get("alch-move-amt").value != "" ? Math.floor(Math.min(Number(get("alch-move-amt").value),MD.ALCH_ARRAY[i])) : num);
    num = Math.max(1,num);

    if(MD.ALCH_ARRAY[i] > 0){
        MD.ALCH_ARRAY[i] -= num;
        MD.updateAlchRow(i);
        get("total-alchemists").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS) + " (" + s(MD.alchemistsAvailable()) + " available)"
    }
};

MD.resetAlchMove = function(){
    get("alch-move-amt").value = "";
};

MD.setAlchemistButton = function(){
    if (MD.hasStructure("Alchemist's Lair")){
        if(get("hirealchemistbutton").style.display == 'none')
            MDART.alertTab("defense");

        get("hirealchemistbutton").style.display = 'inline';

        var price = MD.ResMult(MD.ALCHEMIST_START_COST,Math.pow(MD.ALCH_MULTIPLIER,MD.ALCHEMISTS));
        get("hirealchemistbutton").innerHTML = "Hire Alchemist (" + MD.ResPrint(price) + ")";
        var hireBtn = $("#hirealchemistbutton");
        hireBtn.toggleClass("unaffordable",!MD.canAfford(price));

        var tipText = "Hire an alchemist for all your conversion needs. (" + s(MD.ALCHEMISTS) + " hired)";
        MDART.setTooltip(hireBtn,"",tipText);
    }
    else{
        get("hirealchemistbutton").style.display = 'none'
    }
};

MD.hireAlchemist = function(){
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    var price = MD.ResMult(MD.ALCHEMIST_START_COST,Math.pow(MD.ALCH_MULTIPLIER,MD.ALCHEMISTS));
    while(MD.canAfford(price) && num > 0){
        MD.spend(price);
        MD.ALCHEMISTS++;
        MD.setAlchemistButton();
        get("total-alchemists").innerHTML = "Total Alchemists: " + s(MD.ALCHEMISTS) + " (" + s(MD.alchemistsAvailable()) + " available)"

        var price = MD.ResMult(MD.ALCHEMIST_START_COST,Math.pow(MD.ALCH_MULTIPLIER,MD.ALCHEMISTS));
        num--;
    }
};

MD.getAlchemistPotential = function(){
    var pot = 0;
    for(var i = 118; i < 130; i++){
        if(MD.hasUpgrade(MD.getUpgradeById(i).name)){
            pot += 10;
        }
    }
    pot *= (MD.hasUpgrade("Alchemical Furor") ? MD.uv.level1mult : 1) * (MD.hasUpgrade("Philosopher's Stone") ? MD.uv.level2mult : 1)  * (MD.hasUpgrade("The Elric Brothers") ? MD.uv.level3mult : 1) * (MD.hasUpgrade("Flying Sparks") ? MD.uv.level4mult : 1) * (MD.hasUpgrade("Higher Learning") ? MD.uv.level5mult : 1);
    pot *= (MD.hasUpgrade("Eye of the Hurricane") ? 2 : 1);
    return pot;
};

/*-------------------------------------------------------------------------------------------------
Structures
/------------------------------------------------------------------------------------------------*/
MD.updateStructureButtons = function(){
    var show = false;
    for(var i = 0; i < MD.STRUCTURES.length; i++){
        var st = MD.STRUCTURES[i];
        var btn = get("structure" + i);
        var div = $("#structures-div");
        if(st.unlock_function() && !MD.hasStructure(st.name)){
            show = true;

            if(btn.style.display == 'none'){
                MDART.alertTab("shop");
                btn.style.display = 'inline';
                div.toggle(true);
            }
            btn.innerHTML = st.name;
            MDART.setTooltip($(btn),"",st.desc + " (" + MD.ResPrint(st.cost) + ")");
            $(btn).toggleClass("unaffordable",!MD.canAfford(st.cost))
        }
        else{
            btn.style.display = 'none';
            div.toggle(false);
        }
    }
    
    //Hide the structure header if none are unlocked
    get("structuresection").style.display = (show ? 'inline' : 'none');
};

MD.buyStructure = function(num){
    if(MD.canAfford(MD.STRUCTURES[num].cost)){
        MD.spend(MD.STRUCTURES[num].cost);
        MD.BUILDINGS_ACTIVE.push(num);
        MD.updateStructureButtons();
    }
};

MD.hasStructure = function(name){
    for(var i = 0; i < MD.BUILDINGS_ACTIVE.length; i++){
        if(MD.STRUCTURES[MD.BUILDINGS_ACTIVE[i]].name == name){
            return true;
        }
    }
    return false;
};
/*-------------------------------------------------------------------------------------------------
 UPGRADES
 /------------------------------------------------------------------------------------------------*/
MD.hasUpgrade = function(name){
    //If in the cache, return that we have it
    if(MD.UPGRADE_CACHE[name] === true){
        return true;
    }
    for (var i=0; i < MD.ACTIVE_UPGRADES.length; i++){
        var upgrade = MD.getUpgradeById(MD.ACTIVE_UPGRADES[i]);
        if (upgrade.name == name){
            MD.UPGRADE_CACHE[name] = true; //Add to the cache
            return true;
        }
    }
    return false;
};

//Given an id, get the upgrade associated
MD.getUpgradeById = function(id){
    if(id in MD.UPGRADE_ID_LOOKUP)
        return MD.UPGRADES[MD.UPGRADE_ID_LOOKUP[id]];
    else
        return null;
    // for (var i=0; i<MD.UPGRADES.length; i++){
    //     if (MD.UPGRADES[i].id == id){
    //         return MD.UPGRADES[i]
    //     }
    // }
    // return null
};

//Fills MD.UPGRADE_ID_LOOKUP - should be called when starting the game
MD.initializeUpgradeLookup = function(){
    for(var i = 0; i < MD.UPGRADES.length; i++){
        MD.UPGRADE_ID_LOOKUP[MD.UPGRADES[i].id] = i;
    }
}

MD.upgradeUnlocked = function(id){
    return MD.UNLOCKED_UPGRADES.indexOf(id) != -1
};

MD.checkUpgradeAvailablility = function(){
    for (var i = 0; i < MD.UPGRADES.length; i++){
        var upgrade = MD.UPGRADES[i];
        if(!MD.upgradeUnlocked(upgrade.id) && upgrade.unlock_function()){
            MDART.alertTab("upgrade");
            MD.UNLOCKED_UPGRADES.push(upgrade.id);
            MD.AVAILABLE_UPGRADES.push(upgrade.id)
        }
    }
};

MD.upgradeSortFunction = function(a,b){
    var first = MD.getUpgradeById(a);
    var second = MD.getUpgradeById(b);
    var result = MD.ResCompare(first.cost,second.cost)
    if (result != 0) //If they are different
        return result;
    else
        return first.id - second.id
};

MD.updateUpgradeButtons = function(){
    //Show the first 50 available upgrades
    MD.AVAILABLE_UPGRADES.sort(MD.upgradeSortFunction); //Sort upgrades by cost
    for(var i=0; i < 50; i++){
        if(i<MD.AVAILABLE_UPGRADES.length){
            var upgrade = MD.getUpgradeById(MD.AVAILABLE_UPGRADES[i]);
            var price = MD.getUpgradeCost(MD.AVAILABLE_UPGRADES[i]);
            get("buyupgrade" + i).style.display = 'inline';

            var upgradeBtn = $("#buyupgrade"+i);
            upgradeBtn.toggleClass("special-upgrade-button",upgrade.type=="nightmare");
            upgradeBtn.toggleClass("progress-upgrade-button",upgrade.type=="progress");
            upgradeBtn.toggleClass("dragon-upgrade-button",upgrade.type=="dragon");

            get("buyupgrade" + i).innerHTML =upgrade.name[0];//UPGRADES[MD.AVAILABLE_UPGRADES[i]].name

            upgradeBtn.toggleClass("unaffordable",!MD.canAfford(price));

            //Initialize jquery tooltips to display descriptions
            var tipText = upgrade.name + "  -  " + upgrade.effect + " (" + MD.ResPrint(price) + ")";
            MDART.setTooltip(upgradeBtn,"",tipText);
        }
        else{
            get("buyupgrade" + i).style.display = 'none';
            get("buyupgrade" + i).title = ""
        }
    }
};

//Updates the buttons in stats for the already purchased upgrades
MD.updateUpgradeStats = function(){
    //Find the upgrades bought
    MD.ACTIVE_UPGRADES.sort(MD.upgradeSortFunction); //Sort upgrades by cost

    var i = 0;
    var current = Boolean(get("displayupgrade" + i)); //Get the first upgrade or null if it doesn't exist
    while(current || i < MD.ACTIVE_UPGRADES.length){
        if(!current){ //If the current button doesn't exist, create it
            MDART.createButton("upgrade-display","displayupgrade" + i,"btn round-btn upgrade-button","",null)
        }

        //Update as normal
        if(i<MD.ACTIVE_UPGRADES.length){
            upgrade = MD.getUpgradeById(MD.ACTIVE_UPGRADES[i]);
            get("displayupgrade" + i).style.display = 'inline';
            get("displayupgrade" + i).innerHTML =upgrade.name[0];

            displayBtn = $("#displayupgrade"+i);
            displayBtn.toggleClass("special-upgrade-button",upgrade.type=="nightmare");
            displayBtn.toggleClass("progress-upgrade-button",upgrade.type=="progress");
            displayBtn.toggleClass("dragon-upgrade-button",upgrade.type=="dragon");

            //Initialize jquery tooltips to display descriptions
            tipText = upgrade.name + "  -  " + upgrade.description + " - " + upgrade.effect;
            MDART.setTooltip(displayBtn,"",tipText);
        }
        else{
            get("displayupgrade" + i).style.display = 'none';
            get("displayupgrade" + i).title = ""
        }

        //Update counter
        i++;
        current = Boolean(get("displayupgrade" + i));
    }

    //Display the upgrades remaining
    var remaining = MD.getRemainingUpgrades();
    remaining.sort(MD.upgradeSortFunction);

    i = 0;
    current = Boolean(get("upgraderemaining" + i)); //Get the first upgrade or null if it doesn't exist
    while(current || i < remaining.length){
        if(!current){ //If the current button doesn't exist, create it
            MDART.createButton("upgrades-remaining","upgraderemaining" + i,"btn round-btn upgrade-button","",null)
        }

        //Update as normal
        if(i<remaining.length){
            upgrade = MD.getUpgradeById(remaining[i]);
            get("upgraderemaining" + i).style.display = 'inline';
            get("upgraderemaining" + i).innerHTML =upgrade.name[0];

            displayBtn = $("#upgraderemaining"+i);

            //Initialize jquery tooltips to display descriptions
            tipText = upgrade.name + "  -  " + upgrade.description;
            MDART.setTooltip(displayBtn,"",tipText);
        }
        else{
            get("upgraderemaining" + i).style.display = 'none';
            get("upgraderemaining" + i).title = ""
        }

        //Update counter
        i++;
        current = Boolean(get("upgraderemaining" + i));
    }

    //Display the mage upgrades bought
    i = 0;
    current = Boolean(get("magepurchased" + i)); //Get the first upgrade or null if it doesn't exist
    while(current || i < MD.ACTIVE_MAGE_UPGRADES.length){
        if(!current){ //If the current button doesn't exist, create it
            MDART.createButton("mageupgrade-display","magepurchased" + i,"btn round-btn spell-button","",null)
        }

        //Update as normal
        if(i<MD.ACTIVE_MAGE_UPGRADES.length){
            upgrade = MD.getMageUpgradeById(MD.ACTIVE_MAGE_UPGRADES[i]);
            get("magepurchased" + i).style.display = 'inline';
            get("magepurchased" + i).innerHTML =upgrade.name[0];

            displayBtn = $("#magepurchased"+i);

            //Initialize jquery tooltips to display descriptions
            tipText = upgrade.name + "  -  " + upgrade.effect;
            MDART.setTooltip(displayBtn,"",tipText);
        }
        else{
            get("magepurchased" + i).style.display = 'none';
            get("magepurchased" + i).title = ""
        }

        //Update counter
        i++;
        current = Boolean(get("magepurchased" + i));
    }
};

MD.getRemainingUpgrades = function(){
    //Sort in ascending order
    MD.ACTIVE_UPGRADES.sort(function(a,b){return a - b});

    var remaining = [];
    var current = 0;
    for(var i = 0; i < MD.ACTIVE_UPGRADES.length; i++){
        while(current < MD.ACTIVE_UPGRADES[i]){ //While gaps exist in the bought upgrades
            remaining.push(current); //Add them
            current += 1;
        }
        current += 1; //Move past the contained element
    }

    //Catch elements at the end
    while(current < MD.UPGRADES.length){
        remaining.push(current);
        current += 1
    }
    return remaining;
};

MD.buyUpgrade = function(number){

    var upgrade = MD.getUpgradeById(MD.AVAILABLE_UPGRADES[number]);
    var price = MD.getUpgradeCost(MD.AVAILABLE_UPGRADES[number]);
    if (MD.canAfford(price)){
        if(upgrade.name == "Delve Greedily"){
            MDART.notify("You hear the distant sound of goblin drums.")
        }
        else if(upgrade.name == "Embrace The Swarm"){
            MDART.notify("Your skin begins to crawl.")
        }
        else if(upgrade.name == "Dark Portents"){
            MDART.notify("The air seems to grow thicker.")
        }
        else if(upgrade.name == "Oracle"){
            MD.ORACLE_CLICK_GUIDE = true;
            setTimeout(function(){MD.ORACLE_CLICK_GUIDE = false;},20000); //Draw a click guide on the oracle for 20 seconds
        }
        else if(upgrade.name == "Agriculture" || upgrade.name == "Irrigation"){ //If it's a farm upgrade, update the relevant stuff
            //Update the three farms
            var farms = [8,12,13];
            for(var i = 0; i < farms.length; i++){
                get("farm-txt"+farms[i]).innerHTML = "Harvest Data: " + s(MD.getFarmProduction(farms[i])*MD.getResMult("Raw Materials")) + " food every " + MD.convals.farmtime1 + " seconds (" + s((MD.getFarmProduction(farms[i])*MD.getResMult("Raw Materials"))/MD.convals.farmtime1) + " per second)";
            }
            MDART.drawConstructs(); //Draw the new farm image
        }
        else if(upgrade.name == "Auto-Rift 9000"){
            $("#auto-sacrifice-btn").toggle(true);
        }
        else if(upgrade.name == "Auto-Auto-Rift 9000"){
            $("#auto-auto-btn").toggle(true);
        }

        MD.spend(price)
        var upgradeId = MD.AVAILABLE_UPGRADES[number];
        MD.AVAILABLE_UPGRADES.splice(number,1);

        MD.ACTIVE_UPGRADES.push(upgradeId);
        MD.UPGRADES_BOUGHT += 1;

        MD.updateUpgradeButtons();
        MD.updateStats();
        MD.updateUpgradeStats();
    }
};

MD.getUpgradeCost = function(id){
    var cost = MD.getUpgradeById(id).cost;

    if (MD.hasUpgrade("A Fan of Upgrades"))
        cost = MD.ResMult(cost,(100-MD.uv.upgradereduction)/100);

    return cost;
};

/*-------------------------------------------------------------------------------------------------
 DIGGING
 /------------------------------------------------------------------------------------------------*/

//Multiple digs can be performed at once - they are not exactly equivalent to clicking count times in terms
//of gem amounts, but it is similar
MD.dig = function(x,y,count){
    var manual = typeof count === 'undefined';
    count = setDefault(count,1)

    var gold = MD.getPickStrength();
    MD.changeGold(gold*count);

    if(manual){
        MDART.addClickEffect("gold",x,y,"+" + s(gold) + " gold");
    }

    if(manual)
        MD.MANUAL_CLICKS += count;
    else
        MD.AUTO_CLICKS += count;

    MD.CLICKS_THIS_TICK += count;

    //Random chance of finding gems
    if(tryPercentChance(0.1*MD.PICK_LEVEL*count) && MD.TICKS >= 600){ //You can't find a gem in the first 10 minutes
        var level = tryPercentChance(10) ? 1 : 0;
        MD.findGem(level);

        if(MD.TOTAL_GEMS < 500){
            MDART.notify("You found a " + MD.GEM_OBJECTS[level].name.toLowerCase() +" gem!")
        }
    }

    //For high level picks, find gems according to a normal dist (low picks have the values set to -1,0 so no gems are found)
    var amt = (MD.PICK_LEVEL >= 16 ? 10 : 1);
    amt = (MD.PICK_LEVEL >= 18 ? 100 : amt);
    MD.getGaussianGem(MD.PICKS[MD.PICK_LEVEL].gem_mean,MD.PICKS[MD.PICK_LEVEL].gem_std,amt*count)

    if(MD.PICK_LEVEL >= 17){ //Earth Shrine Picks
        MD.changeSteel((MD.PICK_LEVEL-16)*10*count);
        if(tryPercentChance(10)){
            MD.changeAdamantium((MD.PICK_LEVEL-16)*100*(MD.CONSTRUCT_LEVELS[19]+1)*count);
        }
    }
};

/*-------------------------------------------------------------------------------------------------
 GEMS
 /------------------------------------------------------------------------------------------------*/

MD.findGem = function(i,amt){

    i = setDefault(i,0); //Default to 0
    amt = setDefault(amt,1);

    MD.changeGems(i,amt);
    MD.updateGems();
    MD.updateSocketDropDowns();
};

//This function takes a mean and standard deviation and returns a gem according to a normal distribution
//It is meant to be used for things that generally give a gem most of the time, for cases where you only want
// a gem a fraction of the time, use an if(tryPercentChance(20)) call instead.
MD.getGaussianGem = function(m,sd,amt){

    amt = setDefault(amt,1);

    var g = gaussianRandom(m,sd); //Get the nearest integer
    if(g < 0){ //No gem is earned
        return false;
    }
    else{
        //Round and ensure it is within bounds
        g = Math.round(g);
        g = Math.max(Math.min(MD.GEM_OBJECTS.length-1,g),0);
        MD.findGem(g,amt);
        return true;
    }
}

MD.changeGems = function(i,amt,nomult){
    amt *= ((amt > 0 && typeof(nomult) == "undefined") ? MD.getResMult("Gems") : 1);

    MD.GEMS[i] += amt;

    if(amt > 0){
        MD.TOTAL_GEMS += amt;
    }
};

MD.hasGems = function(i,amt){
    return MD.GEMS[i] >= amt;
};

MD.getGems = function(i){
    return MD.GEMS[i];
}

MD.updateGems = function(){
    if(MD.TOTAL_GEMS > 0){
        get("gemscount").innerHTML = "Gems: " + s(Math.round(sumArray(MD.GEMS)))
    }
    else{
        get("gemscount").innerHTML = ""
    }

    var available = false;
    for(var i = 0; i < MD.GEM_OBJECTS.length; i++){
        var gem = get("sellgem" + i);
        if(MD.GEMS[i] > 0 || MD.TOTAL_GEMS >= n("1M")){
            available = true;
            gem.style.display = 'inline';
            gem.innerHTML = "Sell " + MD.GEM_OBJECTS[i].name + " Gem (" + s(MD.GEM_OBJECTS[i].value) + " gold) <br>" + s(MD.GEMS[i]) + " Owned"; 
            
            //Set the button to unaffordable if the number is 0
            if(MD.TOTAL_GEMS >= n("1M")){
                $(gem).toggleClass("unaffordable",MD.GEMS[i] === 0);
            }
        }
        else{
            gem.style.display = 'none'
        }
    }
    if (available)
        get("sellgemsection").style.display = 'inline';
    else
        get("sellgemsection").style.display = 'none';
};

MD.sellGem = function(i){
    if(MD.GEMS[i] >= 1){
        var price = MD.GEM_OBJECTS[i].value;
        MD.changeGold(price);
        MD.changeGems(i,-1);
        MD.GEMS_SOLD++;
        MD.updateGems();
        MD.updateSocketDropDowns()
    }
};

/*-------------------------------------------------------------------------------------------------
 ENEMIES
 /------------------------------------------------------------------------------------------------*/

//Goblin constructor
MD.Goblin = function(id,lvl){
    this.id = id;
    this.lvl = lvl;
    this.strength = lvl*9;
    this.hp = 50 + lvl*5;
    this.maxhp = this.hp;
    this.name = MD.getGoblinName();

    if (id < 4){ //row 1
        this.x = MD.GOBLIN_ROW_1_X
    }
    else{
        this.x = MD.GOBLIN_ROW_2_X
    }
    this.y = MD.GOBLIN_START_Y + (id%4)*MD.GOBLIN_INCREMENT_Y;

    //Decide if the goblin is a rebel
    var chance = (MD.hasUpgrade("Teenage Rebellion") ? 10 : 1);
    this.rebel = (MD.hasUpgrade("Traitorous Goblins") && tryPercentChance(chance) && MD.hasHirelings(4,1)); //We must have at least one goblin to convert
    if(this.rebel){
        MD.changeHirelings(4,-1);
        this.hp *= 500;
        this.maxhp = this.hp;
        this.strength *= 50;
        this.name += " The Rebel";
    }
};

MD.Spider = function(id,lvl){
    this.id = id;
    this.lvl = lvl;
    this.strength = 1000 + lvl*15;
    this.hp = 2000 + lvl*10;
    this.maxhp = this.hp;
    this.name = MD.getSpiderName();

    if(this.name.indexOf("Nightmare") != -1){ //Woah.
        this.hp *= 10;
        this.maxhp *= 10;
        this.strength *= 10;
    }

    if (id < 3){ //row 1
        this.y = MD.SPIDER_ROW_1_Y
    }
    else{
        this.y = MD.SPIDER_ROW_2_Y
    }
    this.x = MD.SPIDER_START_X + (id%3)*MD.SPIDER_INCREMENT_X
};

MD.getGoblinName = function(){
    var p1 = ["Rot","Green","Slime","Filth","Grime","Putrid","Muck","Silt","Slop","Foul","Blight","Mold","Moist"];
    var p2 = ["face","beard","eyes","heart","back"];
    return p1[getRandom(0,p1.length-1)] + p2[getRandom(0,p2.length-1)]
};

MD.getSpiderName = function(){
    var p1 = ["Starbellied","Whitebanded","Whiteknee","Common","Desert","Lattice","Shamrock","Silver","Black","Dewdrop","Funnelweb","Yellowbanded","Pinktoe","Curlyhair","Longlegged","Robber","Tentweb","Burrowing","Marbled","Brown","Lined","Labyrinth","Northern","Filmy","Fringed","Hammock","Striped","Longjawed"];
    var p2 = ["Spider","Recluse","Jumper","Tarantula","Orbweaver","Widow","Wolf Spider","Antmimic","Dolomedes","Nightmare"];
    return p1[getRandom(0,p1.length-1)] + " " + p2[getRandom(0,p2.length-1)]
};

MD.startGoblinTimer = function(){

    var wait = getRandom(Math.max(1,MD.GOBLIN_TIME - MD.GOBLIN_TIME_VARIATION), MD.GOBLIN_TIME + MD.GOBLIN_TIME_VARIATION);
    if(MD.hasUpgrade("Looting Proficiency"))
        wait /= MD.uv.lootingproficiencymult;
    if(MD.hasUpgrade("Goblin's Bane"))
        wait /= MD.uv.goblinsbanemult;
    if(MD.hasUpgrade("Goblin's Scourge"))
        wait /= MD.uv.goblinsscourgemult;
    if(MD.hasUpgrade("Goblin's Terror"))
        wait /= MD.uv.goblinsterrormult;
    if(MD.GOBLIN_LURE_TIMER > -1)
        wait /= MD.LURES[0].mult;
    wait = Math.max(1,Math.round(wait));
    MD.GOBLIN_TIMER = wait;
    MD.MAX_GOBLIN_TIME = wait;
};

MD.startSpiderTimer = function() {
    var wait = getRandom(Math.max(1,MD.SPIDER_TIME - MD.SPIDER_TIME_VARIATION), MD.SPIDER_TIME + MD.SPIDER_TIME_VARIATION);
    if(MD.hasUpgrade("Covered in Web"))
        wait /= MD.uv.spidermult1;
    if(MD.hasUpgrade("Eww Eww Eww"))
        wait /= MD.uv.spidermult2;
    if(MD.hasUpgrade("Arachnid Mangler"))
        wait /= MD.uv.spidermult3;
    if(MD.hasUpgrade("Shelob Slasher"))
        wait /= MD.uv.spidermult4;
    wait = Math.max(1,Math.round(wait));
    MD.SPIDER_TIMER = wait;
    MD.MAX_SPIDER_TIME = wait;
};

MD.updateGoblinTimer = function(){
    if(MD.hasUpgrade("Delve Greedily") && MD.GOBLIN_TIMER == -1){
        MD.startGoblinTimer()
    }
    else if(MD.GOBLIN_TIMER > 0){
        MD.GOBLIN_TIMER--;
        if (MD.GOBLIN_TIMER == 0){
            MD.triggerGoblinTimer();
        }
    }
};

MD.updateSpiderTimer = function(){
    if(MD.hasUpgrade("Embrace The Swarm") && MD.SPIDER_TIMER == -1){
        MD.startSpiderTimer()
    }
    else if(MD.SPIDER_TIMER > 0){
        MD.SPIDER_TIMER--;
        if (MD.SPIDER_TIMER == 0){
            MD.triggerSpiderTimer()
        }
    }
};

MD.triggerGoblinTimer = function(){
    var possible_locations = [];
    for (var i = 0; i < MD.GOBLIN_PRESENT.length; i++){
        if(MD.GOBLIN_PRESENT[i] == false)
            possible_locations.push(i)
    }
    if (possible_locations.length != 0){ //If we found at least one available space
        i = possible_locations[Math.floor(Math.random()*possible_locations.length)];
        MD.GOBLIN_PRESENT[i] = true; //Put a goblin in one of the spots

        var level = getRandom(Math.max(1,MD.GOBLIN_LEVEL - MD.GOBLIN_LEVEL_VARIATION),MD.GOBLIN_LEVEL + MD.GOBLIN_LEVEL_VARIATION);

        MD.GOBLIN_OBJECT[i] = new MD.Goblin(i,level);

        if (!MD.hasUpgrade("Goblin's Bane") || tryPercentChance(1)) //After 2 spawn speed upgrades, only show occasional messages
            MDART.notify("A level " + s(Math.ceil(level),true) + " goblin appears!")
    }
    MD.startGoblinTimer();
};

MD.triggerSpiderTimer = function(){
    var possible_locations = [];
    for (var i = 0; i < MD.SPIDER_PRESENT.length; i++){
        if(MD.SPIDER_PRESENT[i] == false)
            possible_locations.push(i)
    }
    if (possible_locations.length != 0){ //If we found at least one available space
        i = possible_locations[Math.floor(Math.random()*possible_locations.length)];
        MD.SPIDER_PRESENT[i] = true; //Put a spider in one of the spots

        var level = getRandom(Math.max(1,MD.SPIDER_LEVEL - MD.SPIDER_LEVEL_VARIATION),MD.SPIDER_LEVEL + MD.SPIDER_LEVEL_VARIATION);

        MD.SPIDER_OBJECT[i] = new MD.Spider(i,level);

        if (!MD.hasUpgrade("Eww Eww Eww") || tryPercentChance(1))
            MDART.notify("A level " + s(Math.ceil(level),true) + " spider appears!")
    }
    MD.startSpiderTimer();
};

//Used when loading to create new goblin objects
MD.respawnGoblins = function(){
    for(var i=0; i < MD.GOBLIN_PRESENT.length; i++){
        if(MD.GOBLIN_PRESENT[i] == true){
            var level = getRandom(Math.max(1,MD.GOBLIN_LEVEL - MD.GOBLIN_LEVEL_VARIATION),MD.GOBLIN_LEVEL + MD.GOBLIN_LEVEL_VARIATION);
            MD.GOBLIN_OBJECT[i] = new MD.Goblin(i,level)
        }
    }
};

MD.respawnSpiders = function(){
    for(var i=0; i < MD.SPIDER_PRESENT.length; i++){
        if(MD.SPIDER_PRESENT[i] == true){
            var level = getRandom(Math.max(1,MD.SPIDER_LEVEL - MD.SPIDER_LEVEL_VARIATION),MD.SPIDER_LEVEL + MD.SPIDER_LEVEL_VARIATION);
            MD.SPIDER_OBJECT[i] = new MD.Spider(i,level)
        }
    }
};

MD.processGoblinAttack = function(){
    for (var i = 0; i < MD.GOBLIN_PRESENT.length; i++){
        if (MD.GOBLIN_PRESENT[i]){
            if (MD.WALL_LEVEL > 0){
                var damage = MD.GOBLIN_OBJECT[i].strength / (MD.activeDragon("Baby") ? 2 : 1);
                MD.WALL_STRENGTH -= damage;
                MD.GOBLIN_DAMAGE += damage;
                if (MD.WALL_STRENGTH <= 0){
                    MD.destroyWall()
                }
            }
        }
        MD.updateWallMessage()
    }
};

MD.processSpiderAttack = function(){
    for (var i = 0; i < MD.SPIDER_PRESENT.length; i++){
        if (MD.SPIDER_PRESENT[i]){
            if (MD.WALL_LEVEL > 0){
                MD.WALL_STRENGTH -= MD.SPIDER_OBJECT[i].strength;
                if (MD.WALL_STRENGTH <= 0){
                    MD.destroyWall()
                }
            }

            if(tryPercentChance(Math.min(5,0.1*MD.SPIDER_OBJECT[i].lvl)) && MD.GEMS[0] >= 1){
                MD.changeGems(0,-1);
                if (!MD.hasUpgrade("Eww Eww Eww") || tryPercentChance(1))
                    MDART.notify("A spider has destroyed a gem!");
                MD.updateGems()
            }
        }
        MD.updateWallMessage()
    }
};

MD.clickGoblin = function(i){
    var dmg = MD.getPickStrength();
    MD.damageGoblin(i,dmg)
};

MD.clickSpider = function(i) {
    var dmg = MD.getPickStrength();
    MD.damageSpider(i,dmg)
};

MD.damageGoblin = function(i,d,dealer){
    dealer = typeof dealer !== 'undefined' ? dealer : "click"; //Default to click

    MD.GOBLIN_OBJECT[i].hp -= d;
    if (MD.GOBLIN_OBJECT[i].hp <= 0){
        MD.killGoblin(i);
        if(dealer == "mage"){
            var manaChange = 1*MD.getManaMultiplier();
            MD.changeMana(manaChange);
            MD.GOBLINS_KILLED_BY_MAGES++;
            MD.updateMagePage()
        }
    }
    MDART.drawGoblin(); //Health bars don't require a full redraw, so we don't call updateUnits()
};

MD.damageSpider = function(i,d,dealer){
    dealer = typeof dealer !== 'undefined' ? dealer : "click"; //Default to click

    MD.SPIDER_OBJECT[i].hp -= d;
    if (MD.SPIDER_OBJECT[i].hp <= 0){
        MD.killSpider(i);
        if(dealer == "mage"){
            var manaChange = 5*MD.getManaMultiplier();
            MD.changeMana(manaChange);
            MD.SPIDERS_KILLED_BY_MAGES++;
            MD.updateMagePage()
        }
    }
    drawSpiders(); //Health bars don't require a full redraw, so we don't call updateUnits()
};

MD.killGoblin = function(i){
    var name = MD.GOBLIN_OBJECT[i].name;
    var level = MD.GOBLIN_OBJECT[i].lvl;
    var rebel = MD.GOBLIN_OBJECT[i].rebel

    MD.GOBLIN_OBJECT[i] = null;
    MD.GOBLIN_PRESENT[i] = false;
    MD.GOBLINS_KILLED += 1;

    //Compute new Goblin level
    if(MD.GOBLINS_KILLED % MD.GOBLIN_KILLS_PER_LEVEL == 0)
        MD.GOBLIN_LEVEL += 1;

    //Award prize
    var gold = MD.GOBLIN_REWARD*level + getRandom(0,MD.GOBLIN_REWARD*level*(MD.GOBLIN_REWARD_VARIATION/100));

    //Apply upgrades
    if(MD.hasUpgrade("Looting Proficiency"))
        gold *= MD.uv.lootingproficiencymult;
    if(MD.hasUpgrade("Goblin's Bane"))
        gold *= MD.uv.goblinsbanemult;
    if(MD.hasUpgrade("Goblin's Scourge"))
        gold *= MD.uv.goblinsscourgemult;
    if(MD.hasUpgrade("Goblin's Terror"))
        gold *= MD.uv.goblinsterrormult;
    if(MD.activeDragon("Youngling") || MD.activeDragon("Eternal"))
        gold *= 1000;
    if(rebel)
        gold *= 1000;

    gold = Math.floor(gold);
    MD.changeGold(gold);

    var msg = "Killed " + name + " the level " + s(Math.ceil(level),true) + " goblin and received " + s(gold,true) + " gold!";

    //Random stuff
    if(tryPercentChance(Math.min(0.1*MD.GOBLIN_LEVEL,25)))
        MD.findGem();

    //Rewards for killing a rebel
    if(rebel){
        MD.changeDragonscale(getRandom(10,30));
        MD.changeHirelings(4,3);

        if(MD.hasUpgrade("Teenage Rebellion")){
            MD.changeDragonscale(getRandom(100,300));
            var types = ["fire","earth","lightning","water"];
            var amt = MD.activeDragon("Youngling") ? 5 : 2;
            amt *= (MD.hasUpgrade("King of the Sky") ? 10 : 1);
            var resource = MD.RESOURCES[types[getRandom(0,3)]];
            resource.change_function(amt); //Random essence
            msg += " You have also absorbed " + s(amt*MD.getResMult("Essence"),true) + " " + resource.print_name + " from your fallen foe."
        }
    }

    if (!MD.hasUpgrade("Goblin's Bane") || tryPercentChance(1) || rebel) //After 2 spawn speed upgrades, only show occasional messages
        MDART.notify(msg,true);

    MD.updateGoblinsKilled();
    MDART.updateUnits()
};

MD.killSpider = function(i){
    var name = MD.SPIDER_OBJECT[i].name;
    var level = MD.SPIDER_OBJECT[i].lvl;

    MD.SPIDER_OBJECT[i] = null;
    MD.SPIDER_PRESENT[i] = false;
    MD.SPIDERS_KILLED += 1;

    //Compute new Goblin level
    if(MD.SPIDERS_KILLED % MD.SPIDER_KILLS_PER_LEVEL == 0)
        MD.SPIDER_LEVEL += 1;

    //Award prize
    var gold = MD.SPIDER_REWARD*level + getRandom(0,MD.SPIDER_REWARD*level*(MD.SPIDER_REWARD_VARIATION/100));

    if(MD.hasUpgrade("Covered in Web"))
        gold *= MD.uv.spidermult1;
    if(MD.hasUpgrade("Eww Eww Eww"))
        gold *= MD.uv.spidermult2;
    if(MD.hasUpgrade("Arachnid Mangler"))
        gold *= MD.uv.spidermult3;
    if(MD.hasUpgrade("Shelob Slasher"))
        gold *= MD.uv.spidermult4;

    gold = Math.floor(gold);
    MD.changeGold(gold);

    if (!MD.hasUpgrade("Eww Eww Eww") || tryPercentChance(1))
        MDART.notify("Killed a level " + s(Math.ceil(level),true) + " " + name + " and received " + s(gold,true) + " gold!");

    //Random stuff
    if(tryPercentChance(Math.min(0.5*MD.SPIDER_LEVEL,50)))
        MD.findGem(3);

    MDART.updateUnits()
};

MD.updateGoblinsKilled = function(){
    get("goblinkilledcount").innerHTML = "Goblins Killed: " + MD.GOBLINS_KILLED
};

MD.countGoblins = function(){
    var count = 0;
    for(var i=0; i<MD.GOBLIN_PRESENT.length;i++){
        if (MD.GOBLIN_PRESENT[i])
            count += 1
    }
    return count
};

MD.countSpiders = function(){
    var count = 0;
    for(var i=0; i<MD.SPIDER_PRESENT.length;i++){
        if (MD.SPIDER_PRESENT[i])
            count += 1
    }
    return count
};

MD.updateOracle = function(){
    if (MD.hasUpgrade("Oracle")) {
        $("#oracle-div").qtip("enable"); // Enables the tooltip
        var tipText = "Next Goblin Attack: " + getTime(MD.GOBLIN_TIMER) + "<br>";
        if(MD.SPIDER_TIMER != -1)
            tipText += "Next Spider Attack: " + getTime(MD.SPIDER_TIMER) + "<br>";
        if(MD.GOBLIN_LURE_TIMER > 0)
            tipText += "Remaining Lure Time: " + getTime(MD.GOBLIN_LURE_TIMER) + "<br>";
        MDART.setTooltip($("#oracle-div"),"Oracle",tipText);
    }
    else{
        $("#oracle-div").qtip("disable"); // Disables the tooltip
    }
};

MD.updateOracleWisdom = function(){
    var i = 0;
    for(i = 0; i < MD.ORACLE_TEACHINGS.length; i++){
        var teaching = MD.ORACLE_TEACHINGS[i];
        if(!teaching.complete_function()){
            get("oracle-teaching").innerHTML = teaching.text;
            break;
        }
    }
    if(i == MD.ORACLE_TEACHINGS.length){
        get("oracle-teaching").innerHTML = "I have no more visions to share - do as you will."
    }
}

/*-------------------------------------------------------------------------------------------------
 TRAPS
 /------------------------------------------------------------------------------------------------*/
MD.updateTrapMenu = function(){
    var available = false;
    for (var i = 0; i < MD.TRAPS.length; i++){
        var btn = get("trap" + i);
        if(MD.TRAPS[i].unlock_function()){
            available = true;
            btn.innerHTML = "Buy " + MD.TRAPS[i].name + " (" + s(MD.TRAPS[i].base_cost * Math.pow(MD.TRAPS[i].exponent,MD.TRAPS_BOUGHT[i])) + ")";
            var trapBtn = $("#trap" + i);
            trapBtn.toggleClass("unaffordable",MD.TRAPS[i].base_cost * Math.pow(MD.TRAPS[i].exponent,MD.TRAPS_BOUGHT[i]) > MD.GOLD);

            var tipText = MD.TRAPS[i].description;
            MDART.setTooltip(trapBtn,"",tipText);

            if(btn.style.display == 'none')
                MDART.alertTab("defense");
            btn.style.display = 'inline'
        }
        else{
            btn.style.display = 'none'
        }
    }
    if(available){
        get("trapsection").style.display = 'inline';
        get("resettrap").style.display = 'inline';      
    }
    else{
        get("trapsection").style.display = 'none';
        get("resettrap").style.display = 'none';
    }
};

MD.updateLures = function(){
    var available = false;
    for (var i = 0; i < MD.LURES.length; i++){
        var btn = get("lure" + i);
        if(MD.LURES[i].unlock_function()){
            available = true;
            btn.innerHTML = "Buy " + MD.LURES[i].name + " (" + s(MD.LURES[i].base_cost * Math.pow(MD.LURES[i].exponent,MD.LURES_BOUGHT[i])) + ")";
            var lureBtn = $("#lure" + i);
            lureBtn.toggleClass("unaffordable",MD.LURES[i].base_cost * Math.pow(MD.LURES[i].exponent,MD.LURES_BOUGHT[i]) > MD.GOLD);

            var tipText = MD.LURES[i].description;
            MDART.setTooltip(lureBtn,"",tipText);

            if(btn.style.display == 'none')
                MDART.alertTab("defense");
            btn.style.display = 'inline';
        }
        else{
            btn.style.display = 'none';
        }
    }
    if(available){
        get("luresection").style.display = 'inline';
        get("resetlure").style.display = 'inline';
    }
    else{
        get("luresection").style.display = 'none';
        get("resetlure").style.display = 'none';
    }
};

MD.buyTrap = function(i){
    var num = MD.multibuyActive() ? 10 : 1; //How many to buy
    var cost = MD.TRAPS[i].base_cost * Math.pow(MD.TRAPS[i].exponent,MD.TRAPS_BOUGHT[i]);
    while(MD.GOLD >= cost && num > 0){
        MD.changeGold(-1*cost);
        MD.TRAPS_BOUGHT[i]++;

        if(i < 3)
            MD.GOBLIN_TIMER += MD.TRAPS[i].time;
        else
            MD.SPIDER_TIMER += MD.TRAPS[i].time;

        //Update maximum
        if (MD.GOBLIN_TIMER > MD.MAX_GOBLIN_TIME)
            MD.MAX_GOBLIN_TIME = MD.GOBLIN_TIMER;

        cost = MD.TRAPS[i].base_cost * Math.pow(MD.TRAPS[i].exponent,MD.TRAPS_BOUGHT[i]);
        num--;
    }
    MD.updateTrapMenu();
};

MD.buyLure = function(i){
    var cost = MD.LURES[i].base_cost * Math.pow(MD.LURES[i].exponent,MD.LURES_BOUGHT[i]);
    if(MD.GOLD >= cost){
        MD.changeGold(-1*cost);
        MD.LURES_BOUGHT[i]++;

        MD.GOBLIN_LURE_TIMER += MD.LURES[i].time;

        //Reset the MD.GOBLIN_TIMER
        MD.GOBLIN_TIMER = -1;

        MD.updateLures();
    }
};

MD.updateLureTimer = function(){
    if(MD.GOBLIN_LURE_TIMER >= 0)
        MD.GOBLIN_LURE_TIMER--;
};

MD.resetLures = function(){
    MD.GOBLIN_LURE_TIMER = -1;
}

MD.resetTraps = function(){
    if(MD.GOBLIN_TIMER > 60){
        MD.GOBLIN_TIMER = -1;
    }
    if(MD.SPIDER_TIMER > 200){
        MD.SPIDER_TIMER = -1;
    }

    MD.updateTrapMenu();
};

/*-------------------------------------------------------------------------------------------------
 RANDOM EVENTS
 /------------------------------------------------------------------------------------------------*/
MD.findBuriedTreasure = function(){
    //Get gold
    var base = MD.GOLD/40;
    var variance = MD.GOLD/50;
    var gold = Math.floor(getRandom(base-variance,base+variance)); //Gives 2.5% +- 2% plus 1000
    var max = (MD.hasUpgrade("Gold Forever") ? 7200 * MD.uv.goldforevermult : 7200);
    gold = Math.min(gold,MD.GOLD_PER_SECOND * max)+72; //Cap the amount at 2 hours worth of gold (min 72)
    
    //Get gems
    var gems = 0;
    if(MD.hasUpgrade("Gleaming Treasure")){
        gems = Math.floor(getRandom(20,50));
    }

    MD.changeGold(gold);
    MD.changeGems(0,gems);
    MD.TREASURES_FOUND++;
    var message = "You found a buried treasure containing " + s(gold,true) + " gold"
    if(gems > 0)
        message += " and " + s(gems) + " gems!";
    else
        message += "!";
    MDART.notify(message)
};

MD.hardDrivePricing = function(){
    var base = MD.GOLD/10;
    var i = 1;
    for(; i < 6; i++){
        if (Math.pow(1000,i+1) > base){
            break
        }
    }
    var gold = Math.pow(1000,i);
    var actual = Math.pow(1024,i);
    MD.changeGold(actual);
    MDART.notify("A confused hard drive vendor claims to give you " + s(gold) + " gold but you receive " + s(actual) + ". It's about time.")
};

/*-------------------------------------------------------------------------------------------------
 USER INTERFACE
 /------------------------------------------------------------------------------------------------*/
MD.showMenu = function(){
    MDART.restoreBtn("menuButton");
    MD.showScreen("menu-area");
};

MD.showStats = function(){
    MDART.restoreBtn("statsButton");
    MD.showScreen("stats-area");
};

MD.showMages = function(){
    MDART.restoreBtn("magesButton");
    MD.showScreen("mage-area");
};

MD.showCrafting = function(){
    MDART.restoreBtn("craftingButton");
    MD.showScreen("crafting-area");
};

MD.showAlch = function(){
    MDART.restoreBtn("alchButton");
    MD.showScreen("alch-area");
};

MD.showIndustry = function(){
    MDART.restoreBtn("indButton");
    MD.showScreen("industry-area");
};

MD.showMilitary = function(){
    MDART.restoreBtn("warButton");
    MD.showScreen("military-area");
    $('#construct-dialog-9').dialog('close'); //Sometimes the dialog is reached from the barracks dialog, so we close that here
};

MD.showMechanist = function(){
    MDART.restoreBtn("mechButton");
    MD.showScreen("mechanist-area");
    $('#construct-dialog-18').dialog('close'); //Sometimes the dialog is reached from the barracks dialog, so we close that here
};

MD.showDragons = function(){
    MDART.restoreBtn("dragonButton");
    MD.showScreen("dragon-area");
    $('#construct-dialog-22').dialog('close'); //Sometimes the dialog is reached from the barracks dialog, so we close that here
};

MD.showArch = function(){
    MDART.restoreBtn("libButton");
    MD.showScreen("arch-area");
    $('#construct-dialog-24').dialog('close'); //Sometimes the dialog is reached from the barracks dialog, so we close that here
};

MD.showOracleArea = function(){
    if(MD.hasUpgrade("Oracle")){
        MD.ORACLE_CLICK_GUIDE = false;
        MD.showScreen("oracle-area");
    }
};

MD.showScreen = function(s){
    if(MD.CURRENT_SCREEN == s){
        MD.showCanvas()
    }
    else{
        //Hide the current div
        get(MD.CURRENT_SCREEN).style.zIndex="0";
        $("#" + MD.CURRENT_SCREEN).toggle(false);

        //Set the new div
        MD.CURRENT_SCREEN = s;
        get(MD.CURRENT_SCREEN).style.zIndex="1";
        $("#" + MD.CURRENT_SCREEN).toggle(true);
        get("screen-area").style.overflow = 'scroll'
    }
};

function showExport(so){
    if(MD.CURRENT_SCREEN == "export-area"){
        MD.showCanvas();
    }
    else{
        MD.showScreen("export-area");
        get("export-code").innerHTML = so
        var codeArea = $("#export-code");
        codeArea.focus();
        codeArea.select();
    }
}

MD.showCanvas = function(){
    if(MD.CURRENT_SCREEN != "canvas-container")
        MD.showScreen("canvas-container");
        get("screen-area").style.overflow = 'hidden'
};

//To use at the beginning of the game - it initalizes the divs
MD.hideAllScreens = function(){
    $("#menu-area").toggle(false);
    $("#stats-area").toggle(false);
    $("#mage-area").toggle(false);
    $("#alch-area").toggle(false);
    $("#crafting-area").toggle(false);
    $("#export-area").toggle(false);
    $("#oracle-area").toggle(false);
    $("#industry-area").toggle(false);
    $("#military-area").toggle(false);
    $("#mechanist-area").toggle(false);
    $("#dragon-area").toggle(false);
    $("#arch-area").toggle(false);
};

MD.changeNumberSystem = function(){
    if(MD.NUMBER_SYSTEM == "SS")
        MD.setNumberSystem("SI");
    else if(MD.NUMBER_SYSTEM == "SI")
        MD.setNumberSystem("SN");
    else
        MD.setNumberSystem("SS");
};

MD.setNumberSystem = function(ns){
    if(ns == "SI"){
        MD.NUMBER_SYSTEM = "SI";
        get("changeNumberSystem").innerHTML = "Number Format: SI Suffixes";
    }
    else if(ns == "SS"){
        MD.NUMBER_SYSTEM = "SS";
        get("changeNumberSystem").innerHTML = "Number Format: Short Scale";
    }
    else{
        MD.NUMBER_SYSTEM = "SN";
        get("changeNumberSystem").innerHTML = "Number Format: Scientific Notation";
    }
};

MD.bindEvents = function(){
    $("#pop-amt").on("input",MD.habitationInputChange);
};

MD.changePurchaseAmount = function(){
    MD.FORCE_CONTROL = !MD.FORCE_CONTROL;
    get("changePurchaseAmount").innerHTML = "Force Control (Multibuy): " + (MD.FORCE_CONTROL ? "Yes" : "No");
};

MD.toggleNotifications = function(){
    MD.SHOW_NOTIFICATIONS = !MD.SHOW_NOTIFICATIONS;
    if(MD.SHOW_NOTIFICATIONS)
        get("disableNotificationButton").innerHTML = "Disable Notifications";
    else
        get("disableNotificationButton").innerHTML = "Enable Notifications";
};

MD.toggleClickEffects = function(){
    MD.SHOW_CLICK_EFFECTS = !MD.SHOW_CLICK_EFFECTS;
    if(MD.SHOW_CLICK_EFFECTS)
        get("disableEffectsButton").innerHTML = "Disable Click Effects";
    else
        get("disableEffectsButton").innerHTML = "Enable Click Effects";
};

/*-------------------------------------------------------------------------------------------------
ELEMENT SETUP
 /------------------------------------------------------------------------------------------------*/
MD.setupDialogs = function(){
    //Setup building dialogs
    var dialog_width = 500;
    $("#prep-land-dialog").dialog({
        title: "Prepare Land",
        minWidth: dialog_width,
    });
    $("#prep-land-dialog").dialog("close");

    $("#busy-dialog").dialog({
        title: "Men At Work",
        minWidth: dialog_width,
    });
    $("#busy-dialog").dialog("close");

    $("#start-construction-dialog").dialog({
        title: "Start Construction",
        minWidth: dialog_width,
    });
    $("#start-construction-dialog").dialog("close");

    $("#move-construct-dialog").dialog({
        title: "Move Structures",
        minWidth: dialog_width,
    });
    $("#move-construct-dialog").dialog("close");

    //Setup construct dialogs
    for(var i = 0; i < MD.CONSTRUCTS.length; i++){
        $("#construct-dialog-" + i).dialog({
            title: MD.CONSTRUCTS[i].name + ((MD.CONSTRUCT_LEVELS[i] > 0 && i != 7) ? (" - Level " + s(MD.CONSTRUCT_LEVELS[i],true)) : ""),
            minWidth: dialog_width,
            maxHeight: window.innerHeight,
        });
        $("#construct-dialog-" + i).dialog("close");
    }

    //Custom behaviour
    $("#construct-dialog-6").on( "dialogbeforeclose",function(event, ui){MD.MARKET_DIALOG_OPEN = false;});
};

MD.prepareDropdowns = function(){
    //Fill Dropdown
    var dd = get("gem-combine-limit");
    clearSelectBox(dd);

    for(var i = 0; i < MD.GEM_OBJECTS.length; i++){
        var opt = document.createElement('option');
        opt.innerHTML = MD.GEM_OBJECTS[i].name;
        opt.value = i;
        dd.appendChild(opt)            
    }

    dd.value = MD.GEM_COMBINE_LIMIT;
};

MD.prepareUI = function(){
    if(MD.SHOW_NOTIFICATIONS)
        get("disableNotificationButton").innerHTML = "Disable Notifications";
    else
        get("disableNotificationButton").innerHTML = "Enable Notifications";

    if(MD.SHOW_CLICK_EFFECTS)
        get("disableEffectsButton").innerHTML = "Disable Click Effects";
    else
        get("disableEffectsButton").innerHTML = "Enable Click Effects";
}

/*-------------------------------------------------------------------------------------------------
 UPDATE FUNCTIONS
 /------------------------------------------------------------------------------------------------*/

MD.tick = function() {

    //var startTime = new Date().getTime()
    MD.TICKS++;
    MD.FAST_TICK_COUNT = 0; //Fast tick count helps us track time between ticks, we synchronize it here

    MD.updateResources();
    MD.updateUpgrades();
    MD.updateMages();
    MD.updateMasons();
    MD.updateAlchemists();
    MD.updateCrafting();
    MD.updateIndustry();
    MD.updateMilitary();
    MD.updateMachinist();
    MD.updateDragons();
    MD.updateArcaneum();
    MD.setHirelingButtons();

    MD.processMages();
    MD.processGoblinAttack();
    MD.processSpiderAttack();
    MD.processMasons();
    MD.processIndustry();
    MD.processBlindRevenge();
    MD.processAutoSacrifice();

    MD.updateGoblinTimer();
    MD.updateSpiderTimer();
    MD.updateLureTimer();
    MD.updateOracle();
    MD.updateOracleWisdom();

    MD.testRandomEvents();

    MD.updateStats();
    MD.updateDisplay();

    MD.updateVisuals();

    if(MD.TICKS % 30 == 0){
        MD.autoSave();
        MDART.updateBackground(); //This is unrelated to saving, but it doesn't need to be called often so I'm putting it here
    }

    //Reset this after all other processing in the tick is done
    MD.CLICKS_THIS_TICK = 0;

    //var endTime = new Date().getTime()
    //console.log(endTime-startTime)
};

MD.fast_tick = function() {
    MDART.drawOracle(MD.GOBLIN_TIMER,MD.SPIDER_TIMER); //We draw on the fast tick, but update the qtip each second

    MD.FAST_TICK_COUNT++;
};

MD.updateResources = function(){
    MD.processQueens();
    MD.processChrysalis();
    MD.processHunters();
    MD.processWyvernAdamantium();
    MD.updateGoldPerSecond();
    MD.processDirtProduction();
    MD.processSpecialHirelings();
    MD.delayGold(MD.GOLD_PER_SECOND,10, MD.TICKS)
};

MD.updateDisplay = function(){
    MD.updatePickDisplay();
    MD.updateWallMessage();
    MD.setBuildWallMessage(MD.WALL_LEVEL + 1);
    MD.setBuyPickMessage(MD.PICK_LEVEL+1);

    MD.updateStructureButtons();

    MD.updateTrapMenu();
    MD.updateLures();

    MD.updateGems();
    MD.updateDirtDisplay();
}

MD.updateUpgrades = function(){
    MD.checkUpgradeAvailablility();
    MD.updateUpgradeButtons()
};

MD.updateStats = function(){
    get("timeelapsed").innerHTML = "Time: " + getTime(MD.TICKS);
    get("totalgold").innerHTML = "Total Gold: " + s(MD.TOTAL_GOLD);
    get("totalmana").innerHTML = (MD.TOTAL_MANA > 0) ? "Total Mana: " + s(MD.TOTAL_MANA) : "";  
    get("totalimbue").innerHTML = (sumArray(MD.IMBUEMENT_LEVEL) > 0) ? "Total Imbuements: " + s(sumArray(MD.IMBUEMENT_LEVEL)) : "";   
    get("totalgems").innerHTML = (MD.TOTAL_GEMS > 0) ? "Total Gems: " + s(MD.TOTAL_GEMS) : "";
    get("goblinkilledcount").innerHTML = (MD.GOBLINS_KILLED > 0) ? "Goblins Killed: " + s(MD.GOBLINS_KILLED) : "";
    get("spiderkilledcount").innerHTML = (MD.SPIDERS_KILLED > 0) ? "Spiders Killed: " + s(MD.SPIDERS_KILLED) : "";
    get("manualclickcount").innerHTML = "Manual Clicks: " + s(MD.MANUAL_CLICKS);
    get("autoclickcount").innerHTML = (MD.AUTO_CLICKS > 0) ? "Automatic Clicks: " + s(MD.AUTO_CLICKS) : "";
    get("treasuresfound").innerHTML = (MD.TREASURES_FOUND > 0) ? "Treasures Found: " + s(MD.TREASURES_FOUND) : "";
    get("markettrades").innerHTML = (MD.MARKET_TRADES > 0) ? "Market Trades: " + s(MD.MARKET_TRADES) : "";
    get("goblinsacrificed").innerHTML = (MD.GOBLINS_SACRIFIED > 0) ? "Goblins Sacrificed: " + s(MD.GOBLINS_SACRIFIED) : "";
    get("campaignswon").innerHTML = (MD.CAMPAIGNS_WON > 0) ? "Campaigns Won: " + s(MD.CAMPAIGNS_WON) : "";
    get("soldierslost").innerHTML = (MD.SOLDIERS_LOST > 0) ? "Soldiers Lost: " + s(MD.SOLDIERS_LOST) : "";
    get("maxdraglevel").innerHTML = (MD.MAX_DRAGON_LEVEL > 0) ? "Highest Dragon Level: " + s(MD.MAX_DRAGON_LEVEL) : "";
    get("dragonssacrificed").innerHTML = (MD.DRAGONS_SACRIFICED > 0) ? "Dragons Sacrificed: " + s(MD.DRAGONS_SACRIFICED) : "";
    get("totaltraps").innerHTML = (sumArray(MD.TRAPS_BOUGHT) > 0) ? "Traps Bought: " + s(sumArray(MD.TRAPS_BOUGHT)) : "";
    get("totallures").innerHTML = (MD.LURES_BOUGHT[0] > 0) ? "Lures Bought: " + s(MD.LURES_BOUGHT[0]) : "";
    get("totalfort").innerHTML = (MD.TIMES_FORTIFIED > 0) ? "Wall Fortifications: " + s(MD.TIMES_FORTIFIED) : "";
    get("upgradecount").innerHTML = "Upgrades Bought: " + MD.UPGRADES_BOUGHT + " out of " + MD.UPGRADES.length;
    get("upgraderemainingcount").innerHTML = "Upgrades Remaining: " + (MD.UPGRADES.length-MD.UPGRADES_BOUGHT) + " out of " + MD.UPGRADES.length
    get("mageupgradecount").innerHTML = "Upgrades Bought: " + MD.ACTIVE_MAGE_UPGRADES.length + " out of " + MD.MAGE_UPGRADES.length;

    //Industry
    get("totalfood").innerHTML = (MD.TOTAL_FOOD > 0) ? "Total Food: " + s(MD.TOTAL_FOOD) : "";
    get("totaldirt").innerHTML = (MD.TOTAL_DIRT > 0) ? "Total Dirt: " + s(MD.TOTAL_DIRT) : "";
    get("totalstone").innerHTML = (MD.TOTAL_STONE > 0) ? "Total Stone: " + s(MD.TOTAL_STONE) : "";
    get("totalcoal").innerHTML = (MD.TOTAL_COAL > 0) ? "Total Coal: " + s(MD.TOTAL_COAL) : "";
    get("totaliron").innerHTML = (MD.TOTAL_IRON > 0) ? "Total Iron: " + s(MD.TOTAL_IRON) : "";
    get("totalsteel").innerHTML = (MD.TOTAL_STEEL > 0) ? "Total Steel: " + s(MD.TOTAL_STEEL) : "";
    get("totaladam").innerHTML = (MD.TOTAL_ADAMANTIUM > 0) ? "Total Adamantium: " + s(MD.TOTAL_ADAMANTIUM) : "";

    //Essence
    get("totalfire").innerHTML = (MD.TOTAL_FIRE_ESSENCE > 0) ? "Total Fire Essence: " + s(MD.TOTAL_FIRE_ESSENCE) : "";
    get("totalwater").innerHTML = (MD.TOTAL_WATER_ESSENCE > 0) ? "Total Water Essence: " + s(MD.TOTAL_WATER_ESSENCE) : "";
    get("totalearth").innerHTML = (MD.TOTAL_EARTH_ESSENCE > 0) ? "Total Earth Essence: " + s(MD.TOTAL_EARTH_ESSENCE) : "";
    get("totallightning").innerHTML = (MD.TOTAL_LIGHTNING_ESSENCE > 0) ? "Total Lightning Essence: " + s(MD.TOTAL_LIGHTNING_ESSENCE) : "";
    get("totalspirit").innerHTML = (MD.TOTAL_SPIRIT_ESSENCE > 0) ? "Total Spirit Essence: " + s(MD.TOTAL_SPIRIT_ESSENCE) : "";

    //Totals
    get("totalhirelings").innerHTML = (MD.totalHirelings() > 0) ? "Total Non-Ant Hirelings: " + s(MD.totalHirelings()) : "";
    get("totalconstruct").innerHTML = (MD.totalConstructLevel() > 0) ? "Total Industry Level: " + s(MD.totalConstructLevel()) : "";

};

MD.updateMages = function(){
    MD.updateMageButtons();
    MD.updateMagePage();
    MD.setMageButton();

    //Delving Mages
    MD.checkMageGems();

    //Auras
    MD.updateAuraTime();

    var aura_duration = (MD.hasUpgrade("Durable Mana Channels") ? MD.AURA_DURATION*2 : MD.AURA_DURATION);
    if(MD.hasUpgrade("Eternal Energy")){
        aura_duration *= 2;
    }
    if(MD.hasUpgrade("Instant Power")){
        aura_duration *= 2;
    }
    if(MD.TICKS % aura_duration == 0){
        MD.decrementAuras();  
    }
};

MD.updateMasons = function(){
    MD.setMasonButton()
};

MD.updateAlchemists = function(){
    MD.updateAlchButton();
    MD.setAlchemistButton();
    MD.updateAlchPage();
    MD.processAlchemists();
};

MD.updateCrafting = function(){
    MD.updateCraftingButtons();
    MD.updateCraftingPage();
};

MD.updateIndustry = function(){
    MD.updateIndustryButton();
    MD.checkConstructs();
};

MD.updateMachinist = function(){
    MD.updateMechPage();
    MD.updateMechButton();
};

MD.updateDragons = function(){
    MD.updateDragonButton();
    MD.updateDragonPage();
};

MD.updateArcaneum = function(){
    MD.updateArchButton();
    MD.updateArchPage();
};

MD.updateMilitary = function(){
    MD.updateMilitaryButton();
    MD.updateMilitaryPage();
};

MD.testRandomEvents = function(){
    //Random events
    var chance = (MD.hasUpgrade("Pirate's Luck") ? 0.4 : 0.2);
    chance += (MD.hasUpgrade("Ten Thousand Foot View") ? 1 : 0);
    if(tryPercentChance(chance))
        MD.findBuriedTreasure();
    else if(tryPercentChance(0.02))
        MD.hardDrivePricing()
};

MD.updateVisuals = function(){
    MDART.updateUnits();
}

function getTime(t){
    var days = Math.floor(t/86400);
    t %= 86400;
    var hours = Math.floor(t/3600);
    t %= 3600;
    var minutes = Math.floor(t/60);
    t %= 60;
    var seconds = t;

    var rtr = "";
    if (days != 0)
        rtr += s(days) + (days==1 ? " day, " : " days, ");
    if (days != 0 || hours != 0)
        rtr += hours + (hours==1 ? " hour, " : " hours, ");
    if (days != 0 || hours != 0 || minutes != 0)
        rtr += minutes + (minutes==1 ? " minute, " : " minutes, ");
    if (days != 0 || hours != 0 || minutes != 0 || seconds != 0)
        rtr += seconds + (seconds==1 ? " second" : " seconds");
    return rtr
}

/*-------------------------------------------------------------------------------------------------
 RESOURCE MODIFIERS
 /------------------------------------------------------------------------------------------------*/
MD.changeGold = function(amount){
    amount *= ((amount > 0) ? MD.getResMult("Basic") : 1);

    MD.GOLD += amount;

    if(amount > 0)
        MD.TOTAL_GOLD += amount; //Total_gold measures all gold ever gained

    get("goldcount").innerHTML="Gold: " + s(Math.floor(MD.GOLD));
};

MD.hasGold = function(amount){
    return MD.GOLD >= amount;
};

MD.getGold = function(){
    return MD.GOLD;
};

MD.spend = function(c){
    for(var p in c){
        var resource = p.toLowerCase();
        var amt = c[p];

        var res = MD.RESOURCES[resource];
        if(res != null){
            res.change_function(-amt);
        }
        else
            console.log("Error - Unknown Resource - " + resource);
    }
};

MD.earn = function(c){
    for(var p in c){
        var resource = p.toLowerCase();
        var amt = c[p];

        var res = MD.RESOURCES[resource];
        if(res != null){
            res.change_function(amt);
        }
        else
            console.log("Error - Unknown Resource - " + resource);
    }
};

MD.canAfford = function(c){
    for(var p in c){
        var resource = p.toLowerCase();
        var amt = c[p];
        var res = MD.RESOURCES[resource];
        
        if(res != null){
            if(!res.check_function(amt))
                return false;
        }
        else
            console.log("Error - Unknown Resource - " + resource);
    }
    return true;
};

MD.updateGoldPerSecond = function(){
    MD.GOLD_PER_SECOND = 0;

    var i;
    //Calculate gold from hirelings
    for (i=0; i<MD.HIRELINGS.length;i++){
        MD.GOLD_PER_SECOND += MD.HIRELINGS_OWNED[i] * MD.getProduction(i)
    }

    //Calculate gold from upgrades
    if (MD.hasUpgrade("Delve Greedily"))
        MD.GOLD_PER_SECOND *= MD.uv.delvegreedilymult;
    if (MD.hasUpgrade("Embrace The Swarm"))
        MD.GOLD_PER_SECOND *= MD.uv.embranceswarmmult;
    if (MD.hasUpgrade("The First Steps"))
        MD.GOLD_PER_SECOND *= MD.uv.timeupgrade1;
    if (MD.hasUpgrade("Tick Tock Time"))
        MD.GOLD_PER_SECOND *= MD.uv.timeupgrade2;
    if (MD.hasUpgrade("Flowing Like A River"))
        MD.GOLD_PER_SECOND *= MD.uv.timeupgrade3;
    if (MD.hasUpgrade("Chronological Torrent"))
        MD.GOLD_PER_SECOND *= MD.uv.timeupgrade4;
    if (MD.hasUpgrade("Encouraging Achievements"))
        MD.GOLD_PER_SECOND *= (1+(MD.uv.gpsperupgrade * MD.UPGRADES_BOUGHT)/100);

    //Calculate gold from wizards
    MD.GOLD_PER_SECOND *= 1+(MD.getMagesDelving()/100);

    //Calculate gold from gems gps_increase
    for(i = 0; i < MD.PICK_SOCKETS.length; i++){
        if(MD.PICK_SOCKETS[i] != null)
            MD.GOLD_PER_SECOND *= (1+(MD.GEM_OBJECTS[MD.PICK_SOCKETS[i]].gps_increase/100))
    }

    //Calculate Lightning Shrine Multiplier
    if(MD.hasConstruct("Lightning Shrine")){
        MD.GOLD_PER_SECOND *= Math.pow(MD.CONSTRUCT_LEVELS[21]+1,1.1);
    }

    if(MD.hasUpgrade("Electric Current")){
        MD.GOLD_PER_SECOND *= 4;
    }

    //Calculate loss from Goblins
    var numGoblins = MD.countGoblins();
    var lossPercent;
    if (MD.WALL_LEVEL == 0 && numGoblins > 0){
        lossPercent = ((80/MD.GOBLIN_PRESENT.length)*numGoblins);
        MD.GOLD_PER_SECOND *= (1-(lossPercent/100));//If you have x% of max goblins and no wall, lose x*0.8% of your gps
    }

    var gpsMessage = "Gold Per Second: " + s(roundTenth(MD.GOLD_PER_SECOND * MD.getResMult("Basic"))); //Round to the tenth
    if (MD.WALL_LEVEL == 0 && numGoblins > 0){
        lossPercent = ((80/MD.GOBLIN_PRESENT.length)*numGoblins);
        gpsMessage += " (" + s(Math.round(lossPercent)) + "% stolen by goblins)"
    }
    get("gpscount").innerHTML= gpsMessage
};

//Spreads the earned gold out over a second, instead of giving it all at once
MD.delayGold = function(gold,n, startTicks){
    if(n != 0 && MD.TICKS >= startTicks){ //The start ticks check makes sure this stops if we reset
        MD.changeGold(gold/10);
        setTimeout(function(){MD.delayGold(gold,--n,startTicks)},100)
    }
};

/*-------------------------------------------------------------------------------------------------
 SAVE/LOAD
 /------------------------------------------------------------------------------------------------*/
MD.autoSave = function(){
    MD.saveToLocalStorage()
};

MD.saveToLocalStorage = function(){
    var so = getSaveObject();
    localStorage.setItem(MD.HTML5_LOCAL_STORAGE_NAME,so);
    MDART.notify("Save Successful")
};

MD.loadLocalStorage = function(){
    var so = localStorage.getItem(MD.HTML5_LOCAL_STORAGE_NAME);
    if(so != null){
        MD.loadSaveObject(so)
    }
};

MD.resetGame = function(){
    var r=confirm("Are you sure you want to reset your game?");
    if (r==true){
        r = confirm("Are you REALLY sure? This game has no prestige system - you will go back to the beginning!");
        if (r==true){
            clearLocalStorage();
            MD.resetVariables();
            MD.resetAlchTable();
            MDART.oracle_ctx.clearRect(0,0,MDART.oracle_canvas.width,MDART.oracle_canvas.height); //Clear the oracle canvas
            MDART.update();
            MD.tick();
            MDART.notify("Game reset!");
            MD.showCanvas()
        }
    }
};

function clearLocalStorage(){
    localStorage.removeItem(MD.HTML5_LOCAL_STORAGE_NAME)
}

MD.exportGame = function(){
    var so = getSaveObject();
    showExport(so)
};

MD.importGame = function(){
    var so = prompt("Please enter your save object:","");
    if (so != null){
        try{
            MD.loadSaveObject(so);

            //Clean up things that need to be changed
            MD.UPGRADE_CACHE = {};
            MD.resetAlchTable();
            MD.setupDialogs();

            MDART.notify("Game Imported!");
        }
        catch(err){
            window.alert("The save file failed to import. This is likely caused by not including all the characters.");
        }
    }
};

function getSaveObject(){
    var sototal = {};

    sototal.version = MD.VERSION;

    var so = {};
    so.gold = MD.GOLD;
    so.totalgold = MD.TOTAL_GOLD;
    so.picklevel = MD.PICK_LEVEL;
    so.picksock = MD.PICK_SOCKETS;
    so.walllevel = MD.WALL_LEVEL;
    so.wallstrength = MD.WALL_STRENGTH;
    so.fortlevel = MD.FORTIFICATION_LEVEL;
    so.masons = MD.MASONS;
    so.hireowned = MD.HIRELINGS_OWNED;
    so.unlocked = MD.UNLOCKED_UPGRADES;
    so.available = MD.AVAILABLE_UPGRADES;
    so.active = MD.ACTIVE_UPGRADES;
    so.gobpresent = MD.GOBLIN_PRESENT;
    so.goblevel = MD.GOBLIN_LEVEL;
    so.gps = MD.GOLD_PER_SECOND;
    so.bought = MD.UPGRADES_BOUGHT;
    so.gobkilled = MD.GOBLINS_KILLED;
    so.gobtime = MD.GOBLIN_TIMER;
    so.goblure = MD.GOBLIN_LURE_TIMER;
    so.gobkilledm = MD.GOBLINS_KILLED_BY_MAGES;
    so.traps = MD.TRAPS_BOUGHT;
    so.lures = MD.LURES_BOUGHT;
    so.dirt = MD.DIRT;
    so.totdirt = MD.TOTAL_DIRT;
    so.stone = MD.STONE;
    so.totstone = MD.TOTAL_STONE;
    so.coal = MD.COAL;
    so.totcoal = MD.TOTAL_COAL;
    so.iron = MD.IRON;
    so.totiron = MD.TOTAL_IRON;
    so.steel = MD.STEEL;
    so.totsteel = MD.TOTAL_STEEL;
    so.adam = MD.ADAMANTIUM;
    so.totadam = MD.TOTAL_ADAMANTIUM;
    so.drasca = MD.DRAGONSCALE;
    so.totdrasca = MD.TOTAL_DRAGONSCALE;
    so.flax = MD.FLAX;
    so.totflax = MD.TOTAL_FLAX;
    so.food = MD.FOOD;
    so.totfood = MD.FOOD;
    so.pop = MD.POPULATION;
    so.totpop = MD.TOTAL_POPULATION;
    so.sollost = MD.SOLDIERS_LOST;

    so.fireess = MD.FIRE_ESSENCE;
    so.totfireess = MD.TOTAL_FIRE_ESSENCE;
    so.wateress = MD.WATER_ESSENCE;
    so.totwateress = MD.TOTAL_WATER_ESSENCE;
    so.earthess = MD.EARTH_ESSENCE;
    so.totearthess = MD.TOTAL_EARTH_ESSENCE;
    so.lightningess = MD.LIGHTNING_ESSENCE;
    so.totlightningess = MD.TOTAL_LIGHTNING_ESSENCE;
    so.spiritess = MD.SPIRIT_ESSENCE;
    so.totspiritess = MD.TOTAL_SPIRIT_ESSENCE;

    so.spipres = MD.SPIDER_PRESENT;
    so.spitime = MD.SPIDER_TIMER;
    so.spilevel = MD.SPIDER_LEVEL;
    so.spikilled = MD.SPIDERS_KILLED;
    so.spikilledm = MD.SPIDERS_KILLED_BY_MAGES;

    so.manclicks = MD.MANUAL_CLICKS;
    so.autclicks = MD.AUTO_CLICKS;
    so.ticks = MD.TICKS;
    so.treasuresfound = MD.TREASURES_FOUND;
    so.camwon = MD.CAMPAIGNS_WON;
    so.totgem = MD.TOTAL_GEMS;

    so.mfight = MD.MAGES_FIGHTING;
    so.mconc = MD.MAGES_MEDITATING;
    so.mdelv = MD.MAGES_DELVING;
    so.mexp = MD.MANA;
    so.tmexp = MD.TOTAL_MANA;
    so.magemaxtime = MD.MAGE_MAX_TIME;
    so.imbuelvl = MD.IMBUEMENT_LEVEL;

    so.wood = MD.WOOD;
    so.buildunlocked = MD.BUILDINGS_UNLOCKED;
    so.buildavailable = MD.BUILDINGS_AVAILABLE;
    so.buildactive = MD.BUILDINGS_ACTIVE;
    so.mages = MD.MAGES;
    so.gems = MD.GEMS;
    so.gsold = MD.GEMS_SOLD;
    so.spellunlocked = MD.ACTIVE_MAGE_UPGRADES;

    so.alchim = MD.ALCHEMISTS;
    so.alcharr = MD.ALCH_ARRAY;

    so.conlocs = MD.CONSTRUCT_LOCATIONS;
    so.constat = MD.CONSTRUCTION_STATUS;
    so.conlevs = MD.CONSTRUCT_LEVELS;
    so.asgem = MD.AUTO_SMITH_GEM;
    so.aslim = MD.AUTO_SMITH_LIMIT;
    so.mtres = MD.MAGE_TOWER_RESEARCH;
    so.comblim = MD.GEM_COMBINE_LIMIT;
    so.shownot = MD.SHOW_NOTIFICATIONS;
    so.showeff = MD.SHOW_CLICK_EFFECTS;
    so.pitsmelt = MD.PIT_SMELTING;
    so.blinrev = MD.BLIND_REVENGE;
    so.autrift = MD.AUTO_RIFT;
    so.currate = MD.CURRENT_RATES;
    so.gobsac = MD.GOBLINS_SACRIFIED;
    so.macauto = MD.MACHINIST_AUTO;

    so.adran = MD.ADMIN_RANGE;
    so.distim = MD.DISPLAYED_TIME;

    so.anteat = MD.ANTS_EATEN;
    so.timefort = MD.TIMES_FORTIFIED;
    so.gobdam = MD.GOBLIN_DAMAGE;
    so.dirtman = MD.DIRT_TO_MANA;
    so.martrade = MD.MARKET_TRADES;

    so.curdrag = MD.CURRENT_DRAGON;
    so.draglev = MD.DRAGON_LEVEL;
    so.maxdrag = MD.MAX_DRAGON_LEVEL;
    so.dragown = MD.DRAGONS_OWNED;
    so.mdragprice = MD.MASTER_DRAGON_PRICE;
    so.dragsac = MD.DRAGONS_SACRIFICED;

    so.archarr = MD.ARCH_ARRAY;

    so.numsystem = MD.NUMBER_SYSTEM;

    sototal.saveObject = Base64.encode(JSON.stringify(so))

    return Base64.encode(JSON.stringify(sototal))
}

MD.loadSaveObject = function(so){
    MD.setVariablesToDefault();
    extracted = JSON.parse(Base64.decode(so));
    var version = Number(extracted.version);
    if (version < 0.82){
        MD.extractSaveObject(so); //The save object is stored together

        //If the user had a swarm pick before I added Rhenium, they would be downgraded, fix that here (this only applies for users going from .80 to .82)
        if(MD.PICK_LEVEL == 12)
            MD.PICK_LEVEL++;
    }
    else{
        MD.extractSaveObject(extracted.saveObject)
    }
};

MD.extractSaveObject = function(so){
    so = JSON.parse(Base64.decode(so));

    //var soVersion = so.version;
    MD.GOLD = so.gold;
    MD.TOTAL_GOLD = so.totalgold;
    MD.setWall(so.walllevel,so.fortlevel);
    MD.WALL_STRENGTH = so.wallstrength;

    MD.MASONS = so.masons;
    MD.HIRELINGS_OWNED = so.hireowned;

    //Account for new hirelings
    if (MD.HIRELINGS_OWNED.length == 9)
        MD.HIRELINGS_OWNED.push(0);
    if (MD.HIRELINGS_OWNED.length == 10)
        MD.HIRELINGS_OWNED.push(0);
    if (MD.HIRELINGS_OWNED.length == 11)
        MD.HIRELINGS_OWNED.push(0);
    if (MD.HIRELINGS_OWNED.length == 12)
        MD.HIRELINGS_OWNED.push(0);
    if (MD.HIRELINGS_OWNED.length == 13)
        MD.HIRELINGS_OWNED.push(0);

    MD.UNLOCKED_UPGRADES = so.unlocked;
    MD.AVAILABLE_UPGRADES = so.available;
    MD.ACTIVE_UPGRADES = so.active;
    MD.GOBLIN_PRESENT = so.gobpresent;
    MD.GOBLIN_LEVEL = so.goblevel;
    MD.GOLD_PER_SECOND = so.gps;
    MD.UPGRADES_BOUGHT = so.bought;
    MD.GOBLINS_KILLED = so.gobkilled;
    MD.MANUAL_CLICKS = so.manclicks;
    MD.AUTO_CLICKS = (so.autclicks == undefined) ? 0 : so.autclicks;
    MD.TICKS = so.ticks;

    MD.WOOD = so.wood;
    MD.BUILDINGS_UNLOCKED = so.buildunlocked;
    MD.BUILDINGS_AVAILABLE = so.buildavailable;
    MD.BUILDINGS_ACTIVE = so.buildactive;
    MD.MAGES = so.mages;
    MD.GEMS = so.gems;

    //Account for change in gems
    if (typeof(MD.GEMS) == "number")
        MD.GEMS =  [MD.GEMS,0,0,0,0,0,0,0,0,0];

    MD.ACTIVE_MAGE_UPGRADES = so.spellunlocked;

    //Defaults needed
    MD.setNumberSystem((so.numsystem == undefined) ? "SS" : so.numsystem);
    MD.TREASURES_FOUND = (so.treasuresfound == undefined) ? 0 : so.treasuresfound;
    MD.CAMPAIGNS_WON = (so.camwon == undefined) ? 0 : so.camwon;
    MD.TOTAL_GEMS = (so.totgem == undefined) ? 0 : so.totgem;
    MD.GEMS_SOLD = (so.gsold == undefined) ? 0 : so.gsold;
    MD.MAGES_FIGHTING = (so.mfight == undefined) ? MD.MAGES : so.mfight;
    MD.MAGES_MEDITATING = (so.mconc == undefined) ? 0 : so.mconc;
    MD.MAGES_DELVING = (so.mdelv == undefined) ? 0 : so.mdelv;
    MD.MANA = (so.mexp == undefined) ? 0 : so.mexp;
    MD.TOTAL_MANA = (so.tmexp == undefined) ? 0 : so.tmexp;
    MD.GOBLINS_KILLED_BY_MAGES = (so.gobkilledm == undefined) ? 0 : so.gobkilledm;
    MD.GOBLIN_TIMER = (so.gobtime == undefined) ? -1 : so.gobtime;
    MD.GOBLIN_LURE_TIMER = (so.goblure == undefined) ? -1 : so.goblure;
    MD.MAGE_MAX_TIME = (so.magemaxtime == undefined) ? 0 : so.magemaxtime;

    MD.DIRT = (so.dirt == undefined) ? 0 : so.dirt;
    MD.TOTAL_DIRT = (so.totdirt == undefined) ? 0 : so.totdirt;
    MD.STONE = (so.stone == undefined) ? 0 : so.stone;
    MD.TOTAL_STONE = (so.totstone == undefined) ? 0 : so.totstone;
    MD.COAL = so.coal;
    MD.TOTAL_COAL = (so.totcoal == undefined) ? 0 : so.totcoal;
    MD.IRON = (so.iron == undefined) ? 0 : so.iron;;
    MD.TOTAL_IRON = (so.totiron == undefined) ? 0 : so.totiron;
    MD.STEEL = so.steel;
    MD.TOTAL_STEEL = (so.totsteel == undefined) ? 0 : so.totsteel;
    MD.ADAMANTIUM = (so.adam == undefined) ? 0 : so.adam;
    MD.TOTAL_ADAMANTIUM = (so.totadam == undefined) ? 0 : so.totadam;
    MD.DRAGONSCALE = (so.drasca == undefined) ? 0 : so.drasca;
    MD.TOTAL_DRAGONSCALE = (so.totdrasca == undefined) ? 0 : so.totdrasca;
    MD.FLAX = (so.flax == undefined) ? 0 : so.flax;
    MD.TOTAL_FLAX = (so.totflax == undefined) ? 0 : so.totflax;
    MD.FOOD = (so.food == undefined) ? 0 : so.food;
    MD.TOTAL_FOOD = (so.totfood == undefined) ? 0 : so.totfood;

    MD.FIRE_ESSENCE = (so.fireess == undefined) ? 0 : so.fireess;
    MD.TOTAL_FIRE_ESSENCE = (so.totfireess == undefined) ? 0 : so.totfireess;
    MD.WATER_ESSENCE = (so.wateress == undefined) ? 0 : so.wateress;
    MD.TOTAL_WATER_ESSENCE = (so.totwateress == undefined) ? 0 : so.totwateress;
    MD.EARTH_ESSENCE = (so.earthess == undefined) ? 0 : so.earthess;
    MD.TOTAL_EARTH_ESSENCE = (so.totearthess == undefined) ? 0 : so.totearthess;
    MD.LIGHTNING_ESSENCE = (so.lightningess == undefined) ? 0 : so.lightningess;
    MD.TOTAL_LIGHTNING_ESSENCE = (so.totlightningess == undefined) ? 0 : so.totlightningess;
    MD.SPIRIT_ESSENCE = (so.spiritess == undefined) ? 0 : so.spiritess;
    MD.TOTAL_SPIRIT_ESSENCE = (so.totspiritess == undefined) ? 0 : so.totspiritess;

    MD.IMBUEMENT_LEVEL = (so.imbuelvl == undefined) ? [0,0,0,0,0,0,0,0,0,0,0] : so.imbuelvl;
    if (MD.IMBUEMENT_LEVEL.length == 11) //Account for Wyverns
        MD.IMBUEMENT_LEVEL.push(0);
    if (MD.IMBUEMENT_LEVEL.length == 12) //Account for Wyverns
        MD.IMBUEMENT_LEVEL.push(0);
    if (MD.IMBUEMENT_LEVEL.length == 13) //Account for Dragon hunters
        MD.IMBUEMENT_LEVEL.push(0);

    MD.TRAPS_BOUGHT = (so.traps == undefined) ? [0,0,0] : so.traps;
    if (MD.TRAPS_BOUGHT.length == 3)
        MD.TRAPS_BOUGHT.push(0);
    if (MD.TRAPS_BOUGHT.length == 4)
        MD.TRAPS_BOUGHT.push(0);

    MD.LURES_BOUGHT = (so.lures == undefined) ? [0] : so.lures;

    MD.PICK_SOCKETS = (so.picksock == undefined) ? [] : so.picksock;

    //Spiders
    MD.SPIDER_PRESENT = (so.spipres == undefined) ? [false,false,false,false,false,false] : so.spipres;
    MD.SPIDER_LEVEL = (so.spilevel == undefined) ? 1 : so.spilevel;
    MD.SPIDER_TIMER = (so.spitime == undefined) ? -1 : so.spitime;
    MD.SPIDERS_KILLED = (so.spikilled == undefined) ? 0 : so.spikilled;
    MD.SPIDERS_KILLED_BY_MAGES = (so.spikilledm == undefined) ? 0 : so.spikilledm;

    //Alchemy
    MD.ALCHEMISTS = (so.alchim == undefined) ? 0 : so.alchim;
    MD.ALCH_ARRAY = (so.alcharr == undefined) ? [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] : so.alcharr;

    //Industry
    MD.CONSTRUCT_LOCATIONS = (so.conlocs == undefined) ? new Array(25) : so.conlocs;
    MD.CONSTRUCTION_STATUS = (so.constat == undefined) ? new Array(25) : so.constat;
    MD.CONSTRUCT_LEVELS = (so.conlevs == undefined) ? [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] : so.conlevs;

    MD.AUTO_SMITH_GEM = (so.asgem == undefined) ? 0 : so.asgem;
    MD.AUTO_SMITH_LIMIT = (so.aslim == undefined) ? null : so.aslim;
    MD.MAGE_TOWER_RESEARCH = (so.mtres == undefined) ? 0 : so.mtres;
    MD.GEM_COMBINE_LIMIT = (so.comblim == undefined) ? 9 : so.comblim;
    MD.SHOW_NOTIFICATIONS = (so.shownot == undefined) ? true : so.shownot;
    MD.SHOW_CLICK_EFFECTS = (so.showeff == undefined) ? true : so.showeff;
    MD.PIT_SMELTING = (so.pitsmelt == undefined) ? true : so.pitsmelt;

    //Current rates may be missing some, check that here
    MD.CURRENT_RATES = (so.currate == undefined) ? [] : so.currate;
    while(MD.CURRENT_RATES.length < MD.EXCHANGE_RATES.length){
        MD.CURRENT_RATES.push(MD.getMarketRate());
    }

    MD.ANTS_EATEN = (so.anteat == undefined) ? 0 : so.anteat;
    MD.TIMES_FORTIFIED = (so.timefort == undefined) ? 0 : so.timefort;
    MD.GOBLIN_DAMAGE = (so.gobdam == undefined) ? 0 : so.gobdam;
    MD.DIRT_TO_MANA = (so.dirtman == undefined) ? 0 : so.dirtman;
    MD.MARKET_TRADES = (so.martrade == undefined) ? 0 : so.martrade;

    MD.GOBLINS_SACRIFIED = (so.gobsac == undefined) ? 0 : so.gobsac;
    MD.MACHINIST_AUTO = (so.macauto == undefined) ? [false,false,false] : so.macauto;

    MD.ADMIN_RANGE = (so.adran == undefined) ? 10 : so.adran;
    MD.DISPLAYED_TIME = (so.distim == undefined) ? 10 : so.distim;  

    //Dragons
    MD.CURRENT_DRAGON = (so.curdrag == undefined) ? -1 : so.curdrag;
    MD.DRAGON_LEVEL = (so.draglev == undefined) ? 0 : so.draglev;
    MD.MAX_DRAGON_LEVEL = (so.maxdrag == undefined) ? 0 : so.maxdrag;
    MD.DRAGONS_OWNED = (so.dragown == undefined) ? [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false] : so.dragown;
    MD.MASTER_DRAGON_PRICE = (so.mdragprice == undefined) ? null : so.mdragprice;
    MD.DRAGONS_SACRIFICED = (so.dragsac == undefined) ? 0 : so.dragsac;

    MD.toggleAutoSacrifice((so.autrift == undefined) ? false : so.autrift);
    MD.toggleBlindRevenge((so.blinrev == undefined) ? false : so.blinrev); //Here as it depends on dragons sacrificed

    //Archaneum
    MD.ARCH_ARRAY = (so.archarr == undefined) ? [0,0,0,0,0,0] : so.archarr;


    //GetPopulationMax relies on the value of construct_levels, so we set it here
    MD.POPULATION = (so.pop == undefined) ? MD.getPopulationMax() : so.pop;
    MD.TOTAL_POPULATION = (so.totpop == undefined) ? MD.getPopulationMax() : so.totpop;
    MD.SOLDIERS_LOST = (so.sollost == undefined) ? 0 : so.sollost;

    if(MD.CURRENT_RATES.length == 5){
        MD.CURRENT_RATES.push(100);
    }

    //Do this last to ensure the unlock conditions are already set
    MD.setPickLevel(so.picklevel);

    //Updates
    MD.updateGoblinsKilled();
    MD.respawnGoblins();
    MD.respawnSpiders();
    MD.setHirelingButtons();
    MD.setMasonButton();
    MD.setMageButton();
    MD.setAlchemistButton();
    MD.updateUpgradeStats();

    MDART.update();
};

MD.resetVariables = function(){
    MD.UPGRADE_CACHE = {}; //Reset the cache
    MD.setVariablesToDefault();

    //Updates
    MD.updateGoblinsKilled();
    MD.respawnGoblins();
    MD.respawnSpiders();
    MD.setHirelingButtons();
    MD.setMasonButton();
    MD.setMageButton();
    MD.setAlchemistButton();
    MD.updateGems();
    MD.updateUpgradeStats();
    MD.updateTrapMenu();
    MD.updateLures();
    MD.updatePopulationDisplay();
    MD.initializeConstructUnlocked();

    MD.updateButtons()
};

MD.updateButtons = function(){
    MD.updateCraftingButtons();
    MD.updateAlchButton();
    MD.updateStructureButtons();
    MD.updateIndustryButton();
    MD.updateMilitaryButton();
    MD.updateMechButton();
    MD.updateDragonButton();
    MD.updateArchButton();
};

/*-------------------------------------------------------------------------------------------------
 CANVAS
 /------------------------------------------------------------------------------------------------*/
MDART = {}; //The object that stores drawing and canvas related stuff

//Initialize canvases
MDART.initializeCanvas = function(){
    var parent_div = $("#screen-area"); 
    var div = $(".canvas-container");

    //Generally height is the limiting factor, if not we use width
    var ratio = parent_div.height()/div.height();
    if(494*ratio > parent_div.width()){
        ratio = parent_div.width()/div.width();
    }

    MDART.canvas_ratio = ratio; //Store for later use

    div.width(544*ratio).height(494*ratio);

    //Note - canvases have two dimension values, one for the number of pixels when drawing on the
    //canvas and one for the size on the screen (internal pixels are stretched to make up for it)
    //We fix the internal size and adjust the screen size
    MDART.bg_canvas = get("background-canvas");
    MDART.bg_canvas.width = 544;
    MDART.bg_canvas.height = 494;
    $("#background-canvas").width(544*ratio).height(494*ratio);
    MDART.bg_ctx = MDART.bg_canvas.getContext("2d");

    MDART.units_canvas = get("units-canvas");
    MDART.units_canvas.width = 544;
    MDART.units_canvas.height = 494;
    $("#units-canvas").width(544*ratio).height(494*ratio);
    MDART.units_ctx = MDART.units_canvas.getContext("2d");

    MDART.animation_canvas = get("animation-canvas");
    MDART.animation_canvas.width = 544;
    MDART.animation_canvas.height = 494;
    $("#animation-canvas").width(544*ratio).height(494*ratio);
    MDART.animation_ctx = MDART.animation_canvas.getContext("2d");

    //Oracle canvas
    MDART.oracle_div = get("oracle-div");
    MDART.oracle_canvas = get("oracle-canvas");
    MDART.oracle_canvas.width = MDART.oracle_div.clientWidth;
    MDART.oracle_canvas.height = MDART.oracle_div.clientHeight;
    MDART.oracle_ctx = MDART.oracle_canvas.getContext("2d");

    //Set up mouse processing (animation canvas is the top level, so they go there - in the future perhaps they should be directed to the relevant canvas for each click option)
    MDART.animation_canvas.addEventListener("mousedown", MDART.mouseDownEvent, false);
    MDART.oracle_canvas.addEventListener("mousedown",MD.oracleClicked,false);

    window.onresize = MDART.adjustGameSize;
};

//Contains all functions needed when the screen is resized
MDART.adjustGameSize = function(){
    MDART.resizeCanvas();
    MDART.resizeIndustryCanvas();
};

//Resizes the canvas when needed as the window changes
MDART.resizeCanvas = function(){
    var parent_div = $("#screen-area"); 
    var div = $(".canvas-container");

    //Generally height is the limiting factor, if not we use width
    var ratio = parent_div.height()/div.height();
    if(494*ratio > parent_div.width()){
        ratio = parent_div.width()/div.width();
    }

    //Get the initial dimensions
    var wi = div.width();
    var hi = div.height();

    if(isFinite(ratio) && ratio > 0){
        div.width(wi*ratio).height(hi*ratio);
        $("#background-canvas").width(wi*ratio).height(hi*ratio);
        $("#units-canvas").width(wi*ratio).height(hi*ratio);
        $("#animation-canvas").width(wi*ratio).height(hi*ratio);
    }

    MDART.canvas_ratio = div.width()/544; //Reset the ratio used in click calculations
};

//Full update
MDART.update = function(){ //Refresh the graphics
    MDART.updateBackground();
    MDART.updateUnits();
    MDART.updateIndustryCanvas();
};

//Partial update Functions
MDART.updateBackground = function() {
    MDART.bg_ctx.clearRect(0,0,MDART.bg_canvas.width,MDART.bg_canvas.height);
    if (MDART.bg_loaded) {

        MDART.bg_ctx.drawImage(MDART.background,0,0);

        drawWall();
    }
};

MDART.updateUnits = function(){
    MDART.units_ctx.clearRect(0,0,MDART.units_canvas.width,MDART.units_canvas.height);
    MDART.drawGoblin();
    drawSpiders();
    MDART.drawMages();

    if(MD.MANUAL_CLICKS == 0 && MD.TICKS <= 30){
        var midx = MDART.units_canvas.width/2;
        var midy = MDART.units_canvas.height/2;
        MDART.drawClickGuide(midx-77,midy-77,154,154,"Click Here!");
    }
};

//Click Effects
MDART.ClickEffect = function(type,x,y,text,life){
    this.type; //Determines color for different resources
    this.x = x;
    this.y = y;
    this.text = text;
    this.life = life; //How long it has existed for
};

MDART.addClickEffect = function(type,x,y,text){
    if(MD.SHOW_CLICK_EFFECTS){
        MD.CLICK_EFFECTS[MD.CLICK_EFFECT_POSITION] = new MDART.ClickEffect(type,x,y,text,0);
        MD.CLICK_EFFECT_POSITION = (MD.CLICK_EFFECT_POSITION+1)%MD.CLICK_EFFECTS.length;
    }
}

MDART.drawClickEffects = function(){
    MDART.animation_ctx.font="12px Arial";
    MDART.animation_ctx.fillStyle = "gold";

    for(var i = 0; i < MD.CLICK_EFFECTS.length; i++){
        var eff = MD.CLICK_EFFECTS[i];
        if(eff != null){
            MDART.animation_ctx.fillText(eff.text,eff.x,eff.y);
        }
    }
};

MDART.updateClickEffects = function(){
    for(var i = 0; i < MD.CLICK_EFFECTS.length; i++){
        var eff = MD.CLICK_EFFECTS[i];
        if(eff != null){
            eff.life++;
            if(eff.life > MD.CLICK_EFFECT_LIFE){
                MD.CLICK_EFFECTS[i] = null;
            }

            eff.y -= MD.CLICK_EFFECT_Y;
            eff.x += (Math.floor(eff.life/4) % 2 == 0) ? -1 : 1;
        }
    }
};

//Starts an animation with n states over tt total time (in ms)
MDART.startAnimation = function(n,tt){
    MDART.ANIMATION_CLOCK = setInterval(function(){MDART.updateAnimation(n)},tt/(2*n)); //2 times n is requires to make click effects seem fluid
};

MDART.updateAnimation = function(n){
    if(MD.MOVE_SPRITE)
        MD.SPRITE_POS = (MD.SPRITE_POS+1)%n;
    MD.MOVE_SPRITE = !MD.MOVE_SPRITE;

    MDART.animation_ctx.clearRect(0,0,MDART.animation_canvas.width,MDART.animation_canvas.height);
    MDART.drawMiner();

    if(MD.SHOW_CLICK_EFFECTS){
        MDART.drawClickEffects();
        MDART.updateClickEffects();
    }
};

function drawWall() {
    if (MD.WALL_LEVEL > 0){
        MDART.bg_ctx.beginPath();
        MDART.bg_ctx.lineWidth="15";
        MDART.bg_ctx.strokeStyle=MD.WALLS[MD.WALL_LEVEL].color;
        MDART.bg_ctx.rect(75,75,394,344);
        MDART.bg_ctx.stroke();
    }
}

MDART.drawMiner = function() {
    MDART.animation_ctx.drawImage(MDART.MINER_SPRITE_SHEET,100*MD.PICK_LEVEL,100*MD.SPRITE_POS,100,100,250,210,100,100)
};

MDART.drawGoblin = function(){

    //Loop through the possible goblin draw locations
    var i;
    for (i=0; i<4;i++){
        if (MD.GOBLIN_PRESENT[i]){
            MDART.drawHealthBar(MD.GOBLIN_OBJECT[i].x,MD.GOBLIN_OBJECT[i].y,MD.GOBLIN_OBJECT[i].hp,MD.GOBLIN_OBJECT[i].maxhp);
            var img = (MD.GOBLIN_OBJECT[i].rebel ? MDART.REBEL_SPRITE_1 : MDART.GOBLIN_SPRITE_1);
            MDART.units_ctx.drawImage(img,MD.GOBLIN_OBJECT[i].x,MD.GOBLIN_OBJECT[i].y)
            if (MD.GOBLINS_KILLED == 0) //If this is the first goblin
                MDART.drawClickGuide(MD.GOBLIN_OBJECT[i].x,MD.GOBLIN_OBJECT[i].y+10,MDART.GOBLIN_SPRITE_1.width,MDART.GOBLIN_SPRITE_1.height-10,"Click!");
        }
    }
    for (i=0; i<4;i++){
        if (MD.GOBLIN_PRESENT[i+4]){
            MDART.drawHealthBar(MD.GOBLIN_OBJECT[i+4].x,MD.GOBLIN_OBJECT[i+4].y,MD.GOBLIN_OBJECT[i+4].hp,MD.GOBLIN_OBJECT[i+4].maxhp);
            var img = (MD.GOBLIN_OBJECT[i+4].rebel ? MDART.REBEL_SPRITE_2 : MDART.GOBLIN_SPRITE_2);
            MDART.units_ctx.drawImage(img,MD.GOBLIN_OBJECT[i+4].x,MD.GOBLIN_OBJECT[i+4].y)
            if (MD.GOBLINS_KILLED == 0) //If this is the first goblin
                MDART.drawClickGuide(MD.GOBLIN_OBJECT[i+4].x,MD.GOBLIN_OBJECT[i+4].y+10,MDART.GOBLIN_SPRITE_2.width,MDART.GOBLIN_SPRITE_2.height-10,"Click!");
        }
    }
};

function drawSpiders(){
    //Loop through the possible goblin draw locations
    var i;
    for (i=0; i<3;i++){
        if (MD.SPIDER_PRESENT[i]){
            MDART.units_ctx.drawImage(MDART.SPIDER_SPRITE_1,MD.SPIDER_OBJECT[i].x,MD.SPIDER_OBJECT[i].y);
            MDART.drawHealthBar(MD.SPIDER_OBJECT[i].x,MD.SPIDER_OBJECT[i].y,MD.SPIDER_OBJECT[i].hp,MD.SPIDER_OBJECT[i].maxhp);
        }
    }
    for (i=0; i<3;i++){
        if (MD.SPIDER_PRESENT[i+3]){
            MDART.units_ctx.drawImage(MDART.SPIDER_SPRITE_2,MD.SPIDER_OBJECT[i+3].x,MD.SPIDER_OBJECT[i+3].y);
            MDART.drawHealthBar(MD.SPIDER_OBJECT[i+3].x,MD.SPIDER_OBJECT[i+3].y,MD.SPIDER_OBJECT[i+3].hp,MD.SPIDER_OBJECT[i+3].maxhp);
        }
    }
}

MDART.drawHealthBar = function(x,y,hp,maxhp){
    if(hp != maxhp){
        //Calculate the portion to draw in each color (given 60 pixels)
        var life = Math.ceil((hp/maxhp)*60);

        MDART.units_ctx.strokeStyle = "red";
        MDART.units_ctx.fillStyle = "black";
        roundRect(MDART.units_ctx,x,y,60,8,5,true);

        MDART.units_ctx.fillStyle = "red";
        roundRect(MDART.units_ctx,x,y,life,8,5,true,true);
    }
};

MDART.drawOracle = function(gTime,sTime){
    //Clear
    MDART.oracle_ctx.clearRect(0,0,MDART.oracle_canvas.width,MDART.oracle_canvas.height);
    //Draw the crystal ball
    if(MD.hasUpgrade("Oracle")){
        var midx = MDART.oracle_canvas.width/2;
        var midy = MDART.oracle_canvas.height/2;
        var imx = MDART.ORACLE_BALL.width/2;
        var imy = MDART.ORACLE_BALL.height/2;
        MDART.oracle_ctx.drawImage(MDART.ORACLE_BALL,midx-imx,midy-imy); //Draw the ball in the middle

        //Draw click guide if present
        if(MD.ORACLE_CLICK_GUIDE){
            MDART.oracle_ctx.beginPath();
            MDART.oracle_ctx.lineWidth="5";
            MDART.oracle_ctx.strokeStyle="red";
            MDART.oracle_ctx.rect(midx-imx,midy-imy,imx*2,imy*2);
            MDART.oracle_ctx.stroke();

            MDART.oracle_ctx.font = Math.floor((imy*2)/5) + "px Arial";
            MDART.oracle_ctx.fillStyle = "red";
            MDART.oracle_ctx.fillText("Click Here",(midx-imx)+5,(midy-imy)+30,(imx*2)-10);
        }

        var top = 3*Math.PI/2;
        var gRads = ((gTime-0.1*MD.FAST_TICK_COUNT)/MD.MAX_GOBLIN_TIME)*Math.PI*2;
        var sRads = ((sTime-0.1*MD.FAST_TICK_COUNT)/MD.MAX_SPIDER_TIME)*Math.PI*2;
    }

    //Draw goblin arc
    if(MD.hasUpgrade("Delve Greedily")) {
        MDART.oracle_ctx.beginPath();

        //The goblin arc is normally green, but we color it red if a lure is active
        if(MD.GOBLIN_LURE_TIMER > 0)
            MDART.oracle_ctx.strokeStyle = "maroon";
        else
            MDART.oracle_ctx.strokeStyle = "green";

        MDART.oracle_ctx.lineWidth = "6";
        MDART.oracle_ctx.arc(midx, midy - 3, 30, top, top + gRads);
        MDART.oracle_ctx.stroke();
    }

    //Draw spider arc
    if(MD.hasUpgrade("Embrace The Swarm")) {
        MDART.oracle_ctx.beginPath();
        MDART.oracle_ctx.strokeStyle = "purple";
        MDART.oracle_ctx.arc(midx, midy - 3, 36, top, top + sRads);
        MDART.oracle_ctx.stroke();
    }
};

MDART.drawMages = function(){
    if (MD.MAGES > 0){
        var toDraw = Math.ceil(MD.MAGES/5);
        var drawn = 0;
        var darkWizards = MD.hasUpgrade("Dark Portents"); //This is cast to a number and used to decide whether to take the wizard or the dark wizard from the sprite sheet
        for (var i=0; i<3 ;i++){
            MDART.units_ctx.drawImage(MDART.WIZARD_SPRITE_SHEET,60*Number(darkWizards),0,60,100,MD.MAGE_ROW_1_X,MD.MAGE_START_Y+i*MD.MAGE_INCREMENT_Y,60,100);
            MDART.drawMageAura(MD.MAGE_ROW_1_X,MD.MAGE_START_Y+i*MD.MAGE_INCREMENT_Y,MD.MAGE_AURA_LEVEL[i*2]);
            if(MD.MAGE_MAX_TIME < 1){
                MDART.drawClickGuide(MD.MAGE_ROW_1_X,MD.MAGE_START_Y+i*MD.MAGE_INCREMENT_Y,60,100,"Click!");
            }
            if(++drawn >= toDraw)
                break;
            MDART.units_ctx.drawImage(MDART.WIZARD_SPRITE_SHEET,60*Number(darkWizards),0,60,100,MD.MAGE_ROW_2_X,MD.MAGE_START_Y+i*MD.MAGE_INCREMENT_Y,60,100);
            MDART.drawMageAura(MD.MAGE_ROW_2_X,MD.MAGE_START_Y+i*MD.MAGE_INCREMENT_Y,MD.MAGE_AURA_LEVEL[i*2+1]);
            if(MD.MAGE_MAX_TIME < 1){
                MDART.drawClickGuide(MD.MAGE_ROW_2_X,MD.MAGE_START_Y+i*MD.MAGE_INCREMENT_Y,60,100,"Click!");
            }
            if(++drawn >= toDraw)
                break
        }
    }
};

MDART.drawMageAura = function(x,y,lvl){

    var trans = lvl/MD.MAX_MAGE_AURA; //Get the proportion of transparency to use

    MDART.units_ctx.globalAlpha = trans;
    MDART.units_ctx.drawImage(MDART.WIZARD_SPRITE_SHEET,120,0,60,100,x,y,60,100);
    MDART.units_ctx.globalAlpha = 1.0;
};

//Given a mage index (from 1 to 6) returns the coordinates of the top left and bottom right of the image
MDART.getMagePosition = function(pos){
    var x = (pos%2 == 0 ? MD.MAGE_ROW_1_X : MD.MAGE_ROW_2_X);
    var y = (MD.MAGE_START_Y + MD.MAGE_INCREMENT_Y*Math.floor(pos/2));
    return [x,y,x+60,y+100];
};

MDART.drawClickGuide = function(x,y,w,h,text){
    MDART.units_ctx.beginPath();
    MDART.units_ctx.lineWidth="5";
    MDART.units_ctx.strokeStyle="red";
    MDART.units_ctx.rect(x,y,w,h);
    MDART.units_ctx.stroke();

    MDART.units_ctx.font = Math.floor(h/5) + "px Arial";
    MDART.units_ctx.fillStyle = "red";
    MDART.units_ctx.fillText(text,x+5,y+30,w-10);
};

MDART.SPRITES_LOADED = 0; //Tracks how many sprites we've loaded
MDART.SPRITES_TO_LOAD = 48; //This must not be higher than the real value of the game won't finish loading, if it is lower, the game will just claim to be loaded early

MDART.loadSprite = function(){
    MDART.SPRITES_LOADED++;
    if(MDART.SPRITES_LOADED == MDART.SPRITES_TO_LOAD){ //When all the sprites are loaded
        MD.tick();
        MDART.update();

        //Hide the loading text
        get("loading-text").style.zIndex="-1";
    }
};

MDART.preloadSprites = function(){

    //Load the background
    MDART.bg_loaded = false;
    MDART.background = new Image();
    MDART.background.onload = function(){
        MDART.bg_loaded = true;
        MDART.loadSprite();
    };

    MDART.background.src = "/static/resources/minedefense/background.jpg";

    MDART.MINER_SPRITE_SHEET = new Image();
    MDART.MINER_SPRITE_SHEET.onload = function(){MDART.loadSprite()};
    MDART.MINER_SPRITE_SHEET.src = "/static/resources/minedefense/minersheet.png";

    MDART.GOBLIN_SPRITE_1 = new Image();
    MDART.GOBLIN_SPRITE_1.onload = function(){MDART.loadSprite()};
    MDART.GOBLIN_SPRITE_1.src = "/static/resources/minedefense/Goblin1.png";

    MDART.GOBLIN_SPRITE_2 = new Image();
    MDART.GOBLIN_SPRITE_2.onload = function(){MDART.loadSprite()};
    MDART.GOBLIN_SPRITE_2.src = "/static/resources/minedefense/Goblin2.png";

    MDART.REBEL_SPRITE_1 = new Image();
    MDART.REBEL_SPRITE_1.onload = function(){MDART.loadSprite()};
    MDART.REBEL_SPRITE_1.src = "/static/resources/minedefense/Rebel1.png";

    MDART.REBEL_SPRITE_2 = new Image();
    MDART.REBEL_SPRITE_2.onload = function(){MDART.loadSprite()};
    MDART.REBEL_SPRITE_2.src = "/static/resources/minedefense/Rebel2.png";

    MDART.SPIDER_SPRITE_1 = new Image();
    MDART.SPIDER_SPRITE_1.onload = function(){MDART.loadSprite()};
    MDART.SPIDER_SPRITE_1.src = "/static/resources/minedefense/spider1.png";

    MDART.SPIDER_SPRITE_2 = new Image();
    MDART.SPIDER_SPRITE_2.onload = function(){MDART.loadSprite()};
    MDART.SPIDER_SPRITE_2.src = "/static/resources/minedefense/spider2.png";

    MDART.WIZARD_SPRITE_SHEET = new Image();
    MDART.WIZARD_SPRITE_SHEET.onload = function(){MDART.loadSprite()};
    MDART.WIZARD_SPRITE_SHEET.src = "/static/resources/minedefense/wizardsheet.png"

    MDART.ORACLE_BALL = new Image();
    MDART.ORACLE_BALL.onload = function(){MDART.loadSprite()};
    MDART.ORACLE_BALL.src = "/static/resources/minedefense/oracle.png";

    //Industry
    MDART.EMPTY_GRASS = new Image();
    MDART.EMPTY_GRASS.onload = function(){
        MDART.updateIndustryCanvas();
        MDART.loadSprite();
    }
    MDART.EMPTY_GRASS.src = "/static/resources/minedefense/emptyfield.png";

    MDART.CONSTRUCT_SPRITES = [];

    for(var i = 0; i < MD.CONSTRUCTS.length; i++){
        MDART.CONSTRUCT_SPRITES[i] = [];
        for(var j = 0; j < MD.CONSTRUCTS[i].image.length; j++){
            MDART.CONSTRUCT_SPRITES[i][j] = new Image();
            MDART.CONSTRUCT_SPRITES[i][j].onload = function(){MDART.loadSprite()};
            MDART.CONSTRUCT_SPRITES[i][j].src = MD.CONSTRUCTS[i].image[j];
        }
    }
};

//Sets all one time tooltips
MDART.setTooltips = function(){
    //Set picture tooltips
    for(var i = 0; i < MD.GEM_OBJECTS.length; i++){

        var tipText = "";
        if(i != 0){
            tipText += "Consists of " + MD.GEM_OBJECTS[i].combine_requirement + " " + MD.GEM_OBJECTS[i-1].name.toLowerCase() + " gems. ";
        }
        tipText += "Increases pick efficiency by " + s(MD.GEM_OBJECTS[i].pick_increase) + ". "
        if(MD.GEM_OBJECTS[i].gps_increase > 0){
            tipText += "Increases gold per second by " + MD.GEM_OBJECTS[i].gps_increase + "%."
        }

        MDART.setTooltip($("#gempic" + i),MD.GEM_OBJECTS[i].name + " Gem",tipText);
    }

    //Set button tooltips
    for(i = 0; i < MD.GEM_OBJECTS.length; i++){
        tipText = "";
        if(i != MD.GEM_OBJECTS.length-1){
            tipText += "Combine " + MD.GEM_OBJECTS[i].name.toLowerCase() + " gems into a single " + MD.GEM_OBJECTS[i+1].name.toLowerCase() + " gem. Hold Ctrl to combine all gems.";
            MDART.setTooltip($("#combine-gem-"+i),"",tipText);
        }

        tipText = "";
        if(i != 0){
            tipText += "Break a single " + MD.GEM_OBJECTS[i].name.toLowerCase() + " gems into " + (MD.GEM_OBJECTS[i].combine_requirement-1) + " " + MD.GEM_OBJECTS[i-1].name.toLowerCase() + " gems. Hold Ctrl to break all the gems.";
            MDART.setTooltip($("#break-gem-"+i),"",tipText);
        }
    }
};

//Other Canvas Functions
MDART.mouseDownEvent = function(e) {
    //Check if the mine was clicked
    var canvasPosition = $(this).offset();
    var x = Math.round((e.pageX || 0)-canvasPosition.left);
    var y = Math.round((e.pageY || 0)-canvasPosition.top);

    //The canvas screen size may not correspond to the drawing size, adjust the value here:
    x /= MDART.canvas_ratio;
    y /= MDART.canvas_ratio;

    var midx = MDART.bg_canvas.width/2;
    var midy = MDART.bg_canvas.height/2;
    if (x > midx-77 && x < midx+77 && y > midy-77 && y < midy+77){
        MD.dig(x,y);
    }

    //Check if a goblin was clicked
    var i;
    for (i=0; i < MD.GOBLIN_PRESENT.length; i++){
        if(MD.GOBLIN_PRESENT[i]){
            if(x > MD.GOBLIN_OBJECT[i].x && x < MD.GOBLIN_OBJECT[i].x+MDART.GOBLIN_SPRITE_1.width && y > MD.GOBLIN_OBJECT[i].y && y < MD.GOBLIN_OBJECT[i].y+MDART.GOBLIN_SPRITE_1.height)
                MD.clickGoblin(i)
        }
    }

    //Check if a spider was clicked
    for (i=0; i < MD.SPIDER_PRESENT.length; i++){
        if(MD.SPIDER_PRESENT[i]){
            if(x > MD.SPIDER_OBJECT[i].x && x < MD.SPIDER_OBJECT[i].x+MDART.SPIDER_SPRITE_1.width && y > MD.SPIDER_OBJECT[i].y && y < MD.SPIDER_OBJECT[i].y+MDART.SPIDER_SPRITE_1.height)
                MD.clickSpider(i)
        }
    }

    //Check if a mage was clicked
    var numMages = Math.ceil(MD.MAGES/5);
    for (i=0; i<6 && i < numMages; i++){
        var pos = MDART.getMagePosition(i);
        if(x > pos[0] && x < pos[2] && y > pos[1] && y < pos[3]) {
            MD.clickMage(i);
        }
    }
};

MD.oracleClicked = function(e){
    MD.showOracleArea();
}

$.notify.addStyle('info', {
    html: "<div><span data-notify-text></div>",
    classes: {
        base: {
            "background-color": "lightblue",
            "padding": "3px",
            "border-radius":"10px",
            "width":"300px",
            "margin-top":"5px",
            "text-align":"center"
        }
    }
});
$.notify.defaults({arrowShow: false, elementPosition: 'bottom', gap:5});

MDART.notify = function(str){
    if(MD.SHOW_NOTIFICATIONS){
        $("#info-column2").notify(str, {style: 'info'})
    }
};

/*-------------------------------------------------------------------------------------------------
 INDUSTRY CANVAS + ISOMETRICS
/------------------------------------------------------------------------------------------------*/
MDART.initializeIndustryCanvas = function(){
    var parent_div = $("#industry-area"); 
    var div = $("#industry-container");

    //Generally width is the limiting factor, if not we use width
    var ratio = (parent_div.width())/div.width(); //We only consider 90% of the parents height
    if(320*ratio > parent_div.height()*0.90){
        ratio = (parent_div.height()*0.90)/div.height();
    }

    ratio = Math.max(Math.floor(ratio),1); //Force to an integer for easy computation

    MDART.industry_canvas_ratio = ratio; //Store for later use

    //Set the new values
    div.width(320*ratio).height(210*ratio);

    //The main canvas is kept to 320 x 210 to simplify drawing pixels, the other two are stretched
    MDART.industry_canvas = get("industry-canvas");
    MDART.industry_canvas.width = 320;
    MDART.industry_canvas.height = 210;
    $("#industry-canvas").width(320*ratio).height(210*ratio);
    MDART.industry_context = MDART.industry_canvas.getContext("2d");

    MDART.industry_construct_canvas = get("industry-constructs");
    MDART.industry_construct_canvas.width = 320*ratio;
    MDART.industry_construct_canvas.height = 210*ratio;
    $("#industry-constructs").width(320*ratio).height(210*ratio);
    MDART.industry_construct_context = MDART.industry_construct_canvas.getContext("2d");

    MDART.industry_bg_canvas = get("industry-background");
    MDART.industry_bg_canvas.width = 320*ratio;
    MDART.industry_bg_canvas.height = 210*ratio;
    $("#industry-background").width(320*ratio).height(210*ratio);
    MDART.industry_bg_context = MDART.industry_bg_canvas.getContext("2d");

    MDART.industry_bg_context.imageSmoothingEnabled = false;
    MDART.industry_bg_context.mozImageSmoothingEnabled  = false;
    MDART.industry_bg_context.webkitImageSmoothingEnabled = false;
    MDART.industry_construct_context.imageSmoothingEnabled = false;
    MDART.industry_construct_context.mozImageSmoothingEnabled  = false;
    MDART.industry_construct_context.webkitImageSmoothingEnabled = false;

    //Setup events here
    MDART.industry_construct_canvas.addEventListener("mousedown",MDART.industryMouseDownEvent,false);
    
    //Other setup
    MDART.createPlotObjects();
};

MDART.resizeIndustryCanvas = function(){
    var parent_div = $("#industry-area"); 
    var div = $("#industry-container");

    //Generally width is the limiting factor, if not we use height
    var ratio = (parent_div.width())/div.width(); //We only consider 90% of the parents height
    if(320*ratio > parent_div.height()*0.90){
        ratio = (parent_div.height()*0.90)/div.height();
    }

    ratio = Math.max(Math.floor(ratio),1); //Force to an integer for easy computation

    var wi = div.width();
    var hi = div.height();

    if(isFinite(ratio) && ratio > 0){
        div.width(wi*ratio).height(hi*ratio);
        $("#industry-constructs").width(wi*ratio).height(hi*ratio);
        $("#industry-canvas").width(wi*ratio).height(hi*ratio);
        $("#industry-background").width(wi*ratio).height(hi*ratio);
    }

    MDART.industry_canvas_ratio = div.width()/320;
    MDART.updateIndustryCanvas();
};

MDART.updateIndustryCanvas = function(){
    MDART.industry_context.clearRect(0,0,MDART.industry_canvas.width,MDART.industry_canvas.height);
    MDART.industry_bg_context.clearRect(0,0,MDART.industry_bg_canvas.width,MDART.industry_bg_canvas.height);
    MDART.industry_construct_context.clearRect(0,0,MDART.industry_construct_canvas.width,MDART.industry_construct_canvas.height);
    MDART.industry_bg_context.drawImage(MDART.EMPTY_GRASS,0,0,MDART.industry_bg_canvas.width,MDART.industry_bg_canvas.height);
    MD.fillExistingIndustry();
};

MDART.industryMouseDownEvent = function(e){
    var canvasPosition = $(this).offset();
    var x = Math.round((e.pageX || 0)-canvasPosition.left);
    var y = Math.round((e.pageY || 0)-canvasPosition.top);

    x /= MDART.industry_canvas_ratio;
    y /= MDART.industry_canvas_ratio;

    //Loop through all plots and find the one clicked on
    for(var i = 0; i < MDART.PLOT_OBJECTS.length; i++){
        var p = MDART.PLOT_OBJECTS[i];
        if(pointInQuad([x,y],[p.top,p.top_left,p.bot,p.top_right])){
            if(!MD.MOVE_DIALOG_OPEN){
                MD.clickPlot(i);
            }
            else{
                var building = MD.CONSTRUCT_LOCATIONS[i];
                if(MD.MOVE_BUILDING_1 === null){
                    MD.MOVE_BUILDING_1 = i;
                    if(MD.CONSTRUCT_LOCATIONS[i] !== null && MD.CONSTRUCT_LEVELS[i] !== MDART.PIXELS_PER_PLOT*2+1){
                        get("swap-building-1").innerHTML = "Building 1: " + MD.CONSTRUCTS[building].name;
                    }
                    else{
                        get("swap-building-1").innerHTML = "Building 1: Empty Land";
                    }
                }
                else{
                    MD.MOVE_BUILDING_2 = i;
                    if(MD.CONSTRUCT_LOCATIONS[i] !== null && MD.CONSTRUCT_LEVELS[i] !== MDART.PIXELS_PER_PLOT*2+1){
                        get("swap-building-2").innerHTML = "Building 2: " + MD.CONSTRUCTS[building].name;
                    }
                    else{
                        get("swap-building-2").innerHTML = "Building 2: Empty Land";
                    }
                }
            }
            break;
        }
    }

    return;
}

//Constants related to Plots
MDART.PLOT_ROWS = [0,2,5,9,14,18,21,23,24]; //The last plot in each row
MDART.PIXELS_PER_PLOT = 962;
MDART.CANVAS_OFFSET = 49; //Y-offset to add to all values

//Given an index between 0 and 24 (with 0 being the top of the diamond and 24 being the bottom),
// computes relevant information about the plot
MDART.Plot = function(index){
    this.index = index;

    //Find out which row the plot is in
    for(var i = 0; i < MDART.PLOT_ROWS.length; i++){
        if(index <= MDART.PLOT_ROWS[i]){
            this.row = i;
            break;
        }
    }

    //Find out where in the row the column is
    var row_length = (this.row == 0) ? 1 : MDART.PLOT_ROWS[this.row] - MDART.PLOT_ROWS[this.row-1];
    this.col = row_length-(MDART.PLOT_ROWS[this.row]-index)-1;

    //Get the four corners as functions of the row and column (note for the top and bottom we use the left of the two cells)
    var symRow = (this.row < 5) ? this.row : MDART.PLOT_ROWS.length-1-this.row; //Accounts for row symmatry
    this.top_left = [1+(32*(4-symRow)) + 64*this.col , 16+(this.row*16)+MDART.CANVAS_OFFSET];
    this.top = [31+(32*(4-symRow)) + 64*this.col , 1+(this.row*16)+MDART.CANVAS_OFFSET];
    this.top_right = [62+(32*(4-symRow)) + 64*this.col , 16+(this.row*16)+MDART.CANVAS_OFFSET];
    this.bot = [31+(32*(4-symRow)) + 64*this.col , 31+(this.row*16)+MDART.CANVAS_OFFSET];
};

MDART.createPlotObjects = function(){
    MDART.PLOT_OBJECTS = new Array(25);
    for(var i = 0; i < 25; i++){
        MDART.PLOT_OBJECTS[i] = new MDART.Plot(i);
    }
};

//Progress is a value out of MDART.PIXELS_PER_PLOT, all indicates whether we should draw all pixels or only the last one
MDART.drawDirtOnPlot = function(p,progress,all,stage){
    var plot = MDART.PLOT_OBJECTS[p];

    //Get painting objects
    var imData = MDART.industry_context.getImageData(0,0,MDART.industry_canvas.width,MDART.industry_canvas.height);

    //Determine how far to color
    var done = 0;
    var total = progress;

    //Color the plot
    var mid_y = plot.top_left[1];
    var mid_x = plot.top[0];

    //Used to determine where we are in the spiral
    var x_offset = 0;
    var y_offset = 0;
    var x = plot.top_left[0];
    var y = plot.top_left[1];

    for(var i = 0; i < MDART.PIXELS_PER_PLOT; i++){

        //Draw the pixel
        if(all || done == total-1){
            if(stage == 0) //Dirt
                MDART.setPixel(imData,x,y,139,69,19,255); //Unless told, only paint the last pixel (much faster)
            else //Steel
                MDART.setPixel(imData,x,y,105,105,105,255);
        }

        done++;
        if(done >= total){
            break;
        }

        //Handle Edges
        if(x == plot.top_right[0]-x_offset && y == plot.top_right[1]){ //Right corner
            x = plot.top_right[0]-2-x_offset;
            y = plot.top_right[1]+1;
            continue;
        }
        else if(x == plot.top_left[0]+2+x_offset && y == plot.top_left[1]+1){ //Left corner
            x = plot.top_left[0]+2+x_offset;
            y = plot.top_left[1];

            //Change the offset
            y_offset += 1;
            x_offset += 2;
            continue;
        }

        //Move pixel
        if(y <= mid_y){
            if(x <= mid_x && (x-plot.top_left[0])%2 == 1){
                y--;
            }
            else if((x-plot.top_left[0])%2 == 1){
                y++;
            }
            x++;
        }
        else{
            if(x <= mid_x && (x-plot.top_left[0])%2 == 0){
                y--;
            }
            else if((x-plot.top_left[0])%2 == 0){
                y++;
            }
            x--;
        }
    }

    MDART.industry_context.putImageData(imData,0,0);
}

//This function redraws all the current constructs (all must be redrawn to avoid overlap)
MDART.drawConstructs = function(){
    for(var i = 0; i < MD.CONSTRUCT_LOCATIONS.length; i++){
        if(MD.CONSTRUCT_LOCATIONS[i] != null && MD.CONSTRUCTION_STATUS[i] == MDART.PIXELS_PER_PLOT*2+1){
            var plot = MDART.PLOT_OBJECTS[i];

            var construct = MD.CONSTRUCT_LOCATIONS[i];

            if(MDART.CONSTRUCT_SPRITES[construct].length == 1){
                var image = MDART.CONSTRUCT_SPRITES[construct][0];
            }
            else{
                switch(construct){
                    case 2:
                        var image = MDART.CONSTRUCT_SPRITES[construct][MD.getDragonmountStage()];
                        break;
                    case 7: //Habitation
                        var image = MDART.CONSTRUCT_SPRITES[construct][MD.getHabitationStage()];
                        break;
                    case 8: //Farm
                    case 12:
                    case 13:
                        var image = MDART.CONSTRUCT_SPRITES[construct][MD.getFarmStage()];
                        break;
                }
            }
            MDART.industry_construct_context.drawImage(image,plot.top_left[0]*MDART.industry_canvas_ratio,(plot.bot[1]-image.height+1)*MDART.industry_canvas_ratio,image.width*MDART.industry_canvas_ratio,image.height*MDART.industry_canvas_ratio);
        }
    }
};

MDART.setPixel = function(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
};

/*-------------------------------------------------------------------------------------------------
 Key Presses
 /------------------------------------------------------------------------------------------------*/
$(document).on("keydown", function (e) {
    if(e.which == 17 || e.which == 18){
        MD.CTRL_DOWN = true;
    }
});

$(document).on("keyup", function (e) {
    MD.CTRL_DOWN = false; //For now we just assume the ctrl key needs to be reset
});

MD.multibuyActive = function(){
    return MD.CTRL_DOWN || MD.FORCE_CONTROL; //On mobile, force control is used
};

/*-------------------------------------------------------------------------------------------------
 UI
 /------------------------------------------------------------------------------------------------*/
ALERT_COLOUR = "yellow";

MDART.prepareMenuIcons = function(){
    $("#menuButton").click(MD.showMenu);
    $("#statsButton").click(MD.showStats);
    $("#craftingButton").click(MD.showCrafting);
    $("#magesButton").click(MD.showMages);
    $("#alchButton").click(MD.showAlch);
    $("#indButton").click(MD.showIndustry);
    $("#warButton").click(MD.showMilitary);
    $("#mechButton").click(MD.showMechanist);
    $("#dragonButton").click(MD.showDragons);
    $("#libButton").click(MD.showArch);
};

MDART.prepareTabs = function(){
    // get tab container
    var container = document.getElementById("tabContainer");
    // set current tab
    var navitem = container.querySelector(".tabs ul li");
    //store which tab we are on
    var ident = navitem.id.split("_")[1];
    navitem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
    navitem.setAttribute("class","tabActiveHeader");

    //hide two tab contents we don't need
    var pages = container.querySelectorAll(".tabpage");
    var i;
    for (i = 1; i < pages.length; i++) {
        pages[i].style.display="none";
    }

    //this adds click event to tabs
    var tabs = container.querySelectorAll(".tabs ul li");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].onclick=MDART.displayPage;
    }
};

// on click of one of tabs
MDART.displayPage = function() {
    var current = this.parentNode.getAttribute("data-current");

    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display="none";

    var ident = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    this.setAttribute("class","tabActiveHeader");
    document.getElementById("tabpage_" + ident).style.display="block";
    this.parentNode.setAttribute("data-current",ident);

    //Restore the tab to its proper color
    MDART.restoreTab(ident);
};

//If a tab isn't currently active, this function colors it yellow
MDART.alertTab = function(s){
    if (s=="shop" && !$("#tabHeader_1").hasClass("tabActiveHeader")){
        get("tabHeader_1").style.background = ALERT_COLOUR;
    }
    else if (s == "hire" && !$("#tabHeader_2").hasClass("tabActiveHeader")){
        get("tabHeader_2").style.background = ALERT_COLOUR;
    }
    else if (s == "defense" && !$("#tabHeader_3").hasClass("tabActiveHeader")){
        get("tabHeader_3").style.background = ALERT_COLOUR;
    }
    else if (s == "upgrade" && !$("#tabHeader_4").hasClass("tabActiveHeader")){
        get("tabHeader_4").style.background = ALERT_COLOUR
    }
};

MDART.restoreTab = function(id){
    get("tabHeader_" + id).style.background = "";
};

MDART.alertBtn = function(s){
    get(s).style.background = ALERT_COLOUR;
};

MDART.restoreBtn = function(s){
    get(s).style.background = "";
}

MDART.setTooltip = function(item,title,text){
    if(item.data('qtip') != undefined) { //Qtip already exist
        if(title != "" && item.qtip('option','content.title') != title){
            item.qtip('option','content.title',title);
        }
        if(item.qtip('option','content.text') != text){
            item.qtip('option','content.text',text);
        }
    }
    else{
        item.qtip({
            content: {
                title: title,
                text: text
            },
            position: {
                my: 'right center',
                at: 'left center',
                target: item,
                viewport: $(".game-window")
            },
            show: {
                delay: 0,
                solo: true
            },
            style: {
                classes: 'qtip-jtools'
            }
        })
    }
};

MDART.createButton = function(div,id,class_str,text,function_str){
    var element = document.createElement('button');
    //element.type = 'button';
    element.id = id;
    element.innerHTML = text;
    element.className = class_str;

    if(function_str != null)
        element.setAttribute('onclick',function_str)

    get(div).appendChild(element);
};

/*-------------------------------------------------------------------------------------------------
 DEBUG FUNCTIONS
 /------------------------------------------------------------------------------------------------*/
DEBUG = {};
DEBUG.debugMode = function(){
    MD.GOLD = n("1X");
    MD.TOTAL_GOLD = n("1X");
    MD.MANUAL_CLICKS = n("1T");
    MD.GOBLIN_TIME = 2;
    MD.GOBLIN_TIME_VARIATION=1;
    MD.GOBLINS_KILLED = n("1T");
    MD.GEMS[0] = n("1T");
    MD.TOTAL_GEMS = n("1Z");
    MD.MAGE_MAX_TIME = 1800;

    MD.MANA = n("1X");
    MD.TOTAL_MANA = n("1Z");

    for(var i = 0; i < MD.HIRELINGS_OWNED.length; i++)
        MD.HIRELINGS_OWNED[i] = 200
    MD.HIRELINGS_OWNED[0] = n("25M")

    MD.MAGE_MAX_TIME = 1800;
};

DEBUG.superHighSpeed = function(){
    MD.DEBUG_CLOCK = setInterval(function(){MD.tick()},20);
};

DEBUG.clearIndustry = function(){
    for(var i = 0; i < MD.CONSTRUCT_LOCATIONS.length; i++){
        MD.CONSTRUCT_LOCATIONS[i] = null;
        MD.CONSTRUCTION_STATUS[i] = null;
        MD.CONSTRUCT_LEVELS[i] = 0;
    }
    MDART.initializeIndustryCanvas();
    MDART.updateIndustryCanvas();
};

DEBUG.clearGems = function(){
    for(var i = 0; i < MD.GEMS.length; i++){
        MD.GEMS[i] = 0;
    }
};

DEBUG.maxAura = function(){
    for(var i = 0; i < MD.MAGE_AURA_LEVEL.length; i++){
        MD.MAGE_AURA_LEVEL[i] = 10;
    }
};

DEBUG.crazyResources = function(){
    for(r in MD.RESOURCES){
        MD.RESOURCES[r].change_function(n("1Q"));
    }
};

DEBUG.pause = function(){
    clearInterval(MD.GAME_CLOCK);
};

DEBUG.resume = function(){
    MD.GAME_CLOCK = setInterval(function(){MD.tick()},1000);
}

/*-------------------------------------------------------------------------------------------------
 START
 /------------------------------------------------------------------------------------------------*/
$(document).ready(function(){
    MDART.prepareTabs();
 });

MD.start = function(){

    get("versionheader").innerHTML = "Version "+MD.VERSION
    MD.bindEvents();

    //Graphics
    MDART.initializeCanvas();
    MDART.initializeIndustryCanvas();
    MDART.preloadSprites();
    MDART.setTooltips();
    MDART.prepareMenuIcons();
    MD.hideAllScreens();

    //Upgrade Cache
    MD.initializeUpgradeLookup();

    //Set defaults
    MD.createResourceObjects();
    MD.setVariablesToDefault();

    //Set the buy buttons
    MD.setBuyPickMessage(1);
    MD.setBuildWallMessage(1);

    //Attempt to load the game (does nothing if no local data exists)
    MD.loadLocalStorage();

    //Preparations relying on default values
    MD.prepareDropdowns();
    MD.setupDialogs();
    MD.prepareUI();

    //Industry
    MD.startMarketTimer();
    MD.updateSteelDisplay();
    MD.updateFoodDisplay();
    MD.updateAdamantiumDisplay();
    MD.updateFlaxDisplay();
    MD.updatePopulationDisplay();
    MD.initializeConstructUnlocked();
    MD.initializeMarketButtons();

    //Dragons
    MD.setDragonLevelMessage();

    MD.setHirelingButtons();
    MD.setMasonButton();
    MD.updateCrafting();
    MD.updateSocketDropDowns();
    MD.setMageButton();
    MD.updateMageButtons();
    MD.updateAlchPage();
    MD.updateUpgradeButtons();
    MD.updateUpgradeStats();
    MD.updateMageUpgradeButtons();
    MD.updateGems();
    MD.updateCoalDisplay(); //Because coal is given randomly, it can take a while to show up
    MDART.update();

    //Start the tick function
    MD.GAME_CLOCK = setInterval(function(){MD.tick()},1000);
    MD.FAST_CLOCK = setInterval(function(){MD.fast_tick()},100); //Fires 10 times as often, used for drawing

    //Used for the oracle
    MD.MAX_GOBLIN_TIME = MD.GOBLIN_TIMER;
    MD.MAX_SPIDER_TIME = MD.SPIDER_TIMER;

    //Animate the miner
    MDART.startAnimation(MD.SPRITE_N,1000);

    MD.showCanvas();
    MD.INITIALIZING_GAME = false; //Indicate that we're done initializing
};

/*-------------------------------------------------------------------------------------------------
 3...2...1... GOOOOO!
 /------------------------------------------------------------------------------------------------*/
MD.start();
