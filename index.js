var app = require('express')();
var http = require('http').Server(app);
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const path = require('path');
const tableify = require('tableify');

//const app = express();
const io = require('socket.io')(http);
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ scores: [], count: 0 }).write();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})
io.on('connection', function(socket){
  console.log('a user connected')
  let s = db.get('scores').value().sort((a, b) => b.score - a.score)
  io.emit('data', tableify(s))
});
app.post('/', (req, res) => {
  db.get('scores').push({ score: parseInt(req.query.score), name: req.query.name }).write()
  let s = db.get('scores').value().sort((a, b) => b.score - a.score)
  io.emit('data', tableify(s))
  res.sendStatus(200)
})

http.listen(3000, () => console.log('Listening on port 3000!'))
