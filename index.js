const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv').config()

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded())
app.use(session({secret: process.env.SECRET}))

let User = require('./models/user')
let Task = require('./models/task')

mongoose.connect('mongodb+srv://todolist:' + process.env.PASSWORD + '@cluster0.jvcm6lc.mongodb.net/gloomveterinary')



function getUsername(req) {
    return req.session.username ? req.session.username : ''
}


app.get('/', (req, res) => {
    res.render('pages/home', {'username': getUsername(req)})
})

app.get('/register', (req, res) => {
    res.render('pages/register', {'username': getUsername(req)})
})

app.post('/register', async (req, res) => {
    const user = await User.findOne({'username': req.body.username}).exec()
    if(user != null) {
        res.render('pages/error', {'error': 'Username ' + req.body.username + ' already used', 'username': getUsername(req)})
    }
    else {
        if(req.body.password != req.body.password2) {
            res.render('pages/error', {'error': 'Passwords do not match', 'username': getUsername(req)})
        }
        else {
            User.create({
                username: req.body.username,
                password:  req.body.password
            })
            res.redirect('/login')
        }
    }
})

app.get('/login', (req, res) => {
    res.render('pages/login', {'username': getUsername(req)})
})

app.post('/login', async (req, res) => {
    const user = await User.findOne({'username': req.body.username}).exec()
    if(user != null) {
        if(user.password == req.body.password) {
            req.session.username = req.body.username
            res.redirect('/tasks')
        }
        else {
            res.render('pages/error', {'error': 'Wrong credentials', 'username': getUsername(req)})
        }
    }
    else {
        res.render('pages/error', {'error': 'User not found', 'username': getUsername(req)})
    }
})

app.get('/tasks', async (req, res) => {
    if(req.session.username) {
        let tasks = await Task.find({'username': req.session.username, 'completed': false }).exec()
        res.render('pages/tasks', {'username': req.session.username, 'tasks': tasks})
    }
    else {
        res.redirect('/login')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})
app.get('/doctor', async(req, res) => {
    
})
app.post('/add/task', async (req, res) => {
    if(req.session.username) {
        await Task.create({
            username: req.session.username,
            title: req.body.task,
            completed: false
        })
        res.redirect('/tasks')
    }
    else {
        res.redirect('/login')
    }
})

app.get('/complete/task/:task_id', async (req, res) => {
    if(req.session.username) {
        let task = await Task.findById(req.params.task_id).exec()
        task.completed = true
        task.save()
        res.redirect('/tasks')
    }
    else {
        res.redirect('/login')
    }
})

ap
app.get("/", (req, res) => {
    res.render('pages/home')
})

app.get("/news", (req, res) => {
    res.render('pages/news')
})

app.get("/services", (req, res) => {
    res.render('pages/services')
})

app.get("/service/2", (req, res) => {
    data = [
        {'title': 'General Check-ups', 'content': 'We provide general checkups for all kind of vets for existing customers and for visitors'},
        {'title': 'Vacinnations', 'content': 'We have a fleet of 25 garbage collction vehicles, oprating 24/7'},
        {'title': 'Parking', 'content': 'There are two parking areas in the center of the city with a capacity of 500 vehicles'},
        {'title': 'Kindergarden', 'content': 'All babies can attend a kindergarden close to their house'}
    ]
    res.render('pages/services2', {data: data})
})


app.get("/services", (req, res) => {
    res.render('pages/contact')
})



app.listen(port, () => {
    console.log("Server strated on port " + port)
})