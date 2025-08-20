export default (): string => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

    const zoneLabelMap: Record<string, string> = {
        "Asia/Jakarta": "WIB",     // UTC+7
        "Asia/Makassar": "WITA",   // UTC+8
        "Asia/Jayapura": "WIT",    // UTC+9
    }

    return zoneLabelMap[tz] || tz

}
