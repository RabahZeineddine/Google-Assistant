# Google Assistant API integration

This project is based on [assistant-sdk-nodejs](https://github.com/googlesamples/assistant-sdk-nodejs)

## Google Assistant SDK

### Setup

1. Create or open a project in the [Actions Console](http://console.actions.google.com)
1. Follow the instructions to [register a device model](https://developers.google.com/assistant/sdk/guides/service/python/embed/register-device)
1. Download `credentials.json`
1. Install the [`google-oauthlib-tool`](https://github.com/GoogleCloudPlatform/google-auth-library-python-oauthlib) in a [Python 3](https://www.python.org/downloads/) virtual environment:

```
python3 -m venv env
env/bin/python -m pip install --upgrade pip setuptools
env/bin/pip install --upgrade "google-auth-oauthlib[tool]"
```

1. Use the [`google-oauthlib-tool`](https://github.com/GoogleCloudPlatform/google-auth-library-python-oauthlib) to generate credentials:

```
env/bin/google-oauthlib-tool --client-secrets credentials.json \
                             --credentials devicecredentials.json \
                             --scope https://www.googleapis.com/auth/assistant-sdk-prototype \
                             --save
```

## Assistant API's usage

Check [API Docs](https://assistant.mybluemix.net/v1/api-docs) for more information

```
 POST https://assistant.mybluemix.net/v1/assistant
```

#### Body

```json
    {
    "credentials": {
        "refresh_token": "<refresh_token>",
        "token_uri": "<token_uri>",
        "client_id": "<client_id>",
        "client_secret": "<client_secret>",
        "scopes": [
            "<scope>"
        ]
    },
    "text": "<text>"
}
```

#### Response

```json
{
    "text": "<response_text>>"
}
```
