var thickness = 10;
var halfThickness = thickness / 2;

function hsvToRgb(h,s,v) {
  var s = s / 100,
   v = v / 100;

  var hi = Math.floor((h/60) % 6);
  var f = (h / 60) - hi;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  var rgb = [];

  switch (hi)
  {
    case 0: rgb = [v,t,p];break;
    case 1: rgb = [q,v,p];break;
    case 2: rgb = [p,v,t];break;
    case 3: rgb = [p,q,v];break;
    case 4: rgb = [t,p,v];break;
    case 5: rgb = [v,p,q];break;
  }

  var r = Math.min(255, Math.round(rgb[0]*256)),
  g = Math.min(255, Math.round(rgb[1]*256)),
  b = Math.min(255, Math.round(rgb[2]*256));

  return [r,g,b];
}

function drawCurvedStrip(ctx, x, y, innerRadius, outerRadius, startAngle, endAngle)
{
  ctx.beginPath();
  ctx.moveTo(x+innerRadius * Math.cos(startAngle), y+innerRadius * Math.sin(startAngle));
  ctx.lineTo(x+outerRadius * Math.cos(startAngle), y+outerRadius * Math.sin(startAngle));
  ctx.arc(x,y,outerRadius,startAngle,endAngle,false);
  ctx.lineTo(x+innerRadius * Math.cos(endAngle), y+innerRadius * Math.sin(endAngle));
  ctx.arc(x,y,innerRadius,endAngle,startAngle,true);
  ctx.closePath();
  ctx.fill();

}

function drawDashedCircle(ctx,x,y,innerRadius,outerRadius,n,ratio,c)
{
  angularWidth = 2 * Math.PI / n;
  margin = angularWidth * ratio / (1 + ratio);
  start = -Math.PI/2;
  colorIncrement = 255/n;
  for (i = 0; i < n; i ++)
  {
    var inc = (n - i + c) % n;
    startAngle = i * angularWidth + start - angularWidth/2;
    endAngle = startAngle + angularWidth - margin;
    startAngle += margin;
    hue = (335 + startAngle * (180 / Math.PI)) % 360;
    rgb = hsvToRgb(hue, 100, 100)
    ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] +','+ (1-inc/n) + ')';
    //ctx.fillStyle = 'rgba(209,25,33,'+ (1-inc/n) + ')';
    drawCurvedStrip(ctx,x,y,innerRadius,outerRadius,startAngle,endAngle);
  }
}

function padDigit(n)
{
  n = String(n);
  while (n.length < 2)
  {
    n = '0' + n;
  }
  return n;
}
function getTimeStamp(date)
{
  return padDigit(date.getHours())+':'+padDigit(date.getMinutes())+':'+padDigit(date.getSeconds());
}

function drawClock()
{
  var canvas = document.getElementById('clock');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    var w = canvas.width
    var h = canvas.height
    var x = w/2;
    var y = h/2;
    var outerRadius = Math.min(x,y);
    var innerRadius = outerRadius - thickness;
    ctx.clearRect(0,0,w,h);
    var date = new Date();
    var m = date.getMonth()
    var mmax = 32 - new Date(date.getFullYear(), m, 32).getDate();
    drawDashedCircle(ctx,x,y,innerRadius,outerRadius,60,0.1,date.getSeconds())
    outerRadius = innerRadius - halfThickness;
    innerRadius = outerRadius - thickness;
    drawDashedCircle(ctx,x,y,innerRadius,outerRadius,60,0.1,date.getMinutes())
    outerRadius = innerRadius - halfThickness;
    innerRadius = outerRadius - thickness;
    drawDashedCircle(ctx,x,y,innerRadius,outerRadius,24,0.1,date.getHours())
    outerRadius = innerRadius - halfThickness;
    innerRadius = outerRadius - thickness;
    drawDashedCircle(ctx,x,y,innerRadius,outerRadius,mmax,0.1,date.getDate()-1)
    outerRadius = innerRadius - halfThickness;
    innerRadius = outerRadius - thickness;
    drawDashedCircle(ctx,x,y,innerRadius,outerRadius,12,0.1,m)
    if (document.getElementById('digitalClock') != null)
    {
      document.getElementById('digitalClock').value = getTimeStamp(date);
    }
  }
}

function startClock()
{
  if (document.getElementById('clock').getContext)
  {setInterval(drawClock,1000);}
}
