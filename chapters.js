// ONE place to edit the whole film. Order here = scroll order.
// length = how many screen-heights of scrolling the chapter takes.
// clip / poster paths are relative to this folder. Optional clipMobile = lighter file for phones.
const CHAPTERS = [
  { id:'hero', type:'video', clip:'videos/v01.mp4', clipMobile:'videos/v01_m.mp4', poster:'images/k01.jpg', length:4, first:true,
    title:'M4 Competition', text:'A concept film. Scroll to begin.' },

  { id:'front', type:'video', clip:'videos/v02.mp4', clipMobile:'videos/v02_m.mp4', length:4,
    title:'The face', text:'A tall double grille and a sharp light signature, set low and wide.',
    callouts:['Kidney grille','Headlight signature','Carbon front lip'] },

  { id:'profile', type:'video', clip:'videos/v03.mp4', clipMobile:'videos/v03_m.mp4', length:3,
    title:'The stance', text:'One long shoulder line from nose to tail.' },

  { id:'rear', type:'video', clip:'videos/v04.mp4', clipMobile:'videos/v04_m.mp4', length:3,
    title:'The exit', text:'Quad tips, a lip spoiler, a dark and heavy rear.',
    callouts:['Quad exhaust','Rear diffuser'] },

  { id:'teardown', type:'video', clip:'videos/v05.mp4', clipMobile:'videos/v05_m.mp4', length:4, rail:'Teardown',
    title:'Take it apart', text:'Keep scrolling. The car comes apart, piece by piece.' },

  { id:'exploded', type:'video', clip:'videos/v06.mp4', clipMobile:'videos/v06_m.mp4', length:4, rail:'Exploded view',
    title:'Every part, in space', text:'Panels, powertrain, brakes and cabin, floating in the dark.' },

  { id:'engine', type:'video', clip:'videos/v07.mp4', clipMobile:'videos/v07_m.mp4', length:5, rail:'Engine',
    title:'The engine', text:'A twin-turbo inline-six at the centre of it all.',
    callouts:['Twin-turbo inline-six','Carbon engine cover'] },

  { id:'turbo', type:'video', clip:'videos/v08.mp4', clipMobile:'videos/v08_m.mp4', length:5, rail:'Turbo',
    title:'Where the boost is made', text:'Heat, pressure and speed, close up.',
    // TODO: verify these figures against BMW's official spec page for your market before publishing.
    stats:[{v:503,l:'hp'},{v:650,l:'Nm'},{v:3.5,l:'s, 0-100 km/h',d:1}] },

  { id:'brakes', type:'video', clip:'videos/v09.mp4', clipMobile:'videos/v09_m.mp4', length:4, rail:'Brakes',
    title:'Stopping power', text:'Forged wheel, drilled disc, red caliper.',
    callouts:['Forged wheel','Drilled disc','Multi-piston caliper'] },

  { id:'chassis', type:'video', clip:'videos/v10.mp4', clipMobile:'videos/v10_m.mp4', length:4, rail:'Chassis',
    title:'What holds it down', text:'Suspension and drivetrain, laid out in the open.' },

  { id:'interior', type:'video', clip:'videos/v11.mp4', clipMobile:'videos/v11_m.mp4', length:5,
    title:'The cabin', text:'Carbon-backed seats, a curved display, ambient light.' },

  { id:'colour', type:'colour', length:2, title:'Pick a paint',
    text:'Same car, different mood.',
    swatches:[ {name:'Matte grey', color:'#6b6e73', img:'images/k01.jpg'},
               {name:'Deep blue',  color:'#1f4aa8', img:'images/k16.jpg'},
               {name:'Signal yellow', color:'#e8c81a', img:'images/k17.jpg'},
               {name:'Racing green',  color:'#1e5a3a', img:'images/k18.jpg'} ] },

  { id:'drive', type:'video', clip:'videos/v12.mp4', clipMobile:'videos/v12_m.mp4', length:5,
    title:'Into the night', text:'Tail lights, wet road, and gone.' },

  { id:'outro', type:'outro', length:2, eyebrow:'built by', title:'Sivajotheeswaran',
    text:'Reach out to start something great together.',
    links:[ {label:'sivajothio55@gmail.com', href:'mailto:sivajothio55@gmail.com'},
            {label:'7092992737', href:'tel:+917092992737'} ] },
];
