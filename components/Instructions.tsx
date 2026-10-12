const steps = [
  {
    title: "Create a counter",
    text: "Type a label and click Generate counter. The label is just so you can recognize it later.",
  },
  {
    title: "Copy the counter",
    text: "Click Copy to copy the counter image, the code is handled for you, so no HTML editing is needed. Use the code button to switch to the plain URL instead.",
  },
  {
    title: "Place it where it will be seen",
    text: "Paste the counter into a page, a document, a message, or anywhere that loads images. It is just a normal image, so it works almost anywhere.",
  },
  {
    title: "Watch the views",
    text: "Every time the counter image loads, the view count goes up. Repeat views from the same visitor are counted only once per 5 minutes.",
  },
];

export default function Instructions() {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        How to use your counter
      </h2>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        Views are counted once per visitor per item every 5 minutes, using the
        visitor&apos;s IP address. Reloading a page repeatedly in a short time
        does not inflate the count. Viewing the counter image from your own
        signed-in browser is skipped entirely, and opening the plain counter URL
        from a different browser or an incognito window is a good way to test a
        counter.
      </p>
    </section>
  );
}
