const express = require('express')
const {open} = require('sqlite')
const app = express()
app.use(express.json())
const path = require('path')
const sqlite3 = require('sqlite3')
let db = null
const dbPath = path.join(__dirname, 'todoApplication.db')

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log(`server running at http://localhost:3000/`)
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

/* API 1*/
const convertDbObjectToResponseObject = dbObject => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    priority: dbObject.priority,
    status: dbObject.status,
  }
}
/* case1 */
app.get('/todos/?status=TO%20DO', async (request, response) => {
  const getTodoQuery = `
 SELECT
 *
 FROM
 todo
 WHERE status like '%${search_q}%'
 ;`
  const todosArray = await db.all(getTodoQuery)
  response.send(
    todosArray.map(eachTodo => convertDbObjectToResponseObject(eachTodo)),
  )
})

/* case2 */
app.get('/todos/?priority=HIGH', async (request, response) => {
  const getTodoQuery = `
 SELECT
 *
 FROM
 todo
 WHERE priority like '%${search_q}%'
 ;`
  const todosArray = await db.all(getTodoQuery)
  response.send(
    todosArray.map(eachTodo => convertDbObjectToResponseObject(eachTodo)),
  )
})
/* case3 */
app.get('/todos/?priority=HIGH&status=IN%20PROGRESS', async (request, response) => {
  const getTodoQuery = `
 SELECT
 *
 FROM
 todo
 WHERE priority like '%${search_q}% status like '%${search_q}' 
 ;`
  const todosArray = await db.all(getTodoQuery)
  response.send(
    todosArray.map(eachTodo => convertDbObjectToResponseObject(eachTodo)),
  )
})
/*case4 */

app.get('/todos/?search_q=Play', async (request, response) => {
  const getTodoQuery = `
 SELECT
 *
 FROM
 todo
 WHERE todo like '%${search_q}%'
 ;`
  const todosArray = await db.all(getTodoQuery)
  response.send(
    todosArray.map(eachTodo => convertDbObjectToResponseObject(eachTodo)),
  )
})




/*API 2*/
/* Get a Player API */
/*app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  select 
    *
  from
      cricket_team
  where
   player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  const {player_id, player_name, jersey_number, role} = player
  const dbResponse = {
    playerId: player_id,
    playerName: player_name,
    jerseyNumber: jersey_number,
    role: role,
  }
  response.send(dbResponse)
})*/

module.exports = app
