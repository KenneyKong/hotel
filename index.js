const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

let myMotel = "";

fs.readFile('myMotel.json', 'utf8', (err, data) => {
  if (err) {
  console.error(err);
} else {
 myMotel = JSON.parse(data);
}
});

// configure body-parser middleware to handle incoming HTTP request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// handle incoming HTTP POST request to book a motel room
app.post('/book', (req, res) => {
  // extract data from the HTTP request body
  const roomNumber = req.body.room;
  const checkinDate = new Date(req.body.checkin);
  const checkoutDate = new Date(req.body.checkout);
  const customerName = req.body.customer_name;
  const customerNumber = req.body.customer_number;

// find the selected motel room data object by its room_number property
const room = myMotel.find(r => r.room_number === parseInt(roomNumber));
        






/*
// check room availbility, if unavailble send an alert.
if (!room.available) {
  // room is not available, send error response
  res.status(400).send('This room is not available for the selected dates.');
  return;
}

const currentDate = new Date();
const availableRooms = myMotel.map(room => {
  if (!room.available) {
    const roomCheckout = new Date(room.checkout_date);
    if (currentDate > roomCheckout) {
      room.available = true;
    }
  }
  return room;
});



const availableRooms = myMotel.filter(room => {
  if (!room.available) return false;
  const roomCheckin = new Date(room.checkin_date);
  const roomCheckout = new Date(room.checkout_date);
  if (checkinDate < roomCheckout && checkoutDate > roomCheckin) {
    return false;
  }
  return true;
});
*/






// calculate the total price for the stay, cents rounded off to the nearest tenth with .tofixed(2)
const nights = Math.round((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
const totalPrice = (nights * room.room_price).toFixed(2);

        
// generate the room description
const amenities = room.amenities.join(', ');
const description = `Room ${room.room_number} features a ${room.bed_size} bed, ${amenities}.`;
        
// update the motel data with the booking information
  room.available = false;
  room.checkin_date = checkinDate.toISOString().slice(0, 10);
  room.checkout_date = checkoutDate.toISOString().slice(0, 10);
  room.customer_name = customerName;
  room.customer_phone = customerNumber;
        
// write the updated data to the JSON file
fs.writeFile('myMotel.json', JSON.stringify(myMotel), err => {
  if (err) {
  console.error(err);
  res.sendStatus(500);
 } else {
              

// alert confirmation box will pop up. After user click "ok" user will be sent back home
res.send(`<script>alert("Booking is confirmed for ${customerName} from ${checkinDate.getMonth() + 1}/${checkinDate.getDate()}/${checkinDate.getFullYear()} through ${checkoutDate.getMonth() + 1}/${checkoutDate.getDate()}/${checkoutDate.getFullYear()}. Total price for the stay is $${totalPrice}.\\n\\n${description}\\n\\nYou will now be redirected back to the homepage.\\n\\nThank you for booking with us!"); window.location.href = '/home'; </script>`);

// confirmation page will open, but no html css can be made on code below
/*
const link = '<span><nav><ul><li><a href="/home">Home</a></li><li><a href="/rooms">Rooms</a></li><li><a href="/book">Book</a></li></ul></nav></span>';
res.send(link + `<p style="font-family: Trebuchet MS, Lucida Sans Unicode; font-size: 16px;">Booking is confirmed for ${customerName} from ${checkinDate.getMonth() + 1}/${checkinDate.getDate()}/${checkinDate.getFullYear()} through ${checkoutDate.getMonth() + 1}/${checkoutDate.getDate()}/${checkoutDate.getFullYear()}. Total price for the stay is $${totalPrice}.<br><br>${description}</p>`);
 */    

// message in the console if reservation was written to myMotel.json
console.log("It was written");

}
});
});

// Home page
app.get('/home', function(req, res) {
  const home = fs.readFileSync(__dirname + '/home.html', 'utf8');
  res.send(home);
});


// Rooms page
app.get('/rooms', function(req, res) {
  const rooms = fs.readFileSync(__dirname + '/rooms.html', 'utf8');
  res.send(rooms);
});



// Book page
app.get('/book', function(req, res) {
  const booking = fs.readFileSync(__dirname + '/book.html', 'utf8');
  res.send(booking);
});


// start the Express.js server and listen for incoming HTTP requests        
app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});
        
//middleware & static files to link css file into node.js
//move styles.css file into "public" directory
  app.use(express.static('public'));

// just to check in the console if node.js file is linked to html files
  console.log('its linked!');
