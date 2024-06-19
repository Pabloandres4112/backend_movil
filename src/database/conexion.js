import {createPool} from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({path:'./src/env/.env'})

export const pool = createPool({
    host:'viaduct.proxy.rlwy.net', 
    user:'root',
    password:'PkVIItCyQRtCdxTARkOybxuKUYWgChou',
    port:49885,
    database:'railway'
})

