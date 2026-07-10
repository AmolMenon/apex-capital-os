// @ts-nocheck
"use client";

import { useEffect, useState } from 'react';
import Joyride, { Step } from 'react-joyride';
import { usePathname } from 'next/navigation';

export function GuidedTour() {
  const [run, setRun] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only run the tour if the user hasn't seen it yet and we are on the dashboard
    if (typeof window !== 'undefined' && pathname === '/command-center') {
      const hasSeenTour = localStorage.getItem('apex-tour-seen');
      if (!hasSeenTour) {
        setRun(true);
      }
    }
  }, [pathname]);

  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to Apex Capital OS. Let us show you around the most sophisticated venture capital platform ever built.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-pipeline-status',
      content: 'Track velocity across the entire fund pipeline in real-time.',
      placement: 'bottom',
    },
    {
      target: '.tour-priority-queue',
      content: 'The Priority Queue automatically surfaces deals that require immediate attention or partner review.',
      placement: 'bottom',
    },
    {
      target: '.tour-activity-feed',
      content: 'Stay updated with a real-time activity feed of automated diligence and partner actions.',
      placement: 'left',
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apex-tour-seen', 'true');
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#10b981', // emerald-500
          backgroundColor: '#09090b', // background
          textColor: '#fafafa', // foreground
          arrowColor: '#09090b',
        },
        tooltipContainer: {
          textAlign: 'left',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
        },
        buttonNext: {
          backgroundColor: '#10b981',
        },
        buttonBack: {
          color: '#a1a1aa',
          marginRight: 10,
        }
      }}
    />
  );
}
