const express = require('express')
const cors = require('cors')
const { json } = require('body-parser')
const mysql = require('mysql2')

const port = process.env.PORT || 5000
const app = express()

var db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'tasktank',
})

app.use(cors())
app.use(json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getteams/:id', (req, res) => {
  const q =
    `select team.id , team.name from team , members , membersteam
    where team.id = membersteam.tid and members.id = membersteam.mid and members.id = ?;`
  db.query(q,[req.params.id], (err, rows) => {
    if (err) {
      res.send(err)
    } else {
      res.send(rows)
    }
  })
})

app.get('/getmembers/:tid', (req, res) => {
  const q =
    `select members.id , members.name from team , members , membersteam
    where team.id = membersteam.tid and members.id = membersteam.mid and team.id = ?;`
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
      if (err ) {
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

  
  app.post('/signin', (req, res) => {
    const { email, password } = req.body
    const q =
      'select * from members where email = ? and password = ?;'
   
    db.query(q, [email, password], (err, rows) => {
      if (err) {
        console.log(err)
      } else {
         res.send(rows)
      }
    })
  })

  app.post('/signup', (req, res) => {
    const { name , email, password , image , type } = req.body
    const q = 'insert into members values (null , ? , ? , ? , ? , ?);'

    db.query(q, [name , email, password , image , type], (err, rows) => {
      if (err) {
        res.send(err)
      } else {
        res.send('Account Successfully created')
      }
    })
  })

  app.post('/googleverify', (req, res) => {
    const { email } = req.body
    const q = 'select * from members where email = ?;'

    db.query(q, [ email], (err, rows) => {
      if (err) {
        res.send('error')
      } else {
        res.send(rows)
      }
    })
  })

  app.post('/createteam', (req, res) => {
    const { name , leader } = req.body
    const q = 'insert into team values(null ,?,?);'

    db.query(q, [name , leader], (err, rows) => {
      if (err) {
        res.send(err)
      } else {
        res.send('Team created')
      }
    })
  })

  app.delete('/exitteam/:tid/:mid', (req, res) => {
    const q = 'delete from membersteam where tid = ? and mid = 4?;'
    db.query(q, [req.params.tid , req.params.mid], (err, rows) => {
      if (err) {
        res.send(err)
      } else {
        res.send('Exited from team')
      }
    })
  })

  
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })

