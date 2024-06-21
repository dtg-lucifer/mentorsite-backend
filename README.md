# Welcome to the mentoring session booking system!

This is a simple system that allows students to book a mentoring session with a mentor. The system is built using Node.js, Express.js, and MongoDB. And the authentication is done using JWT and cookies for storing that in the frontend.

## Setup - Project

- Don't forget to create a `.env` file in the root of the project with the following structure:

	```env
	PORT=""
	DB_URL=""
	EXPIRY=""
	HR_MAIL=""
	HR_MAIL_PASS=""
	```

- First of all you have to create the credentials file for the project inside `src/gmeet/config/credentials.json` with the following structure:

  ```json
  {
    "installed": {
      "client_id": "",
      "project_id": "",
      "auth_uri": "",
      "token_uri": "",
      "auth_provider_x509_cert_url": "",
      "client_secret": "",
      "redirect_uris": [""]
    }
  }
  ```

	_It will automatically prompt you to authenticate using a google account of yourself for the first time but from the next time you won't be prompted so don' worry about that._

	_**And keep in mind that the refresh and auth tokens will be automatically generate inside the  `src/gmeet/config/token.json` for the first time when you authenticate using your google account**_

  > For reference that how can you get the credentials you can visit - [Google API Console](https://developers.google.com/meet/api/guides/quickstart/nodejs)

- Install the dependencies using the following command:

	```bash
	npm install
	```

	Or,

	```bash
	yarn
	```