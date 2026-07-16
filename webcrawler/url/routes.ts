import type { FastifyInstance } from 'fastify';
import {urlService} from "./service.js"

interface post {
    url : string
}

async function urlroutes(fastify: FastifyInstance, _opts: any) {
    const service = urlService(fastify.db)
    fastify.get('/url', async function (request, reply:any) {
        const resp = await service.getUrl()
        reply.send(resp)
    });

    fastify.post<{Body:post}>('/queue',async function (request, reply:any){
        const {url} = request.body
        const resp = await service.insertUrlById(url)
        reply.send(resp);
    })

}

export default urlroutes;