import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.PGURI,
})

client
  .connect()
  .then(() => {
    console.log('connected to db')
  })
  .catch((error) => {
    console.error('error connecting to db', error)
  })

export default client
