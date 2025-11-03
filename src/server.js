import { fastify } from 'fastify'
import formbody from '@fastify/formbody'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import pointOfView from '@fastify/view'
import fastifyStatic from '@fastify/static'
import ejs from 'ejs'
import path from 'path'
import bcrypt from 'bcrypt'
import { sql }from './app.js'
import { error } from 'console'

const server = fastify()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

server.register(formbody)

// render /views ejs files
server.register(pointOfView, {
    engine: {
      ejs: ejs
    },
    root: path.join(__dirname, '../views')
})

server.register(fastifyStatic, {
    root: path.join(__dirname, '../public')
})

export var logged_in_status = false

// user sign up
server.post('/signup', async (req, rep) => {
    try {
        // receber dados
        const { username, email, password } = req.body
        console.log("name: ", username)        
        console.log(req.body)

        // verificar se o email ja esta logado
        const [rows] = await sql`
        SELECT email FROM users WHERE email = ${email};`
        //console.log("rows: ", rows.email)

        // don't think its working
        if (rows > 0) { //rows is undefined. how? || NOTE: i was writing [rows] 
            return rep.status(400).json({error: "this email already exists."})
        }

        // hash da senha
        const passwordHash = await bcrypt.hash(password, 10)

        

        // inserir na db
        const insert = await sql`
        INSERT INTO users (name, email, password) VALUES (${username}, ${email}, ${passwordHash});`
        console.log("user created")

        // set default settings
        const [id] = await sql`
        select id from users where email = ${email};`
        
        if (insert) {
            await sql`
            insert into user_settings (
            user_id, theme, unit, auto_detect_pr, share_workout)
            values (${id.id}, 'light', 'kg', true, true);`
        }
        console.log("default settings assigned.")
                                                                
        // set user status
        const [data] = await sql`
        select * from users where email = ${email};`
        logged_in_status = {
            status: true,
            id: data.id,
            username: data.name,
            email: data.email
        }

        //rep.send({message: "insert completed", user: {id: id.id, username: data.name, email: data.email}})
        console.log("status:", logged_in_status)
        //rep.json("user signed up succefully!")
    } catch (err) {
        console.log(err)
        rep.statusCode = 500
        //rep.json({error: "server error"})
    }
    
    // todo: sent user back to main page
    return rep.viewAsync('index.ejs', { logged_in_status })
})

// user log in
server.post('/login', async(req, rep) => {
    try {
        // read data
        const { email, password } = req.body
        
        // compare password and email
        const [matchEmail] = await sql`
        select * from users where email = ${email};`
        
        const user = matchEmail // como posso atribuir as propiedades de senha a const user

        const matchPassword = bcrypt.compareSync(password, user.password)
        
        if (!matchPassword || !user) {
            rep.send("password or email is wrong.")
            console.log("password or email is wrong.")
            return rep.redirect("/")
        }

        // set user status
        logged_in_status = {
            status: true,
            id: user.id,
            username: user.name,
            email: user.email
        } 

        console.log("user logged in. data:", user)
        rep.statusCode = 200
        
    } catch (err) {
        console.log(err)
        /*rep.statusCode = 500
        rep.json({error: "server error"})*/
    }
    return rep.redirect('/')    
    
})

server.get('/', (_req, rep) => {
  rep.view('index.ejs', { logged_in_status }) // render template
})

server.post('/settings', async (req, rep) => {
    // get data from front end
    try {
        const { unit, theme, autoPR, workoutTimer, shareWorkout } = req.body
        console.log(req.body)

        const userID = logged_in_status.id
        console.log('user id: ', userID)
        console.log('about to do the query..')
        
        const query = await sql`
        update user_settings set unit = ${unit}, theme = ${theme}, auto_detect_pr = ${autoPR}, workout_timer = ${workoutTimer}, share_workout = ${shareWorkout}
        where user_id = ${userID};`

        console.log('query completed.')
        if (!query) {
            console.log("error.")
        }
        console.log("success!")
        rep.statusCode = 200
    } catch (err) {
        rep.send(err)
    }
    return rep.redirect('/')
    // insert user settings in db

})

server.get('/programs', (_req, rep) => {
    rep.view('programs.ejs', { logged_in_status })
})

server.get('/programs/create', (req, rep) => {
    rep.view('create-program.ejs', { logged_in_status })
})

var exercises = await sql `select name from exercise;`
console.log(exercises)

server.get('/programs/create/customize', (_req, rep) => {
   return rep.viewAsync('customize-program.ejs', { logged_in_status, exercises })
})


server.post('/programs/create/customize/submit-program', async (req, rep) => {
    const { program_name } = req.body
    const { exercise, sets, reps, method, intensity } = req.body

    for (var i = 0; i < exercise.length; i++) {
        [exercises] = await sql`select id from exercise where name = ${exercise[i]};`
    }
    console.log('exercises id: ', exercises)

    const insert_into_workout = await sql`
    insert into workout(program_id) values ( (select id from programs where name = ${program_name}) ) returning id;`
        
    const workout_id = insert_into_workout[0].id
    console.log('workout id:', workout_id)

    await sql`
    insert into workout_exercises(exercise_id, workout_id) values ( (select id from exercise where name = any(${exercise})), ${workout_id} );`

    console.log('operation completed.')
})

server.post('/programs/create', async (req, rep) => {
    try {
        const { name, length, description } = req.body
        console.log( "req.body: ", name, length, description )
        
        const id = logged_in_status.id

        const insert = await sql`
        insert into programs(name, length, description, user_id) values 
        (${name}, ${length}, ${description}, ${id});`

        if (insert) {
            return rep.redirect("/programs/create/customize")
        }
    } catch (err) {
        rep.send(err)
    }
})

const muscle_group = await sql`select name from muscle_group;`

server.get('/exercises', (_req, rep) => {
    rep.view('exercises.ejs', { logged_in_status, muscle_group, exercises })
})

server.post('/exercises/add', async (req, rep) => {
    try {
        const { name, type, muscle_group } = req.body

        const verify = await sql`select name from exercise where name = ${name};`
        
        if (verify.length > 0) {
            console.log("exercise already exists.")
            return rep.redirect('/exercises')
        }
        
        const [inserted] = await sql`
        insert into exercise(name, exercise_type) values(${name}, ${type}) returning id;`
        const exercise_id = inserted.id 

        for (const muscle of muscle_group) {
            await sql`
            insert into muscle_exercise(exercise_id, muscle_id) values (${exercise_id}, (select id from muscle_group where name = ${muscle}));`
        }

        // problems: it the relation between muscle and exercise is not being created.

        console.log("exercise added.")
        return rep.redirect('/exercises')
        
    } catch (err) {
        rep.send(err)
    }
})

server.post('/exercises/delete', async (req, rep) => {
    const exercise_to_delete_name = req.body
    try {
        await sql`
        delete from exercise where name = any(${exercise_to_delete_name.exercise_to_delete_name});`
        console.log("exercise deleted.")
    } catch (err) {
        rep.send(err)
    }
})

server.listen({
    port: 5001,
})
console.log("server running on port 5001")