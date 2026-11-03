import {RESOURCES,CATEGORIES} from './data.js';
import {matchResources} from './matcher.js';
const $=id=>document.getElementById(id);
const form=$('match-form'), results=$('results');
const category=$('category');
for(const c of CATEGORIES){const option=document.createElement('option');option.value=c.id;option.textContent=c.label;category.append(option);}

function element(tag,cls='',value=''){
  const node=document.createElement(tag);if(cls)node.className=cls;node.textContent=value;return node;
}
function render(){
  const prefs={category:category.value,city:$('city').value,audience:$('audience').value,urgent:$('urgent').checked};
  const matching=matchResources(RESOURCES,prefs,20);
  results.replaceChildren();
  $('result-count').textContent=`${matching.length} sample match${matching.length===1?'':'es'} found`;
  if(!matching.length){results.append(element('p','empty','No sample listings match. Try selecting “Any city” or a different audience.'));return;}
  for(const resource of matching){
    const card=element('article','resource-card');
    const top=element('div','card-top');
    const label=element('span','category-tag',resource.category.toUpperCase());
    const availability=element('span','availability '+resource.availability,resource.availability.toUpperCase());
    top.append(label,availability);
    card.append(top,element('h3','',resource.name),element('p','resource-description',resource.details));
    const meta=element('div','resource-meta');
    meta.append(element('span','',`📍 ${resource.city}`),element('span','',`💳 ${resource.cost}`),element('span','',`Match score ${resource.score}`));
    card.append(meta);
    const reasons=element('p','why',resource.reasons.join(' · '));card.append(reasons);
    results.append(card);
  }
}
form.addEventListener('change',render);
form.addEventListener('submit',event=>{event.preventDefault();render();results.scrollIntoView({behavior:'smooth',block:'start'});});
$('reset').addEventListener('click',()=>{form.reset();render();});
render();
