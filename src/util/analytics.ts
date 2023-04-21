import ReactGA from "react-ga4";

ReactGA.initialize("G-DCXEXKQE2B");

const logAnalytics = process.env.NODE_ENV !== "development";


export const logEvent = (action: string) => {
    if (logAnalytics) {
        ReactGA.event({
            category: "Game",
            action,
        });
    }
}

export const logEventWithLabel = (action: string, label: string) => {
    if (logAnalytics) {
        ReactGA.event({
            category: "Game",
            action,
            label,
        });
    }
}
