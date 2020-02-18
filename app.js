const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require('shortid')
const cors = require('cors')
const User = require('./data/mongoDb')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//static frontend page
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

//posting a new user
app.post('/api/exercise/new-user', (req, res) => {
    let userName = req.body.username;
   console.log(userName);

    User.find({username: userName}, (err, data) => {
        if(err) return err;
        if (data[0] === undefined) {
            let short = shortid.generate();
            let newUser = new User({
                _id: short,
                username: userName,
                count: 0,
                log: []
            });

            newUser.save((errSave, dataSave) => {
                if (errSave) return console.log(errSave);
                console.log('saved to database');
                return res.json({
                    "username":dataSave.username,
                    "_id":dataSave._id});
            });
        } else {
            return res.send('username already taken')
        }
    })
})

//retrieve all users from database
app.get('/api/exercise/users', (req, res) => {
    User.find((err, data) => {
        if (err) return err;
        const users = [...data].map(user => (
            {_id: user._id, username: user.username}
            )
        );
        console.log(users);
        res.send(users)
    })
})

//posting a new exercise for one of the users by id
app.post('/api/exercise/add', (req, res) => {
    if (req.body.date.length === 0) {
        req.body.date = new Date().toLocaleDateString("en-US");
    }

    User.find({_id: req.body.userId}, (err, data) => {
        if (err) return err;
        let userData = data[0];
        if (userData === undefined) {
            return res.send('unknown _id')
        }else {
            userData.log.push({
                "description":req.body.description,
                "duration":req.body.duration,
                "date":req.body.date
            })
            userData.markModified('log');
            userData.count = userData.log.length;
            userData.save((err,dataSave)=>{
                if (err) return console.log('err');
                console.log(userData)
                return res.json({
                    username: dataSave.username,
                    description: req.body.description,
                    duration: req.body.duration,
                    _id: dataSave.id,
                    date: req.body.date
                })
            });
        }
    })

})

//getting a users a users full info from database with query url
app.get('/api/exercise/log', (req, res) => {
    if (!req.query.userId) return res.send('unknown userId')
    User.find({_id: req.query.userId}, (err, data) => {
        if (err) return err;

        let queries = {
            from: req.query.from,
            to: req.query.to,
            limit: req.query.limit
        };
        let dataEdit = {
            _id: data[0]._id,
            username: data[0].username,
            count: data[0].count,
            log: data[0].log
        }

        Object.keys(queries).forEach(que => {
            let date = new Date(queries[que]);
            switch (que) {
                case ("from" ):
                    if (!isNaN(date.getTime())) {
                        dataEdit["from"] = date.toLocaleDateString("en-US");
                        dataEdit["log"] = dataEdit.log.filter(exercise =>
                            new Date(exercise.date).getTime() >= date.getTime());
                        break;
                    }else {
                        break;
                    }

                case ("to" ):
                    if (!isNaN(date.getTime())) {
                        dataEdit["to"] = date.toLocaleDateString("en-US");
                        dataEdit["log"] = dataEdit.log.filter(exercise =>
                            new Date(exercise.date).getTime() <= date.getTime());
                        break
                    } else {
                        break;
                    }

                case "limit":
                    if (!isNaN(parseInt(queries[que])) && parseInt(queries[que]) > 0) {
                        dataEdit["log"] = dataEdit.log.filter(exercise =>
                            dataEdit.log.indexOf(exercise) < queries[que]);
                        dataEdit["count"] = queries[que];
                        break
                    } else {
                        break;
                    }
            }
        })

        return res.json(dataEdit);
    });

})

app.listen(process.env.PORT || 3000, () => {
    console.log('working all');
});

