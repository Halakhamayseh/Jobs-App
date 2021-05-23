'use strict';
//dep
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const cors = require('cors');
require('dotenv').config();
//set up
const server = express();
const PORT=process.env.PORT||5000
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(express.static('./public'));
server.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
//routs
server.get('/', homeHandler);
server.get('/search', searchHandler);
server.post('/result', resultHandler);
server.get('/mylist', mylistHandler);
server.post('/add', addHandler);
server.get('/details:id', detailsHandler);
server.put('/update:id', updateHandler);
server.delete('/delete:id', deleteHandler);
//callbackfun
function homeHandler(req,res) {
    const url = `https://jobs.github.com/positions.json?location=usa`
    superagent.get(url).then(reult => {
        let data = result.body
        const arr=data.map(e=>{new Const(e)})
    })
    res.render('pages/index', { keyH:arr})
}
function searchHandler(req,res) {
    res.render('pages/search')
}
function resultHandler(req, res) {
    let description=req.body.description
    const url = `https://jobs.github.com/positions.json?description=${description}&location=usa`
    superagent.get(url).then(reult => {
        let data2 = result.body
        const arr2=data2.map(e=>{new Const(e)})
    })
    res.render('pages/result', { keyR:arr2})
}
function addHandler(req, res) {
    const title = req.body.title;
    const company = req.body.company;
    const location = req.body.location;
    const url = req.body.url;
    const description = req.body.description;
    let safeValue=[title,company,location,url,description]
    const SQL = `INSERT INTO job (title, company, location, url,description)
VALUES ('$1', '$2', '$3', '$4', '$5');`;
    client.query(SQL, safeValue).then(result => {
        res.rdircet('/mylist')
    })
    
}
function mylistHandler(req, res) {
    const SQL = `SELECT * FROM job;`;
    client.query(SQL).then(result => {
        res.render('pages/mylist.ejs',{keyM:result.rows})
    })
    
}
function detailsHandler(req, res) {
    const id = req.params.id;
    let safe=[id]
    const SQL = `SELECT * FROM job WHERE id =$1;`;
    client.query(SQL).then(result => {
        res.render('pages/mylist.ejs',{keyD:result.rows[0]})
    })
    
}
function updateHandler(req, res) {
    const id = req.params.id;
       const title = req.body.title;
    const company = req.body.company;
    const location = req.body.location;
    const url = req.body.url;
    const description = req.body.description;
    let safeValue=[title,company,location,url,description,id]
  
    const SQL = `UPDATE job SET title = '$1', company= '$2' , location= '$3' , company= '$4' , description= '$5' WHERE id = '$6';`;
    client.query(SQL,safeValue).then(result => {
        res.rdircet(`/details:${id}`)
    })
    
}
function deleteHandler(req, res) {
    const id = req.params.id;
    let safe=[id]
    const SQL = `DELETE FROM job WHERE id =$1;`;
    client.query(SQ,safe).then(result => {
        res.rdircet(`/details:${id}`)
    })
    
}
//constru
function Const(obj) {
    this.title = obj.title;
    this.company = obj.company;
    this.location = obj.location;
    this.url = obj.url;
    this.description = obj.description;
}
//connect
server.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`listen to port ${PORT}`)
    })
})
