import { useState, useEffect } from "react";
import { journeys } from "./constant";
import { Typewriter } from "../typewritter-effect";

type JourneyKey = keyof typeof journeys;

interface LoadingJourneyProps {
  route: string;
}

export default function LoadingJourney({ route }: LoadingJourneyProps) {
  const journey = journeys[route as JourneyKey] || journeys.unknown;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep((prev) => (prev + 1) % journey.steps.length);
    }, journey.steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, journey]);

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-muted-foreground">
        <Typewriter text={journey.steps[currentStep].text} speed={10} />
      </p>
    </div>
  );
}
