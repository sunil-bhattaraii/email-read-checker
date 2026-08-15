# Email Read Checker

Track when your emails are opened using an invisible 1x1 tracking pixel.

## Features

- Create tracking pixels with a purpose label
- Copy a pixel and paste it directly into an email
- See the open count and last opened time for each pixel
- Reset a pixel count after testing (with a confirmation dialog)
- Optional sign in; pixels are stored in your browser until you sign in
- Guest pixels sync to your account on sign in
- Footer shows a page visit count, limited to once per hour per browser

## How it works

Each pixel is a transparent 1x1 image served by the app. When a recipient
opens the email and images load, the image request is recorded as an open.
Loads from your own browser are not counted, so previewing a pixel does not
inflate the count. To test a pixel, open its URL in a different browser or in
an incognito window.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set the environment variables in `.env` (see `.env.example`):

- `MONGODB_URI`: a MongoDB connection string (for example MongoDB Atlas)
- `JWT_SECRET`: a random string used to sign session tokens
- `APP_URL`: the public base URL of the app (for example `http://localhost:3000`)

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Production

Build and start the app:

```bash
npm run build
npm run start
```

## Notes

- Opens are only counted when images load. Some email clients block images by
  default.
- Use a strong password. It cannot be recovered if you forget it.
