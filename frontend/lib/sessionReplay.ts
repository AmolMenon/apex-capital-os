export const sessionReplay = {
  identifyUser: (userId: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SessionReplay] Identify User: ${userId}`);
    }
    // Future: Route to FullStory/Clarity/PostHog session replay
  },
  setCompany: (companyId: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SessionReplay] Set Company: ${companyId}`);
    }
    // Future: Tag session with company ID
  },
  tagReview: (reviewId: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SessionReplay] Tag Review: ${reviewId}`);
    }
    // Future: Tag session with review ID to find review sessions easily
  }
};
