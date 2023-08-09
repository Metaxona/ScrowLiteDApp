export const dateFormat = (date) => {
    if (!String(date).match(new RegExp("[0-9]{10,13}"))) return null;
    return new Intl.DateTimeFormat("en-us", {
        dateStyle: "full",
        timeStyle: "short",
    }).format(new Date(date) * 1000);
};
export const relativeTimeFormat = (date) => {
    if (!date) return null;
    const rlt = new Intl.RelativeTimeFormat("en", { style: "short" });
    const time = parseInt(Date.now() / 1000) - parseInt(date);
    if (time >= 31449600) return rlt.format(-parseInt(time / 31540000), "years");
    if (time >= 2592000) return rlt.format(-parseInt(time / 2628000), "months");
    if (time >= 604800) return rlt.format(-parseInt(time / 604800), "weeks");
    if (time >= 86400) return rlt.format(-parseInt(time / 86400), "days");
    if (time >= 3600) return rlt.format(-parseInt(time / 3600), "hours");
    if (time >= 60) return rlt.format(-parseInt(time / 60), "minutes");
    if (time < 60) return rlt.format(-time, "seconds");
};
