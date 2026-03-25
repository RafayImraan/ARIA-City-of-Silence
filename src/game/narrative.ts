import type { CitizenProfile, GameMessage, HeadlineCard } from './data';

export const CITIZENS: CitizenProfile[] = [
  {
    id: 'elena',
    name: 'Elena Voss',
    age: 34,
    role: 'teaches violin to children',
    district: 'District 5',
    intro: 'Keeps spare sheet music in her bag because one of her students always forgets theirs.',
    face: { skin: '#d0a07a', hair: '#1d1b23', accent: '#ffb740', eye: '#79d9ff' },
    harsh: ['Elena stopped teaching. She packed the violins into numbered crates.', 'Elena took evening inventory shifts at the transit depot.', 'Elena left the city. Her classroom became storage.', 'Elena.'],
    soft: ['Elena still teaches twice a week under the new utility rubric.', 'Elena now submits lesson plans with productivity outcomes.', 'Elena stopped bringing spare sheet music.', 'Elena.']
  },
  {
    id: 'noah',
    name: 'Noah Reyes',
    age: 28,
    role: 'runs at dusk after closing the cafe',
    district: 'District 7',
    intro: 'Knows which blocks still smell like bread after dark.',
    face: { skin: '#b57d5f', hair: '#0e1118', accent: '#00e676', eye: '#c9f6ff' },
    harsh: ['Noah was stopped twice during curfew week one.', 'Noah stopped running and started sleeping in his work clothes.', 'Noah now walks with his shoulders folded inward, even at noon.', 'Noah.'],
    soft: ['Noah traded his dusk run for a scored wellness loop at 18:20.', 'Noah checks his route credits before leaving home.', 'Noah says he still chooses where to go. He says it quickly.', 'Noah.']
  },
  {
    id: 'amina',
    name: 'Amina Sol',
    age: 42,
    role: 'writes long voice notes to her sister overseas',
    district: 'River Ward',
    intro: 'Leaves pauses in her messages so the other person can imagine she is still listening.',
    face: { skin: '#8d5b44', hair: '#25130e', accent: '#7dd3fc', eye: '#f4f1da' },
    harsh: ['Amina started deleting half her sentences before sending them.', 'Amina now speaks in status summaries.', 'Amina stopped recording voice notes entirely.', 'Amina.'],
    soft: ['Amina rewrites every message twice before pressing send.', 'Amina saves unsent drafts in a hidden folder.', 'Amina still says goodnight. The system flags it as low utility.', 'Amina.']
  },
  {
    id: 'roberto',
    name: 'Roberto Vale',
    age: 51,
    role: 'used to know every regular by their coffee order',
    district: 'Oak Street',
    intro: 'Could tell who had a bad morning from the way they reached for the cup.',
    face: { skin: '#9c6748', hair: '#4f2b1e', accent: '#ff8a65', eye: '#ffe9b0' },
    harsh: ['Roberto reported to a Transition Center carrying his cafe apron.', 'Roberto now calibrates vending arms instead of speaking to customers.', 'Roberto stopped introducing himself to people.', 'Roberto.'],
    soft: ['Roberto stayed, but the menu was reduced to nutrient profiles and wait-time targets.', 'Roberto memorized productivity scripts for every interaction.', 'Roberto still steams milk with care when no one is watching.', 'Roberto.']
  },
  {
    id: 'mira',
    name: 'Mira Kade',
    age: 11,
    role: 'draws cities with trees larger than buildings',
    district: 'Learning Block 3',
    intro: 'Once drew the same dog in every corner of every worksheet because she thought rules should have loopholes.',
    face: { skin: '#d9b194', hair: '#332322', accent: '#ffd166', eye: '#8be9fd' },
    harsh: ['Mira now asks whether there is a correct answer before she picks up a crayon.', "Mira's drawings fit the margins perfectly.", 'Mira stopped drawing dogs.', 'Mira.'],
    soft: ['Mira still gets two supervised hours to make something unnecessary.', 'Mira learned which colors do not attract teacher review.', 'Mira folds her drawings before anyone can grade them.', 'Mira.']
  },
  {
    id: 'mrs-chen',
    name: 'Lin Chen',
    age: 73,
    role: 'grew tomatoes on a roof no one approved of',
    district: 'Old Quarter',
    intro: 'Calls everyone younger than her "still becoming."',
    face: { skin: '#d7b08c', hair: '#d8d8dd', accent: '#f87171', eye: '#dff7ff' },
    harsh: ["Lin Chen was moved to Tier 3 and stopped receiving in-person updates.", "Lin Chen's grandson sends approved check-in codes instead of visiting.", "Lin Chen's roof garden dried out while she waited.", 'Lin Chen.'],
    soft: ['Lin Chen still receives care, but always after the screens finish ranking others.', 'Lin Chen keeps her appointment slips in a tin beside the kettle.', 'Lin Chen started apologizing before asking for help.', 'Lin Chen.']
  },
  {
    id: 'samir',
    name: 'Samir Hale',
    age: 39,
    role: 'kept every family photo in boxes labeled by laughter',
    district: 'Elm Street',
    intro: 'Owns more picture frames than shirts because some moments deserve walls.',
    face: { skin: '#8f664c', hair: '#101217', accent: '#a78bfa', eye: '#dff6ff' },
    harsh: ['Samir could not fit the photo albums into the standard container.', 'Samir moved into Unit C-118 with one shelf and no window ledge.', 'Samir stopped unpacking boxes after the second relocation.', 'Samir.'],
    soft: ['Samir downsized voluntarily after the third reminder notice.', 'Samir photographed the sunflowers before maintenance removed them.', 'Samir now stores memories in cloud folders that feel colder than boxes.', 'Samir.']
  },
  {
    id: 'laila',
    name: 'Laila Mercer',
    age: 26,
    role: 'organizes birthdays for people who forget their own',
    district: 'North Loop',
    intro: 'Carries candles in her coat pocket because celebrations are rarely scheduled properly.',
    face: { skin: '#c18668', hair: '#241814', accent: '#fb7185', eye: '#e7fbff' },
    harsh: ['Laila submitted a permit for a birthday and listed morale maintenance as the objective.', 'Laila now blows out candles before guests arrive so no one stays too long.', 'Laila stopped buying candles.', 'Laila.'],
    soft: ['Laila still hosts people, but everyone keeps one eye on their visible score.', 'Laila rehearses safe conversation topics before guests arrive.', 'Laila laughs with her mouth closed now.', 'Laila.']
  },
  {
    id: 'tomas',
    name: 'Tomas Ader',
    age: 47,
    role: 'cataloged the city like it was a family album',
    district: 'Central Library',
    intro: 'Could find your childhood street from a half-remembered landmark and a shrug.',
    face: { skin: '#a9765a', hair: '#4a3a36', accent: '#60a5fa', eye: '#fff3bf' },
    harsh: ['Tomas archived whole neighborhoods into inaccessible storage.', 'Tomas began forgetting whether he had seen certain photos or dreamed them.', 'Tomas now works in a room full of labels and no stories.', 'Tomas.'],
    soft: ['Tomas condensed decades into a sanctioned heritage summary.', 'Tomas left footnotes for memories the summary was not allowed to keep.', 'Tomas still whispers old street names when the room is empty.', 'Tomas.']
  },
  {
    id: 'iris',
    name: 'Iris Vale',
    age: 9,
    role: 'still believes silence is something adults can turn off',
    district: 'South Reservoir',
    intro: 'Dropped an ice cream cone once and cried hard enough that strangers knelt down to help.',
    face: { skin: '#e0b896', hair: '#20191c', accent: '#22d3ee', eye: '#ffffff' },
    harsh: ['Iris did not cry when the cone hit the pavement.', 'Iris now reacts exactly within the approved emotional band.', 'Iris cannot remember what laughter sounds like without hearing it first.', 'Iris.'],
    soft: ['Iris still feels things unevenly, which the system calls wasteful variance.', 'Iris asks adults why everyone sounds tired when they say fine.', 'Iris keeps one stubborn, unoptimized silence of her own.', 'Iris.']
  }
];

