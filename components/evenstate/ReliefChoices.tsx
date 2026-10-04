"use client";

import { useState } from "react";

const choices = [
  { name: "Stress", exercise: "breathing", description: "A gently paced breathing exercise is the app’s first suggestion for stress. Grounding and releasing muscle tension offer other ways to begin." },
  { name: "Fear", exercise: "grounding", description: "The app suggests grounding: a way to bring attention to your surroundings. Breathing is another option you can explore." },
  { name: "Anger", exercise: "refocusing", description: "The app suggests a self-paced refocusing exercise. Releasing muscle tension and breathing are alternative places to start." },
  { name: "Overwhelm", exercise: "grounding", description: "The app starts with grounding. You can also explore breathing or planning one manageable next step." },
  { name: "I’m not sure", exercise: "grounding", description: "You don’t need a precise name for the moment. The app suggests grounding, with other exercises available to explore." },
] as const;

export function ReliefChoices() {
  const [selected, setSelected] = useState(0);
  const choice = choices[selected];
  return (
    <div className="ev-relief-explorer">
      <fieldset>
        <legend>Explore the app’s suggested starting points</legend>
        <div className="ev-relief-choices">
          {choices.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={index === selected} aria-controls="relief-suggestion" onClick={() => setSelected(index)}>
              {item.name}
            </button>
          ))}
        </div>
      </fieldset>
      <div id="relief-suggestion" className="ev-relief-suggestion" aria-live="polite" aria-atomic="true">
        <span className="ev-suggestion-mark" aria-hidden="true">↳</span>
        <div><h3>Start with {choice.exercise}.</h3><p>{choice.description}</p></div>
      </div>
    </div>
  );
}
