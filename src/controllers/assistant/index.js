'use strict'
import path from 'path'
import grpc from 'grpc'
import protoFiles from 'google-proto-files'
import GoogleAuth from 'google-auth-library'


const PROTO_ROOT_DIR = protoFiles('..')

const embedded_assistant_pb = grpc.load({
    root: PROTO_ROOT_DIR,
    file: path.relative(PROTO_ROOT_DIR, protoFiles.embeddedAssistant.v1alpha2)
}).google.assistant.embedded.v1alpha2

export default class AssistantController {

    constructor(credentials) {
        credentials.type = 'authorized_user'
        this.endpoint_ = 'embeddedassistant.googleapis.com'
        this.client = this.createClient_(credentials)
        this.locale = credentials.local || 'pt-BR'
        this.deviceModelId = 'default'
        this.deviceInstanceId = 'default'
    }

    createClient_(credentials) {
        const sslCreds = grpc.credentials.createSsl()
        const auth = new GoogleAuth()
        const refresh = new auth.UserRefreshClient()
        refresh.fromJSON(credentials)
        const callCreds = grpc.credentials.createFromGoogleCredential(refresh)
        const combinedCreds = grpc.credentials.combineChannelCredentials(sslCreds, callCreds)
        const client = new embedded_assistant_pb.EmbeddedAssistant(this.endpoint_, combinedCreds)
        return client
    }


    async assist(text) {

        const config = new embedded_assistant_pb.AssistConfig()
        config.setTextQuery(text)
        config.setAudioOutConfig(new embedded_assistant_pb.AudioOutConfig())
        config.getAudioOutConfig().setEncoding(1)
        config.getAudioOutConfig().setSampleRateHertz(16000)
        config.getAudioOutConfig().setVolumePercentage(100)
        config.setDialogStateIn(new embedded_assistant_pb.DialogStateIn())
        config.setDeviceConfig(new embedded_assistant_pb.DeviceConfig())
        config.getDialogStateIn().setLanguageCode(this.locale)
        config.getDeviceConfig().setDeviceId(this.deviceInstanceId)
        config.getDeviceConfig().setDeviceModelId(this.deviceModelId)
        const request = new embedded_assistant_pb.AssistRequest()
        request.setConfig(config)

        delete request.audio_in
        const conversation = this.client.assist()
        return new Promise((resolve, reject) => {
            let response = {}
            conversation.on('data', (data) => {
                if (data.device_action) {
                    response.deviceAction = JSON.parse(data.device_action.device_request_json)
                } else if (data.dialog_state_out !== null && data.dialog_state_out.supplemental_display_text) {
                    response.text = data.dialog_state_out.supplemental_display_text
                }
            })
            conversation.on('end', () => {
                // Response ended, resolve with the whole response.
                resolve(response)
            })
            conversation.on('error', (error) => {
                reject(error)
            })
            conversation.write(request)
            conversation.end()
        })

    }
}