import { Router } from 'express'
import { validator } from '../../config/validator'
import { assistSchema } from './schemas'
import { getErrorMessage } from '../../config/responses'
import AssistantController from '../../controllers/assistant'

let router = Router()


const initRouter = () => {

    router.route('/')
        .post(
            validator.body(assistSchema),
            assist
        )

    return router
}


const assist = async (req, res) => {
    try {
        const assistantController = new AssistantController(req.body.credentials)
        let result = await assistantController.assist(req.body.text)
        res.status(200).send(result)
    } catch (error) {
        console.error(error)
        res.status(error.code || 500).json({ message: getErrorMessage(error.code || 500) })
    }

}

export default initRouter()
