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
app.get('/getmembers/:tid', (req, res) => {
  const q =
    `select id,name from members where tid = 1`
  db.query(q, [req.params.tid , req.params.tid], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})
app.get('/getchats/:snd/:rec', (req, res) => {
  const q =
    `select snd,rec,message ,time_format(time , '%k:%i') as time , status from messages 
    where (snd =? and rec =?) or (snd =? and rec =?)
    order by id ;`
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
    `select snd,sndgp as rec, message , name ,time_format(time , '%k:%i') as time ,status
    from messages
    left join members
    on members.id = snd
    where sndgp = ?
    order by messages.id;`
  db.query(q, [req.params.sndgp], (err, rows) => {
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

  app.put('/updatestatus/:snd/:rec', (req, res) => {
    const q = `
    UPDATE messages
    SET status = 1
    WHERE snd = ? and rec = ?;
    `
    db.query(q, [req.params.snd , req.params.rec], (err, rows) => {
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

  // sql query to replace getmembers
    /*SELECT T1.cnt, T1.snd, T1.rec, T1.tid , T2.name
      FROM (select count(status = 0) as cnt,snd, rec, tid , name from members
      left join messages
      on  members.id = snd
      where sndgp is null and tid = ?
      group by snd,rec, tid , name) AS T1
      JOIN (select count(status = 0) as cnt,snd, rec, tid , name from members
      left join messages
      on  members.id = rec
      where sndgp is null and tid = ?
      group by snd,rec, tid , name) AS T2
      ON T1.cnt = T2.cnt */