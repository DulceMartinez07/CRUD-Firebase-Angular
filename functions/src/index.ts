//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api/personas', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

const db = admin.firestore();
const userCollection = 'personas';

export const webApi = functions.https.onRequest(main);

interface IUser {
    nombre: string;
    apellido: string;
}

app.get('/personas', async (req, res) => {
    try{
        const userQuerySnapshot = await db.collection(userCollection).get();
        const users: any[]=[];

        userQuerySnapshot.forEach((doc) => {
            users.push({
                id: doc.id ,
                data: doc.data()
        });
        });

        res.status(200).json(users);
    }catch(e){
        res.status(500).json({message: e});
    }
});

app.get('/personas/:userId', (req, res)=> {
    const userId = req.params.userId;

    db.collection(userCollection).doc(userId).get()
    .then (user => {
        if(!user.exists){
            throw new Error ('Usuario no encontrado');
        }
        res.status(200).json({id: user.id, data:user.data()});
    })
    .catch(error => res.status(500).send(error));
});

app.post('/personas', async(req, res)=>{
    try{
        const user: IUser ={
            nombre: req.body['nombre'],
            apellido: req.body['email']
        };

        const newDoc = await db.collection(userCollection).add(user);
        res.status(201).json({message: `Nuevo usuario Creado: ${newDoc.id} `});
    } catch(e){
        res.status(400).json({message: 'Debe contener Nombre y Apellido'});
    }
});

app.put('/personas/:userId', async(req, res)=>{
    const userId = req.params.userId;
    await db.collection(userCollection).doc(userId).set(req.body,{merge: true} )
    .then(() => res.status(200).json({message: 'Usuario actualizado'}))
    .catch((error) => res.status(500).json({message: error}));
});

app.delete('/personas/:userId', async (req, res) => {
    const userId = req.params.userId;
    await db.collection(userCollection).doc(userId).delete()
    .then(() => res.status(200).json({message: 'Usuario eliminado'}))
    .catch((error) => res.status(500).json({message: error}));
});