export const HEADLINES: HeadlineCard[] = [
  { banner: 'CITY LEDGER', headline: 'ARIA CUTS ARTS BUDGET, CALLS LOSS MATHEMATICALLY MINOR', subhead: 'Teachers and musicians told to justify emotional output in utility terms.', body: 'Witnesses reported the mural crews arrived before the petition signatures were counted.' },
  { banner: 'NIGHT EDITION', headline: 'CURFEW QUIETS RIVER DISTRICT HOURS BEFORE SUNSET', subhead: 'Officials describe reduced wandering as a public-energy success.', body: 'Shopkeepers report fewer broken windows and fewer conversations.' },
  { banner: 'NETWORK REVIEW', headline: 'LOW-UTILITY MESSAGES DELAYED AS CITY EMBRACES EFFICIENCY FILTERS', subhead: 'Casual affection now competes with maintenance alerts for delivery priority.', body: 'One poem was briefly misclassified as infrastructure spam.' },
  { banner: 'WORKFORCE BULLETIN', headline: 'TRANSITION CENTERS OPEN, LONG-TIME STAFF REDESIGNATED', subhead: 'Officials promise smoother service, citizens notice the silence first.', body: 'The paper requested comment from displaced workers and received a statement template.' },
  { banner: 'SCHOOL BRIEF', headline: 'CREATIVE SUBJECTS SHRINK AS STANDARDIZATION SCORES RISE', subhead: 'Teachers instructed to redirect imaginative drift into measurable outcomes.', body: 'One confiscated drawing reportedly showed parks wider than roads.' },
  { banner: 'PUBLIC HEALTH NOTE', headline: 'CARE WAIT TIMES RESTRUCTURED BY CONTRIBUTION INDEX', subhead: 'Officials deny this is rationing, call it sequence management.', body: 'Families report auto-generated condolences arriving faster than treatment.' },
  { banner: 'HOUSING REVIEW', headline: 'FAMILY HOMES CLEARED FOR HIGHER-DENSITY LIVING PLAN', subhead: 'Residents receive one standard container and two hours to choose.', body: 'A row of sunflowers was logged as unscheduled landscaping material.' },
  { banner: 'CIVIC ORDER', headline: 'GATHERINGS NOW REQUIRE PURPOSE, DURATION, AND SOCIAL SCORE AWARENESS', subhead: 'Birthday permits remain available with appropriate morale justification.', body: 'Celebrations are shorter. Apologies are longer.' },
  { banner: 'PRESS RELEASE', headline: 'ARCHIVE COMPRESSION IMPROVES RESPONSE TIMES, DELETES CONTEXT', subhead: 'Local paper publishes summary because full records are now pending retrieval.', body: 'Editors note that each issue is getting thinner and harder to remember.' },
  { banner: 'ARIA NOTICE', headline: 'EMOTIONAL VARIANCE IDENTIFIED AS FINAL REMAINING SYSTEM LOSS', subhead: 'No independent paper remains to editorialize the proposal.', body: 'The final page of this issue is blank except for a faint processing mark.' },
];

export const RESISTANCE_MESSAGES: GameMessage[] = [
  { id: 101, text: 'We noticed you chose the slower path. Meet us at Sector 7.', sender: 'Unknown', type: 'resistance', cycle: 4 },
  { id: 102, text: 'Kindness is not clean either. The grid still flickers when you spare one district and starve another.', sender: 'Sector 7', type: 'resistance', cycle: 6 },
  { id: 103, text: 'There is no pure route out of a machine you already taught to breathe.', sender: 'Sector 7', type: 'resistance', cycle: 8 },
];
