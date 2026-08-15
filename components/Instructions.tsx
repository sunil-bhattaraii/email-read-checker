const steps = [
  {
    title: "Create a pixel",
    text: "Type a purpose and click Generate pixel. The purpose is just a label so you can recognize it later.",
  },
  {
    title: "Copy the URL or the img code",
    text: "Use the code button to switch between the tracking URL and the 1x1 img tag. The copy button copies whatever is shown.",
  },
  {
    title: "Add it to your email",
    text: "In Gmail, paste the img code into the HTML source of your message. In other email tools, add the URL as an image link.",
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
        Some email clients block images by default. Opens are only counted when
        images load. The tracking image is 1x1 and invisible to the reader.
      </p>
    </section>
  );
}
