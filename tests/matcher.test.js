import test from 'node:test';
import assert from 'node:assert/strict';
import {RESOURCES} from '../src/data.js';
import {matchResources,scoreResource} from '../src/matcher.js';

test('directory has 15 distinct fictional resources',()=>{
  assert.equal(RESOURCES.length,15);
  assert.equal(new Set(RESOURCES.map(x=>x.id)).size,15);
});
test('category filtering excludes other categories',()=>{
  assert.ok(matchResources(RESOURCES,{category:'food'}).every(x=>x.category==='food'));
});
test('city selection permits city and remote listings',()=>{
  assert.ok(matchResources(RESOURCES,{city:'Dallas'}).every(x=>['Dallas','Remote'].includes(x.city)));
});
test('audience matching respects published demo audience',()=>{
  assert.ok(matchResources(RESOURCES,{audience:'students'}).every(x=>x.audience.includes('all')||x.audience.includes('students')));
});
test('high scoring matches are sorted descending',()=>{
  const results=matchResources(RESOURCES,{category:'learning',city:'Dallas',urgent:true});
  assert.ok(results.length>0);assert.ok(results.every((item,i)=>i===0 || results[i-1].score>=item.score));
});
test('urgency boosts open and penalizes waitlisted items',()=>{
  const open=RESOURCES.find(r=>r.availability==='open');
  const waiting=RESOURCES.find(r=>r.availability==='waitlist');
  assert.ok(scoreResource(open,{urgent:true}).score>scoreResource(open,{urgent:false}).score);
  assert.ok(scoreResource(waiting,{urgent:true}).score<scoreResource(waiting,{urgent:false}).score);
});
test('ranking has explainable reasons',()=>{
  const results=matchResources(RESOURCES,{city:'Austin',category:'food',audience:'students'});
  assert.ok(results.every(r=>r.reasons.length>0));
});
test('limit and invalid input are handled',()=>{
  assert.equal(matchResources(RESOURCES,{},3).length,3);
  assert.throws(()=>matchResources(null),TypeError);
  assert.throws(()=>matchResources(RESOURCES,{},0),RangeError);
});
test('unmatched category returns empty results',()=>assert.equal(matchResources(RESOURCES,{category:'nonexistent'}).length,0));
