import type { FastifyReply, FastifyRequest } from 'fastify'

class HealthController {
	async health(_: FastifyRequest, reply: FastifyReply) {
		reply.send({
			uptime: process.uptime(),
			message: 'Ok',
			date: new Date(),
		})
	}
}

export default HealthController
