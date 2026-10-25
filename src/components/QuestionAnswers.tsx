import { useEffect, type ReactNode } from "react";

export type QuestionAnswer = { id: string; question: string; answer: ReactNode };

export function QuestionAnswers({ items, collapsible = false }: { items: QuestionAnswer[]; collapsible?: boolean }) {
  useEffect(() => {
    if (!collapsible) return;
    const openLinkedAnswer = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openLinkedAnswer();
    window.addEventListener("hashchange", openLinkedAnswer);
    return () => window.removeEventListener("hashchange", openLinkedAnswer);
  }, [collapsible, items]);

  const answerStyle = "mt-2 pl-4 text-sm leading-relaxed text-muted-foreground [&_a]:text-sky-deep [&_a]:underline";
  return collapsible ? <div className="mt-4 space-y-3">{items.map(item => <details key={item.id} id={item.id} className="rounded-lg border border-border bg-card px-4 py-2"><summary className="min-h-11 cursor-pointer py-3 text-sm font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.question}</summary><div className={`${answerStyle} pb-3`}>{item.answer}</div></details>)}</div> : <dl className="mt-4 divide-y divide-border">{items.map(item => <div key={item.id} id={item.id} className="py-5"><dt className="font-bold text-foreground">{item.question}</dt><dd className={answerStyle}>{item.answer}</dd></div>)}</dl>;
}