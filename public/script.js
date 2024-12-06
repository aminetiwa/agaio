const socket = new WebSocket('ws://localhost:8080');


const joueurelement = document.querySelector('.joueur');
const map = document.querySelector('.map');


let joueurtaille = 10;
joueurelement.style.width = `${joueurtaille}px`;
joueurelement.style.height = `${joueurtaille}px`;


let joueurx = 15000;
let joueury = 15000;


const zoomLevel = 1;


function updateCamera() {
  const cameraX = window.innerWidth / 2 - joueurx;
  const cameraY = window.innerHeight / 2 - joueury;


  map.style.transform = `translate(${cameraX}px, ${cameraY}px) scale(${zoomLevel})`;

  
  joueurelement.style.left = `${window.innerWidth / 2 - joueurtaille / 2}px`;
  joueurelement.style.top = `${window.innerHeight / 2 - joueurtaille / 2}px`;
}

socket.onopen = () => {
  console.log('Connexion WebSocket ouverte');
};


document.addEventListener('mousemove', (event) => {

  let mouseX = event.clientX;
  let mouseY = event.clientY;


  let vitesse = 3;


  if (mouseX > window.innerWidth / 2) {
    joueurx += vitesse;
  }
  if (mouseX < window.innerWidth / 2) {
    joueurx -= vitesse;
  }
  if (mouseY > window.innerHeight / 2) {
    joueury += vitesse;
  }
  if (mouseY < window.innerHeight / 2) {
    joueury -= vitesse;
  }


  socket.send(JSON.stringify({
    type: 'joueur-move',
    x: joueurx,
    y: joueury
  }));


  updateCamera();
});


function pointrandom() {
  let point = document.createElement('div');
  point.classList.add('random-point');

  let randomX = Math.random() * 30000;
  let randomY = Math.random() * 30000;


  point.style.left = randomX + 'px';
  point.style.top = randomY + 'px';

 
  map.appendChild(point);

  return {
    x: randomX,
    y: randomY,
    element: point
  };
}


const points = [];


setInterval(() => {
  const point = pointrandom();
  points.push(point);
}, 1);


setInterval(() => {

  let joueurCentreX = joueurx + (joueurtaille / 2);
  let joueurCentreY = joueury + (joueurtaille / 2);

  
  points.forEach((point, index) => {
    let distanceX = joueurCentreX - point.x;
    let distanceY = joueurCentreY - point.y;
    let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

    
    if (distance < 30) {
      console.log('Point capturé !');

      
      socket.send(JSON.stringify({ type: 'point-capture', x: point.x, y: point.y }));

      
      point.element.remove();
      points.splice(index, 1);

      
      joueurtaille += 1;
      joueurelement.style.width = `${joueurtaille}px`;
      joueurelement.style.height = `${joueurtaille}px`;

      
      updateCamera();
    }
  });
}, 1000 / 60); 


function genererEnnemi() {
  let ennemi = document.createElement('div');
  ennemi.classList.add('ennemi');

  
  let ennemitaille = 50;
  ennemi.style.width = `${ennemitaille}px`;
  ennemi.style.height = `${ennemitaille}px`;

  
  let ennemiX = Math.random() * 30000;
  let ennemiY = Math.random() * 30000;

  
  ennemi.style.left = `${ennemiX}px`;
  ennemi.style.top = `${ennemiY}px`;

  
  map.appendChild(ennemi);

  
  return {
    x: ennemiX,
    y: ennemiY,
    taille: ennemitaille,
    element: ennemi
  };
}


const ennemis = [];


setInterval(() => {
  const nouvelEnnemi = genererEnnemi();
  ennemis.push(nouvelEnnemi);
}, 5000);


setInterval(() => {
  ennemis.forEach((ennemi) => {
    
    ennemi.x += (Math.random() - 0.5) * 5;
    ennemi.y += (Math.random() - 0.5) * 5;

    
    ennemi.element.style.left = `${ennemi.x}px`;
    ennemi.element.style.top = `${ennemi.y}px`;

    
    let distX = (joueurx + joueurtaille / 2) - (ennemi.x + ennemi.taille / 2);
    let distY = (joueury + joueurtaille / 2) - (ennemi.y + ennemi.taille / 2);
    let distance = Math.sqrt(distX * distX + distY * distY); // Distance entre les centres

    
    if (distance < (joueurtaille + ennemi.taille) / 2) {
      console.log("Collision avec un ennemi!");

      
      joueurtaille =  joueurtaille - 50;
      if (joueurtaille <10){
        joueurtaille =10;
      }

      
      joueurelement.style.width = `${joueurtaille}px`;
      joueurelement.style.height = `${joueurtaille}px`;

      
      updateCamera();
    }
  });
}, 1000 / 60); 
