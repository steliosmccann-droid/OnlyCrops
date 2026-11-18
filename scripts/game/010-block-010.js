

// Historical reference archive. UNKNOWN metadata is intentionally null, never fabricated.
window.FarmCropArchive=Object.freeze(window.FarmCropArchiveData);
window.FarmCropArchiveStats=Object.freeze({listed:window.FarmCropArchive.length,verifiedEvent:window.FarmCropArchive.filter(x=>x.status==='historical_event').length,verifiedEconomy:window.FarmCropArchive.filter(x=>x.status==='values_verified_locked').length,discrepancies:window.FarmCropArchive.filter(x=>x.source_conflict||x.historical_reference).length,playable:4});

