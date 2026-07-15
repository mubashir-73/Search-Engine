import type { FastifyInstance } from "fastify";

async function routes(fastify:FastifyInstance, options:any){
    fastify.get('/api',async (request,reply)=>{
        return {message:"API HIT"}
    })
} 

export default routes;