/** Deterministic, explainable matcher with eligibility-aware filtering. */
export function scoreResource(resource, prefs={}) {
  const category=prefs.category||'all', city=prefs.city||'any', audience=prefs.audience||'all';
  const urgent=Boolean(prefs.urgent);
  if(category!=='all' && resource.category!==category) return null;
  if(city!=='any' && resource.city!==city && resource.city!=='Remote') return null;
  if(audience!=='all' && !resource.audience.includes('all') && !resource.audience.includes(audience)) return null;
  let score=25;const reasons=[];
  if(category!=='all'){score+=30;reasons.push('Matches requested service');}
  else reasons.push('Available in the resource directory');
  if(city==='any'){score+=3;reasons.push('City flexible');}
  else if(resource.city===city){score+=20;reasons.push('In your selected city');}
  else if(resource.city==='Remote'){score+=10;reasons.push('Available remotely');}
  if(audience!=='all') {score+=12;reasons.push(resource.audience.includes('all')?'Open to all audiences':'Matches selected audience');}
  const availability=resource.availability;
  if(availability==='open'){score+=14;reasons.push('Currently marked open in demo');}
  else if(availability==='limited'){score+=4;reasons.push('Limited demo availability');}
  else if(availability==='waitlist'){score-=15;reasons.push('Marked as waitlist in demo');}
  if(urgent && availability==='open'){score+=15;reasons.push('Prioritized for urgent availability');}
  if(urgent && availability==='waitlist'){score-=20;reasons.push('Waitlist less suitable for urgent need');}
  return {...resource,score,reasons};
}

export function matchResources(resources,prefs={},limit=20){
  if(!Array.isArray(resources)) throw new TypeError('Resources must be an array');
  if(!Number.isInteger(limit)||limit<1) throw new RangeError('limit must be a positive integer');
  return resources.map(r=>scoreResource(r,prefs)).filter(Boolean)
    .sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)||a.id.localeCompare(b.id))
    .slice(0,limit);
}
