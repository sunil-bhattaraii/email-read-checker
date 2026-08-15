# ReadMail

Track when your emails are opened using an invisible 1x1 tracking pixel.

## Features

- Create tracking pixels with a purpose label so you can recognize them later
- Copy a pixel and paste it directly into an email message
- See the open count and the last opened time for each pixel
- Reset a pixel count after testing, with a confirmation dialog
- Optional sign in; pixels are saved in your browser until you sign in
- Guest pixels sync to your account when you sign in
- Footer shows a page visit count, limited to once per hour per browser

## How it works

Each pixel is a transparent 1x1 image served by the app at a unique URL. When
an email containing the pixel is opened and the recipient's email client loads
images, the image request is recorded as an open and the last opened time is
updated.

### Counting behavior

- Every image load is counted. If the same recipient opens an email multiple
  times, each load adds another open.
- Viewing your own message also counts as an open. Email clients load images
  without the app session cookie, so the owner check does not apply there.
- Only a direct preview of the tracking URL from your own signed-in browser is
  skipped, so refreshing the pixel URL in the dashboard does not inflate the
  count.
- Opens only count when images load. Some email clients block images by
  default, so the count can be lower than the number of times the email was
  actually opened.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set the environment variables in `.env` (see `.env.example`):

- `MONGODB_URI`: a MongoDB connection string, for example MongoDB Atlas
- `JWT_SECRET`: a random string used to sign session tokens
- `APP_URL`: the public base URL of the app, for example `http://localhost:3000`

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. Type a purpose and click Generate pixel.
2. Click Copy to copy the 1x1 image, then paste it into your email. You can
   switch to the plain URL with the code button.
3. Send the email. Opens and last opened times appear in the table.
4. To test a pixel, open its URL in a different browser or in an incognito
   window, then reset the count when you are done.

## Accounts

- There is no registration step. Signing in with a username creates the
  account automatically on the first sign in.
- Passwords must be at least 8 characters and contain at least one letter and
  one number.
- Passwords are hashed with bcrypt. They cannot be recovered if forgotten, so
  use a strong one.
- The Remember me checkbox, checked by default, saves your username and
  password in the browser's localStorage and offers a Use saved credentials
  button on the login form.

## Reset

Each pixel row has a reset button. It opens a confirmation dialog, and on
confirmation sets the open count back to 0 and clears the last opened time.

## Production

Build and start the app:

```bash
npm run build
npm run start
```

For a real deployment, set `APP_URL` to the public URL of the app and generate
a fresh `JWT_SECRET`.
