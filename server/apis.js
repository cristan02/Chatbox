const express = require('express')
const cors = require('cors')
const { json } = require('body-parser')
const mysql = require('mysql2')

var db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'tasktank',
})

const app = express()
const port = 5000

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getteams/:name', (req, res) => {
  const q =
    `select team.id , team.name from team
    left join members
    on team.id=tid where members.name = ?;`
  db.query(q,[req.params.name], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})
app.get('/getmembers/:id', (req, res) => {
  const q =
  `select count(status = 0) as cnt ,snd, rec, tid , name from members
  left join messages
  on  members.id = rec 
  where sndgp is null and tid = ? and snd = ?
  group by snd, sndgp, rec, name, tid
  UNION
  select count(status = 0) as cnt ,snd, rec, tid , name from members
  left join messages
  on  members.id = rec 
  where sndgp is null and tid = ?
  group by snd, sndgp, rec, name, tid;`
  db.query(q,[req.params.id], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})
app.get('/getchats/:snd/:rec', (req, res) => {
  const q =
    `select snd,rec,message from messages
    where (snd =? and rec =?) or (snd =? and rec =?);`
  db.query(q,[req.params.snd , req.params.rec , req.params.rec , req.params.snd], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})

app.get('/getgroupchats/:sndgp', (req, res) => {
  const q =
    `select snd,sndgp as rec, message from messages
    where sndgp = ?;`
  db.query(q, [req.params.sndgp], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})

app.get('/getchatnumber/:snd/:tid', (req, res) => {
  const q =
    `select count(status = 0) as cnt ,snd, rec, tid , name from members
    left join messages
    on  members.id = rec 
    where sndgp is null and tid = ? and snd = ?
    group by snd, sndgp, rec, name, tid
    UNION
    select count(status = 0) as cnt ,snd, rec, tid , name from members
    left join messages
    on  members.id = rec 
    where sndgp is null and tid = ?
    group by snd, sndgp, rec, name, tid;`
  db.query(q, [req.params.tid , req.params.snd , req.params.tid], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})


app.post('/group', (req, res) => {
    const q =
      'insert into messages(snd,sndgp,rec,message,time,status) values (?,?,?,?,?,?);'
    const { snd,sndgp,rec,message,time,status } = req.body
    db.query(q, [snd,sndgp,rec,message,time,status], (err, rows) => {
      if (err) {
        res.send(err)
      } else {
        res.send('Success')
      }
    })
  })

  app.post('/nongroup', (req, res) => {
    const q =
      'insert into messages(snd,sndgp,rec,message,time,status) values (?,?,?,?,?,?);'
    const { snd,sndgp,rec,message,time,status } = req.body
    db.query(q, [snd,sndgp,rec,message,time,status], (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        res.send('Success')
      }
    })
  })

  app.put('/student/update/:id', (req, res) => {
    const q = `
    update student
    set fname = ?, lname = ?
    where s_id = ?
    `
    const { fname, lname } = req.body
    db.query(q, [fname, lname, req.params.id], (err, rows) => {
      if (err) {
        res.send(err)
      } else {
        res.send('Success')
      }
    })
  })
  
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })