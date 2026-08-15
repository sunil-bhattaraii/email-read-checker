const steps = [
  {
    title: "Create a pixel",
    text: "Type a purpose and click Generate pixel. The purpose is just a label so you can recognize it later.",
  },
  {
    title: "Copy the pixel",
    text: "Click Copy to copy the 1x1 image — the code is handled for you, so no HTML editing is needed. Use the code button to switch to the plain URL instead.",
  },
  {
    title: "Paste it into your email",
    text: "Paste the pixel directly into your email message. In Gmail, just paste it into the compose box. In other email tools, you can also add the URL as an image link.",
  },
  {
    title: "Send the email",
    text: "Each time a recipient opens the email and images load, the open count for that pixel goes up and the last opened time updates.",
  },
];

export default function Instructions() {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-neutral-900">
        How to use your pixel
      </h2>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-neutral-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-neutral-500">
        Opens are only counted when images load. Some email clients block
        images by default. Loads from your own browser are not counted, so
        previewing a pixel does not inflate the count. To test a pixel, open
        its URL in a different browser or in an incognito window.
      </p>
    </section>
  );
}
