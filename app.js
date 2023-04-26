const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./database');

// init app & middleware
const app = express()
app.use(express.json())

// db connection
let db;
let PORT = process.env.PORT;
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`Server in ${process.env.STATUS} mode, Listening on port: ${PORT}`);
        });
        db = getDb();
    }
})

/** routes or endpoints:
 * GET: getOne, getMany, getAll
 * POST: One, Many
 * PATCH/UPDATE: One
 * dELETE: One, Many
 * 
 */

app.get('/questions', (req, res) => {

    let qn = [];

    db.collection('questions')
    .find()
    .forEach(question => qn.push(question))
    .then(() => {
        res.status(200).json(qn);
    })
    .catch(() => {
        res.status(500).json({error: "could not fetch"})
    });

}) // get ALL questions

app.get('/questions/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('questions')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error: "could not fetch"});
        });
    } else res.status(500).json({error: "invalid Id"});
}) // get ONE question

app.post('/questions', (req, res) => {
    const question = req.body

    db.collection('questions')
    .insertOne(question)
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(500).json({err: 'could not insert document'})
    })
}) // add ONE question

app.delete('/questions/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('questions')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "could not delete document"});
        });
    } else res.status(500).json({error: "invalid Id"});
    
}) // delete ONE question

app.patch("/questions/:id", (req, res) => {
    const updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('questions')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: "could not update document"});
        });
    } else res.status(500).json({error: "invalid Id"});
}) // update ONE question