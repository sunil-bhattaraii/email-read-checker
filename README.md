# ReadMail

Track views of anything with a simple, embeddable view counter.

## Features

- Create view counters with a label so you can recognize them later
- Copy a counter and embed it (as an image) just about anywhere
- See the view count and the last viewed time for each counter
- Reset a counter after testing, with a confirmation dialog
- Optional sign in; counters are saved in your browser until you sign in
- Guest counters sync to your account when you sign in
- Footer shows a page visit count, limited to once per hour per browser

## How it works

Each counter is a transparent 1x1 image served by the app at a unique URL.
When the item containing the counter is viewed and the image loads, the request
is recorded as a view and the last viewed time is updated.

### Counting behavior

- Each view is recorded once per visitor per counter every 5 minutes, based on
  the visitor's IP address (stored as a salted hash, never the raw IP). Rapid
  reloads from the same IP do not inflate the count.
- Viewing your own item also counts unless the request carries your session, so
  a direct preview of the counter URL from your own signed-in browser is
  skipped.
- Views only count when images load. Some clients block images by
  default, so the count can be lower than the number of actual views.

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

1. Type a label and click Generate counter.
2. Click Copy to copy the 1x1 image, then embed it wherever you want to track
   views. You can switch to the plain URL with the code button.
3. Watch the view counts and last viewed times appear in the table.
4. To test a counter, open its URL in a different browser or in an incognito
   window, then reset the count when you are done.

## Badges

Each counter also exposes a dynamic image showing its view count in a rounded
capsule with an eye icon. Embed it anywhere that loads images:

```html
<img src="https://your-app.example/p/COUNTER_ID/views-image" alt="View count" />
```

Pass `?theme=` to switch the color scheme:

```html
<img src="https://your-app.example/p/COUNTER_ID/views-image?theme=dark" alt="View count" />
```

The badge is served without caching, so it always shows the current count.
It is read-only: it reflects views recorded by the tracking pixel and never
increments the counter itself.

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

Each counter row has a reset button. It opens a confirmation dialog, and on
confirmation sets the view count back to 0, clears the last viewed time, and
removes the recent-visitor locks so the counter can be re-tested immediately.

## Production

Build and start the app:

```bash
npm run build
npm run start
```

For a real deployment, set `APP_URL` to the public URL of the app, for
example `https://readmail.sunil-bhattarai.com.np`, and generate a fresh
`JWT_SECRET`.
